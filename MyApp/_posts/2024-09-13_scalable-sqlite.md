---
title: Scalable Server SQLite Apps 
summary: Learn how to build concurrent, safe scalable SQLite .NET Apps 
tags: [sqlite,.net8]
author: Demis Bellot
image: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&fit=crop&h=1000&w=2000
draft: true
---

Ever since adding [support for Litestream](https://docs.servicestack.net/ormlite/litestream) in
our project's templates [GitHub Action Deployments](https://servicestack.net/posts/kubernetes_not_required)
we've been using SQLite as the backend for our new .NET Apps as it's the 
[most cost-effective option](https://docs.servicestack.net/ormlite/litestream#savings-at-scale)
that frees us from needing to use a cloud managed database which lets us make use of Hetzner's much cheaper
[US Cloud VMs](https://www.hetzner.com/cloud/).

We're also seeing increased usage of SQLite Server Apps with [BlueSky Social](https://github.com/bluesky-social/atproto/pull/1705)
having moved to SQLite and all of 37 Signals new [Once](https://once.com) Web Apps 
[using SQLite](https://world.hey.com/dhh/multi-tenancy-is-what-s-hard-about-scaling-web-services-dd1e0e81)
and Cloud Providers building distributed databases on top of SQLite like 
[Cloudflare D1](https://blog.cloudflare.com/introducing-d1/) and Fly.io's 
multi-region distributed [LiteFS](https://fly.io/docs/litefs/) solution.

SQLite is highly-performant and can handle a large number of concurrent read operations and its
write operations are roughly [35% Faster](https://www.sqlite.org/fasterthanfs.html)
than writing to the Filesystem directly with very low latency that's often faster than other RDBMS's
courtesy of its proximity to the running application.

## Single Concurrent Writer

The primary limitation of SQLite is that it only supports a single concurrent writer, which means if you 
have multiple requests writing to the same database at the same time, they will need to coordinate access. 

As long as we can overcome this limitation SQLite can be an excellent choice to power many Web Apps. In the
previous ServiceStack v8.3 release we [worked around this limitation](https://docs.servicestack.net/commands#use-case-sqlite-writes)
by using [MQ Command DTOs](https://docs.servicestack.net/commands#mq-command-dtos) to route all DB
Writes to be executed by a single Background MQ Thread.

This works great for [messaging-based architectures](https://docs.servicestack.net/commands#messaging)
where you can queue commands to be processed serially, but the overhead of using commands for all 
DB writes can be cumbersome when needing to perform sporadic writes within complex logic.

## Database Locks

The new `Locks` class maintains an object lock for each registered database connection that can be 
used to synchronize **write access** for different SQLite databases, e.g:

```js
var row = db.SingleById<Table>(request.Id);
row.PopulateWithNonDefaultValues(request);
lock (Locks.AppDb)
{
    Db.Update(row);
}
```

`Locks.AppDb` can be used synchronize db writes for the App's primary database, e.g. `App_Data/app.db`.

Whilst `Locks.GetDbLock(namedConnection)` can be used to get the DB Write Lock for other 
[registered SQLite Database](https://docs.servicestack.net/ormlite/multi-database-app) by using
the same named connection the SQLite Database Connection was registered against, e.g:

```csharp
var dbFactory = new OrmLiteConnectionFactory(connStr, SqliteDialect.Provider);
dbFactory.RegisterConnection(Databases.Search, 
    $"DataSource=App_Data/search.db;Cache=Shared", SqliteDialect.Provider);
dbFactory.RegisterConnection(Databases.Analytics, 
    $"DataSource=App_Data/analytics.db;Cache=Shared", SqliteDialect.Provider);

//...
using var dbSearch = dbFactory.Open(Database.Search);
locks (Locks.GetDbLock(Database.Search))
{
    dbSearch.Insert(row);
}

using var dbAnalytics = dbFactory.Open(Database.Analytics);
locks (Locks.GetDbLock(Database.Analytics))
{
    dbAnalytics.Insert(row);
}
```

### Use Synchronous APIs for SQLite

Generally it's recommended to use non-blocking Async APIs for any I/O Operations however as 
SQLite doesn't use a Network and its native implementation is blocking, its ADO .NET Async
APIs are just pseudo async wrappers around SQLite's blocking APIs which just adds unnecessary 
overhead so we recommend **always** using synchronous APIs for SQLite, especially since it's 
not possible to use await inside a lock:

```csharp
lock (Locks.AppDb)
{
    //Can't await inside a lock
    //await Db.UpdateAsync(row); 
    Db.Update(row);
}
```

It's also safe to assume SQLite will always be blocking since all 
[Asynchronous I/O efforts](https://www.sqlite.org/asyncvfs.html) were abandoned in favor
of [WAL mode](https://www.sqlite.org/wal.html) which mitigates the cost of **fsync()**.

## Queuing DB Writes with SyncCommand

Locks are a great option for synchronizing DB Writes that need to be executed within
complex logic blocks. However locks can cause contention in highly concurrent Apps,
one way to remove contention is to serially execute DB Writes instead which we can
do by executing DB Writes within `SyncCommand*` using a named `[Worker(Workers.AppDb)]`
attribute for Writes to the primary database, e.g: 

```csharp
[Worker(Workers.AppDb)]
public class DeleteCreativeCommand(IDbConnectionFactory dbFactory) 
    : SyncCommand<DeleteCreative>
{
    protected override void Run(DeleteCreative request)
    {
        var artifactIds = request.ArtifactIds;
        using var db = dbFactory.Open();
        db.Delete<AlbumArtifact>(x => artifactIds.Contains(x.ArtifactId));
        db.Delete<ArtifactReport>(x => artifactIds.Contains(x.ArtifactId));
        db.Delete<ArtifactLike>(x => artifactIds.Contains(x.ArtifactId));
        db.Delete<Artifact>(x => x.CreativeId == request.Id);
        db.Delete<CreativeArtist>(x => x.CreativeId == request.Id);
        db.Delete<CreativeModifier>(x => x.CreativeId == request.Id);
        db.Delete<Creative>(x => x.Id == request.Id);
    }
}
```

Other databases should use its named connection for its named worker, e.g: 

```csharp
[Worker(Databases.Search)]
public class DeleteSearchCommand(IDbConnectionFactory dbFactory) 
    : SyncCommand<DeleteSearch>
{
    protected override void Run(DeleteSearch request)
    {
        using var db = dbFactory.Open(Databases.Search);
        db.DeleteById<ArtifactFts>(request.Id);
        //...
    }
}
```

## Executing Commands

Now everytime the commands are executed they will be added to a ConcurrentQueue
where they'll be serially executed by the worker's Background Task: 

```csharp
public class MyServices(IBackgroundJobs jobs) : Service
{
    public void Any(DeleteCreative request)
    {
        // Queues a durable job to execute the command with the named worker
        var jobRef = jobs.EnqueueCommand<DeleteCreativeCommand>(request);
        // Returns immediately with a reference to the Background Job
    }

    public async Task Any(DeleteSearch request)
    {
        // Executes a transient (i.e. non-durable) job with the named worker
        var result = await jobs.RunCommandAsync<DeleteSearchCommand>(request);
        // Returns after the command is executed
    }
}
```

When using any `SyncCommand*` base class, its execution still uses database locks
but any contention is mitigated as they're executed serially by a single worker thread.

### AutoQuery Crud Database Write Locks

To avoid SQLite concurrency write exceptions all DB Writes should be executed within
its database lock or a named worker. Including [AutoQuery Crud](https://docs.servicestack.net/autoquery/crud)
APIs which by default will use Database Locks if the primary databases is SQLite.

This behavior can also be explicitly configured with:

```csharp
services.AddPlugin(new AutoQueryFeature {
    UseDatabaseWriteLocks = true
});
```
