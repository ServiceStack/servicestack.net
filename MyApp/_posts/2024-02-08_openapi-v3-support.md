---
title: OpenAPI v3 Support
summary: A walkthrough of the new OpenAPI v3 support in ServiceStack 8.1
tags: [openapi,.net8]
image: https://images.unsplash.com/photo-1496478981722-3ae516118a04?crop=entropy&fit=crop&h=1000&w=2000
author: Darren Reid
draft: true
---

In the ServiceStack 8.1 release, we have introduced a way to better incorporate your ServiceStack APIs into the larger ASP.NET Core ecosystem by mapping your ServiceStack APIs to the [standard ASP.NET Core Endpoints](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/routing?view=aspnetcore-8.0#endpoints). This enables you to have your ServiceStack APIs integrate with your larger ASP.NET Core application in the same way other middle ware does, opening up more opportunities for reuse of your ServiceStack APIs.

This opens up the ability to use common third party tooling. A good example of this is adding OpenAPI v3 specification generation for your endpoints offered by the `Swashbuckle` package. As a part of the 8.1 release, we have also added the `ServiceStack.AspNetCore.OpenApi` library to make this integration as easy as possible, and incorporate additional information from your ServiceStack APIs into Swagger metadata.

Previously, without the ability to map Endpoints, we've maintained a ServiceStack specific OpenAPI specification generation via the `OpenApiFeature` plugin. While this provided a lot of functionality by accurately describing your ServiceStack APIs, it could be tricky to customize those API descriptions to the way some users wanted to.

In this post we will look at how you can take advantage of the new OpenAPI v3 Swagger support using mapped Endpoints, customizing the generated specification, as well as touch on other related changes to ServiceStack 8.1.

## AppHost Initialization

To use ServiceStack APIs as mapped Endpoints, the way ServiceStack is initialized in your ASPNET Core application needs to be updated. To map your ServiceStack API to standard Endpoints, we also need to change any uses of the `Funq` IoC container to use ASP.NET Core's built in Dependency Injection system.

### Program.cs

Previously, the following initialized your ServiceStack `AppHost` by itself.

```csharp
app.UseServiceStack(new AppHost());
```

The `app` in this example is a `WebApplication` resulting from an `IHostApplicationBuilder` calling `builder.Build()`. And while we still need to call the `UseServiceStack` method, we also need to move the discover of your ServiceStack APIs to earlier in the setup.

```csharp
var builder = WebApplication.CreateBuilder(args);
// Add dependencies using `builder.Services`
// ...
// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
```

In the above, there is nothing ServiceStack specific yet, this is how any ASP.NET Core application would integrate Swagger/OpenAPI v3 support. Next, we will want to register our ServiceStack services.

```csharp
// Register all services
builder.Services.AddServiceStack(typeof(MyServices).Assembly, c => {
    c.AddSwagger(o => {
        o.AddBasicAuth();
    });
});
```

Before we call `builder.Build()`, we to make sure our services and any dependencies they declare in their own `ConfigureServices` method are initialized. We call `AddSwagger` with the `AddBasicAuth` option to add the ServiceStack routes to the OpenAPI generated operations. This manages the mapping from ServiceStack to OpenAPI specification for you, while still leaving the standard options for customization using the `Swashbuckle` library to customize that description of your APIs as you see fit. The `AddBasicAuth` or `AddJwtAuth` adds an `OpenApiSecurityScheme` which trickles down to the Swagger UI.

We then `Build()` our `WebApplication`, and continue on with our application config in the `Program.cs` file as normal.

```csharp
var app = builder.Build();

app.UseSwagger(); // Provided by Swashbuckle library
app.UseSwaggerUI(); // Provided by Swashbuckle library
```

And lastly, we still need to call `app.UseServiceStack` with your `AppHost`, but this time we also want to add the `MapEndpoints` call on the `ServiceStackOptions`.

```csharp
app.UseServiceStack(new AppHost(), options =>
{
    options.MapEndpoints();
});

app.Run();
```

All this setup is done for you in our updated ServiceStack [templates](https://github.com/NetCoreTemplates), but for existing applications, you will need to do [some additional changes](#TODO_migration_docs) to support this new way of running your ServiceStack applications.

## More Control

One point of friction with our previous `OpenApiFeature` plugin was the missing customization ability to the OpenAPI spec to somewhat disconnect from the defined ServiceStack service, and related C# Request and Response Data Transfer Objects (DTOs). Since the `OpenApiFeature` plugin used class and property attributes on your Request DTOs, making the *structure* of the OpenAPI schema mapping quite ridged, preventing the ability for certain customizations.

For example, if we have an `UpdateTodo` Request DTO that looks like the following class:

```csharp
[Route("/todos/{Id}", "PUT")]
public class UpdateTodo : IPut, IReturn<Todo>
{
    public long Id { get; set; }
    [ValidateNotEmpty]
    public string Text { get; set; }
    public bool IsFinished { get; set; }
}
```

Previously, we would get a default Swagger UI that enabled all the properties as `Paramters` to populate.

![](/img/posts/openapi-v3/openapi-v2-defaults.png)

While this correctly describes the Request DTO structure, sometimes as developers we get requirements for how we want to present our APIs to our users from within the Swagger UI. 

With the updated SwaggerUI, and the use of the `Swashbuckle` library, we get the following UI by default.

![](/img/posts/openapi-v3/openapi-v3-defaults-application-json.png)

These are essentially the same, we have a CRUD Todo API that takes a `UpdateTodo` Request DTO, and returns a `Todo` Response DTO. ServiceStack needs to have uniquely named Request DTOs, so we can't have a `Todo` schema as the Request DTO despite the fact that it is the same structure as our `Todo` model. 
This is a good thing, as it allows us to have a clean API contract, and separation of concerns between our Request DTOs and our models. 
However, it might not be desired to present this to our users, since it can be convenient to think about CRUD services as taking the same resource type as the response.

To achieve this, we use the Swashbuckle library to customize the OpenAPI spec generation. Depending on what you want to customize, you can use the `SchemaFilter` or `OperationFilter` options. In this case, we want to customize the matching operation to reference the `Todo` schema for the Request Body.

First, we create a new class that implements the `IOperationFilter` interface.

```csharp
public class OperationRenameFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (context.ApiDescription.HttpMethod == "PUT" &&
            context.ApiDescription.RelativePath == "todos/{Id}")
        {
            operation.RequestBody.Content["application/json"].Schema.Reference = new OpenApiReference
            {
                Type = ReferenceType.Schema,
                Id = "Todo"
            };
        }
    }
}
```

The above matches some information about the `UpdateTodo` request we want to customize, and then sets the `Reference` property of the `RequestBody` to the `Todo` schema.
We can then add this to the `AddSwaggerGen` options in the `Program.cs` file.

```csharp
builder.Services.AddSwaggerGen(o =>
{
    o.OperationFilter<OperationRenameFilter>();
});
```

The result is the following Swagger UI.

![](/img/posts/openapi-v3/openapi-v3-customized-application-json.png)

This is just one simple example of how you can customize the OpenAPI spec generation, and `Swashbuckle` has some great documentation on the different ways you can customize the generated spec.
And these customizations impact any of your ASP.NET Core Endpoints, not just your ServiceStack APIs.

## Closing

Now that ServiceStack APIs can be mapped to standard ASP.NET Core Endpoints, it opens up a lot of possibilities for integrating your ServiceStack APIs into the larger ASP.NET Core ecosystem. 
The use of the `Swashbuckle` library via the `ServiceStack.AspNetCore.OpenApi` library is just one example of how you can take advantage of this new functionality.
