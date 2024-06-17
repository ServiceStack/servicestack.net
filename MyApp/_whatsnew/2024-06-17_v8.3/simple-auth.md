---
title: Simple Auth Story for .NET 8 Microservices
url: https://docs.servicestack.net/auth/admin-apikeys
image: https://img.youtube.com/vi/EuwatAglol0/maxresdefault.jpg
order: 3
---

With ServiceStack now [fully integrated](/auth/identity-auth) with ASP.NET Identity Auth,
our latest .NET 8 [Tailwind Templates](/start) offer a full-featured Auth Configuration complete with User Registration,
Login, Password Recovery, Two Factory Auth, and more.

Whilst great for Web Applications that need it, it neglects the class of Apps which don't need User Auth and
the additional complexity it brings inc. Identity and Password Management, EF Migrations, Token Expirations, OAuth Integrations, etc.

For these stand-alone Apps, Microservices and Docker Appliances that would still like to restrict Access to their APIs
but don't need the complexity of ASP .NET Core's Authentication machinery, a simpler Auth Story would be preferred.

With the introduction of API Keys in this release we're able to provide a simpler Auth Story for .NET 8 Microservices
that's easy for **Admin** Users to manage and control which trusted clients and B2B Integrations can access their functionality.
