---
title: Migrating to ASP.NET Core Identity for Authentication 
summary: A walkthrough of migrating our BlazorDiffusion example application over to ASP.NET Core Identity for authentication
tags: [auth,identity-auth]
url: https://media.servicestack.com/podcasts/identity-migration.mp3
---

This document outlines the process of migrating a ServiceStack application, specifically the 
BlazorDiffusion example, to use ASP.NET Core Identity for authentication. 

The migration involves several steps including adding ASP.NET Core Identity NuGet packages, 
creating ASP.NET Core Identity classes for users and roles, creating a database context, 
initializing ASP.NET Core Identity tables with a migration, and updating the application to use 
ASP.NET Core Identity. 

The document also provides a detailed explanation of how to migrate existing users, roles, 
and foreign key relationships. Finally, it highlights the advantages of using ASP.NET Core Identity, 
such as its compatibility with the ASP.NET Core ecosystem and its additional features.