---
title: Text to Blazor CRUD upgraded to use best LLMs
summary: Discover how to quickly generate Blazor Admin CRUD Apps from a text description using the new okai tool
tags: [okai,ai,autoquery,blazor,vue]
author: Demis Bellot
image: ./img/posts/text-to-blazor-upgraded/bg.webp
---

Text to Blazor has upgraded to use the best coding LLMs from Anthropic, Google, Moonshot AI, 
Alibaba and xAI to power its app generation capabilities to create new Blazor Admin CRUD 
Apps from just a text description.

<section class="not-prose">
<div id="text-to-blazor" class="bg-white dark:bg-black pb-8">
  <a href="/text-to-blazor">
  <div class="py-4 mx-auto flex justify-between items-center max-w-screen-lg">
    <div class="mx-auto text-center">
      <img class="mx-auto h-20" src="/img/models/anthropic.svg">
      <div>
        <b class="block">Anthropic</b>
        <span class="text-sm">Claude 4.5 Sonnet</span>
      </div>
    </div>
    <div class="mx-auto text-center">
      <img class="mx-auto h-20" src="/img/models/gemini-pro.svg">
      <div>
        <b class="block">Google</b>
        <span class="text-sm">Gemini 2.5 Pro</span>
      </div>
    </div>
    <div class="mx-auto text-center">
      <img class="mx-auto h-20" src="/img/models/moonshot.svg">
      <div>
        <b class="block">Moonshot AI</b>
        <span class="text-sm">Kimi K2 (1T)</span>
      </div>
    </div>
    <div class="mx-auto text-center">
      <img class="mx-auto h-20 p-2" src="/img/models/qwen.svg">
      <div>
        <b class="block">Alibaba</b>
        <span class="text-sm">Qwen 3 Coder (480B)</span>
      </div>
    </div>
    <div class="mx-auto text-center">
      <img class="mx-auto h-20 p-2" src="/img/models/xai.svg">
      <div>
        <b class="block">xAI</b>
        <span class="text-sm">Grok Code Fast</span>
      </div>
    </div>
  </div>
  </a>
  <div class="my-8 mx-auto w-[340px]">
    <a href="/text-to-blazor"
       class="flex items-center rounded-full bg-white px-6 py-3 text-lg font-semibold text-green-900 shadow-sm ring-2 ring-inset ring-green-300 hover:bg-gray-50">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-4" viewBox="0 0 32 32"><path fill="currentColor" d="M19 22v-2h1v-7h-1v-2h4v2h-1v7h1v2zm-3.5 0h2L14 11h-3L7.503 22h2l.601-2h4.778zm-4.794-4l1.628-5.411l.256-.003L14.264 18zM32 4h-4V0h-2v4h-4v2h4v4h2V6h4zm-2 8h2v2h-2zM18 0h2v2h-2z"/><path fill="currentColor" d="M32 32H0V0h14v2H2v28h28V18h2z"/></svg>
      Text to Blazor CRUD App
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 ml-1" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12L8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z"/></g></svg>
    </a>
  </div>
</div>
</section>

Just enter in the type of App you want to create or the Data Models it needs and it will generate 
a new Blazor CRUD App for you.

<div class="flex justify-center">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="Bd283EYJKxM" style="background-image: url('https://img.youtube.com/vi/Bd283EYJKxM/maxresdefault.jpg')"></lite-youtube>
</div>

[![](/img/posts/text-to-blazor/text-to-blazor-prompt.webp)](/text-to-blazor)

<div class="pb-4 not-prose flex justify-center">
<a href="https://servicestack.net/text-to-blazor" class="text-3xl text-indigo-600 hover:text-indigo-800">https://servicestack.net/text-to-blazor</a>
</div>

This will query 5 different high quality AI models to generate 5 different Data Models, APIs, DB Migrations 
and Admin UIs which you can browse to find the one that best matches your requirements.

[![](/img/posts/text-to-blazor-upgraded/text-to-blazor-gen.webp)](/text-to-blazor)

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

**Admin Only** - ideal for internal Admin Apps where the Admin UI is the Primary UI

![](/img/posts/text-to-blazor/okai-blazor-admin.webp)

### Blazor Vue App

**UI + Admin** - Creates a new [blazor-vue](https://blazor-vue.web-templates.io) template ideal for Internet or public facing Apps, 
sporting a full-featured public facing UI for a Web App's users whilst enabling a back-office CRUD UI 
for Admin Users to manage their data.

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

## FREE Access to worlds most popular AI Models

In addition to upgrading the models in text-to-blazor we've also made available them available to our
generic **chat** prompt that can be used as a convenient way to conduct personal research against many 
of the worlds most popular Large Language Models - for Free!

![](/img/posts/okai-chat/okai-chat.webp)

No API Keys, no Signups, no installs, no cost, you can just start immediately using the `npx okai chat` script to ask LLMs
for assistance:

:::sh
npx okai chat "command to copy a folder with rsync?"
:::

This will use the default model (currently gemini-flash 2.5) to answer your question.

### Select Preferred Model

You can also use your preferred model with the `-m <model>` flag with either the model **name** or its **alias**,
e.g you can use
[Microsoft's PHI-4 14B](https://techcommunity.microsoft.com/blog/aiplatformblog/introducing-phi-4-microsoft%E2%80%99s-newest-small-language-model-specializing-in-comple/4357090) model with:

:::sh
npx okai -m phi chat "command to copy folder with rsync?"
:::

### List Available Models

We're actively adding more great performing and leading experimental models as they're released.
You can view the list of available models with `ls models`:

:::sh
npx okai ls models
:::

Which at this time will return the following list of available models along with instructions for how to use them:

```txt
USAGE (5 models max):
a) OKAI_MODELS=codestral,llama3.3,flash
b) okai -models codestral,llama3.3,flash <prompt>
c) okai -m flash chat <prompt>

FREE MODELS:
claude-3-haiku            (alias haiku)
codestral:22b             (alias codestral)
deepseek-chat-v3.1:671b  
deepseek-r1:671b          (alias deepseek-r1)
deepseek-v3.1:671b        (alias deepseek)
gemini-2.5-flash          (alias flash)
gemini-2.5-flash-lite     (alias flash-lite)
gemini-flash-thinking-2.5
gemma2:9b                
gemma3:27b                (alias gemma)
glm-4.5                  
glm-4.5-air              
glm-4.5v                 
gpt-4.1-mini             
gpt-4.1-nano             
gpt-4o-mini              
gpt-5-mini               
gpt-5-nano               
gpt-oss-120b             
gpt-oss-20b              
grok-code-fast-1          (alias grok-code)
kimi-k2                  
llama-4-maverick         
llama-4-scout            
llama3.1:70b             
llama3.1:8b              
llama3.3:70b              (alias llama3)
llama4:109b               (alias llama4)
llama4:400b              
mistral-nemo:12b          (alias mistral-nemo)
mistral-small:24b         (alias mistral-small)
mistral:7b                (alias mistral)
mixtral:8x22b             (alias mixtral)
nova-lite                
nova-micro               
phi-4:14b                 (alias phi,phi-4)
qwen3-coder              
qwen3-coder:30b          
qwen3:235b               
qwen3:30b                
qwen3:32b                
qwen3:8b                 

PREMIUM MODELS: *
claude-3-5-haiku         
claude-3-5-sonnet        
claude-3-7-sonnet        
claude-3-sonnet          
claude-sonnet-4-0         (alias sonnet)
gemini-2.5-pro            (alias gemini-pro)
gpt-4.1                  
gpt-4o                   
gpt-5                    
gpt-5-chat               
grok-4                    (alias grok)
mistral-large:123b       
nova-pro                 
o4-mini                  
o4-mini-high             

 * requires valid license:
a) SERVICESTACK_LICENSE=<key>
b) SERVICESTACK_CERTIFICATE=<LC-XXX>
c) okai -models <premium,models> -license <license> <prompt>
```

Where you'll be able to use any of the great performing inexpensive models listed under `FREE MODELS` for Free.
Whilst ServiceStack customers with an active commercial license can also use any of the  more expensive
and better performing models listed under `PREMIUM MODELS` by either:

a) Setting the `SERVICESTACK_LICENSE` Environment Variable with your **License Key**
b) Setting the `SERVICESTACK_CERTIFICATE` Variable with your **License Certificate**
c) Inline using the `-license` flag with either the **License Key** or **Certificate**

### FREE for Personal Usage

To be able to maintain this as a free service we're limiting usage as a tool that developers can use for personal
assistance and research by limiting usage to **60 requests /hour** which should be more than enough for most
personal usage and research whilst deterring usage in automated tools.

:::tip info
Rate limiting is implemented with a sliding [Token Bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket)
that replenishes 1 additional request every 60s
:::
