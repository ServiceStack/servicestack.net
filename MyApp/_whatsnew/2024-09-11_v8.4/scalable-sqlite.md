---
title: High Performance, Safe and Scalable SQLite
url: https://docs.servicestack.net/ormlite/scalable-sqlite
image: /img/posts/scalable-sqlite/pvq.webp
order: 3
---

Ever since adding support for Litestream in ServiceStack project's templates GitHub Action Deployments 
we've been using SQLite as the backend for our latest new .NET Apps as it's the most cost-effective 
option that frees us from needing to use cloud managed databases and by extension expensive major cloud 
providers instead of the better value commodity cloud providers.

SQLite is a highly-performant DB that can handle a large number of concurrent read operations and
35% faster filesystem performance for write operations with next to no latency that's often 
faster than other RDBMS's courtesy of its proximity to the running application which gives it
unique advantages over traditional client/server RDBMS's where it's not susceptible to the 
[N+1 Queries problem](https://www.sqlite.org/np1queryprob.html) and is also able to execute your
custom C# Logic inside SQL Queries using [Application SQL Functions](https://www.sqlite.org/appfunc.html).

With [litestream.io](https://litestream.io) taking care of real-time replication to managed storage
we just need to workaround SQLite's single concurrent writer to unlock the value, performance and 
unique features of SQLite in our Apps which we cover in this release with integrated support for
Database Locks and Sync Commands.