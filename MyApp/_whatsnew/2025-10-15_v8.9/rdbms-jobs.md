---
title: Execute Background Jobs and Recurring Tasks in PostgreSQL, SQL Server & MySQL
url: /posts/rdbms_jobs
image: /img/whatsnew/v8.9/bg.webp
order: 1
---

We're excited to announce that we've created a drop-in replacement for our much loved SQLite **Background Jobs**
feature to run in **PostgreSQL**, **SQL Server**, and **MySQL**! The new `DatabaseJobsFeature` maintains the 
same simple API, data models, and service contracts - making migration straightforward while integrating 
with your existing database infrastructure.

Add it to your .NET 8+ project with a single command. The implementation leverages each database's strengths - PostgreSQL 
gets automatic monthly table partitioning, while SQL Server and MySQL use indexed append-only tables for efficient job 
history management or maintain jobs in a separate database to isolate write-heavy workload from your primary App Database.

It has all the loved features: queue APIs or Commands, schedule recurring tasks with CRON expressions,
execute jobs serially with named workers, auto-retry failed jobs, and monitor everything in real-time through 
the Admin UI. 

Whether you need to integrate with existing enterprise infrastructure or leverage advanced RDBMS features - 
Database Jobs now works with your preferred DB!
