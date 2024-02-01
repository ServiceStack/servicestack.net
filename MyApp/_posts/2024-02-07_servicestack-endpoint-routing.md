---
title: ServiceStack Endpoint Routing
summary: ServiceStack .NET 8 is now more integrated then ever with support for ASP.NET Core Endpoint Routing and IOC    
tags: [servicestack,.net 8,apis]
image: https://images.unsplash.com/photo-1510022151265-1bb84d406531?crop=entropy&fit=crop&h=1000&w=2000
author: Demis Bellot
draft: true
---

In an effort to reduce friction and improve integration with ASP.NET Core Apps, we've continued the trend from last year
for embracing ASP.NET Core's built-in features and conventions which saw the latest ServiceStack v8 release converting 
all its newest .NET 8 templates to adopt [ASP.NET Core Identity Auth](https://docs.servicestack.net/auth/identity-auth).

This is a departure from building upon our own multi-platform abstractions which allows the same ServiceStack code-base
to run on both .NET Core and .NET Framework. Our new focus is to instead the adopt De facto standards and conventions 
of the latest .NET platform for ServiceStack's new value-added features.

Whilst ServiceStack integrates into ASP.NET Core Apps as custom middleware into ASP.NET Core's HTTP Request Pipeline, 
it invokes its own black-box of functionality from there, implemented using its own suite of disconnected features.

Whilst this works well with ServiceStack having full control over how to implement its own features, it's not as
integrated as it could be, where there are limits on what ServiceStack Features could be used within external ASP .NET Core
MVC Controllers, Razor Pages, Minimal APIs, etc. The ability to apply application-wide authorization policies across
an Application entire surface area, using and configuring different JSON Serialization implementations.

### Areas for tighter integration

The major areas we've identified that could benefit from tighter integration with ASP.NET Core include:

 - [Funq IOC Container](https://docs.servicestack.net/ioc)
 - [ServiceStack Routing](https://docs.servicestack.net/routing) and [Request Pipeline](https://docs.servicestack.net/order-of-operations)
 - [ServiceStack.Text JSON Serializer](https://docs.servicestack.net/json-format)

### ServiceStack v8.1 is fully integrated!

We're happy to announce the latest release of ServiceStack v8.1 now supports utilizing the optimal ASP.NET Core's features 
to reimplement all these key areas - fostering seamless integration and greater reuse.

Better yet, this is the new behavior enabled in all of ServiceStack's new ASP .NET Identity Auth .NET 8 templates.

### ASP .NET Core IOC

The primary limitation of ServiceStack using its own Funq IOC is that any dependencies registered in Funq are not injected
into Razor Pages/Blazor Components/MVC Controllers etc. registered in ASP .NET Core's IOC. 

That's why our [Modular Startup](https://docs.servicestack.net/modular-startup) configurations have recommended utilizing
custom `IHostingStartup` configurations to register application dependencies in ASP .NET Core's IOC where they can be 
injected into both ServiceStack Services and ASP.NET Core's external components, e.g:

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureDb))]

namespace MyApp;

public class ConfigureDb : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
                context.Configuration.GetConnectionString("DefaultConnection"),
                SqliteDialect.Provider));
        });
}
```

But there were fundamental restrictions on what could be registered in ASP .NET Core's IOC as everything needed to be 
registered before AspNetCore's `WebApplication` was built and before ServiceStack's AppHost could be initialized, 
which prohibited being able to register any dependencies created by the AppHost including Services, AutoGen Services, 
Validators and internal functionality like App Settings, Virtual File System and Caching providers, etc.

## Switch to use ASP .NET Core IOC

To enable ServiceStack to switch to using ASP .NET Core's IOC you'll need to move registration of all dependencies and
Services to before the WebApplication is built by calling the `AddServiceStack()` extension method with the Assemblies
where your ServiceStack Services are located, e.g:

```csharp
builder.Services.AddServiceStack(typeof(MyServices).Assembly);

var app = builder.Build();

//...
app.UseServiceStack(new AppHost());
```

Which now registers all ServiceStack dependencies in ASP .NET Core's IOC, including all ServiceStack Services prior to
the AppHost being initialized which no longer needs to specify the Assemblies where ServiceStack Services are created
and no longer needs to use Funq as all dependencies should now be registered in ASP .NET Core's IOC.

### Registering Dependencies and Plugins

Additionally ASP.NET Core's IOC requirement for all dependencies needing to be registered before the WebApplication is 
built means you'll no longer be able to register any dependencies or plugins in ServiceStack's `AppHost.Configure()` method.

```csharp
public class AppHost() : AppHostBase("MyApp"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Register IOC Dependencies and ServiceStack Plugins
        });

    public override void Configure()
    {
        // DO NOT REGISTER ANY PLUGNIS OR DEPENDENCIES HERE
    }
}
```

Instead anything that needs to register dependencies in ASP.NET Core IOC should now use the `IServiceCollection` extension methods:

 - Use `IServiceCollection.Add*` APIs to register dependencies
 - Use `IServiceCollection.AddPlugin` API to register ServiceStack Plugins
 - Use `IServiceCollection.RegisterService*` APIs to dynamically register ServiceStack Services

This can be done wherever you have access to `IServiceCollection`, either in `Program.cs`:

```csharp
builder.Services.AddPlugin(new AdminDatabaseFeature());
```

Or in any Modular Startup `IHostingStartup` configuration, e.g:

```csharp
public class ConfigureDb : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
                context.Configuration.GetConnectionString("DefaultConnection"),
                SqliteDialect.Provider));
            
            // Enable Audit History
            services.AddSingleton<ICrudEvents>(c =>
                new OrmLiteCrudEvents(c.GetRequiredService<IDbConnectionFactory>()));
            
            // Enable AutoQuery RDBMS APIs
            services.AddPlugin(new AutoQueryFeature {
                 MaxLimit = 1000,
            });

            // Enable AutoQuery Data APIs
            services.AddPlugin(new AutoQueryDataFeature());
            
            // Enable built-in Database Admin UI at /admin-ui/database
            services.AddPlugin(new AdminDatabaseFeature());
        })
        .ConfigureAppHost(appHost => {
            appHost.Resolve<ICrudEvents>().InitSchema();
        });
}
```

The `ConfigureAppHost()` extension method can continue to be used to execute any startup logic that requires access to 
any registered dependencies.

### Authoring ServiceStack Plugins

To enable ServiceStack Plugins to support both Funq and ASP .NET Core IOC, any dependencies and Services a plugin needs
should be registered in the `IConfigureServices.Configure(IServiceCollection)` method as seen in the refactored
[ServerEventsFeature.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack/ServerEventsFeature.cs)
plugin, e.g:

```csharp
public class ServerEventsFeature : IPlugin, IConfigureServices
{
    //...
    public void Configure(IServiceCollection services)
    {
        if (!services.Exists<IServerEvents>())
        {
            services.AddSingleton<IServerEvents>(new MemoryServerEvents
            {
                IdleTimeout = IdleTimeout,
                HouseKeepingInterval = HouseKeepingInterval,
                OnSubscribeAsync = OnSubscribeAsync,
                OnUnsubscribeAsync = OnUnsubscribeAsync,
                OnUpdateAsync = OnUpdateAsync,
                NotifyChannelOfSubscriptions = NotifyChannelOfSubscriptions,
                Serialize = Serialize,
                OnError = OnError,
            });
        }
        
        if (UnRegisterPath != null)
            services.RegisterService<ServerEventsUnRegisterService>(UnRegisterPath);

        if (SubscribersPath != null)
            services.RegisterService<ServerEventsSubscribersService>(SubscribersPath);
    }

    public void Register(IAppHost appHost)
    {
        //...
    }
}
```

#### All Plugins refactored to support ASP .NET Core IOC

All of ServiceStack's Plugins have been refactored to make use of `IConfigureServices` which supports registering in both 
Funq and ASP.NET Core's IOC when enabled.  

#### Funq IOC implements IServiceCollection and IServiceProvider interfaces

To enable this Funq now implements both `IServiceCollection` and`IServiceProvider` interfaces to enable 100% source-code 
compatibility for registering and resolving dependencies with either IOC, which we now recommend using over Funq's
native Registration and Resolution APIs to simplify migration efforts to ASP.NET Core's IOC in future.

## Dependency Injection

The primary difference between the IOC's is that ASP.NET Core's IOC does not support property injection by default, 
which will require you to refactor your ServiceStack Services to use constructor injection of dependencies, although
this has become a lot more pleasant with C# 12's [Primary Constructors](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/primary-constructors)
where it now requires a lot less boilerplate to define and assign dependencies, e.g:

```csharp
public class TechStackServices(IAutoQueryDb autoQuery) : Service
{
    public async Task<object> Any(QueryTechStacks request)
    {
        using var db = autoQuery.GetDb(request, base.Request);
        var q = autoQuery.CreateQuery(request, Request, db);
        return await autoQuery.ExecuteAsync(request, q, db);
    }
}
```

This has become our preferred approach for injecting dependencies in ServiceStack Services which have all been refactored
to use constructor injection utilizing primary constructors in order to support both IOC's.

To make migrations easier we've also added support for property injection convention in **ServiceStack Services** using 
ASP.NET Core's IOC where you can add the `[FromServices]` attribute to any public properties you want to be injected, e.g:

```csharp
public class TechStackServices : Service
{
    [FromServices]
    public required IAutoQueryDb AutoQuery { get; set; }

    [FromServices]
    public MyDependency? OptionalDependency { get; set; }
}
```

This feature can be useful for Services wanting to access optional dependencies that may or may not be registered. 

::: info NOTE
This is only supported in ServiceStack Services and not other dependencies
:::

### Built-in ServiceStack Dependencies

This integration now makes it effortless to inject and utilize optional ServiceStack features like
[AutoQuery](https://docs.servicestack.net/autoquery/) and [Server Events](https://docs.servicestack.net/server-events)
in other parts of ASP.NET Core inc. Blazor Components, Razor Pages, MVC Controllers, Minimal APIs, etc.

Whilst Built-in ServiceStack features that are registered by default and are immediately available to be injected into any IOC dependency include:
 - `IVirtualFiles` - Read/Write [Virtual File System](https://docs.servicestack.net/virtual-file-system), defaults to `FileSystemVirtualFiles` at `ContentRootPath`
 - `IVirtualPathProvider` - Multi Virtual File System configured to scan multiple read only sources, inc `WebRootPath`, In Memory and Embedded Resource files  
 - `ICacheClient` and `ICacheClientAsync` - In Memory Cache, or distributed Redis cache if [ServiceStack.Redis](https://docs.servicestack.net/redis/) is configured
 - `IAppSettings` - Multiple [AppSettings](https://docs.servicestack.net/appsettings) configuration sources

With ASP.NET Core's IOC now deeply integrated we cast our eyes on the next area of integration: API Integration and Routing.

## Endpoint Routing

Whilst ASP.NET Core's middleware is a flexible way to compose and execute different middleware in a HTTP Request pipeline,
each middleware is effectively their own island of functionality that's able to handle HTTP Requests in which ever way
they see fit.

In particular ServiceStack's middleware would execute its own [Request Pipeline](https://docs.servicestack.net/order-of-operations) 
which would execute ServiceStack API's registered at user-defined routes with its own [ServiceStack Routing](https://docs.servicestack.net/routing).




This release continues that trend by adding support for 
[ASP.NET Core Endpoint Routing](https://docs.servicestack.net/releases/v5.10#aspnet-core-endpoint-routing)