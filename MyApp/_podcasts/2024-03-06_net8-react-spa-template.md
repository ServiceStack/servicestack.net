---
title: New React SPA Template
summary: A tour of the features in the new enhanced Vite TypeScript React SPA template for .NET 8
tags: [template,react,.net8,autoquery]
url: https://media.servicestack.com/podcasts/net8-react-spa-template.mp3
media: {size:2731533,duration:682.824000,format:mp3}
draft: true
---

This episode covers the new React Single Page Application (SPA) template for .NET 8 from ServiceStack. 
It highlights the React SPA template features such as its integration with ServiceStack, 
Tailwind CSS, and Vite Press. 

The React SPA template aims to provide developers with a streamlined and efficient way to build 
modern web applications, offering tools for identity authentication, markdown content creation, 
and interactive components.

### Getting Started

Create a new React SPA App with your preferred project name:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/react-spa" :tags="['vite','auth']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">React SPA</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/react.svg">
        </template>
    </project-template>
</project-creator>

Alternatively create a new project with the [x dotnet tool](https://docs.servicestack.net/dotnet-new):

:::sh
x new react-spa ProjectName
:::

### Videos

:::youtube WXLF0piz6G0
Explore the high productivity features in the new ServiceStack React SPA template
:::

### Links

- [Blog Post](/posts/net8-react-spa-template)