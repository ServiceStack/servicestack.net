---
title: ASP.NET Core Identity Auth & Entity Framework
url: https://docs.servicestack.net/releases/v8_00#asp.net-core-identity-auth-in.net-8-templates
image: /img/whatsnew/v8.0/blazor-identityauth-qrcode.webp
order: 3
---

A significant change we've added to our new .NET 8 Project Templates is the adoption of the same ASP.NET Core 
Identity Authentication that's configured in Microsoft's default Projects templates.

ASP.NET Core Identity Auth now used in new Integrated Auth projects Going forward all new ServiceStack .NET Project Templates 
will adopt ASP.NET Identity Auth, which closely follows the same approach as the Microsoft Project Template it integrates 
ServiceStack with, e.g. the new .NET 8 Blazor and Blazor Vue project templates adopts the exact same Auth configuration 
as Microsoft's default Blazor Project Template configured with Individual Identity Auth, likewise with the Bootstrap 
and Tailwind styled MVC and Razor Pages templates.

#### ASP.NET Core Identity Auth Migration Guide

Migrating from ServiceStack Auth to Identity Auth should be relatively straight-forward as ServiceStack uses a compatible 
Identity v2 password hashing format, which should let you migrate your users to Identity Auth without them noticing.

To help with any migrations we've published an [Identity Auth Migration Guide](https://docs.servicestack.net/auth/migrate-to-identity-auth) 
we've used to convert existing ServiceStack Auth Apps to use Identity Auth.