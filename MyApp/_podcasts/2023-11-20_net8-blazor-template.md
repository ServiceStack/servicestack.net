---
title: New .NET 8 Blazor Tailwind Template
summary: Kicking the tires on the new Blazor for .NET 8 project template for streamlined Web UI development in C#
tags: [template,.net8,blazor]
url: https://media.servicestack.com/podcasts/net8-blazor-template.mp3
---

This episode covers the new Blazor template for .NET 8 that simplifies C# Web UI development. 
The template integrates ASP.NET Core Identity for authentication, utilizes Tailwind CSS for 
responsive design, and leverages Docker for containerization and deployment. 

It includes features like ServiceStack Blazor Components for data handling, AutoQuery for 
developing APIs and CRUD apps, and Auto Admin Pages for managing database tables. 

The template also offers a choice of Entity Framework or OrmLite for database interaction 
and provides a built-in SQLite database for quick setup.

### Getting Started

Create a new Blazor App with your preferred project name:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/blazor" :tags="['auto','tailwind']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Blazor</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/blazor.svg">
        </template>
    </project-template>
</project-creator>

### Videos

:::youtube hqyozHSL0Nk
Blazor Tailwind Template
:::

### Links

- [Blog Post](/posts/net8-blazor-template)