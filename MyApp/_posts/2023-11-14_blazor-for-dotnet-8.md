---
title: New Blazor for .NET 8 Template
summary: The new Blazor for .NET 8 template streamlines web UI development in C#.
tags: [dotnet, blazor, templates]
image: https://images.unsplash.com/photo-1516491575772-bab9f75948c0?crop=entropy&fit=crop&h=1000&w=2000
author: Darren Reid
draft: true
---

With the release of **.NET 8**, ServiceStack's **Blazor project template** has been updated to streamline web UI development in C#.

In this overview, we'll explore how the template enhances **Docker integration**, establishes **ASP.NET Core Identity** for authentication, and uses **Tailwind CSS** for responsive design. We’ll also discuss the project's structured organization, **ServiceStack components** for data handling, and the integration with **ASP.NET Core Identity**, all crafted to elevate developer efficiency in building web applications.

<div class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 pb-4 pt-4">
        <div class="aspect-w-16 aspect-h-9">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/hqyozHSL0Nk"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
        </div>
    </div>
</div>

## Enhanced Containerization and Authentication

.NET 8 simplifies Docker integration. Using `dotnet publish`, developers can now automate the creation of Docker images that adhere to best security practices, such as running as a non-root user in containers.

In terms of security, the template integrates ASP.NET Core Identity, offering a structured approach to authentication, including support for two-factor authentication.

## Structured Project Scaffolding

The command `x new blazor MyProject` creates a new Blazor application with a predefined structure:

- **SQLite Database**: Set up as the default database, it allows developers to start immediately without configuring a separate database server.
- **Entity Framework Core Migrations**: Found in a dedicated directory, easing schema evolution and database versioning.
- **Organized Solution**: Divided into AppHost, Service Interface, Service Model, and Tests projects to promote separation of concerns and maintainability.
- **Docker and GitHub Actions**: The template is ready for Docker deployment, with GitHub actions facilitating continuous deployment workflows.

## Responsive and Interactive UIs with Blazor

Developers can expect a responsive UI out of the box, thanks to Tailwind CSS. The template also takes full advantage of Blazor’s server rendering for interactive components, optimizing WebSocket connections for pages requiring real-time interactivity.

## Streamlining Data Handling with ServiceStack Components

The ServiceStack component library, updated for .NET 8, introduces components like AutoQuery Grid and AutoForm, which interface with AutoQuery services. These provide a data management UI with minimal setup and customization options for diverse requirements.

## ASP.NET Core Identity Integration

Integrating ASP.NET Core Identity doesn't complicate securing ServiceStack services. It's straightforward to implement role-based access control, as shown with attributes like `[ValidateHasRole("Employee")]` directly on request DTOs, making security implementations clear and maintainable.

## Developer Experience and Workflow

The template is designed to reduce the friction in starting a new Blazer project, focusing on developer productivity and maintaining a clear and efficient workflow.

For those who would benefit from the template's offerings, it is available to enhance your development process with Blazor for .NET 8.

*To explore this template, [the source code is available on GitHub](https://github.com/NetCoreTemplates/blazor).*

