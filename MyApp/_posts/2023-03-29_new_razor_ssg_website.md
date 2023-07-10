---
title: New Razor SSG generated servicestack.net
summary: Celebrating 150M Downloads with a new Razor SSG generated Website
tags: razor,ssg,website
image: https://images.unsplash.com/photo-1475669698648-2f144fcaaeb1?crop=entropy&fit=crop&h=1000&w=2000
draft: true
author: Demis Bellot
---

## Celebrating 150M Total Downloads

We're happy to report that ServiceStack has eclipsed **150M total downloads!**

<div class="my-16 flex mx-auto justify-center">
   <a href="https://www.nuget.org/profiles/servicestack"><img class="w-96" src="/img/posts/razor-ssg/150M-downloads.png"></a>
</div>

Which comes just after a year from **100M downloads** in [v6 Release](https://docs.servicestack.net/releases/v6_0) when we announced 
[ServiceStack is now FREE for Individuals & OSS!](https://servicestack.net/free)

We're celebrating this new milestone with a **brand new website**, rewritten from Ruby's Jekyll with an exciting new 
[Razor SSG](https://razor-ssg.web-templates.io) project template which takes advantage of the advances we've made in the last few releases 
with our npm dependency-free approach to [Simple, Modern JavaScript](https://vue-mjs.web-templates.io/posts/javascript), 
the built-in support for
[Prerendering Razor Pages](https://vue-mjs.web-templates.io/posts/prerendering) and the rich Tailwind 
[Vue Component Library](https://docs.servicestack.net/vue/)
to create an enjoyable experience for creating Fast, FREE, beautiful, CDN-hostable static generated websites & blogs!

<div class="not-prose my-16 px-4 sm:px-6">
<div class="text-center"><h3 id="new-website" class="text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold text-gray-900">
    <a class="text-indigo-600 hover:text-indigo-600" href="https://servicestack.net">servicestack.net</a>
</h3></div>
<p class="mx-auto mt-5 max-w-prose text-xl text-gray-500">
    Checkout the new Vue, Tailwind & Razor SSG powered <a class="text-indigo-600 hover:text-indigo-600" href="https://servicestack.net">servicestack.net</a> website!
</p>
<div class="my-8">
<a href="https://servicestack.net" class="not-prose max-w-4xl"><div class="block flex justify-center shadow hover:shadow-lg rounded"><img class="" src="/img/whatsnew/v6.8/servicestack.net-home-1440.png"></div></a>
</div></div>

### Migrating away from Jekyll

We have a lot to thank Jekyll for as the pioneer of statically generated websites and igniting the [Jamstack](https://jamstack.org) movement
showing the benefits of markdown powered, statically-generated websites. However managing Ruby from Windows/WSL has always been a source of friction
which was awkward to manage from a different filesystem which ultimately prompted seeking an alternative solution after Jekyll upgrades broke RubyMine
support forcing the use of text editors to maintain our website code-base and content.

### Search for a better SSG Solution

Our experience with maintaining extensive [documentation in VitePress](https://servicestack.net/posts/jekyll-to-vitepress) and static website
content in Jekyll has effectively taught us that any heavy content website that can be maintained in Markdown and statically generated, should be.
Not only is it the fastest way to deliver static content from CDN edge caches, inexpensive & portable to host,
but it's vastly more reliable than an App Server that's dependent on uptime of VMs, infrastructure dependencies, load balancer and firewall misconfigurations,
account or billing issues, etc.

### SSG C# Razor Pages with Vue & Tailwind

Deterred by the growing complexity of current SSG solutions, we decided to create a new solution using C# & Razor Pages
with a clean implementation that allowed full control with an **npm dependency-free** solution letting us adopt our preferred approach to
[Simple, Modern JavaScript](https://vue-mjs.web-templates.io/posts/javascript) without any build-tooling or SPA complexity.

We're happy with the results of [https://servicestack.net](https://servicestack.net) new Razor SSG website -
a clean, crisp code-base utilizing simple JS Module Vue 3 components, the source code of which is publicly maintained at:

<div class="my-8 flex justify-center">
    <a class="text-3xl text-indigo-600 hover:text-indigo-800" href="https://github.com/servicestack/servicestack.net">https://github.com/servicestack/servicestack.net</a>
</div>

Which serves as a good example at how well Razor SSG scales for larger websites.

### Benefits from Jekyll

Whilst still only at **v1** release, we found it already had a number of advantages over the existing Jekyll static website:

- Faster live reloads
- C#/Razor more type-save & productive than Ruby/Liquid
- Greater flexibility in implementing new features
- Better IDE support (from Rider)
- Ability to reuse our .NET libraries
- Better development experience from Windows