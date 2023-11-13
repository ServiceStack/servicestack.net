---
title: New Blazor for .NET 8 Template
summary: The new Blazor for .NET 8 template streamlines web UI development in C#.
tags: [dotnet, blazor, templates]
image: https://images.unsplash.com/photo-1516491575772-bab9f75948c0?crop=entropy&fit=crop&h=1000&w=2000
author: Darren Reid
draft: true
---

With the release of **.NET 8**, we're happy to announce ServiceStack's new [Blazor](https://blazor.web-templates.io/)
project template that takes advantage of .NET 8 Blazor's new features that redefines modern Web Development in C#.

In this video overview we'll explore how the template, adopts Blazor's familiar **ASP.NET Core Identity** 
for its authentication, utilizes the modern [Tailwind CSS](https://tailwindcss.com) framework for beautiful responsive design
and adopts .NET's best-practice
[Docker Containerization](https://learn.microsoft.com/en-us/dotnet/core/docker/publish-as-container) support for its built-in
[GitHub Action Deployments](https://blazor.web-templates.io/deploy) which enables a simple ready-made CI solution for deployment to any
Linux Host via SSH and Docker compose.

We’ll also discuss the project's structure, usage of **ASP.NET Core Identity** for Authorization and utilizing
**ServiceStack Blazor Components** for data handling, all integrated to maximize developer efficiency in building Web Applications.

<div class="flex justify-center">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="hqyozHSL0Nk" style="background-image: url('https://img.youtube.com/vi/hqyozHSL0Nk/maxresdefault.jpg')"></lite-youtube>
</div>

:::{.text-center}
## Create a new ServiceStack Blazor App
:::

<div class="not-prose flex justify-center">
  <project-template template="blazor"></project-template>
</div>

## ASP.NET Core Identity Integration

In terms of security, the template integrates ASP.NET Core Identity, offering a structured approach to authentication,
including support for email confirmation, two-factor authentication and GDPR compliance features.

Integrating ASP.NET Core Identity doesn't complicate securing ServiceStack services which can still be secured with
[Declarative Validation Attributes](https://docs.servicestack.net/auth/authentication-and-authorization#declarative-validation-attributes)
for role-based access control, e.g. using `[ValidateHasRole("Employee")]` directly on Request DTOs, bringing your 
existing knowledge and experience with ServiceStack Authentication to securing your UI and APIs with Identity Auth.

The template includes a pre-baked solution for sending general and Identity Auth Emails with your configured SMTP Server
in managed background workers with [Background MQ](https://docs.servicestack.net/background-mq) and an enhanced version of the default 
ASP.NET Core Blazor Identity UI, with all pages upgraded to use a beautiful Tailwind CSS theme as well as integration with 
[qrcode.js](https://davidshimjs.github.io/qrcodejs/) 
for providing a visual QR Code barcode which mobile phone users can easily scan to setup 2FA Authentication:

![](/img/posts/net8-blazor/blazor-identityauth-qrcode.png)

## Responsive and Interactive UIs with Tailwind CSS

With responsive UI out-of-the-box, thanks to Tailwind CSS, Developers can style their Blazor Apps with the modern 
popular utility-first CSS framework for creating beautiful, maintainable **Responsive UIs** with **DarkMode** support

It also takes full advantage of Blazor’s static rendering for its Website layout for optimal performance and SEO,
so only Pages and Components that require interactivity need to opt-in for Blazor Server Interactive rendering modes.

## ServiceStack.Blazor Tailwind Components

The [ServiceStack.Blazor Components](https://blazor-gallery.jamstacks.net), updated for .NET 8 enables you to rapidly
develop beautiful Blazor Apps integrated with Rich high-productivity UI Tailwind Components like
[AutoQueryGrid](https://blazor-gallery.servicestack.net/gallery/autoquerygrid) and
[AutoForms](https://blazor-gallery.servicestack.net/gallery/autoform) which interface with
[AutoQuery services](https://docs.servicestack.net/autoquery/) to provide a full CRUD data management UI with minimal effort.

## Enhanced Containerization

.NET 8 simplifies Docker integration. Using `dotnet publish`, developers can now automate the creation of Docker images 
that adhere to best security practices, such as running as a non-root user in containers that can utilize the built-in 
GitHub Actions to effortlessly deploy their containerized Blazor Apps with Docker and GitHub Registry via SSH to any Linux Server.

## Other Template Features

Other features that enhances the default ASP.NET Blazor App templates with several modern, high-productivity features, include:

- [Entity Framework](https://learn.microsoft.com/ef/) & [OrmLite](https://docs.servicestack.net/ormlite/) - Choose the best ORM for each App feature, with a unified solution that sees [OrmLite's DB Migrations](https://docs.servicestack.net/ormlite/db-migrations) run both EF and OrmLite migrations, inc. Seed Data with a single command at Development or Deployment
- [SQLite Database](https://www.sqlite.org) - Set up as the default database, it allows developers to start immediately without configuring a separate database server
- [AutoQuery](https://docs.servicestack.net/autoquery/) - Rapidly developing data-driven APIs, UIs and CRUD Apps
- [Auto Admin Pages](https://www.youtube.com/watch?v=tt0ytzVVjEY) - Quickly develop your back-office CRUD Admin UIs to manage your App's Database tables at [/admin](https://blazor.web-templates.io/admin)
- [Markdown](https://docs.servicestack.net/razor-press/syntax) - Maintain SEO-friendly documentation and content-rich pages like this one with just Markdown, beautifully styled with [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- [Built-in UIs](https://servicestack.net/auto-ui) - Use ServiceStack's Auto UIs to [Explore your APIs](https://docs.servicestack.net/api-explorer) at [/ui](https://blazor.web-templates.io/ui/)
  or Query your [App's Database Tables](https://docs.servicestack.net/admin-ui-database) at [/admin-ui/database](https://blazor.web-templates.io/admin-ui/database)
- [Universal API Components](https://youtu.be/66DgLHExC9E) - Effortlessly create reusable, maximally performant universal Blazor API Components that works in Blazor Server and Web Assembly Interactivity modes
- [Organized Project Structure](https://docs.servicestack.net/physical-project-structure) - Divided into AppHost, Service Interface, Service Model, and Tests projects to promote separation of concerns and maintainability.