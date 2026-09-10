---
title: Startup Tasks - client DTOs that stay in sync on every restart
url: https://docs.servicestack.net/startup-tasks
image: /img/posts/startup-tasks/bg.webp
order: 4
---

**Startup Tasks** work like C# Source Generators, but run inside your App once it has fully started - with access to its `AppHost`, plugins, metadata and listening URLs - so they can generate code in any language or run any other development task. They only run in development, and failures are logged without stopping the App.

The built-in `dtos` task finds your existing `dtos.ts`, `dtos.mjs`, `dtos.py` and other ServiceStack References and regenerates them from the App's own metadata on every restart - in-process, with no Node.js or HTTP request - removing the manual `npx get-dtos` step. It's even more valuable for AI Assistants, which only need to change the C# DTOs and Services and never have to find a generation command or hand-write client contracts. Add it to existing projects with `npx add-in startup-dtos`.
