---
title: New Razor SSG generated docs.servicestack.net
summary: The new docs.servicestack.net website is now generated with Razor SSG - now with Dark Mode!
tags: [razor, ssg, documentation]
image: https://images.unsplash.com/photo-1526243741027-444d633d7365?crop=entropy&fit=crop&h=1000&w=2000
author: Demis Bellot
---

Following in the footsteps of [porting servicestack.net](/posts/new_razor_ssg_website) website 
[from Jekyll](https://github.com/mythz/site) to 
[Razor SSG](https://github.com/ServiceStack/servicestack.net), we've decided to 
also take control over our last active VitePress website and port our [docs.servicestack.net](https://docs.servicestack.net) to 
[Razor SSG](https://razor-ssg.web-templates.io/), giving us complete control over its implementation allowing us to 
resolve any issues and add any features ourselves as needed, at the same time freeing us from the complexity and brittleness 
of the npm ecosystem with a more robust C# and Razor Pages SSG based implementation.

## VitePress Issues

Our 500 page [docs.servicestack.net](https://docs.servicestack.net) started experiencing growing pains under [VitePress](https://vitepress.dev)
which started experiencing rendering issues that we believe stems from VitePress's SSR/SPA hydration model that for
maximum performance would convert the initial downloaded SSR content into an SPA to speed up navigation between pages.

However several pages began to randomly show duplicate content and sometimes not display the bottom section of pages at all. 
For a while we worked around these issues by running custom JavaScript to detect and remove duplicate content from the DOM 
after the page loaded as well as moving bottom fragments of pages into separate includes and external Vue components 
for the pages with missing content. 

However as the time to detect and workaround these issues across all our documentation started becoming too time consuming,
it was time to consider a more permanent and effective solution. 

## Porting to Razor SSG

Given we've already spent time & effort porting docs.servicestack.net 
[from Jekyll to VitePress](/posts/jekyll-to-vitepress) less than 2 years ago and after the success 
we had of rapidly [porting servicestack.net](/posts/new_razor_ssg_website) to Razor SSG and rapidly creating 
[Vue Stable Diffusion](https://servicestack.net/posts/vue-stable-diffusion) with Razor SSG in a fraction of the time it 
took to develop the equivalent [Blazor Diffusion](https://docs.servicestack.net/blazor-diffusion), it was clear we
should also do the same for the new documentation website. 

Porting **docs.servicestack.net** ended up being fairly straightforward process that was completed in just a few days, 
with most of the time spent on implementing existing VitePress features we used in C# and Markdig Extensions,
a new Responsive Tailwind Layout and adding support for Dark Mode which was previously never supported.  

Fortunately none of VitePress's SSR/SPA hydration issues manifested in the Razor SSG port which adopted the 
cleaner traditional architecture of generating clean HTML from Markdown and Razor Pages and enhanced on the client-side with Vue.

We're extremely happy with the result, a much lighter and cleaner HTML generated site that now finally supports Dark Mode!

<div class="not-prose mt-8 grid grid-cols-2 gap-4">
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://docs.servicestack.net?light">
        <img class="p-2" src="/img/posts/razor-ssg/docs.servicestack.net.png">
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">docs.servicestack.net</div>
    </a>
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://docs.servicestack.net?dark">
        <img class="p-2" src="/img/posts/razor-ssg/docs.servicestack.net-dark.png">
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">docs.servicestack.net</div>
    </a>
</div>

<div class="my-8 flex justify-center">
    <a class="text-3xl text-indigo-600 hover:text-indigo-800" href="https://github.com/ServiceStack/docs.servicestack.net">https://github.com/ServiceStack/docs.servicestack.net</a>
</div>

## Razor Pages Benefits

The new Razor SSG implementation now benefits from Razor Pages flexible layouts and partials where pages can be optionally
implemented in just markdown, Razor or a hybrid mix of both. The [Vue](https://docs.servicestack.net/vue/?light) splash page is an example of this implemented in a custom
[/Vue/Index.cshtml](https://github.com/ServiceStack/docs.servicestack.net/blob/main/MyApp/Pages/Vue/Index.cshtml) Razor Page:

<div class="not-prose mt-8 grid grid-cols-2 gap-4">
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://docs.servicestack.net/vue/?light">
        <img class="p-2" src="/img/posts/razor-ssg/razor-pages-vue.png">
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">docs.servicestack.net</div>
    </a>
</div>

Other benefits include a new Documentation Map feature with live scroll updating, displayed on the right side of each documentation page.

## Razor Press Docs Website Template

We've extracted the new Documentation features into a new Razor SSG based project template optimized for creating
documentation and content-centric websites which we'll release within the next few days after we've finished documenting it.

<div class="not-prose mt-8 grid grid-cols-2 gap-4">
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://razor-press.web-templates.io">
        <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/razor-press.png">
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">razor-press.web-templates.io</div>
    </a>
</div>

In a nutshell the new [Razor Press template](https://razor-press.web-templates.io) is a Simple, Powerful, Fast, Flexible & FREE! Use Razor Pages to generate
beautiful Tailwind static websites powered by Markdown & enhanced with Vue Auto deploys to GitHub Pages to Host
for FREE on GitHub CDN

<div class="flex justify-center">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="uqEa_DfFFDQ" style="background-image: url('https://img.youtube.com/vi/uqEa_DfFFDQ/maxresdefault.jpg')"></lite-youtube>
</div>

Just like [our release of Razor SSG](/posts/razor-ssg) it will be a free project template you can use to create beautiful 
static Tailwind websites with Razor Pages with built-in GitHub Action workflows that deploys to GitHub Pages CDN 
where it can be hosted for FREE under your own custom domain name.

## Example

Currently the largest website generated with Razor Press is the ServiceStack's documentation at [docs.servicestack.net](https://docs.servicestack.net):

<div class="not-prose mt-8 grid grid-cols-2 gap-4">
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://docs.servicestack.net/?light">
        <img class="p-2" src="https://servicestack.net/img/posts/razor-ssg/docs.servicestack.net.png">
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">docs.servicestack.net</div>
    </a>
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://docs.servicestack.net/?dark">
        <img class="p-2" src="https://servicestack.net/img/posts/razor-ssg/docs.servicestack.net-dark.png">
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">docs.servicestack.net</div>
    </a>
</div>

A **500+** pages documentation website ported from VitePress, which prompted the creation of Razor Press after
experiencing issues with VitePress's SSR/SPA model whose workaround became too time consuming to maintain.

The new Razor SSG implementation now benefits from Razor Pages flexible layouts and partials where pages can be optionally
implemented in just markdown, Razor or a hybrid mix of both. The [Vue](https://docs.servicestack.net/vue/) splash page is an example of this implemented in a custom
[/Vue/Index.cshtml](https://github.com/NetCoreTemplates/razor-press/blob/main/MyApp/Pages/Vue/Index.cshtml) Razor Page.

<div class="not-prose mt-8 grid grid-cols-2 gap-4">
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://docs.servicestack.net/vue/">
        <img class="p-2" src="https://docs.servicestack.net/img/pages/ssg/razor-pages-vue.png">
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">docs.servicestack.net</div>
    </a>
</div>
