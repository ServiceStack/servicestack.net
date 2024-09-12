---
title: Execute Background Jobs and Recurring Tasks
url: https://docs.servicestack.net/background-jobs
image: /img/posts/background-jobs/jobs-dashboard.webp
order: 1
---

**Background Jobs** is our effortless solution for managing background jobs and 
scheduled tasks in any .NET 8 App, implemented in true ServiceStack fashion where 
it seamlessly integrates into existing ServiceStack Apps with a built-in Management UI 
to provide real-time monitoring, inspection and management of background jobs.

It packs all useful features we wanted in its initial V1 release, including:

- No infrastructure dependencies
    - Monthly archivable rolling Databases with full Job Execution History
- Execute existing **APIs** or **Commands**
- Schedule **Reoccurring Tasks**
- Serially execute jobs with **named Workers**
- Queue Jobs that **Depends On** successful completion of a parent Job
- Execute **Callback** on successful execution of Job
- Queue Jobs to **Run After** a specified Date
- Execute Jobs within the context of an Authenticated User
- **Auto Retry** and **Timeout** failed jobs on a default or per-job limit
- Cancellable Jobs
- Requeue Failed Jobs
- Maintain Status, Logs and Progress of Executing Jobs
- Execute transitive (i.e. non-durable) jobs
