---
title: Tailwind CSS v4.0 is here! 
summary: All ASP .NET Core Identity Auth Tailwind Templates upgraded to Tailwind CSS v4
tags: [templates,tailwind,vue,react]
author: Demis Bellot
image: ./img/posts/tailwindcss-v4/bg.webp
---

We're happy to announce that all ServiceStack's ASP .NET Core Identity Auth Tailwind Templates have been upgraded to 
[Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4) - an all-new version 
optimized for performance and flexibility, with a reimagined configuration and customization experience, 
and taking full advantage of the latest advancements the web platform has to offer.

<a href="https://tailwindcss.com/blog/tailwindcss-v4">
<svg viewBox="0 0 167 21" fill="none" class="my-12 mx-auto h-12 text-black dark:text-white"><path class="fill-sky-400" d="M17.183 0C12.6 0 9.737 2.291 8.59 6.873c1.719-2.29 3.723-3.15 6.014-2.577 1.307.326 2.242 1.274 3.275 2.324 1.685 1.71 3.635 3.689 7.894 3.689 4.582 0 7.445-2.291 8.591-6.872-1.718 2.29-3.723 3.15-6.013 2.576-1.308-.326-2.243-1.274-3.276-2.324C23.39 1.98 21.44 0 17.183 0ZM8.59 10.309C4.01 10.309 1.145 12.6 0 17.182c1.718-2.291 3.723-3.15 6.013-2.577 1.308.326 2.243 1.274 3.276 2.324 1.685 1.71 3.635 3.689 7.894 3.689 4.582 0 7.445-2.29 8.59-6.872-1.718 2.29-3.722 3.15-6.013 2.577-1.307-.327-2.242-1.276-3.276-2.325-1.684-1.71-3.634-3.689-7.893-3.689Z"></path><path fill="currentColor" d="M51.547 8.688h-3v5.803c0 1.548 1.016 1.524 3 1.427v2.346c-4.015.483-5.611-.629-5.611-3.773V8.688H43.71V6.172h2.225V2.925l2.612-.774v4.021h2.998v2.516Zm11.43-2.516h2.61v12.092h-2.61v-1.741c-.92 1.28-2.346 2.055-4.233 2.055-3.288 0-6.021-2.78-6.021-6.36 0-3.603 2.733-6.36 6.021-6.36 1.886 0 3.313.774 4.233 2.032V6.172Zm-3.821 9.915c2.176 0 3.82-1.62 3.82-3.87 0-2.248-1.644-3.868-3.82-3.868-2.177 0-3.821 1.62-3.821 3.869s1.644 3.87 3.82 3.87ZM69.94 4.36a1.687 1.687 0 0 1-1.668-1.669c.002-.443.179-.868.491-1.18a1.662 1.662 0 0 1 2.354 0c.312.312.49.737.491 1.18 0 .895-.75 1.669-1.668 1.669Zm-1.306 13.905V6.172h2.612v12.092h-2.612Zm5.635 0V.609h2.611v17.654H74.27ZM93.834 6.172h2.757l-3.797 12.092h-2.563l-2.516-8.15-2.539 8.15h-2.563L78.816 6.172h2.757l2.346 8.343 2.54-8.343h2.49l2.514 8.343 2.37-8.343ZM99.83 4.36c-.92 0-1.669-.774-1.669-1.669.002-.443.18-.868.492-1.18a1.661 1.661 0 0 1 2.354 0c.313.312.49.737.492 1.18 0 .895-.75 1.669-1.669 1.669Zm-1.306 13.905V6.172h2.612v12.092h-2.612ZM110.52 5.858c2.708 0 4.643 1.838 4.643 4.982v7.423h-2.612v-7.158c0-1.838-1.064-2.804-2.708-2.804-1.717 0-3.071 1.015-3.071 3.482v6.48h-2.612V6.174h2.612V7.72c.798-1.257 2.103-1.862 3.748-1.862Zm17.024-4.522h2.612v16.927h-2.612v-1.741c-.918 1.282-2.345 2.055-4.231 2.055-3.289 0-6.022-2.78-6.022-6.36 0-3.603 2.733-6.36 6.022-6.36 1.886 0 3.313.774 4.231 2.032V1.336Zm-3.821 14.751c2.177 0 3.821-1.62 3.821-3.87 0-2.248-1.644-3.868-3.821-3.868-2.176 0-3.82 1.62-3.82 3.869s1.644 3.87 3.82 3.87Zm15.187 2.49c-3.651 0-6.384-2.78-6.384-6.36 0-3.602 2.733-6.359 6.384-6.359 2.37 0 4.426 1.233 5.393 3.12l-2.249 1.306c-.532-1.137-1.717-1.863-3.168-1.863-2.128 0-3.748 1.62-3.748 3.797 0 2.176 1.62 3.797 3.748 3.797 1.451 0 2.636-.75 3.216-1.863l2.249 1.282c-1.015 1.91-3.071 3.144-5.441 3.144Zm9.746-9.068c0 2.201 6.505.87 6.505 5.345 0 2.419-2.104 3.724-4.716 3.724-2.418 0-4.159-1.089-4.933-2.83l2.249-1.305c.387 1.088 1.355 1.74 2.684 1.74 1.161 0 2.056-.386 2.056-1.354 0-2.151-6.505-.942-6.505-5.27 0-2.274 1.959-3.701 4.425-3.701 1.983 0 3.628.92 4.474 2.515l-2.2 1.233c-.436-.943-1.283-1.378-2.274-1.378-.943 0-1.765.41-1.765 1.281Zm11.148 0c0 2.201 6.505.87 6.505 5.345 0 2.419-2.104 3.724-4.716 3.724-2.418 0-4.158-1.089-4.933-2.83l2.249-1.305c.387 1.088 1.354 1.74 2.684 1.74 1.161 0 2.056-.386 2.056-1.354 0-2.151-6.505-.942-6.505-5.27 0-2.274 1.959-3.701 4.426-3.701 1.982 0 3.627.92 4.473 2.515l-2.2 1.233c-.435-.943-1.282-1.378-2.273-1.378-.944 0-1.766.41-1.766 1.281Z"></path></svg>
</a>

Tailwindcss v4 is now the default version used in all new ServiceStack Tailwind Blazor, Razor Pages, MVC, Vue, React 
and Angular Templates, including: 

 - [Vue Component Library](https://docs.servicestack.net/vue/) 
 - [Blazor Components](https://servicestack.net/blazor) 
 - All of ServiceStack's [Built-in Auto UIs](/auto-ui)
 - Build and deployment GitHub Actions

### Standalone CLI: Use Tailwind CSS without Node.js

Whilst TailwindCSS v4 brings many quality of life improvements, it also posed a challenge for usage in 
non-Node.js templates which used `npx tailwindcss@v3` to maintain simplicity and avoid needing to install 
any node dependencies. 

Unfortunately using npx without `node_modules` is no longer possible in Tailwind v4, instead we've switched
to using the [Standalone CLI](https://tailwindcss.com/blog/standalone-cli) which allows using Tailwind CSS 
without Node.js.

`tailwindcss` is a single executable that can be added anywhere in your System `PATH`, to simplify the 
process we've added support for detecting, downloading and installing the `tailwindcss` executable if missing 
in each templates `postinstall.js` which can be run with:

:::sh
npm install
:::

In non-Node.js templates this doesn't install any node dependencies, instead it's used to run one-off tasks
like running [DB Migrations](https://docs.servicestack.net/ormlite/db-migrations) to create the App Database,
update any local 3rd Party dependencies and now downloading and installing the `tailwindcss` executable if missing
on Windows, macOS and Linux operating systems, which can also be rerun at anytime with:

:::sh
node postinstall.js
:::

### Blazor Templates

The latest TailwindCSS v4 Standalone CLI is now used in all ServiceStack's Blazor Templates:

<project-creator v-slot="x">
    <project-template :name="x.text" :mix="mixTags" repo="NetCoreTemplates/blazor" :tags="['server','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Blazor</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15z" fill="currentColor"></path></svg>
        </template>
    </project-template>
    <project-template :name="x.text" :mix="mixTags" repo="NetCoreTemplates/blazor-wasm" :tags="['wasm','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Blazor WASM</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15z" fill="currentColor"></path></svg>
        </template>
    </project-template>
    <project-template :name="x.text" :mix="mixTags" repo="NetCoreTemplates/blazor-vue" :tags="['vue','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Blazor Vue</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15z" fill="currentColor"></path></svg>
        </template>
    </project-template>
</project-creator>

- **Blazor** - Identity Auth [Blazor Server Template](/posts/net8-blazor-template)
- **Blazor WASM** - Identity Auth [Blazor WASM](/posts/blazor-8-admin) and Interactive Auto Template
- **Blazor Vue** - No compromises, Identity Auth [statically-rendered Blazor](/posts/net8-best-blazor)

<div class="not-prose my-8 grid grid-cols-3 gap-4">
 <a class="block group border hover:border-indigo-700" href="https://blazor.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/blazor.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">blazor</div>
 </a>
 <a class="block group border hover:border-indigo-700" href="https://blazor-wasm.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/blazor-wasm.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">blazor-wasm</div>
 </a>
 <a class="block group border hover:border-indigo-700" href="https://blazor-vue.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/blazor-vue.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">blazor-vue</div>
 </a>
</div>

### Razor Pages & MVC

The TailwindCSS v4 Standalone CLI is also in Razor Pages and MVC Templates:

<project-creator v-slot="x">
    <project-template :name="x.text" :mix="mixTags" repo="NetCoreTemplates/razor" :tags="['auth','tailwind']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Razor Pages</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M23.844 27.692a16.332 16.332 0 0 1-6.645 1.3q-6.364 0-10.013-3.243a11.3 11.3 0 0 1-3.649-8.9a13.716 13.716 0 0 1 3.785-9.898A12.716 12.716 0 0 1 16.9 3.008a11.676 11.676 0 0 1 8.425 3.006a9.994 9.994 0 0 1 3.142 7.533a10.187 10.187 0 0 1-2.318 7.114a7.532 7.532 0 0 1-5.817 2.547a2.613 2.613 0 0 1-1.845-.642a2.323 2.323 0 0 1-.764-1.6a4.9 4.9 0 0 1-4.148 2.243a4.6 4.6 0 0 1-3.507-1.479a5.706 5.706 0 0 1-1.384-4.063a9.913 9.913 0 0 1 2.2-6.357q2.2-2.763 4.8-2.763a5.063 5.063 0 0 1 4.256 1.716l.311-1.338h2.405l-2.081 9.08a10.716 10.716 0 0 0-.352 2.243q0 .972.744.972a4.819 4.819 0 0 0 3.877-2.047a8.93 8.93 0 0 0 1.621-5.681a7.98 7.98 0 0 0-2.675-6.175a9.887 9.887 0 0 0-6.919-2.432a10.6 10.6 0 0 0-8.158 3.467a12.066 12.066 0 0 0-3.2 8.495a9.561 9.561 0 0 0 3.06 7.573q3.06 2.7 8.586 2.7a13.757 13.757 0 0 0 5.675-1.054ZM19.466 12.25a3.977 3.977 0 0 0-3.6-1.716q-1.824 0-3.263 2.23a8.726 8.726 0 0 0-1.439 4.824q0 3.635 2.905 3.635a3.771 3.771 0 0 0 2.651-1.183a6.309 6.309 0 0 0 1.7-3.2Z"></path></svg>
        </template>
    </project-template>
    <project-template :name="x.text" :mix="mixTags" repo="NetCoreTemplates/mvc" :tags="['auth','tailwind']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">MVC</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 3v8.5H3V3h8.5zm0 18H3v-8.5h8.5V21zm1-18H21v8.5h-8.5V3zm8.5 9.5V21h-8.5v-8.5H21z"/></svg>
        </template>
    </project-template>
</project-creator>

- **razor** - Identity Auth & Entity Framework Razor Pages Template 
- **mvc** - Identity Auth & Entity Framework MVC Template

<div class="not-prose my-8 grid grid-cols-2 gap-4">
 <a class="block group border hover:border-indigo-700" href="https://razor.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/razor.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">razor.web-templates.io</div>
 </a>
 <a class="block group border hover:border-indigo-700" href="https://mvc.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvc.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">mvc.web-templates.io</div>
 </a>
</div>

### React, Vue & Angular SPA Templates

All React, Vue and Angular Single Page App templates have been upgraded to Vite 6 and use Tailwind v4's
[First-party Vite plugin](https://tailwindcss.com/blog/tailwindcss-v4#first-party-vite-plugin) for seamless
integration and even greater incremental live reload performance.

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/vue-spa" :tags="['vite','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Vue SPA</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 3h3.5L12 15l6.5-12H22L12 21L2 3m4.5 0h3L12 7.58L14.5 3h3L12 13.08L6.5 3Z"/></svg>
        </template>
    </project-template>
    <project-template :name="x.text" repo="NetCoreTemplates/react-spa" :tags="['vite','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">React SPA</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10.11c1.03 0 1.87.84 1.87 1.89c0 1-.84 1.85-1.87 1.85c-1.03 0-1.87-.85-1.87-1.85c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7c-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86c.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5l-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47c.54.03 1.11.03 1.71.03c.6 0 1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7c.52.59 1.03 1.23 1.51 1.9c.82.08 1.63.2 2.4.36c.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86c-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63c2.54.75 4.37 1.99 4.37 3.68c0 1.69-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63c-1.46.84-3.45-.12-5.37-1.95c-1.92 1.83-3.91 2.79-5.38 1.95c-1.46-.84-1.62-3.05-1-5.63c-2.54-.75-4.37-1.99-4.37-3.68c0-1.69 1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63c1.47-.84 3.46.12 5.38 1.95c1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26c2.1-.63 3.28-1.53 3.28-2.26c0-.73-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26c-2.1.63-3.28 1.53-3.28 2.26c0 .73 1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16c-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7c.64-.35.83-1.82.32-3.96c-.77.16-1.58.28-2.4.36c-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16c.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 0 1 2.4-.36c.48-.67.99-1.31 1.51-1.9Z"/></svg>
        </template>
    </project-template>
    <project-template :name="x.text" repo="NetCoreTemplates/angular-spa" :tags="['vite','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Angular SPA</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 2.5l8.84 3.15l-1.34 11.7L12 21.5l-7.5-4.15l-1.34-11.7L12 2.5m0 2.1L6.47 17h2.06l1.11-2.78h4.7L15.45 17h2.05L12 4.6m1.62 7.9h-3.23L12 8.63l1.62 3.87Z"></path></svg>
        </template>
    </project-template>
</project-creator>

- **vue-spa** - Identity Auth, Vite 6 Vue 3.5 SPA Template
- **react-spa** - Identity Auth, Vite 6 React 19 SPA Template
- **angular-spa** - Identity Auth, Angular 19 SPA Template

<div class="not-prose my-8 grid grid-cols-3 gap-4">
 <a class="block group border hover:border-indigo-700" href="https://vue-spa.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/vue-spa.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">vue-spa</div>
 </a>
 <a class="block group border hover:border-indigo-700" href="https://react-spa.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/react-spa.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">vue-spa</div>
 </a>
 <a class="block group border hover:border-indigo-700" href="https://angular-spa.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/angular-spa.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">vue-spa</div>
 </a>
</div>

### Razor & Markdown Statically Generated Templates

The [Razor SSG](https://razor-ssg.web-templates.io) template is recommended for creating any statically generated 
websites with Razor like Blogs, Portfolios & Marketing sites like [servicestack.net](https://servicestack.net) 
which can be hosted for **FREE** on 
[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) CDN or 
[Cloudflare Pages](https://pages.cloudflare.com).

Whilst [Razor Press](https://razor-press.web-templates.io) is optimized for developing and maintaining 
documentation-centric websites like [docs.servicestack.net](https://docs.servicestack.net):

<project-creator v-slot="x">
    <project-template :name="x.text" :mix="mixTags" repo="NetCoreTemplates/razor-ssg" :tags="['ssg','markdown']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Razor SSG</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M23.844 27.692a16.332 16.332 0 0 1-6.645 1.3q-6.364 0-10.013-3.243a11.3 11.3 0 0 1-3.649-8.9a13.716 13.716 0 0 1 3.785-9.898A12.716 12.716 0 0 1 16.9 3.008a11.676 11.676 0 0 1 8.425 3.006a9.994 9.994 0 0 1 3.142 7.533a10.187 10.187 0 0 1-2.318 7.114a7.532 7.532 0 0 1-5.817 2.547a2.613 2.613 0 0 1-1.845-.642a2.323 2.323 0 0 1-.764-1.6a4.9 4.9 0 0 1-4.148 2.243a4.6 4.6 0 0 1-3.507-1.479a5.706 5.706 0 0 1-1.384-4.063a9.913 9.913 0 0 1 2.2-6.357q2.2-2.763 4.8-2.763a5.063 5.063 0 0 1 4.256 1.716l.311-1.338h2.405l-2.081 9.08a10.716 10.716 0 0 0-.352 2.243q0 .972.744.972a4.819 4.819 0 0 0 3.877-2.047a8.93 8.93 0 0 0 1.621-5.681a7.98 7.98 0 0 0-2.675-6.175a9.887 9.887 0 0 0-6.919-2.432a10.6 10.6 0 0 0-8.158 3.467a12.066 12.066 0 0 0-3.2 8.495a9.561 9.561 0 0 0 3.06 7.573q3.06 2.7 8.586 2.7a13.757 13.757 0 0 0 5.675-1.054ZM19.466 12.25a3.977 3.977 0 0 0-3.6-1.716q-1.824 0-3.263 2.23a8.726 8.726 0 0 0-1.439 4.824q0 3.635 2.905 3.635a3.771 3.771 0 0 0 2.651-1.183a6.309 6.309 0 0 0 1.7-3.2Z"></path></svg>
        </template>
    </project-template>
    <project-template :name="x.text" :mix="mixTags" repo="NetCoreTemplates/razor-press" :tags="['ssg','markdown']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Razor Press</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13"></path></svg>
        </template>
    </project-template>
</project-creator>

<div class="not-prose my-8 grid grid-cols-2 gap-4">
 <a class="block group border hover:border-indigo-700" href="https://razor-ssg.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/razor-ssg.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">razor-ssg.web-templates.io</div>
 </a>
 <a class="block group border hover:border-indigo-700" href="https://razor-press.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/razor-press.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">razor-press.web-templates.io</div>
 </a>
</div>

### React and Vue Statically Generated Templates

For those preferring a pure Vite and Node.js stack we've also upgraded our 
[press-vue.servicestack.net](https://press-vue.servicestack.net) and [press-react.servicestack.net](https://press-react.servicestack.net)
website templates to Vite 6, latest Vue and React and TailwindCSS v4:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="ServiceStack/press-vue" :tags="['static','markdown']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Vite Vue</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 3h3.5L12 15l6.5-12H22L12 21L2 3m4.5 0h3L12 7.58L14.5 3h3L12 13.08L6.5 3Z"/></svg>
        </template>
    </project-template>
    <project-template :name="x.text" repo="ServiceStack/press-react" :tags="['static','markdown']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Vite React</div>
        <template #icon>
            <svg class="w-12 h-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10.11c1.03 0 1.87.84 1.87 1.89c0 1-.84 1.85-1.87 1.85c-1.03 0-1.87-.85-1.87-1.85c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7c-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86c.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5l-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47c.54.03 1.11.03 1.71.03c.6 0 1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7c.52.59 1.03 1.23 1.51 1.9c.82.08 1.63.2 2.4.36c.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86c-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63c2.54.75 4.37 1.99 4.37 3.68c0 1.69-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63c-1.46.84-3.45-.12-5.37-1.95c-1.92 1.83-3.91 2.79-5.38 1.95c-1.46-.84-1.62-3.05-1-5.63c-2.54-.75-4.37-1.99-4.37-3.68c0-1.69 1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63c1.47-.84 3.46.12 5.38 1.95c1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26c2.1-.63 3.28-1.53 3.28-2.26c0-.73-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26c-2.1.63-3.28 1.53-3.28 2.26c0 .73 1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16c-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7c.64-.35.83-1.82.32-3.96c-.77.16-1.58.28-2.4.36c-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16c.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 0 1 2.4-.36c.48-.67.99-1.31 1.51-1.9Z"/></svg>
        </template>
    </project-template>
</project-creator>

- **press-vue** - Statically generated Vite 6 Vue 3.5 SPA Template
- **press-react** - Statically generated Vite 6 React 19 SPA Template

<div class="not-prose my-8 grid grid-cols-2 gap-4">
 <a class="block group border hover:border-indigo-700" href="https://press-vue.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/press-vue.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">press-vue.web-templates.io</div>
 </a>
 <a class="block group border hover:border-indigo-700" href="https://press-react.web-templates.io">
     <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/press-react.png">
     <div class="bg-gray-50 text-gray-600 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">press-react.web-templates.io</div>
 </a>
</div>

### Universal Markdown Features

These templates implement the [Vite Press Plugin](/posts/vite-press-plugin) which enables access to a suite of 
universal markdown-powered features that can be reused across Vue, React and .NET Razor and Blazor projects, 
allowing you to incorporate same set of markdown feature folders to power markdown content features across 
a range of websites built with different technologies.