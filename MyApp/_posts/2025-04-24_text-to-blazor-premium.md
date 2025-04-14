---
title: Text to Blazor upgraded to use best coding LLMs
summary: Text to Blazor now generates CRUD Apps using best coding models from Google, Anthropic, Meta, DeepSeek & Mistral
tags: [okai,ai,autoquery,blazor,vue]
author: Demis Bellot
image: ./img/posts/text-to-blazor/bg.webp
---

## Text to Blazor now utilizing world's best coding models

After the positive reception we've received for Text to Blazor we've now upgraded it to use the best 
(non-thinking) coding LLMs from the leading AI and OSS companies, inc:

<div class="not-prose py-4 flex justify-between items-center">
    <div class="mx-auto text-center">
        <img class="mx-auto h-20" src="https://openai.servicestack.net/img/models/gemini-pro.svg">
        <div>
            <b class="block">Google</b>
            <span class="text-sm">Gemini 2.5 Pro</span>
        </div>
    </div>
    <div class="mx-auto text-center">
        <img class="mx-auto h-20" src="https://openai.servicestack.net/img/models/claude-3-sonnet.svg">
        <div>
            <b class="block">Anthropic</b>
            <span class="text-sm">Claude 3.7 Sonnet</span>
        </div>
    </div>
    <div class="mx-auto text-center">
        <img class="mx-auto h-20 p-2" src="https://openai.servicestack.net/img/models/llama.svg">
        <div>
            <b class="block">Meta</b>
            <span class="text-sm">Llama 4 Maverick (400B)</span>
        </div>
    </div>
    <div class="mx-auto text-center">
        <img class="mx-auto h-20" src="https://openai.servicestack.net/img/models/deepseek-3.jpg">
        <div>
            <b class="block">DeepSeek</b>
            <span class="text-sm">DeepSeek V3 (685B)</span>
        </div>
    </div>
    <div class="mx-auto text-center">
        <img class="mx-auto h-20 p-2" src="https://openai.servicestack.net/img/models/codestral.svg">
        <div>
            <b class="block">Mistral</b>
            <span class="text-sm">Codestral (22B)</span>
        </div>
    </div>
</div>


These LLMs routinely top [Aider's LLM Leaderboards](https://aider.chat/docs/leaderboards/) and are also amongst
the most popular LLMs used for **programming** on [Open Router](https://openrouter.ai):

[![](/img/posts/text-to-blazor-premium/popular-coding-llms.webp)]([/text-to-blazor](https://openrouter.ai/rankings/programming?view=day))

## 100+ Blazor CRUD Apps Created!

Since [Text to Blazor's announcement](/posts/text-to-blazor) in ServiceStack's last release we're happy
to report that more than 100+ Blazor CRUD Apps have been created and downloaded!

Text to Blazor harnesses the power of AI to instantly generate new Blazor Admin CRUD Apps from just a text description.

<div class="flex justify-center">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="Bd283EYJKxM" style="background-image: url('https://img.youtube.com/vi/Bd283EYJKxM/maxresdefault.jpg')"></lite-youtube>
</div>

[![](/img/posts/text-to-blazor/text-to-blazor-prompt.webp)](/text-to-blazor)

<div class="pb-4 not-prose flex justify-center">
<a href="https://servicestack.net/text-to-blazor" class="text-3xl text-indigo-600 hover:text-indigo-800">https://servicestack.net/text-to-blazor</a>
</div>


This will query 5 different leading AI coding models to generate 5x different Data Models, APIs, DB Migrations and Admin UIs which you choose amongst to pick the best one that matches your requirements for your new CRUD App:

[![](/img/posts/text-to-blazor-premium/text-to-blazor-premium.webp)](/text-to-blazor)

### Using AI to only generate Data Models

Whilst the result is a working CRUD App, the approach taken is very different from most AI tools
which uses AI to generate the entire App that ends up with a whole new code-base developers didn't write
which they'd now need to maintain.

Instead AI is only used to generate the initial Data Models within a **TypeScript Declaration file**
which we've found is the best format supported by AI models that's also the best typed DSL for defining
data models with minimal syntax that's easy for humans to read and write.

### Download preferred Blazor Vue CRUD App

Once you've decided on the Data Models that best matches your requirements, you can download your preferred 
generated Blazor Vue CRUD App:

[![](/img/posts/text-to-blazor/text-to-blazor-download.webp)](/text-to-blazor)

### Blazor Admin App

**Admin Only** - is ideal for internal Admin Apps where the Admin UI is the Primary UI

![](/img/posts/text-to-blazor/okai-blazor-admin.webp)

### Blazor Vue App

**UI + Admin** - Creates a new [blazor-vue](https://blazor-vue.web-templates.io) template that's ideal
for Internet or public facing Apps, sporting a full-featured public facing UI for a Web App's
users whilst enabling a back-office CRUD UI for Admin Users to manage their App's data.

![](/img/posts/text-to-blazor/okai-blazor-vue.webp)

Clicking on the **Admin UI** button will take you to the Admin UI at `/admin`:

![](/img/posts/text-to-blazor/okai-blazor-vue-admin.webp)


## Run Migrations

In order to create the necessary tables for the new functionality, you'll need to run the DB Migrations.

If migrations have never been run before, you can run the `migrate` npm script to create the initial database:

:::sh
npm run migrate
:::

If you've already run the migrations before, you can run the `rerun:last` npm script to drop and re-run the last migration:

:::sh
npm run rerun:last
:::

Alternatively you can nuke the App's database (e.g. `App_Data/app.db`) and recreate it from scratch with `npm run migrate`.

## Instant CRUD UI

After running the DB migrations, you can hit the ground running and start using the Admin UI to manage the new 
Data Model RDBMS Tables:

:::youtube 8buo_ce3SNM
Using AutoQuery CRUD UI in a Text to Blazor App
:::

### Create new Records from Search Dialog

We're continually improving the UX of the [AutoQueryGrid Component](/vue/autoquerygrid) used in generating CRUD UIs to enable a more productive and seamless workflow. A change added to that end that you can see in the above video is the ability to add new Records from a Search dialog:

![](/img/posts/text-to-blazor/autoquerygrid-new2.webp)

This now lets you start immediately creating new records without needing to create any lookup entries beforehand.

## Audited Data Models

The TypeScript Data Models enable a rapid development experience for defining an App's Data Models which are used
to generate the necessary AutoQuery CRUD APIs to support an Admin UI.

An example of the productivity of this approach is the effortless support for maintaining a detailed audit history for changes to select tables by inheriting from the `AuditBase` base class, e.g:

```ts
export class Job extends AuditBase {
    ...
}
```

Which can then be regenerated using the name of the TypeScript Model definitions:

:::sh
npx okai Jobs.d.ts
:::

This will include additional `CreatedBy`, `CreatedDate`, `ModifiedBy`, `ModifiedDate`, `DeletedBy` and `DeletedDate`
properties to the specified Table and also generates the necessary
[Audit Behaviors](https://docs.servicestack.net/autoquery/crud#apply-generic-crud-behaviors)
on the AutoQuery APIs to maintain the audit history for each CRUD operation.

### AutoQuery CRUD Audit Log

As the **blazor-admin** and **blazor-vue** templates are configured to use the [AutoQuery CRUD Executable Audit Log](https://docs.servicestack.net/autoquery/audit-log)
in its [Configure.AutoQuery.cs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp/Configure.AutoQuery.cs)
the Audit Behaviors will also maintain an Audit Trail of all CRUD operations which can be viewed in the Admin UI:

![](/img/posts/text-to-blazor/okai-audit-form.webp)

