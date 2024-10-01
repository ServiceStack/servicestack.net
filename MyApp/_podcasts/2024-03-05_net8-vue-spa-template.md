---
title: New Vue SPA Template
summary: Getting to know the advanced features and capabilities of the enhanced Vite TypeScript Vue SPA template for .NET 8
tags: [template,vue,.net8,autoquery]
url: https://media.servicestack.com/podcasts/net8-vue-spa-template.mp3
media: {size:1414413,duration:353.544000,format:mp3}
---

This episode focuses on the new Vue Single Page Application (SPA) template designed for .NET 8. 
It details how this template builds upon the ASP.NET Core Vue SPA template by incorporating 
ServiceStack's high-productivity features. Specifically, API integration, end-to-end typing, 
Vue components, built-in authentication, Tailwind CSS, dark mode, and a Vite Press plugin. 

The Vue SPA template aims to provide developers with a more efficient and enjoyable experience 
when building web applications with .NET 8 and Vue.

### Getting Started

Create a new Vue SPA App with your preferred project name:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/vue-spa" :tags="['vite','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Vue SPA</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/vue.svg">
        </template>
    </project-template>
</project-creator>

Alternatively create a new project with the [x dotnet tool](https://docs.servicestack.net/dotnet-new):

:::sh
x new vue-spa ProjectName
:::

### Videos

:::youtube JlUjWlVslRg
Explore the high productivity features in the new ServiceStack Vue SPA template
:::

### Links

- [Blog Post](/posts/net8-vue-spa-template)