---
title: ASP.NET Core Identity Auth in .NET 8  
summary: Talking about ServiceStack's switch to ASP.NET Core Identity Auth in new .NET 8 Blazor, Razor and MVC Project Templates  
tags: [c#,identity-auth,blazor]
url: https://media.servicestack.com/podcasts/net8-identity-auth.mp3
---

This episode talks about ServiceStack's transition to using ASP.NET Core Identity Authentication 
as its default authentication model in new projects. This switch provides several advantages, 
including improved integration with Microsoft's project templates, access to new .NET 8 
authentication features, and the ability to easily migrate existing ServiceStack applications 
to Identity Auth. 

It then provides instructions on how to migrate from ServiceStack Auth to Identity Auth, 
including steps for migrating users, roles, and data models and also discusses how to 
configure Identity Auth in ServiceStack applications, and how to use the provided email 
sender implementation to send emails.

### Getting Started:

Create a new Project with [ASP.NET Identity Auth](https://docs.servicestack.net/auth/identity-auth) with your preferred project name:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/blazor" :tags="['tailwind']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Blazor</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/blazor.svg">
        </template>
    </project-template>
    <project-template :name="x.text" repo="NetCoreTemplates/blazor-vue" :tags="['tailwind']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Blazor Vue</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/blazor.svg">
        </template>
    </project-template>
    <project-template :name="x.text" repo="NetCoreTemplates/mvc" :tags="['tailwind']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">MVC</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/windows.svg">
        </template>
    </project-template>
    <project-template :name="x.text" repo="NetCoreTemplates/razor" :tags="['tailwind']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Razor Pages</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/razor.svg">
        </template>
    </project-template>
    <project-template :name="x.text" repo="NetCoreTemplates/mvc-bootstrap" :tags="['bootstrap']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">MVC</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/windows.svg">
        </template>
    </project-template>
    <project-template :name="x.text" repo="NetCoreTemplates/razor-bootstrap" :tags="['bootstrap']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Razor Pages</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/razor.svg">
        </template>
    </project-template>
</project-creator>

### Links

- [Blog Post](/posts/net8-identity-auth)