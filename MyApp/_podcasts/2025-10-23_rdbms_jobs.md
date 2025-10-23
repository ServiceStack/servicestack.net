---
title: RDBMS Background Jobs
summary: Run Background Jobs and Scheduled Tasks in PostgreSQL, SQL Server or MySQL
tags: [db,ormlite,jobs]
author: Demis Bellot
url: https://media.servicestack.com/podcasts/rdbms_jobs.mp3
media: {size:13145337,duration:936.071837,format:mp3}
---

This episode introduces the new **DatabaseJobFeature**, which ports ServiceStack's **Background Jobs** 
functionality from SQLite to industrial-strength relational database management systems (RDBMS) like 
**PostgreSQL**, **SQL Server**, and **MySQL**. 

This feature allows developers to run background jobs and schedule tasks within their existing .NET 8+ 
applications, providing durability and a management UI for monitoring. A key element is replicating 
SQLite's monthly data archival strategy by using **monthly partitioned SQL tables** for completed and 
failed job history, with **PostgreSQL** offering native partitioning support. 

The functionality supports queuing existing **APIs** or custom **Commands** and offers extensive options 
for controlling job execution, including serialization via named workers, dependency management, and 
authenticated user contexts, while also supporting **recurring tasks** via TimeSpan or CRON expressions.
