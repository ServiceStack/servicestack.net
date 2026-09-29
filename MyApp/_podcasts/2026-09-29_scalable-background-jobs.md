---
title: Scalable Background Jobs
summary: ServiceStack v10.3 turns Background Jobs into a durable job platform - scale out across App Servers, queues with runtime controls, exactly-once guarantees, workflows, batches and production-grade schedules, all on the database you already run
tags: [servicestack, jobs, rdbms]
url: https://media.servicestack.com/podcasts/scalable-background-jobs.mp3
media: {size:21027583,duration:1421.641723,format:mp3}
---

**ServiceStack v10.3** introduces a robust, database-driven platform for managing **scalable background jobs** without the need for external message brokers. 

This update enhances reliability through **graceful shutdowns**, automatic job recovery, and **exactly-once execution guarantees** such as idempotent enqueuing. Developers can now utilize **advanced orchestration tools**, including multi-step workflows, fanned-out batches, and sophisticated scheduling with built-in concurrency controls. 

The system supports **dynamic runtime adjustments**, allowing users to pause queues, throttle processing speeds, and monitor server health directly through an integrated **Admin UI**. By leveraging existing RDBMS infrastructure like PostgreSQL or SQL Server, the platform ensures **high availability** and seamless scaling across multiple app servers. 

Detailed **observability features** and automated data retention policies further ensure that background tasks remain transparent and maintainable over time.