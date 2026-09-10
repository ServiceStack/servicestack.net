---
title: Startup Tasks - Generate code from your running App
summary: StartupTasks run dev-time tasks once your App has fully started, keeping client DTOs and other generated code in sync with your server on every restart, with no extra build step for developers or AI Assistants to remember
tags: [servicestack, dev, ai]
author: Demis
image: ./img/posts/startup-tasks/bg.webp
---

## A Source Generator that runs inside your App

C# [Source Generators](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/source-generators-overview)
changed how .NET developers think about boilerplate: describe something once, and the compiler keeps
the derived code up to date for you. Nobody has to remember to run anything.

But source generators only run at compile time. They only see your source code, they can only emit C#,
and the generated code can only go into the assembly being compiled. Much of the code a ServiceStack App
depends on is derived from the **running** App instead: its registered Services, its plugins, its
configuration and even the URLs it's listening on.

That's where the new **Startup Tasks** come in. They're a place to register dev tasks that run
automatically **once your App has fully started**, with access to the fully initialized `AppHost`
and all its plugins:

```csharp
StartupTasks.Register("dtos", () =>
    appHost.GetPlugin<NativeTypesFeature>().GenerateDtos());
```

Startup Tasks:

- **Run automatically** after ASP.NET Core reports the App has started
- **Only run in development** when `DebugMode` is enabled, so they're disabled in `Production`
- **Can do anything** a fully running App can do - generate code in any language, rebuild an index, seed content
- **Are isolated** - failures are logged without stopping the App or any of the other tasks

Think of them as source generators for everything a compiler can't see, without being limited to
generating C#.

## No more `npx get-dtos`

The main use-case that motivated the feature is keeping
[Add ServiceStack Reference](https://docs.servicestack.net/add-servicestack-reference) client DTOs in
sync with your server.

Previously after adding or changing a Request DTO, Response DTO or Service, you would also need to
regenerate your client DTOs with:

:::sh
npx get-dtos
:::

It's a small step, but one that's easy to forget. When it's missed, the client keeps compiling against
a stale contract and the mismatch only shows up at runtime, or gets committed to source control.

With the `dtos` Startup Task registered, **restarting your App is enough**. It finds every existing
`dtos.*` reference in your project - `dtos.ts`, `dtos.mjs`, `dtos.py`, `dtos.dart`, `admin.dtos.ts`,
etc. - and regenerates it from the App's own metadata, honoring the options in each file's header.

The generation runs entirely in-process. It doesn't need Node.js or make an HTTP request, and it only
updates files that belong to the current App, so a DTO pointing to another API, staging or production
server is never overwritten. Files are also left alone when only the generated `Date` header would
change, so file-watching tools like `dotnet watch` or Vite don't end up in a rebuild loop.

This makes for a much tighter feedback loop during full-stack development:

1. Change a Service or DTO
2. Restart the App (or let `dotnet watch` do it)
3. Your TypeScript client immediately reports any code broken by the new contract

### Add it to your project

All ServiceStack project templates which use TypeScript `.ts` or JavaScript `.mjs` DTOs already include
the `dtos` Startup Task. To add it to an existing project, run:

:::sh
npx add-in startup-dtos
:::

Which adds the registration in its own `Configure.StartupTasks.GeneratedDtos.cs`:

```csharp
public class ConfigureGeneratedDtos : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(afterAppHostInit: appHost => {
            StartupTasks.Register("dtos", () =>
                appHost.GetPlugin<NativeTypesFeature>().GenerateDtos());
        });
}
```

## One less thing for AI Assistants to get wrong

Removing a manual build step doesn't just help developers, it's even more valuable for AI Assistants.

An AI agent adding a new API needs to know that client DTOs are generated, which command regenerates
them, and that it must be run against the right server URL. When it doesn't, it tends to do the
worst possible thing: hand-write or "fix up" the client types itself, spending tokens on code it
shouldn't be writing and quietly letting the client drift from the server contract.

With Startup Tasks there's nothing for the agent to know. It only has to change the C# DTOs and
Services, which are the source of truth, and the client contracts follow on the next restart:

- **No client contracts to generate** - agents never write or maintain `dtos.ts` by hand
- **No project-specific commands to discover** - no instructions needed in `AGENTS.md` or `CLAUDE.md`
- **Fast, typed feedback** - the TypeScript compiler flags client code affected by the change, which
  agents can act on straight away
- **Smaller, cleaner diffs** - generated files only change when the API contract actually changes

The same workflow works whether a change was made by a developer, an AI Assistant or both.

## Beyond DTOs

Startup Tasks can run any parameterless dev task that requires a fully started App. For example, Apps
using `PdfFeature` can keep the typed C# models of their PDF templates in sync with their `.ui.json`
schemas:

```csharp
StartupTasks.Register("pdf", () =>
    appHost.GetPlugin<PdfFeature>().GeneratePdfs());
```

Or use them for your own development conveniences, like keeping a local search index up to date:

```csharp
StartupTasks.Register("search-index", () =>
    appHost.Resolve<SearchIndexer>().Update());
```

We recommend keeping each registration in its own `Configure.StartupTasks.*.cs` file, e.g:

```text
Configure.StartupTasks.GeneratedDtos.cs
Configure.StartupTasks.GeneratedPdfs.cs
Configure.StartupTasks.SearchIndex.cs
```

Use [App Tasks](https://docs.servicestack.net/app-tasks) instead for tasks that should be explicitly
run from the command-line, accept arguments and exit when complete, e.g. database migrations.

## Learn more

See the [Startup Tasks docs](https://docs.servicestack.net/startup-tasks) for more on configuring
`GenerateDtos()` with `GenerateDtosOptions`, how it determines which DTO files belong to your App,
and how to inspect its `GenerateDtosResult`.
