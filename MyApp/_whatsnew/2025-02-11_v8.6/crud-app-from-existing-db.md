---
title: Generate CRUD APIs and Admin UIs from existing DBs
url: https://docs.servicestack.net/autoquery/okai-db
image: /img/whatsnew/v8.6/servicify.webp
order: 4
---

This release also enables a new and flexible way to generate AutoQuery CRUD APIs and Admin UIs for an existing 
database using TypeScript Data Models which serve as the blueprint for generating everything needed to support 
the feature in your App, including the AutoQuery CRUD APIs, Admin UIs and DB Migrations.

First step is capturing metadata from existing RDBMS tables with the `App.json` AppTask which uses your 
App's configured DB connection to generate the metadata:

```sh
dotnet run --AppTasks=App.json
```

The generated `App_Data/App.json` metadata can then be converted into TypeScript Data Models with the `okai` tool:

```sh
npx okai convert App_Data/App.json > ../MyApp.ServiceModel/App.d.ts
```

Where you'll then be able to use okai's existing code generation framework to customize the Data Models 
before generating their CRUD APIs and Admin UIs.
