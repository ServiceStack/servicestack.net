---
title: Using ASP.NET Core Output Caching
summary: How to use ASP.NET Core Output Caching to cache the response of a ServiceStack Service using ServiceStack.Redis
tags: [caching,.net8,redis]
author: Darren Reid
image: ./img/posts/redis-outputcache/bg.webp
---

With the release of ServiceStack 8.1, we've embraced tighter integration with ASP.NET Core, including support for registering ServiceStack services with ASP.NET Core's Endpoint Routing system. This opens up exciting opportunities to leverage more of ASP.NET Core's rich feature set in your ServiceStack applications.

One such feature is ASP.NET Core's built-in support for Output Caching (also known as Response Caching). Output Caching allows you to dramatically improve the performance of your APIs by caching the output and serving it directly from the cache for subsequent requests. This can significantly reduce the load on your server and database for frequently accessed, cacheable responses.

## Enabling Output Caching

To utilize Output Caching with your ServiceStack Endpoints, you first need to add the Output Caching middleware to your ASP.NET Core request pipeline in the `Configure` method of your `Program.cs`:

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
app.UseOutputCache();
// ...
app.UseServiceStack(new AppHost(), options => options.MapEndpoints());
```

Then in `ConfigureServices` you need to add the Output Caching services:

```csharp
services.AddOutputCache();
```

The order of adding OutputCache to your request pipeline can be very sensitive to change, so this will depend largely on your application and dependencies you are already using. For example, below is an example of using it in a Blazor application.

```csharp
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();
// Add OutputCache after Antiforgery and before Auth related middleware
app.UseOutputCache();

// Required for OutputCache
app.UseAuthentication();
app.UseAuthorization();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

// Add additional endpoints required by the Identity /Account Razor components.
app.MapAdditionalIdentityEndpoints();

app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
});
```

## Configuring Caching Behavior

With the middleware in place, you can now configure caching behaviors for your ServiceStack Endpoints by registering against the Route Handlers within the ServiceStack `options`.

```csharp
app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
    options.RouteHandlerBuilders.Add((routeHandlerBuilder, operation, verb, route) =>
    {
        routeHandlerBuilder.CacheOutput(c =>
        {
            // Use Cache Profiles
            c.UseProfile("Default30");

            // Or configure caching per-request
            c.Expire(TimeSpan.FromSeconds(30));
            c.VaryByAll();
        });
    });
});
```

You can also vary the cache by specific properties, e.g:

```csharp
builder.CacheOutput(c => c.VaryBy("userRole","region"));
```

Or use Cache Profiles for reusable caching strategies:

```csharp
builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("Default30", p => p.Expire(TimeSpan.FromSeconds(30)));
});
```

Then apply the named profile to your endpoints:

```csharp
builder.CacheOutput(c => c.UseProfile("Default30"));
```

## Finer-grained Control

For more granular control, you can apply the `[OutputCache]` attribute directly on your Service class, and use the ServiceStack AppHost metadata in your `RouteHandlerBuilder`s `Add` method to detect and cache only the routes that are attributed with `OutputCache`.

```csharp
app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
    options.RouteHandlerBuilders.Add((routeHandlerBuilder, operation, verb, route) =>
    {
        // Initialized appHost and allServiceTypes
        var appHost = HostContext.AppHost;
        var allServiceTypes = appHost.Metadata.ServiceTypes;

        // Find the service matching the RequestType of the operation
        var operationType = operation.RequestType;
        // Match with operation, verb and route
        appHost.Metadata.OperationsMap.TryGetValue(operationType, out var operationMap);
        var serviceType = operationMap?.ServiceType;
        if (serviceType == null)
            return;
        if (serviceType.HasAttributeOf<OutputCacheAttribute>())
        {
            // Handle duration from OutputCacheAttribute
            var outputCacheAttribute = serviceType.FirstAttribute<OutputCacheAttribute>();
            routeHandlerBuilder.CacheOutput(policyBuilder =>
            {
                policyBuilder.Cache().Expire(TimeSpan.FromSeconds(outputCacheAttribute.Duration));
            });
        }
    });
});
```



```csharp
[OutputCache(Duration = 60)]
public class MyServices : Service
{
    public object Any(Hello request)
    {
        return new HelloResponse { Result = $"Hello, {request.Name}!" };
    }
}
```

This enables for fine grained control of the built in `OutputCache` functionality compatible with using the same attribute with your MVC Controllers, and you can extend your use by updating the code above within the ServiceStack options.

## ServiceStack Redis Distributed Cache

The above examples so far have been using a cache store that comes with the OutputCache package. This is just an in memory store, so isn't suitable for a distributed application. Thankfully, you can override the IOutputCacheStore interface in your IoC to change out the implementation that uses a centralized system like a Redis server.

```csharp
public class RedisOutputCacheStore(IRedisClientsManager redisManager) : IOutputCacheStore
{
    public async ValueTask<byte[]?> GetAsync(string key, CancellationToken cancellationToken)
    {
        await using var redis =  await redisManager.GetClientAsync(token: cancellationToken);
        var value = await redis.GetAsync<byte[]>(key, cancellationToken);
        return value;
    }

    public async ValueTask SetAsync(string key, byte[] value, string[]? tags, TimeSpan validFor, CancellationToken cancellationToken)
    {
        await using var redis = await redisManager.GetClientAsync(token: cancellationToken);
        
        // First persist in normal cache hashset
        await redis.SetAsync(key, value, validFor, cancellationToken);

        if (tags == null)
            return;
        foreach (var tag in tags)
        {
            await redis.AddItemToSetAsync($"tag:{tag}", key, cancellationToken);
        }
    }

    public async ValueTask EvictByTagAsync(string tag, CancellationToken cancellationToken)
    {
        await using var redis = await redisManager.GetClientAsync(token: cancellationToken);
        
        var keys = await redis.GetAllItemsFromListAsync($"tag:{tag}", cancellationToken);
        
        foreach (var key in keys)
        {
            await redis.RemoveEntryAsync(key);
            await redis.RemoveItemFromSetAsync($"tag:{tag}", key, cancellationToken);
        }
    }
}
```

The above is a simple implementation of the IOutputCacheStore using the ServiceStack.Redis client to handle a centralized distributed cache. Using the class above, we can create a `Configure.OutputCache.cs` file that registers our IoC dependencies.

```csharp
[assembly: HostingStartup(typeof(BlazorOutputCaching.ConfigureOutputCache))]

namespace BlazorOutputCaching;

public class ConfigureOutputCache : IHostingStartup
{
    public void Configure(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.AddSingleton<IRedisClientsManager>(c =>
                new BasicRedisClientManager("localhost:6379"));
            services.AddSingleton<IOutputCacheStore, RedisOutputCacheStore>();
        });
    }
}
```

We register out Redis client manager for our RedisOutputCacheStore, and then the store itself.

## Summary

ASP.NET Core Output Caching is a powerful tool for improving the performance of your ServiceStack endpoints. With ServiceStack 8.1's tight integration with ASP.NET Core Endpoint Routing, utilizing this feature is now straightforward.

As always, caching is a balancing act. Apply it judiciously to frequently accessed, cacheable data. And be sure to implement appropriate invalidation strategies to keep your application's data fresh.

By leveraging Output Caching effectively, you can dramatically improve the scalability and responsiveness of your ServiceStack powered applications. Try it out in your ServiceStack 8.1+ projects and let us know how it goes!