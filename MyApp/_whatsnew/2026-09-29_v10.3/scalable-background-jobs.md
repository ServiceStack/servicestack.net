---
title: Scalable Background Jobs - a durable job platform on the database you already run
url: https://docs.servicestack.net/background-jobs-rdbms
image: /img/posts/scalable-background-jobs/bg.webp
order: 1
---

**Background Jobs** grows from a simple way to move work off the request thread into a complete, durable job platform, using the same `IBackgroundJobs` API on the same database, with **no broker to deploy**. The RDBMS provider now safely scales out across **any number of App Servers** sharing PostgreSQL, SQL Server or MySQL. Every Job is claimed with a renewable lease, crashed servers' Jobs are recovered automatically, and deploys shut down gracefully without losing work.

Named **queues** with their own concurrency, priorities and cluster-wide **rate limits** can be paused and re-throttled at runtime. Idempotent enqueue, Singleton Jobs and a transactional outbox make sure work happens once. Jitter backoff, expiry and enforced timeouts help failures heal themselves, and multi-step **workflows**, **batches** with live progress, per-tenant ordering, awaitable results and time-zone aware **schedules** handle the rest. Everything is visible from an expanded Admin UI.
