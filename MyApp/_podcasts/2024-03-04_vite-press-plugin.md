---
title: Vite Press Plugin
summary: Introducing the Universal Vite Press Plugin for Vite Vue & React Apps and its unique compatibility with .NET 8 Apps utilizing Markdig
tags: [template,docs,markdown]
url: https://media.servicestack.com/podcasts/vite-press-plugin.mp3
media: {size:727341,duration:181.776000,format:mp3}
---

This episode introduces a new plugin called Vite Press Plugin. 
It is designed to be used with Vite Vue and React applications and provides documentation 
capabilities using Markdown. 

This plugin allows developers to easily create and maintain documentation-centric and 
content heavy web applications by leveraging the power of Markdown for content creation.

### Getting Started

Create new (non .NET) Vue or React Static Rendered App with your preferred project name:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/press-vue" :tags="['static','markdown']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Vite Vue</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/vue.svg">
        </template>
    </project-template>
    <project-template :name="x.text" repo="NetCoreTemplates/press-react" :tags="['static','markdown']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Vite React</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/react.svg">
        </template>
    </project-template>
</project-creator>

Create a new Vue or React .NET App with your preferred project name:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/vue-spa" :tags="['vite','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Vue SPA</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/vue.svg">
        </template>
    </project-template>
    <project-template :name="x.text" repo="NetCoreTemplates/react-spa" :tags="['vite','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">React SPA</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/react.svg">
        </template>
    </project-template>
</project-creator>

### Links

- [Blog Post](/posts/vite-press-plugin)