---
title: Built-In Identity Auth Admin UI
summary: Explore the new Identity Auth Admin UI for creating and managing Identity Auth users in .NET 8  
tags: [servicestack,.net 8,auth]
image: https://images.unsplash.com/photo-1563920443079-783e5c786b83?crop=entropy&fit=crop&h=1000&w=2000
author: Demis Bellot
draft: true
---

With ServiceStack now [deeply integrated into ASP.NET Core Apps](/posts/servicestack-endpoint-routing) we're back to
refocusing on adding value-added features that can benefit all .NET Core Apps.



we've added a new built-in Identity Auth Admin UI that's available in .NET 8 projects. 

The new UI is a modern SPA built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/) 
that's served from the `/auth` route which is only accessible to Admin Users.

