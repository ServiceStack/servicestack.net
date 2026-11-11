---
title: Astro - content sites that ship no JavaScript by default
url: https://docs.servicestack.net/releases/v10_05#new-astro-template
image: /img/posts/astro-template/bg.webp
order: 3
---

The new **astro-static** template is for content-first Apps like blogs, docs, marketing and product sites that still need auth and .NET APIs. Pages are rendered to plain HTML and CSS with **no JavaScript by default**, and interactive React components are hydrated as **islands** only where you need them, sharing the signed-in user with `withApp()`.

It includes a **Markdown and MDX blog** whose frontmatter is validated against a typed schema at build time, with RSS and a sitemap, plus ASP.NET Core Identity Auth, dark mode and AutoQuery CRUD. Every page is prerendered and served by your .NET App, with no Node.js server to run in production.
