---
title: Scalable Background Jobs
summary: ServiceStack v10.3 turns Background Jobs into a durable job platform - scale out across App Servers, queues with runtime controls, exactly-once guarantees, workflows, batches and production-grade schedules, all on the database you already run
tags: [servicestack, jobs, rdbms]
author: Demis
image: ./img/posts/scalable-background-jobs/bg.webp
---

## Background Jobs, ready for your important work

The work that matters most in most Apps doesn't happen inside the request. Charging a payment, sending an
email, importing a spreadsheet, generating a report, syncing a tenant or calling a third-party API are all
things you want to run in the background - and they're also the things you can least afford to lose, run
twice, or let pile up behind each other.

[Background Jobs](https://docs.servicestack.net/background-jobs) started as a simple way to move that work
off the request thread. **ServiceStack v10.3** makes it a complete, durable job platform for the work your
business depends on.

It's the same `IBackgroundJobs` API you already use, on the same database you already run. There's **no
broker to deploy**, no new infrastructure to operate and nothing to learn before you benefit. Existing Jobs
get safer retries, bounded resource usage and graceful shutdown just by upgrading, while the new features
are there the moment you need them:

<jobs-highlights></jobs-highlights>

Most of the features in this post come with an interactive simulation, so you can see how they behave
before you write any code.

## Scale out without a broker

The [RDBMS provider](https://docs.servicestack.net/background-jobs-rdbms) now safely runs on **any number
of App Servers** sharing the same PostgreSQL, SQL Server or MySQL database.

Every Job is **claimed with a lease** that's renewed while it runs, and every write a server makes to a Job
is fenced by that lease. A Job is only ever owned by one server at a time, and a slow or partitioned server
can't overwrite the result of the server that took over from it.

When a server crashes, is killed or loses its network, its leases simply expire and another server
**recovers its Jobs automatically**. A Job that keeps taking its server down with it is counted as a failed
attempt each time, and is failed with a `LeaseExpired` error once it exceeds its `RetryLimit`, instead of
being retried forever.

On PostgreSQL and MySQL 8+, servers claim Jobs with `SKIP LOCKED`, so adding more servers adds more
throughput rather than more contention. Try taking a server down and watch its Jobs fail over:

<cluster-simulator></cluster-simulator>

### Deploy without losing work

Background Jobs now **shuts down gracefully**. Running Jobs are given `ShutdownTimeoutSecs` (default 30s)
to finish and save their progress, and any Job that was claimed but never started is handed straight back
so another server picks it up immediately, rather than waiting for its lease to expire on every deploy.
It's registered by the plugin, so existing Apps get it without touching their hosted service.

### Know which servers are doing what

Each App Server records a heartbeat, so the Admin UI's **Nodes** view, `jobs.GetJobNodes()` and the
`AdminGetJobNodes` API report which servers are alive, what version they're running, how many Jobs each is
running and which ones stopped reporting. You can **drain a server** before taking it out of service so it
finishes its Jobs without taking any more, or **dedicate servers to queues**, e.g. only run GPU work on
the servers that have one:

```csharp
services.AddPlugin(new DatabaseJobFeature {
    Queues = ["gpu"], // this server only processes Jobs on the gpu queue
});

jobs.SetJobNodeDraining(serverId, draining: true);
```

<screenshot src="/img/posts/scalable-background-jobs/05-nodes.webp" title="App Servers processing Jobs, with their heartbeat, running Jobs and Drain control"></screenshot>

## Give each workload its own lane

Different work has different needs: a password reset can't wait behind a bulk import, and a third-party
API can't be called faster than its quota allows. Jobs can now be routed to **named queues**, each with its
own Workers and concurrency, so a backlog on one queue never delays another. Within a queue, Jobs with a
higher `Priority` run first:

```csharp
jobs.EnqueueCommand<SendPasswordResetCommand>(request, new() {
    Queue = "emails",
    Priority = 10, // ahead of the newsletter
});
```

```csharp
services.AddPlugin(new DatabaseJobFeature {  // or BackgroundsJobFeature
    MaxConcurrentJobs = 8,                   // default for every queue
    QueueConcurrency = { ["imports"] = 2 },  // bulk imports can't take over the server
});
```

<queue-lanes></queue-lanes>

### Pause, re-throttle and rate limit at runtime

Queues are also your controls during an incident. When a downstream system is down, **pause its queue** -
its Jobs stay safely queued and resume where they left off, instead of burning through their retries. Raise
a queue's concurrency to clear a backlog, or lower it to protect a struggling dependency, without a
redeploy.

Concurrency limits how many Jobs run at once, but a quota like "10 calls per second" limits how often they
*start*. **Queue rate limits** handle exactly that, and on the RDBMS provider the limit is counted across
every server, so adding servers doesn't multiply your API bill:

```csharp
jobs.PauseJobQueue("payments");
jobs.ResumeJobQueue("payments");
jobs.SetJobQueueConcurrency("imports", 4);
jobs.SetJobQueueRateLimit("stripe-api", rateLimit: 10, window: TimeSpan.FromSeconds(1));
```

Every change is stored in the database, so it takes effect on every server and survives restarts - and
they're all available from the Admin UI's **Queues** tab:

<screenshot src="/img/posts/scalable-background-jobs/04-queues.webp" title="Pause, resume, concurrency and rate limit controls for each queue"></screenshot>

## Never do the same work twice

Networks time out, users double-click and messages get replayed. The same request arriving twice is
normal - charging a customer twice isn't. Background Jobs now gives you three ways to make sure work
happens once:

- **Idempotent enqueue** - give a Job a meaningful `RefId` and submitting it again returns the Job that's
  already queued instead of creating a duplicate
- **Singleton Jobs** - a `SingletonKey` allows only one Job with that key to be queued or running at a time,
  enforced by a unique index so it holds even when several servers submit at the same moment
- **Transactional outbox** - with the RDBMS provider, queue Jobs on your own connection so they're saved in
  the same transaction as your data. If the transaction rolls back, so do its Jobs

```csharp
jobs.EnqueueCommand<ChargeOrderCommand>(order, new() {
    RefId = $"charge-order-{order.Id}",
    DuplicateRefIdBehavior = DuplicateRefIdBehavior.ReturnExisting,
});

jobs.EnqueueCommand<RefreshProductsCacheCommand>(new() {
    SingletonKey = "refresh-products-cache",
});
```

<dedup-playground></dedup-playground>

## Failures that heal themselves

Most failures are temporary, so the best thing a Job can do is wait and try again - without every failed
Job hammering a recovering dependency at the same moment:

- **Smarter retries** back off with `Fixed`, `Linear`, `Exponential` or the new default
  `ExponentialJitter`, which spreads retries out after an outage
- **Every failure is kept**, with its error, server and duration, so an intermittent failure shows its
  full history rather than only the last error
- **Jobs that shouldn't run late won't** - give a Job an `ExpiresIn` or `ExpiresAt` and if it can't start
  in time it's cancelled with `JobExpired`, so there are no reminders for meetings that already happened
- **Timeouts are enforced**, and even a Job that ignores its cancellation token releases its Worker so the
  Jobs behind it keep moving
- **Cancellation reaches the running Job**, on whichever server is executing it

```csharp
jobs.EnqueueCommand<SyncCrmContactCommand>(contact, new() {
    RetryLimit = 5,
    RetryBackoff = RetryBackoff.ExponentialJitter,
    RetryDelay = TimeSpan.FromSeconds(5),
    MaxRetryDelay = TimeSpan.FromMinutes(5),
    ExpiresIn = TimeSpan.FromHours(1),
    TimeoutSecs = 120,
});
```

Plan out a retry policy and see when each attempt would run:

<retry-planner></retry-planner>

<screenshot src="/img/posts/scalable-background-jobs/07-job-attempts.webp" title="A Job that succeeded after two failed attempts"></screenshot>

## From single Jobs to workflows

### Multi-step workflows

Real business processes are rarely a single step. Jobs can now depend on each other, with each step able
to read the result of the step before it. If a step fails, the steps after it are cancelled, while steps
queued with `JobDependencyPolicy.OnFinished` still run however the previous step ended - perfect for
notifications and clean-up:

```csharp
var charge  = jobs.EnqueueCommand<ChargePaymentCommand>(order);
var reserve = jobs.EnqueueCommand<ReserveInventoryCommand>(order, new() { DependsOn = charge.Id });
var ship    = jobs.EnqueueCommand<ShipOrderCommand>(order, new() {
    DependsOn = reserve.Id,
    Callback = nameof(OrderShippedCommand),
});
// Tell the customer what happened, whether shipping succeeded or not
jobs.EnqueueCommand<NotifyCustomerCommand>(order, new() {
    DependsOn = ship.Id,
    DependsOnPolicy = JobDependencyPolicy.OnFinished,
});
```

<workflow-simulator></workflow-simulator>

### Batches with live progress

Fan out thousands of Jobs as a **Batch** and watch its progress in the Admin UI. When every Job has
finished the batch's `callback` runs, and `onSuccess` runs only if every Job succeeded - so "email the
report when the import completes" no longer needs a polling loop. A Job with `DependsOnBatch` fans back in,
only running once the whole batch is done:

```csharp
jobs.CreateJobBatch(batchId, total: images.Count,
    callback: nameof(ImportFinishedCommand),   // runs once every Job has finished
    onSuccess: nameof(PublishGalleryCommand)); // only when every Job succeeded

foreach (var image in images)
    jobs.EnqueueCommand<ResizeImageCommand>(image, new() { BatchId = batchId });

jobs.EnqueueCommand<CreateZipArchiveCommand>(new() { DependsOnBatch = batchId });
```

<batch-simulator></batch-simulator>

A whole batch can be cancelled or have its failed Jobs requeued in one call:

<screenshot src="/img/posts/scalable-background-jobs/09-job-batch.webp" title="Batch progress, callbacks and requeueing its failed Jobs"></screenshot>

### Keep each customer's Jobs in order

Jobs that share a `ConcurrencyKey` run one at a time, while Jobs with different keys still run in
parallel. Each tenant's syncs, each account's ledger updates or each document's edits are applied in order,
without serialising everyone else behind them:

```csharp
jobs.EnqueueCommand<SyncTenantDataCommand>(sync, new() {
    ConcurrencyKey = $"tenant:{sync.TenantId}",
    TenantId = sync.TenantId, // also filter and report by tenant
});
```

<tenant-ordering></tenant-ordering>

## Get results back

Background work doesn't have to mean fire-and-forget. **Await a Job's result** in the same request to keep a
synchronous API while the heavy lifting runs on whichever server has capacity, or give it a `ReplyTo` and
have its result **delivered** the moment it completes - POSTed to a webhook URL, or published to an MQ:

<results-delivery></results-delivery>

When a `ReplyTo` can come from your users, restrict where results can be sent so your servers can't be used
to reach internal addresses:

```csharp
services.AddPlugin(new DatabaseJobFeature {
    ValidateReplyTo = JobReplyTo.AllowUrlPrefixes(["https://hooks.example.org/"]),
});
```

## Schedules you can trust

[Recurring Tasks](https://docs.servicestack.net/recurring-tasks) are now durable and safe to run on every
server - each occurrence is only ever queued once, however many servers evaluate the schedule. Schedules
run in the time zone you choose, can skip an occurrence while the previous one is still running, and can be
limited to a date range or number of runs:

```csharp
var schedule = Schedule.Cron("0 9 * * MON-FRI");
schedule.TimeZoneId = "America/New_York";
schedule.OverlapPolicy = ScheduleOverlapPolicy.Skip;
schedule.EndDate = new DateTime(2026, 12, 31);

jobs.RecurringCommand<SendDailyDigestCommand>("Daily Digest", schedule);
```

<schedule-pillars></schedule-pillars>

<screenshot src="/img/posts/scalable-background-jobs/11-scheduled-tasks.webp" title="Scheduled Tasks with their next run, last result and run-now controls"></screenshot>

## See what your Jobs are doing

A job platform is only as good as your ability to see into it. The **Background Jobs Admin UI** now shows
per-queue statistics and wait times on its dashboard, so a backlog shows up before Jobs start timing out:

<screenshot src="/img/posts/scalable-background-jobs/01-dashboard.webp" title="Job activity and statistics over a selected period"></screenshot>

It also gains queue controls, the Nodes view, each Job's failed attempts, batch progress, pause and
run-now controls for Scheduled Tasks, replaying a completed Job, and bulk actions to cancel or requeue Jobs
by queue, tag or batch. Running Jobs stream their progress and logs live:

<screenshot src="/img/posts/scalable-background-jobs/03-job-running.webp" title="A running Job streaming its progress and logs live"></screenshot>

Outside the Admin UI, Background Jobs plugs into the tools your team already uses:

<observability-pillars></observability-pillars>

A `JobsHealthCheck` reports a growing backlog, a long wait or servers that stopped reporting to
[ASP.NET Core health checks](https://docs.servicestack.net/background-jobs-monitoring#health-checks), and
Jobs publish OpenTelemetry traces and metrics under `ServiceStack.Jobs`. Each Job continues the trace of the
request that queued it - even after a retry, or when another server recovers it - so an API call and the
work it started appear in the same trace:

```csharp
services.AddHealthChecks()
    .AddCheck<JobsHealthCheck>("background-jobs");

services.AddOpenTelemetry()
    .WithTracing(x => x.AddSource(JobsDiagnostics.Name))
    .WithMetrics(x => x.AddMeter(JobsDiagnostics.Name));
```

## Keeping your database lean

Your jobs database is a work queue, not a blob store, so v10.3 bounds what goes into it. Requests larger
than `MaxRequestBodyChars` (1M chars) are rejected when queued, oversized Responses aren't stored, Job logs
are capped at `MaxJobLogChars`, and you can opt in to `JobSummaryRetention` and `ArchiveRetention` to delete
old history automatically:

```csharp
services.AddPlugin(new DatabaseJobFeature {
    JobSummaryRetention = TimeSpan.FromDays(90),
    ArchiveRetention = TimeSpan.FromDays(365),
});
```

## Upgrading

Background Jobs upgrades its database schema automatically on startup. The changes are additive, so your
history and Scheduled Tasks are preserved, but there are a few things to prepare for:

- **Let your queue drain first** - Jobs that are still queued, delayed, retrying or running when the
  upgrade is applied are cleared, and kept in your history as Cancelled with `QueueClearedOnUpgrade`
- **Upgrade every server at once** - when running the RDBMS provider on multiple servers, stop them all
  before starting the new version rather than doing a rolling deploy
- **Check your concurrency** - Jobs without a named Worker now run at most `MaxConcurrentJobs` at a time
  per queue (default: the number of CPU cores)
- **`ReplyTo` is now delivered** - if you used it to store your own data, move it to `Args` or `Meta`

See [Upgrading to v10.3](https://docs.servicestack.net/releases/v10_03#upgrading-to-v10.3) in the Release
Notes for the full checklist, schema changes and behaviour changes to review.

## Get Started

Background Jobs is available in every ServiceStack App on **.NET 8+**. Existing Apps get the reliability
improvements with the upgrade, while new features are opt-in per Job or per queue. Use
[DatabaseJobFeature](https://docs.servicestack.net/background-jobs-rdbms) on PostgreSQL, SQL Server or
MySQL to scale out across servers, or [SQLite Background Jobs](https://docs.servicestack.net/background-jobs-sqlite)
for a single server.

To add RDBMS Background Jobs to an existing App, run:

:::sh
npx add-in db-jobs
:::

Or for SQLite Background Jobs:

:::sh
npx add-in jobs
:::

Then open **Background Jobs** in the [Admin UI](https://docs.servicestack.net/admin-ui) to see your queues,
batches and schedules. To dive deeper, the Background Jobs docs have been reorganized into focused guides:

<jobs-guides></jobs-guides>
