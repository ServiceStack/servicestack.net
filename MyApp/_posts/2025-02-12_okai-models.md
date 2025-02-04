---
title: New okai tool for Rapid App Development
summary: Explore the new okai tool and workflow for rapidly developing Blazor Vue Crud Apps with AI and TypeScript Data Models
tags: [okai,ai,autoquery,blazor,vue]
author: Demis Bellot
image: https://images.unsplash.com/photo-1613206485381-b028e578e791?crop=entropy&fit=crop&h=1000&w=2000
---

## AI powered Rapid App Development Workflow

The new `okai` npm tool works similar to the online [Text to Blazor App](/posts/text-to-blazor) generator
except it's a local tool that can add additional functionality to an existing project:

<ascii-cinema src="/img/posts/okai-models/okai-prompt-jobs.cast"
    loop="true" poster="npt:00:20" theme="dracula" rows="24" />

The syntax for adding a new feature to your Web App is `npx okai <prompt>`, e.g:

:::sh
npx okai "The type of App you would like to create"
:::

Where it will generate the Data Models, AutoQuery CRUD APIs, DB Migrations and Admin UI for the 
selected feature which you'll see after selecting the LLM Data Models you want to use, e.g:

```sh
Selected 'deepseek-r1:70b' data models

Saved: /home/mythz/src/MyApp/MyApp.ServiceModel/Jobs.d.ts
Saved: /home/mythz/src/MyApp/MyApp.ServiceModel/Jobs.cs
Saved: /home/mythz/src/MyApp/wwwroot/admin/sections/Jobs.mjs
Saved: /home/mythz/src/MyApp/wwwroot/admin/sections/index.mjs
Saved: /home/mythz/src/MyApp/Migrations/Migration1001.cs

Run 'dotnet run --AppTasks=migrate' to apply new migration and create tables

To regenerate classes, update 'Jobs.d.ts' then run:
$ okai Jobs.d.ts
```

Where okai will generate everything needed to support the feature in your App, including:

- `MyApp.ServiceModel/Jobs.d.ts` - TypeScript Data Models
- `MyApp.ServiceModel/Jobs.cs` - AutoQuery CRUD APIs and Data Models
- `wwwroot/admin/sections/Jobs.mjs` - Admin UI Section
  - requires `blazor-admin` or `blazor-vue` template
- `MyApp/Migrations/Migration1001.cs` - DB Migrations
  - requires project with [OrmLite DB Migrations](https://docs.servicestack.net/ormlite/db-migrations) 

Then to apply the migration and create the tables you can run:

:::sh
npm run migrate
:::

## Declarative AI powered Features

The approach okai uses is very different from most AI tools which instead of using AI to generate an 
entire App or source code for a feature it's only used to generate the initial Data Models within 
a TypeScript Declaration file which we've found is best format supported by AI models that's also the 
best typed DSL for defining data models with minimal syntax that's easy for humans to read and write.

This is possible for ServiceStack Apps since a significant portion of an App's functionality can be
[declaratively applied](https://docs.servicestack.net/locode/declarative) including all 
[AutoQuery CRUD APIs](https://docs.servicestack.net/autoquery/crud) which can be implemented just
using typed Request DTOs to define the shape of the API AutoQuery should implement.

From the Data Models, the rest of the feature is generated using declarative code-first APIs depending
on the template used. 

### Generated Admin UI

To have okai generate an Admin UI you'll need to use it within a new Blazor Admin project or 
Blazor Vue ([blazor-vue](https://blazor-vue.web-templates.io)) project:

:::sh
x new blazor-admin Acme
:::

Which both support a "Modular no-touch" Admin UI which will appear under a new group in the Admin Sidebar:

![](/img/posts/text-to-blazor/okai-blazor-admin.webp)

## Customize Data Models

The data models defined in the TypeScript Declaration file e.g. `Jobs.d.ts` is what drives the
generation of the Data Models, APIs, DB Migrations and Admin UIs.

This can be further customized by editing the TypeScript Declaration file and re-running the `okai` tool
with the name of the TypeScript Declaration file, e.g. `Jobs.d.ts`:

:::sh
npx okai Jobs.d.ts
:::

Which will re-generate the Data Models, APIs, DB Migrations and Admin UIs based on the updated Data Models.

![](/img/posts/text-to-blazor/okai-Employees.webp)

:::tip
You only need to specify the `Jobs.d.ts` TypeScript filename (i.e. not the filepath) from
anywhere within your .NET solution
:::

### Live Code Generation

If you'd prefer to see the generated code in real-time you can add the `--watch` flag to watch the 
TypeScript Declaration file for changes and automatically re-generate the generated files on Save:

:::sh
npx okai Jobs.d.ts --watch
:::

<video autoplay="autoplay" loop="loop" controls>
    <source src="https://media.servicestack.com/videos/okai-watch.mp4" type="video/mp4">
</video>
