---
title: Resilient Retries and Read Replicas in OrmLite
summary: ServiceStack v10.4 lets OrmLite safely retry deadlocks, throttling and failovers from one line of configuration, and spread reads over a read replica whose read-only connections catch the classic replica bug in development instead of in production
tags: [servicestack, ormlite]
author: Demis
image: ./img/posts/retries-read-replicas/bg.webp
---

:::youtube O7RAp_XvHMc
Survive Deadlocks without writing Retry Loops: Safe Database Retries and Read Replicas in .NET
:::

Your tests pass, then at peak traffic two customers send each other money at the same moment. Each transaction locks
one account, then waits for the other's. Neither can continue, so the database picks one as the **deadlock victim**
and rolls it back:

```csharp
// Alice sends Bob 10 while Bob sends Alice 30, at the same time
using var trans = db.OpenTransaction();
db.UpdateAdd(() => new BankAccount { Balance = -amount }, x => x.Id == fromId);
db.UpdateAdd(() => new BankAccount { Balance = amount }, x => x.Id == toId);
trans.Commit();
```

```txt
SqlException: Transaction (Process ID 75) was deadlocked on lock resources with another process
and has been chosen as the deadlock victim. Rerun the transaction.

Balances: Alice 130, Bob 70    (Alice's transfer of 10 was lost)
```

Nothing is wrong with the code, and the database even says what to do: rerun the transaction. Deadlocks,
serialization failures, throttling by a cloud database, failovers and dropped connections all work this way. They'd
work a moment later, but right now they fail the request.

The usual fix is a retry loop around every unit of work, or a resilience library wrapped around every call, which is
easy to get wrong in the one place that matters: retrying something that already happened.

## One RetryPolicy, one RunInTransaction

**ServiceStack v10.4** handles these temporary errors in OrmLite itself. Set a `RetryPolicy` once:

```csharp
OrmLiteConfig.RetryPolicy = OrmLiteRetry.Exponential(maxRetries: 3)
    .OnRetry((ex, retry, delay) => log.LogWarning("Retry {Retry}: {Error}", retry, ex.Message));
```

Then wrap the transfer in `RunInTransaction`. When it's chosen as the deadlock victim, the whole transaction is rolled
back and run again in a new one:

```csharp
await db.RunInTransactionAsync(async () => {
    await db.UpdateAddAsync(() => new BankAccount { Balance = -amount }, x => x.Id == fromId);
    await db.UpdateAddAsync(() => new BankAccount { Balance = amount }, x => x.Id == toId);
});
```

```txt
Retry 1: Transaction (Process ID 75) was deadlocked on lock resources with another process
and has been chosen as the deadlock victim. Rerun the transaction.

Balances: Alice 120, Bob 80    (both transfers applied)
```

One retry, and both transfers go through. There's nothing else to change in your code: every statement OrmLite runs
uses the policy, and the error is thrown as before when a statement can't safely be retried, or after the last retry.

Each dialect recognizes its own driver's temporary errors on **PostgreSQL**, **SQL Server**, **MySQL** and
**MariaDB**, from PostgreSQL's `40001` serialization failures and `40P01` deadlocks to SQL Server's `1205` deadlocks
and Azure SQL throttling and failover errors. SQLite doesn't need retries, so an App that starts on SQLite starts
retrying the moment it moves to one of them, without changing its configuration.

### Waits that back off

`OrmLiteRetry.Exponential()` waits twice as long after each retry, `50ms`, `100ms` then `200ms` by default, up to a
`maxDelay`:

```csharp
OrmLiteConfig.RetryPolicy = OrmLiteRetry.Exponential(
    maxRetries: 3,                               // runs each statement up to 4 times
    delay: TimeSpan.FromMilliseconds(50),        // waits 50ms, 100ms, then 200ms (the defaults)
    maxDelay: TimeSpan.FromSeconds(2));
```

Each wait is a random 50-100% of the delay, so requests that failed together don't all retry together.

Each database can also have a policy of its own, e.g. to retry the main database more often and never retry a
reporting database:

```csharp
services.AddOrmLite(options => options.UsePostgres(connectionString, dialect => {
    dialect.RetryPolicy = OrmLiteRetry.Exponential(maxRetries: 5);
}))
.AddSqlServer("reporting", reportingConnectionString, dialect => {
    dialect.RetryPolicy = OrmLiteRetry.None;
});
```

## Only retried when it's safe

Retrying blindly can do damage. If the connection drops after an `INSERT` was sent, it may already have been saved,
and running it again would save it twice. So OrmLite tells apart 2 kinds of temporary errors:

| Kind | Examples | What's run again |
|-|-|-|
| `NotApplied`: the database confirmed the statement wasn't applied | Deadlocks, serialization failures, throttling, connections that couldn't be made | Any statement |
| `MaybeApplied`: the connection was lost, so it's unknown if it was applied | Network resets, failovers, a server that restarted | Only reads |

```csharp
// The database confirmed it wasn't applied: deadlocks, serialization failures, throttling
db.Insert(order);                        // retried

// The connection was lost, so the statement may have been applied
db.Select<Order>(x => x.Total > 100);    // retried: reads can't apply twice
db.Insert(order);                        // not retried: it might be saved twice

// Statements in a transaction aren't retried on their own: the database rolled it all back
db.RunInTransaction(() => { ... });      // the whole transaction runs again
db.InsertAll(orders);                    // runs in its own transaction, retried as a whole
```

A single statement inside a transaction is never retried on its own. After a deadlock the database has rolled back the
whole transaction, so running only the last statement again would silently lose the ones before it. That's what
`RunInTransaction` is for, and the APIs that write many rows, like `InsertAll`, `UpdateAll`, `SaveAll` and
`DeleteByIds`, already run in a transaction of their own that's retried as a whole.

A transaction that fails while it's being committed is also only run again when the database confirmed it wasn't
committed.

## Your code may run more than once

One rule follows from that: the code in `RunInTransaction` may run more than once. Its database changes are rolled back
before it runs again, but an email, a card payment or a call to another API isn't. So do those after the transaction
commits, when it can no longer run again:

```csharp
var orderId = await db.RunInTransactionAsync(async () => {
    var id = await db.InsertAsync(order, selectIdentity: true);
    await db.UpdateAddAsync(() => new Product { Stock = -order.Quantity }, x => x.Id == order.ProductId);
    return id;
});

// After the transaction is committed, so it's only sent once
await emailer.SendOrderConfirmationAsync(orderId);
```

## Scale your reads with a replica

Most Apps read far more than they write, and a read replica, like a PostgreSQL standby, takes those reads off your
primary. Register it with `AddReadReplica()`:

```csharp
services.AddOrmLite(options => options.UsePostgres(connectionString))
    .AddReadReplica(replicaConnectionString);
```

Then open connections for queries that can read from it with `OpenReadOnlyDbConnection()`:

```csharp
using var db = dbFactory.OpenReadOnlyDbConnection();
var orders = db.Select<Order>(x => x.CreatedDate >= since);
```

```txt
Without a replica:   OpenReadOnlyDbConnection()  →  primary
With a replica:      OpenReadOnlyDbConnection()  →  replica   (IsReadOnly, IsReadReplica)
                     OpenDbConnection()          →  primary
```

With a replica it opens the replica. Without one, like in development, it opens the primary, so the same code works in
both. Named connections can have replicas of their own, and a replica uses its primary's dialect, so its naming
strategy, converters, connection filters and retry policy are the same:

```csharp
services.AddOrmLite(options => options.UsePostgres(connectionString))
    .AddReadReplica(replicaConnectionString)
    .AddPostgres("reporting", reportingConnectionString)
    .AddReadReplica("reporting", reportingReplicaConnectionString);

using var reports = dbFactory.OpenReadOnlyDbConnection("reporting");
```

To keep reads working while a replica is down, `fallbackToPrimary` opens the primary when the replica can't be opened,
and logs a warning:

```csharp
.AddReadReplica(replicaConnectionString, fallbackToPrimary: true)
```

To spread reads over several replicas, use a connection string that does it, e.g. Npgsql's multiple hosts with
`Target Session Attributes=prefer-standby;Load Balance Hosts=true`.

## Read-only means read-only

The classic replica bug is a write that sneaks onto a read connection. It works in development, where there's no
replica, then fails in production, where there is.

So read-only connections can't write, even when they're opened on the primary:

```csharp
using var db = dbFactory.OpenReadOnlyDbConnection(); // the primary, without a replica
db.SingleById<BankAccount>(1);                        // reads work
db.Insert(new BankAccount { Id = 2, Balance = 50 });  // a write fails
```

```txt
PostgreSQL:  PostgresException: 25006: cannot execute INSERT in a read-only transaction
MySQL:       MySqlException: Cannot execute statement in a READ ONLY transaction
SQL Server:  InvalidOperationException: This connection is read-only, it's opened for queries that can
             read from a read replica. Write with a connection to the primary, e.g. Db instead of ReadDb,
             or OpenDbConnection().
```

PostgreSQL, MySQL and SQLite make the connection's session read-only, which is made read-write again before it's
returned to the pool, and on SQL Server OrmLite rejects the write itself. The bug fails on your machine, not after you
deploy. Connections also say what they are with `IsReadOnly` and `IsReadReplica`, and whether they've written with
`HasWrites`.

## In ServiceStack: ReadDb and ReadYourWritesFor

In ServiceStack Services, `ReadDb` is the read replica of the connection `Db` uses, configured by the AppHost's
`DbConnectionRequestFilters` like `Db`, e.g. with the request's tenant. Without a replica it's the same database
as `Db`:

```csharp
public class ReportServices : Service
{
    public object Get(SalesReport request) =>
        ReadDb.Select<Order>(x => x.CreatedDate >= request.Since);
}
```

Replicas can lag behind their primary. Save a form, get redirected, and the replica may not have your change yet, so it
looks like it didn't save. ServiceStack handles both halves of that:

- Once a request writes, its `ReadDb` reads from the primary, so it sees what it wrote
- A user's next requests read from the primary for **5 seconds** after one of their requests writes, so the page they're
  sent to after saving shows what they saved while the replica catches up

Users are identified by their authenticated user id, or their session when they're not signed in. Change how long with
`ReadYourWritesFor`, or turn it off with `TimeSpan.Zero`:

```csharp
public override void Configure()
{
    ReadYourWritesFor = TimeSpan.FromSeconds(10);
}
```

Recent writes are remembered in the App's memory cache, so with several servers use sticky sessions, or override the
AppHost's `RecordDbWrites()` and `HasRecentDbWrites()` to keep them in a distributed cache.

### AutoQuery

AutoQuery APIs can run their queries on the replica too, while AutoQuery CRUD APIs keep writing to the primary.
`[ReadReplica]` opts an AutoQuery API or table in, or out with `[ReadReplica(false)]`, e.g. for an API that reads what
was just written:

```csharp
services.AddPlugin(new AutoQueryFeature { UseReadReplica = true });

[ReadReplica(false)]
public class QueryRecentOrders : QueryDb<Order> {}
```

The Admin UI's profiling shows which queries ran on a replica.

## What retries and replicas don't do

Retries are for temporary errors, not slow queries:

- Retries only happen when a `RetryPolicy` is set
- SQLite isn't retried, as its drivers already wait for locks to be released
- Statements that time out aren't retried by default, as a query that was too slow is likely to be too slow again.
  `Handle()` can opt them in, e.g. `.Handle(ex => ex is SqlException { Number: -2 })`
- Errors after a query's first row has been read aren't retried
- Queries run with OrmLite's Dapper APIs aren't retried, and on SQL Server their writes aren't rejected on read-only
  connections
- SqlClient has its own optional retry logic, use either it or a `RetryPolicy`, as using both multiplies their retries

## Get Started

Retries and read replicas are available in **ServiceStack v10.4**. Upgrade your `ServiceStack.OrmLite.*` packages and
add one line of configuration:

```csharp
OrmLiteConfig.RetryPolicy = OrmLiteRetry.Exponential(maxRetries: 3);
```

See the docs for the complete reference:

- [Retrying Temporary Errors](https://docs.servicestack.net/ormlite/retries) - what's retried, configuring policies,
  retrying other errors and each database's temporary errors
- [Read Replicas](https://docs.servicestack.net/ormlite/getting-started#read-replicas) - registering replicas,
  read-only connections, `ReadDb`, `ReadYourWritesFor` and AutoQuery
- [v10.4 Release Notes](https://docs.servicestack.net/releases/v10_04) - everything else in this release
