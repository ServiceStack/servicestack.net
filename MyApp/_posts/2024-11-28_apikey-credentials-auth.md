---
title: Simple API Keys Credentials Provider for .NET 8 C# Microservices
summary: Improved Simple Auth using API Keys and Admin UI that's ideal for .NET 8 C# Microservices
tags: [.net8,auth,apikeys]
author: Demis Bellot
image: https://images.unsplash.com/photo-1496368077930-c1e31b4e5b44?crop=entropy&fit=crop&h=1000&w=2000
---

The usability of the [Simple Auth with API Keys](https://docs.servicestack.net/auth/admin-apikeys) story has
been significantly improved with the new `ApiKeyCredentialsProvider` which enables .NET Microservices to provide
persistent UserSession-like behavior using simple API Keys which can be configured together with the
`AuthSecretAuthProvider` and `ApiKeysFeature` to enable a Credentials Auth implementation which users can
use with their API Keys or Admin AuthSecret.

A typical configuration for .NET Microservices looking to enable Simple Auth access whose APIs are protected
by API Keys and their Admin functionality protected by an Admin Auth Secret can be configured with:

```csharp
public class ConfigureAuth : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services =>
        {
            services.AddPlugin(new AuthFeature([
                new ApiKeyCredentialsProvider(),
                new AuthSecretAuthProvider("MyAuthSecret"),
            ]));
            services.AddPlugin(new SessionFeature());
            services.AddPlugin(new ApiKeysFeature());
        })
        .ConfigureAppHost(appHost =>
        {
            using var db = HostContext.AppHost.GetDbConnection();
            appHost.GetPlugin<ApiKeysFeature>().InitSchema(db);
        });
}
```

When registered a Credentials Auth dialog will appear for [ServiceStack Built-in UIs](https://servicestack.net/auto-ui)
allowing users to Sign In with their **API Keys** or Admin **Auth Secret**.

![](/img/posts/apikey-credentials-auth/ai-server-auth-apiexplorer.png)

### Session Auth with API Keys

Behind the scenes this creates a Server [Auth Session](https://docs.servicestack.net/auth/sessions)
but instead of maintaining an Authenticated User Session it saves the API Key in the session then attaches the API Key
to each request. This makes it possible to make API Key validated requests with just a session cookie instead of
requiring resubmission of API Keys for each request.

### AI Server

This is an ideal Auth Configuration for .NET Docker Appliances and Microservices like [AI Server](/posts/ai-server)
that don't need the complexity of ASP .NET Core's Identity Auth machinery and just want to restrict access to their APIs
with API Keys and restrict Admin functionality to Administrator's with an Auth Secret.

The benefit of `ApiKeyCredentialsProvider` is that it maintains a persistent Session so that end users
only need to enter their API Key a single time and they'll be able to navigate to all of AI Server's protected
pages using their API Key maintained in their Server User Session without needing to re-enter it for each UI and
every request.

### User Access with API Keys

AI Server uses **API Keys** to restrict Access to their AI Features to **authorized Users** with Valid API Keys who
are able to use its Built-in UIs for its AI Features with the Users preferred Name and issued API Key:

![](/img/posts/apikey-credentials-auth/ai-server-auth-user.png)

After signing in a single time they'll be able to navigate to any protected page and start using AI Server's
AI features:

![](/img/posts/apikey-credentials-auth/ai-server-auth-user-chat.png)

### User Access to API Explorer

This also lets users use their existing Auth Session across completely different UIs
like [API Explorer](https://docs.servicestack.net/api-explorer)
where they'll have the same access to APIs as they would when calling APIs programatically with their API Keys, e.g:

![](/img/posts/apikey-credentials-auth/ai-server-auth-apiexplorer-api.png)

### Coarse or fine-grained API Key access

By default **any** Valid API Key can access restricted services by `[ValidateApiKey]`

```csharp
[ValidateApiKey]
public class Hello : IGet, IReturn<HelloResponse>
{
    public required string Name { get; set; }
}
```

### API Key Scopes

API Keys can be given elevated privileges where only Keys with user defined scopes:

![](https://docs.servicestack.net/img/pages/auth/simple/admin-ui-apikeys-edit.png)

Are allowed to access APIs restricted with that scope:

```csharp
[ValidateApiKey("todo:read")]
public class QueryTodos : QueryDb<Todo>
{
    public long? Id { get; set; }
    public List<long>? Ids { get; set; }
    public string? TextContains { get; set; }
}
```

### Restricted API Keys to specific APIs 

API Keys can also be locked down to only be allowed to call specific APIs:

![](https://docs.servicestack.net/img/pages/auth/simple/admin-ui-apikeys-restrict-to.png)

## Admin Access

AI Server also maintains an Admin UI and Admin APIs that are only accessible to **Admin** users who 
Authenticate with the App's configured Admin Auth Secret who are able to access AI Server's Admin
UIs to monitor Live AI Requests, create new User API Keys, Manage registered AI Providers, etc. 

![](/img/posts/apikey-credentials-auth/ai-server-auth-admin-jobs.png)

### Admin Restricted APIs

You can restrict APIs to Admin Users by using `[ValidateAuthSecret]`: 

```csharp
[Tag(Tags.Admin)]
[ValidateAuthSecret]
[Api("Add an AI Provider to process AI Requests")]
public class CreateAiProvider : ICreateDb<AiProvider>, IReturn<IdResponse>
{
    //...
}
```

Which are identified in API Explorer with a **padlock** icon whilst APIs restricted by API Key are 
identified with a **key** icon:

![](/img/posts/apikey-credentials-auth/ai-server-auth-apiexplorer-admin.png)
