---
title: Swashbuckle OpenAPI v3 and Swagger UI
url: https://docs.servicestack.net/releases/v8_00
image: /img/whatsnew/v8.1/openapiv3-logo.png
order: 3
---

Utilizing the same **ASP.NET Core Endpoints** that the rest of the ASP.NET Core App uses enables your ServiceStack APIs 
to integrate with your wider ASP.NET Core application, opening up more opportunities for reuse of your ServiceStack APIs.

This opens up the ability to use common third party tooling like the popular `Swashbuckle` package used to to
enable OpenAPI v3 specification generation of ASP .NET Core APIs which now includes ServiceStack APIs, 
displayed along-side Minimal and Web APIs. 

We've created the **ServiceStack.AspNetCore.OpenApi** package to make this integration as easy as possible, which 
incorporates additional information from your ServiceStack APIs into Swagger metadata.