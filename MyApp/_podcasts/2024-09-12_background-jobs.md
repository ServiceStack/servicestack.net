---
title: Background Jobs
tags: [jobs,admin-ui,commands,api]
summary: Taking a deep dive into Background Jobs, a new library for .NET 8 Apps for simplifying task scheduling and management
url: https://media.servicestack.com/podcasts/background-jobs.mp3
media: {size:1990029,duration:497.448000,format:mp3}
---

This episode covers Background Jobs, a new library for .NET 8 Apps which provides a mechanism 
for managing and scheduling background tasks. 

This feature allows developers to execute existing APIs or custom commands in the background, 
schedule recurring tasks using cron expressions or Time Spans, and track the status and 
progress of jobs. 

Background Jobs uses SQLite for persistence and offers a real-time administration UI for 
monitoring and managing tasks. It covers an overview of the feature's capabilities, including 
how to use it, configure options, and implementing custom commands.

### Getting Started

Create any new [Identity Auth template](/start) which is pre-configured with Background Jobs, e.g:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/blazor-vue" :tags="['auth','vue']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Blazor Vue</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/blazor.svg">
        </template>
    </project-template>
</project-creator>

Alternatively create a new project with the [x dotnet tool](https://docs.servicestack.net/dotnet-new):

:::sh
x new blazor-vue ProjectName
:::

### Videos

:::youtube 2Cza_a_rrjA
Durable Background Jobs and Scheduled Tasks for .NET
:::

:::youtube DtB8KaXXMCM
Schedule your Reoccurring Tasks with Background Jobs!
:::

### Links

- [Blog Post](/posts/background-jobs)
