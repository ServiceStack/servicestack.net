---
title: Startup Tasks - Generate code from your running App
summary: StartupTasks run dev-time tasks once your App has fully started, keeping client DTOs and other generated code in sync with your server on every restart, with no extra build step for developers or AI Assistants to remember
tags: [servicestack, dev, ai]
url: https://media.servicestack.com/podcasts/startup-tasks.mp3
media: {size:1282410,duration:88.653787",format:mp3}
---

ServiceStack’s new **Startup Tasks** feature automates development workflows by executing essential processes immediately after an application finishes starting. 

Unlike standard source generators that only function during compilation, these tasks have **full access to the running AppHost**, allowing them to synchronize client DTOs and other derived assets with the server's live configuration. 

This system eliminates the need for manual commands like `npx get-dtos`, as **restarting the application** automatically updates language-specific files for TypeScript, Python, and other targets. 

By maintaining a **single source of truth**, this automation prevents runtime mismatches and ensures that both human developers and AI assistants work with up-to-date contracts. 

The feature is **exclusive to development mode**, ensuring that these heavy synchronization tasks never impact production performance. 

Beyond code generation, users can leverage these tasks for **custom conveniences** such as rebuilding search indexes or seeding local data.