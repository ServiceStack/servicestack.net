---
title: Generate CRUD APIs and Admin UIs from existing DB
summary: Use the metadata from an existing RDBMS to generate AutoQuery CRUD APIs and Admin UIs for managing your data.
tags: [okai,db,autoquery,api,admin-ui]
author: Demis Bellot
image: https://images.unsplash.com/photo-1484662020986-75935d2ebc66?crop=entropy&fit=crop&h=1000&w=2000
---

A core piece of functionality in the [Text to Blazor CRUD App](/posts/text-to-blazor) feature is distilling an AI Prompt
into TypeScript classes that can be [further customized](https://localhost:5002/posts/text-to-blazor#customize-data-models)
to generate AutoQuery CRUD APIs and Admin UIs for managing the underlying RDBMS tables.

## TypeScript Data Models

Using TypeScript to define models is a flexible and effortless way to define your data models as it offers a DSL-like 
format with minimal boilerplate that's human-friendly to read and write that can also leverage TypeScript's
powerful TypeScript Type System to provide a rich authoring experience with strong typing and intellisense
that's validated against the referenced [api.d.ts](https://okai.servicestack.com/api.d.ts) schema 
containing all the C# Types, interfaces, and attributes used in defining APIs, DTOs and Data Models.

### Blueprint for Code Generation

The TypeScript Data Models then serve as the blueprint for generating everything needed to support the feature 
in your App, including the AutoQuery CRUD APIs, Admin UIs and DB Migrations should you prefer to re-create it from scratch.

### RDBMS Metadata AppTask

The first step in generating TypeScript Data Models is to capture the metadata from the existing RDBMS tables which
we can do with the `App.json` [AppTask](https://docs.servicestack.net/app-tasks) below which uses your App's configured
RDBMS connection to generate the Table Definitions for all tables in the specified RDBMS connection and schema
to the file of your choice (e.g `App_Data/App.json`):

```csharp
AppTasks.Register("App.json", args =>
  appHost.VirtualFiles.WriteFile("App_Data/App.json",ClientConfig.ToSystemJson(
      migrator.DbFactory.GetTables(namedConnection:null, schema:null))));
```

This task can then be run from the command line with:

:::sh
dotnet run --AppTasks=App.json
:::

Which will generate the `App_Data/App.json` file containing the metadata for all tables in the RDBMS.

### Different Connection or DB Schema

If you prefer to generate the metadata for a different connection or schema, you can create a new AppTask 
with your preferred `namedConnection` and/or `schema`, e.g:

```csharp
AppTasks.Register("Sales.json", args =>
  appHost.VirtualFiles.WriteFile("Sales.json", ClientConfig.ToSystemJson(
    migrator.DbFactory.GetTables(namedConnection:"reports",schema:"sales"))));
```

### Generate TypeScript Data Models

The next step is to generate TypeScript Data Models from the captured metadata which can be done with the `okai` tool
by running the `convert` command with the path to the `App.json` JSON table definitions which will generate the 
TypeScript Data Models to stdout which can be redirected to a file in your **ServiceModel** project, e.g:

:::sh
npx okai convert App_Data/App.json > ../MyApp.ServiceModel/App.d.ts  
:::

## Generate CRUD APIs and Admin UIs

The data models defined in the `App.d.ts` TypeScript Declaration file is what drives the
generation of the Data Models, APIs, DB Migrations and Admin UIs.

### Customize Data Models

This can be further customized by editing the TypeScript Declaration file and re-running the `okai` tool
with just the filename, e.g:

:::sh
npx okai App.d.ts
:::

Which will re-generate the Data Models, APIs, DB Migrations and Admin UIs based on the updated Data Models.

![](/img/posts/okai-models/npx-okai-App.png)

:::tip
You only need to specify the `App.d.ts` TypeScript filename (i.e. not the filepath) from
anywhere within your .NET solution
:::

### Live Code Generation

If you'd prefer to see the generated code in real-time you can add the `--watch` flag to watch the
TypeScript Declaration file for changes and automatically re-generate the generated files on Save:

:::sh
npx okai App.d.ts --watch
:::

<video autoplay="autoplay" loop="loop" controls>
    <source src="https://media.servicestack.com/videos/okai-watch.mp4" type="video/mp4">
</video>