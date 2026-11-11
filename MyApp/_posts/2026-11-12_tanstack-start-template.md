---
title: TanStack Start + .NET with Type-safe Routes and No Node.js Server
summary: ServiceStack v10.5 adds a tanstack-static template where every link and route param is type checked, every page is prerendered for fast first loads then runs as a SPA, and dynamic routes don't need to be known at build time, all served by your .NET App with no Node.js server to run in production
tags: [servicestack, react, templates]
author: Demis
image: ./img/posts/tanstack-start-template/bg.webp
---

<!-- TODO: add the video
:::youtube VIDEO_ID
TanStack Start + .NET: Type-safe Routes, No Node.js Server
:::
-->

Rename a page in most React Apps and nothing complains. Every link that pointed at the old path still compiles, the
build still passes, and you find out about the broken link when a user clicks it in production.

**ServiceStack v10.5** adds a new React template built on [TanStack Start](https://tanstack.com/start/latest), the
full-stack React framework from the creators of TanStack Query, Table and Router. In this template, a link to a page
that doesn't exist is a compile error:

```tsx
<Link to="/abuot">About</Link>
// error: Type '"/abuot"' is not assignable to type ... (the union of every route in your App)
```

Create a new TanStack Start App with:

:::sh
npx create-net tanstack-static MyProject
:::

<div class="not-prose my-8 grid gap-4 sm:grid-cols-2">
  <a href="https://github.com/NetCoreTemplates/tanstack-static" class="block rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-indigo-400">
    <div class="font-semibold text-gray-900 dark:text-gray-100">tanstack-static</div>
    <div class="text-sm text-gray-600 dark:text-gray-400">Source code on GitHub</div>
  </a>
  <a href="https://tanstack-static.react-templates.net" class="block rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-indigo-400">
    <div class="font-semibold text-gray-900 dark:text-gray-100">tanstack-static.react-templates.net</div>
    <div class="text-sm text-gray-600 dark:text-gray-400">Live Demo</div>
  </a>
</div>

## Routes are files, and files are types

Pages are files in `src/routes/` created with `createFileRoute()`, e.g. `routes/about.tsx` becomes `/about` and
`routes/posts.$id.tsx` becomes `/posts/$id`. [TanStack Router](https://tanstack.com/router/latest) generates a fully
typed route tree from those files each time you run `vp dev` or `vp build`, so:

- a `<Link to>` path that doesn't exist won't compile
- a missing or misspelled path param won't compile
- search params are typed too
- renaming or removing a route turns every stale link into a compile error, instead of a 404 in production

Here's the template's auth-protected `/profile` page:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { appAuth, ValidateAuth } from '@/lib/auth'

export const Route = createFileRoute('/profile')({
    head: () => ({ meta: [{ title: 'Profile' }] }),
    // Prerendered as a loading page, the profile is rendered in the browser once the signed-in user is known
    component: ValidateAuth(Profile),
})

function Profile() {
    const { user, signOut } = appAuth()
    //...
}
```

## Just React

There are no React Server Components, no `"use client"` boundaries and no rules about which components may run where.
Routes are plain React components that you can reason about like any other React code, which also makes them easier
for AI Agents to get right.

There's less magic as well. The `<html>` document, head tags, providers and router are all regular code in your root
route that you own, and each page declares its own title and meta tags with its route's `head()` function, as
`/profile` does above.

## Prerendered from your links

At build time, the `tanstackStart()` Vite plugin starts at your home page and follows every link, prerendering each
page it finds to static HTML. Links to pages served by .NET, like `/api`, `/ui`, `/admin-ui` and `/Identity`, are
skipped:

```ts
tanstackStart({
    // Static export: prerender every route to MyApp.Client/dist/client, which is served from MyApp/wwwroot
    prerender: {
        enabled: true,
        crawlLinks: true,          // prerender every page linked from a prerendered page
        autoSubfolderIndex: false, // /about => about.html, served by MapCleanUrls() in Program.cs
        filter: ({ path }) => !isServerPath(path), // skip links to .NET pages
    },
    // Also write _shell.html, the fallback page for routes not prerendered (e.g. /posts/$id)
    spa: {
        enabled: true,
        maskPath: '/spa-shell',
    },
}),
```

Every page loads instantly as plain HTML, which is good for first loads and search engines, then hydrates into a
single page App with client-side navigation between pages.

## Dynamic routes that don't need to be known in advance

Crawling links means dynamic routes just work. A route like `/posts/$id` is prerendered for every post your pages
link to. Any other id, such as a post published after you last deployed, falls back to a generated `_shell.html` SPA
shell, which renders the page in the browser:

| Request | Served |
|-|-|
| `/posts/1`, `/posts/2`, `/posts/3` (linked from your pages) | prerendered `posts/1.html`, `posts/2.html`, `posts/3.html` |
| `/posts/99` (not linked anywhere at build time) | `_shell.html`, rendered in the browser |

Static exports in Next.js instead need every dynamic value listed at build time with `generateStaticParams()`. Here,
the values you link to are prerendered and the rest still work.

## One .NET App, in development and in production

The template uses the same hybrid development model as our other React templates:

- **Development** - `dotnet watch` starts both your .NET App and the TanStack Start Vite dev server, with ASP.NET Core
  proxying page requests to Vite, which renders each page on request with full HMR support
- **Production** - `npm run build` prerenders every route to HTML, which is published to `MyApp/wwwroot` and served
  with clean URLs, with any route that wasn't prerendered falling back to `_shell.html`

There's no Node.js server to deploy, run, patch or secure in production. Your .NET App is the only thing serving your
App, and it deploys with the template's existing Docker and [Kamal deployments](https://react-templates.net/docs/deployments).
TanStack Start isn't designed around any hosting platform, so nothing ties you to one.

## The rules that come with no server

Without a server in production, a few rules apply. They're short, and they're what keeps the App simple to host:

### Call ServiceStack APIs instead of server functions

Don't use TanStack Start's server functions (`createServerFn`), server routes or middleware. Call your ServiceStack
APIs from the browser with the typed `JsonServiceClient` instead, e.g. a simplified version of the `HelloApi`
component on the home page:

```tsx
import { useState, useEffect } from 'react'
import { TextInput, useClient } from '@servicestack/react'
import { ApiResult } from '@servicestack/client'
import { Hello, HelloResponse } from '@/lib/dtos'

export default ({ value }: { value: string }) => {
    const [name, setName] = useState(value)
    const client = useClient()
    const [api, setApi] = useState<ApiResult<HelloResponse>>(new ApiResult())

    useEffect(() => {
        (async () => {
            setApi(new ApiResult())
            setApi(await client.api(new Hello({ name })))
        })()
    }, [name])

    return (<div>
        <TextInput id="name" label="API Example" value={name} onChange={setName} />
        <div>{api.error?.message ?? api.response?.result ?? 'loading...'}</div>
    </div>)
}
```

The `Hello` and `HelloResponse` DTOs are generated from your .NET App, so the API call is typed end to end, from
your C# Request DTO to the React component that calls it.

### Loaders run at build time

Route `loader`s and `beforeLoad` run when the page is prerendered, when there's no signed-in user and no browser.
Fetch per-user or frequently changing data in your components after hydration, as `HelloApi` does.

### Pages are prerendered signed out

Once a page hydrates, the template loads the App's metadata and the signed-in user. Protected pages are wrapped with
`ValidateAuth()`, which waits until the signed-in user is known before rendering the page, or redirecting to sign in.
That's why `/profile` is prerendered as a loading page and rendered in the browser.

## Written down for your AI Agent

All of these rules are in the template's `AGENTS.md`, so an AI Agent knows which TanStack Start features to use and
which to avoid, and validates its changes with `npm run check`:

```markdown
Because there's no Node.js server in production:
- Don't use TanStack Start server functions (`createServerFn`), server routes or middleware -
  call ServiceStack APIs with `client` from `@/lib/gateway` instead
- Route `loader`s and `beforeLoad` run at build time when prerendering, with no signed-in user or browser APIs.
  Fetch per-user or frequently changing data in components
- Pages are prerendered signed-out. Protect pages with `ValidateAuth()`, which waits for `useAppReady()`
  before redirecting
```

## Everything else you'd expect

It's still a full ServiceStack App, with ASP.NET Core Identity sign in, sign up and account management, an
auth-protected `/profile` page, AutoQuery CRUD APIs you can manage from the built-in
[Admin UI](https://docs.servicestack.net/admin-ui), dark mode, and the [Vite+](/posts/vite-plus-templates) toolchain
for formatting, linting, type checking, testing and building.

## Start one

Type-safe routes, prerendered pages, a single page App after the first load, and nothing but your .NET App to run in
production:

:::sh
npx create-net tanstack-static MyProject
:::

Read more in the [tanstack-static docs](https://react-templates.net/docs/templates/tanstack-static) and the
[v10.5 Release Notes](https://docs.servicestack.net/releases/v10_05#new-tanstack-start-template).
