---
title: .NET 8's Best Blazor is not Blazor as we know it  
summary: We explore the exciting new potential of Blazor in .NET 8 to develop fast, interactive Web Apps without compromise    
tags: [template,blazor,vue,api]
url: https://media.servicestack.com/podcasts/net8-best-blazor.mp3
media: {size:2251533,duration:562.824000,format:mp3}
draft: true
---

This episode discusses the exciting new possibilities of Blazor in .NET 8. With the introduction of 
static rendering, Blazor apps can now deliver clean, fast HTML without the need for large 
WebAssembly assets or WebSocket connections. 

This paradigm shift enables developers to build high-performing web applications without 
the compromises of traditional Blazor rendering modes. It highlights the benefits of using Vue.js 
for interactive features within statically rendered Blazor apps, offering a solution for building 
fast, SEO-friendly applications. 

It concludes with a comparison of different Blazor implementations, including the new Blazor Vue 
template, demonstrating the significant improvements achieved through the combination of 
static rendering and Vue.js.

### Getting Started

Create a new Blazor Vue App with your preferred project name:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/blazor-vue" :tags="['vue','tailwind']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Blazor Vue</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/blazor.svg">
        </template>
    </project-template>
</project-creator>

### Videos

:::youtube YwZdtLEtROA
Full stack web UI with Blazor in .NET 8
:::

:::youtube ujbTGn4IwFs
Blazor Vue Template
:::

### Links

- [Blog Post](/posts/net8-best-blazor)