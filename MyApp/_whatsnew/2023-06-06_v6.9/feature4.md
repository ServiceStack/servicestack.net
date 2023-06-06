---
title: Vue Stable Diffusion
url: https://docs.servicestack.net/releases/v6_9#vue-stable-diffusion
image: /img/whatsnew/v6.9/vuediffusion.png
---

Following [blazordiffusion.com](https://blazordiffusion.com) which was created to showcase ServiceStack's
Blazor Server and Blazor WASM [project templates and components](https://servicestack.net/blazor), 
we've rewritten a new Stable Diffusion App in Vue adopting a
[Simple Modern JavaScript](https://razor-ssg.web-templates.io/posts/javascript) approach to showcase the **Razor SSG**
Project Template and Tailwind [Vue Component Library](https://docs.servicestack.net/vue/) available at:

<h3 class="not-prose text-4xl text-center pb-8">
    <a class="text-blue-600 hover:underline" href="https://diffusion.works">https://diffusion.works</a>
</h3>

Vue Diffusion is built differently from other Razor SSG Apps as instead of being pre-rendered from static content 
like Markdown documents, it's prerendered from https://blazordiffusion.com APIs to render its dynamic 
[Albums](https://diffusion.works/albums/), 
[Top](https://diffusion.works/top) and [Latest](https://diffusion.works/latest) pages at deployment which it does by 
configuring the App's Service Gateway to reference external Blazor Diffusion APIs.