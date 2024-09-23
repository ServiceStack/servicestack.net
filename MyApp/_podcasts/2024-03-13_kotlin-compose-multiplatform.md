---
title: Kotlin Compose Multiplatform with end-to-end typed Kotlin & C# APIs
summary: Talking about the exciting new JetBrains Technology for creating native Mobile, Desktop and Web Apps
tags: [template,kotlin,ios,android]
url: https://media.servicestack.com/podcasts/kotlin-compose-multiplatform.mp3
draft: true
---

This episode covers how to develop cross-platform applications using JetBrains' Compose 
Multiplatform technology. It emphasizes the ability to create native applications for iOS, Android, 
and Desktop platforms, while leveraging Kotlin ServiceStack Reference to generate typed Kotlin DTOs 
for end-to-end typed API integration with .NET backends. 

It then guides the reader through setting up an environment using either Android Studio 
or JetBrains Fleet, and provides instructions for creating new projects, updating DTOs, 
and running both the .NET API and Kotlin Desktop App.

### Getting Started

Create a new Kotlin Multiplatform App with your preferred project name:

<project-creator v-slot="x">
    <project-template :name="x.text" repo="NetCoreTemplates/kmp-desktop" :tags="['kotlin','desktop']">
        <div class="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">Compose Desktop</div>
        <template #icon>
            <img class='w-12 h-12' src="/img/svgs/compose.svg">
        </template>
    </project-template>
</project-creator>

Alternatively create a new project with the [x dotnet tool](https://docs.servicestack.net/dotnet-new):

:::sh
x new kmp-desktop MyApp
:::

### Videos

:::youtube r6T3B7o1GYE
JetBrains Compose Multiplatform iOS & Android Apps
:::

### Links

- [Blog Post](/posts/kotlin-compose-multiplatform)