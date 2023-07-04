---
title: Vue Stable Diffusion
summary: Rewriting Blazor Diffussion image generation & album catalog in Vue & Razor SSG  
tags: vue,tailwind
image: https://images.unsplash.com/photo-1573490647695-2892d0bf89e7?crop=entropy&fit=crop&h=1000&w=2000
author: Demis Bellot
---

Just as [blazordiffusion.com](https://blazordiffusion.com) was created to showcase ServiceStack's
Blazor Server and Blazor WASM [project templates and components](/blazor), we've also recreated a new Stable Diffusion UI 
in Vue to showcase the [Razor SSG](https://razor-ssg.web-templates.io) Project Template and Tailwind
[Vue Component Library](https://docs.servicestack.net/vue/) that's now available at:

<h3 class="not-prose text-4xl text-center pb-8">
    <a class="text-blue-600 hover:underline" href="https://diffusion.works">https://diffusion.works</a>
</h3>

## Blazor Diffusion with a Vue UI

Weighing close to [100 APIs](https://api.blazordiffusion.com/metadata), Blazor Diffusion is good representation of a 
medium-sized real-world App that can be used to compare the end user UX of different popular UI technologies used to
develop Web Apps. 

These Diffusion Apps are especially comparable as both Blazor WASM and Vue are both SSG Jamstack Apps deployed to a CDN
which both access the same [https://api.blazordiffusion.com](https://api.blazordiffusion.com/metadata) backend .NET APIs and
both make use of the Tailwind [Blazor Component Library](https://servicestack.net/blazor#blazor-component-gallery) and
[Vue Component Library](https://docs.servicestack.net/vue/) rewritten in Vue, so any differences in UX are predominantly
differences in what the UI technologies can deliver.

We'll look at covering the development workflow, productivity, startup and runtime performance of Blazor Server, 
Blazor WASM and Vue in a future post, for now you can compare their GitHub code-bases and Live Demos of each or download 
and run them locally to evaluate their code-base size, development workflow and performance to evaluate the different
UI technologies:

| Name          | Repo                                                                                  | Live Demo                                                        |
|---------------|---------------------------------------------------------------------------------------|------------------------------------------------------------------|
| Vue           | [NetCoreApps/VueDiffusion](https://github.com/NetCoreApps/VueDiffusion)               | [https://diffusion.works](https://diffusion.works)               |
| Blazor WASM   | [NetCoreApps/BlazorDiffusionWasm](https://github.com/NetCoreApps/BlazorDiffusionWasm) | [blazordiffusion.com](https://blazordiffusion.com)               |
| Blazor Server | [NetCoreApps/BlazorDiffusion](https://github.com/NetCoreApps/BlazorDiffusion)         | [server.blazordiffusion.com](https://server.blazordiffusion.com) |

It's best to evaluate Blazor Server by running it locally as it in particular has poor responsiveness when served over 
high internet latencies, but loads and runs exceptional well in low latency environments like Intranets which is the 
only environment where we'd recommend hosting it.

## Razor SSG

Vue Diffusion is built differently from other Razor SSG Apps as instead of being pre-rendered from static content
like Markdown documents, it's prerendered from https://blazordiffusion.com APIs to render its dynamic 
[Albums](https://diffusion.works/albums/), [Top](https://diffusion.works/top) and [Latest](https://diffusion.works/latest) 
pages at deployment which it does by configuring the App's [Service Gateway](https://docs.servicestack.net/service-gateway) to reference 
[external Blazor Diffusion APIs](https://github.com/NetCoreApps/VueDiffusion/blob/0bbbca3970c07c0cf261ae32c24736ae287981f9/MyApp/Configure.Ssg.cs#L22):

```csharp
services.AddSingleton<IServiceGateway>(implementationFactory: 
    provider => new JsonApiClient(AppConfig.Instance.ApiBaseUrl!));
```

Resulting in all APIs invoked within Razor Pages being delegated to external Blazor Diffusion APIs as the data source
to generate its prerendered Razor Pages.

## Features

For a preview of the development model of Razor SSG enhanced with Vue Components, checkout some of the different pages 
and their implementations:

<div class="not-prose">
    <h3 class="text-3xl flex justify-between">
        <span>Stable Diffusion Search</span>
        <a class="text-blue-600 hover:underline" href="https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/Pages/Index.cshtml">
            Index.cshtml
        </a>
    </h3>
</div>

[![](/img/posts/vue-diffusion/vuediffusion-search.png)](https://diffusion.works)

<div class="not-prose">
    <h3 class="text-3xl flex justify-between">
        <span>Generate Images</span>
        <span>
            <a class="text-blue-600 hover:underline" href="https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/Pages/Create.cshtml">
                Create.cshtml
            </a>
            <span class="text-gray-400">|</span> 
            <a class="text-blue-600 hover:underline" href="https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/wwwroot/mjs/components/Create.mjs">
                Create.mjs
            </a>
        </span>
    </h3>
</div>

[![](/img/posts/vue-diffusion/vuediffusion-create.png)](https://diffusion.works/create)

<div class="not-prose">
    <h3 class="text-3xl flex justify-between">
        <span>Favorites</span>
        <a class="text-blue-600 hover:underline" href="https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/Pages/Favorites.cshtml">
            Favorites.cshtml
        </a>
    </h3>
</div>

[![](/img/posts/vue-diffusion/vuediffusion-favorites.png)](https://diffusion.works/favorites)

<div class="not-prose">
    <h3 class="text-3xl flex justify-between">
        <span>Albums</span>
        <a class="text-blue-600 hover:underline" href="https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/Pages/Albums.cshtml">
            Albums.cshtml
        </a>
    </h3>
</div>

[![](/img/posts/vue-diffusion/vuediffusion-albums.png)](https://diffusion.works/albums/)

<div class="not-prose">
    <h3 class="text-3xl flex justify-between">
        <span>Selected Image</span>
        <a class="text-blue-600 hover:underline" href="https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/wwwroot/mjs/components/Artifacts.mjs#L303">
            Artifacts.mjs
        </a>
    </h3>
</div>

[![](/img/posts/vue-diffusion/vuediffusion-selected.png)](https://diffusion.works/?view=63121)

<div class="not-prose">
    <h3 class="text-3xl flex justify-between">
        <span>Top Images</span>
        <a class="text-blue-600 hover:underline" href="https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/Pages/Top.cshtml">
            Top.cshtml
        </a>
    </h3>
</div>

[![](/img/posts/vue-diffusion/vuediffusion-top.png)](https://diffusion.works/top)

<div class="not-prose">
    <h3 class="text-3xl flex justify-between">
        <span>Latest Images</span>
        <span>
            <a class="text-blue-600 hover:underline" href="https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/Pages/Latest.cshtml">
                Latest.cshtml
            </a>
            <span class="text-gray-400">|</span> 
            <a class="text-blue-600 hover:underline" href="https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/Pages/Latest.cshtml.cs">
                Latest.cshtml.cs
            </a>
        </span>
    </h3>
</div>

[![](/img/posts/vue-diffusion/vuediffusion-latest.png)](https://diffusion.works/latest)

Most of these pages also utilize the reusable Vue 3 components defined in: 

- [Artifacts.mjs](https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/wwwroot/mjs/components/Artifacts.mjs)
- [Auth.mjs](https://github.com/NetCoreApps/VueDiffusion/blob/main/MyApp/wwwroot/mjs/components/Auth.mjs)

## Stale-While-Revalidate APIs

We'll have a lot more to write up about our experiences with Vue Diffusion vs Blazor Diffusion in future
[Blog Posts](https://servicestack.net/blog), but we wanted to highlight the performance enhancing technique it uses
to improve perceived performance between pages by utilizing `@servicestack/vue` new State-While-Revalidate (SWR) APIs.

Latency is the biggest performance killer when hosting Web Applications on the Internet, so much so that we'd
historically look to start with a [Single Page App template](https://jamstacks.net) in order to provide the
best UX up until the advent of native ES Modules support in modern browsers meant we could rid ourselves of
SPA complexity and adopt a [Simple, Modern JavaScript](https://jamstacks.net/posts/javascript) Multi Page App (MPA)
approach combined with [htmx's Boost](https://htmx.org/attributes/hx-boost/) feature to improve performance
by avoiding full page reloads.

However we found that to be a fragile approach when navigating back/forward between pages as you'd need to be
mindful of what scripts to place between `<head>` and `<body>` tags and which scripts need to be re-executed
between navigations, reintroducing some of the stateful SPA complexity we want to avoid with a traditional MPA Web App.

We instead discovered we could get just as good UX with stateless full page reloads of pre-rendered HTML pages
if we use SWR to fetch all the API data needed to render the page on first load:

[![](/img/posts/vue-diffusion/diffusion-swr.gif)](https://diffusion.works)

This is easily achieved in reactive Vue.js UIs by invoking API requests with the new `swr()` client API where if
the same API request had been run before it will execute the callback immediately with its "stale" cached results
in `localStorage` first, before executing the callback again after receiving the API response with the latest data:

```ts
import { useClient } from "@servicestack/vue"
const client = useClient()

const results = ref([])
const topAlbums = ref([])
//...

onMounted(async () => {
    await Promise.all([
        client.swr(request.value, api => {
            results.value = api.response?.results || []
            //...
        }),
        client.swr(new AnonData(), async api => {
            topAlbums.value = api.response?.topAlbums || []
            //...
        }),
    ])
})
```

This results in UIs being immediately rendered on load and if the API response has changed, the updated reactive 
collections will re-render the UI with the updated data.
