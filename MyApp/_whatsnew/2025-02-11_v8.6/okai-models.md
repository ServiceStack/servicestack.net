---
title: New okai tool for Rapid App Development
url: https://docs.servicestack.net/autoquery/okai-models
image: /img/posts/okai-models/okai-models.webp
order: 2
---

The new `okai` npm tool works similar to the online [Text to Blazor App](/posts/text-to-blazor) generator
except it's a local tool that can add additional functionality to an existing project.

The syntax for adding a new feature to your Web App is `npx okai <prompt>`, e.g:

```sh
npx okai "The kind of Feature you would like to add"
```

Where it will generate the Data Models, AutoQuery CRUD APIs, DB Migrations and Admin UI for the
selected feature which you'll see after selecting the LLM Data Models you want to use