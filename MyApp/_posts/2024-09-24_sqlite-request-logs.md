---
title: SQLite Request Logs 
summary: Maintain Request Log History in rolling Monthly SQLite databases 
tags: [sqlite,.net8]
author: Demis Bellot
image: https://images.unsplash.com/photo-1535350356005-fd52b3b524fb?crop=entropy&fit=crop&h=1000&w=2000
---

Up until this release all of ServiceStack's database features like [AutoQuery](https://servicestack.net/autoquery)
have been database agnostic courtesy of OrmLite's [support for popular RDBMS's](https://docs.servicestack.net/ormlite/installation)
so that they integrate into an App's existing configured database.

[Background Jobs](/posts/background-jobs) is our first foray into a SQLite-only backend, as it's the only 
RDBMS that enables us to provide encapsulated black-box functionality without requiring any infrastructure 
dependencies. It's low latency, high-performance and ability to create lightweight databases on the fly make 
it ideal for self-managing isolated appliance backends like Background Jobs and Request Logging which don't 
benefit from integrating with your existing RDBMS.

The new [ServiceStack.Jobs](https://nuget.org/packages/ServiceStack.Jobs) NuGet package allows us
to deliver plug and play SQLite backed features into .NET 8 Apps that are configured with any RDBMS
or without one. The next feature added is a SQLite backed provider for [Request Logs](https://docs.servicestack.net/request-logger) 
with the new `SqliteRequestLogger` which can be added to existing .NET 8 Apps with the
[mix tool](https://docs.servicestack.net/mix-tool):

:::sh
x mix sqlitelogs
:::

Which adds a reference to **ServiceStack.Jobs** and the [Modular Startup](https://docs.servicestack.net/modular-startup) config below:

```csharp
using ServiceStack.Jobs;
using ServiceStack.Web;

[assembly: HostingStartup(typeof(MyApp.ConfigureRequestLogs))]

namespace MyApp;

public class ConfigureRequestLogs : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            
            services.AddPlugin(new RequestLogsFeature {
                RequestLogger = new SqliteRequestLogger(),
                EnableResponseTracking = true,
                EnableRequestBodyTracking = true,
                EnableErrorTracking = true
            });
            services.AddHostedService<RequestLogsHostedService>();
        });
}

public class RequestLogsHostedService(ILogger<RequestLogsHostedService> log, IRequestLogger requestLogger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var dbRequestLogger = (SqliteRequestLogger)requestLogger;
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(3));
        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            dbRequestLogger.Tick(log);
        }
    }
}
```

This will use a Hosted Background Service to flush Request Logs to the requests SQLite database 
every **3** seconds (configurable in the PeriodicTimer).

If your App is already using `RequestLogsFeature` configured (e.g. with Profiling) you'll want to
remove it:

```csharp
public class ConfigureProfiling : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            // services.AddPlugin(new RequestLogsFeature());
            services.AddPlugin(new ProfilingFeature
            {
                IncludeStackTrace = true,
            });
        });
}
```

## Rolling Monthly SQLite Databases

The benefit of using SQLite is that databases can be created on-the-fly where Requests will be persisted
into isolated **requests** Monthly databases which can be easily archived into managed file storage instead 
of a singular growing database, visible in the [Database Admin UI](https://docs.servicestack.net/admin-ui-database):

![](/img/posts/sqlite-request-logs/sqlite-databases.webp)

SQLite logs will also make it easier to generate monthly aggregate reports to provide key insights
into the usage of your App.

## AutoQuery Grid Admin Logging UI

As SQLite Requests Logs also makes it efficiently possible to sort and filter through logs, the
Logging UI will switch to using a fully queryable `AutoQueryGrid` when using `SqliteRequestLogger`:

![](/img/posts/sqlite-request-logs/sqlite-request-logs.webp)
