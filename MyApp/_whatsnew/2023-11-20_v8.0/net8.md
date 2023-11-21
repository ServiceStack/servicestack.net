---
title: Enhanced for .NET 8
url: https://docs.servicestack.net/releases/v8_00
image: /img/whatsnew/v8.0/net8.webp
order: 1
---

We're excited to welcome the next major release of ServiceStack v8, designed to take advantage of many advancements
for in .NET's latest long-term release: **.NET 8**

#### All NuGet Packages include net8.0 builds

All of ServiceStack's active NuGet packages now include `.net8.0` target framework builds along with their
dependencies on Microsoft's packages upgraded to use the latest `8.0.0` that were released with .NET 8.

#### All .NET Project Templates upgraded to .NET 8

All Project Templates have been upgraded to use **ServiceStack v8** and **.NET 8**, inc. built-in CI/CD GitHub Actions 
upgraded to use [secure rootless Linux Docker containers](https://devblogs.microsoft.com/dotnet/securing-containers-with-rootless/)
built into .NET 8 which allow you to effortlessly deploy your containerized .NET 8 Apps with Docker and
GitHub Registry via SSH to any Linux Server.
