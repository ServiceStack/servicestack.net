---
title: AutoQuery Schemas - instant CRUD Apps from your data models
url: /posts/autoquery-schema
image: /img/posts/autoquery-schema/bg.webp
order: 4
---

Open **/auto** in an App with AutoQuery APIs and you already have an admin application: a searchable gallery of your data models, and behind each one a working CRUD App with a results grid, server-side paging, sorting, AutoQuery's typed filters, column selection, persistent preferences, Create and Edit forms, searchable reference lookups and guarded Delete actions. No frontend project and no generated source files.

The catalog and every action within it are generated for the **current session**, so a model only appears when its Query API is accessible and Create, Edit and Delete only appear when that user can call them. Add `.json` to get the portable schema powering it, and give it to the generic `AutoQuerySchema` component in `@servicestack/vue` or `@servicestack/react` to embed the same experience in your own App's navigation and design system.
