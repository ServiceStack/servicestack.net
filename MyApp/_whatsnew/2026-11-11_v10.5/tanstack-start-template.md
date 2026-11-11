---
title: TanStack Start - type-safe routes, prerendered pages and no Node.js server
url: https://docs.servicestack.net/releases/v10_05#new-tanstack-start-template
image: /img/posts/tanstack-start-template/bg.webp
order: 2
---

The new **tanstack-static** template builds React Apps with **TanStack Start** and **TanStack Router**, where every `<Link>` path and route param is type checked, so renaming a route is a compile error instead of a broken link in production. It's just React, with no Server Components or `"use client"` boundaries to learn.

Every page linked from your App is **prerendered** to static HTML for fast first loads and SEO, then runs as a SPA, whilst dynamic routes like `/posts/$id` that weren't linked fall back to a generated SPA shell. Pages are served by your .NET App with no Node.js server in production, and call your ServiceStack APIs with the typed `JsonServiceClient`.
