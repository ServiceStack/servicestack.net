---
title: API Rate Limiting
summary: ServiceStack v10.3 adds opt-in ASP.NET Core rate limiting for ServiceStack APIs - bind a named policy to a Request DTO or share one budget across every API with the same Tag, enforced across every route an API can be called from
tags: [servicestack, api, security]
author: Demis
image: ./img/posts/rate-limiting/bg.webp
url: https://media.servicestack.com/podcasts/rate-limiting.mp3
media: {size:1264504,duration:82.918458,format:mp3}
---

The release of **ServiceStack v10.3** introduces integrated **API rate limiting** by leveraging the existing capabilities of **ASP.NET Core**. Developers can now protect their services from excessive traffic by applying **usage policies** directly to Request DTOs through attributes or by grouping multiple APIs under a single **shared budget** using tags. 

This system is designed for **efficiency and security**, rejecting unauthorized requests at the application's edge before they consume expensive resources. To ensure reliability, the framework performs **validation checks at startup**, preventing misconfigurations or unmetered routes from reaching production. 

The implementation is highly flexible, supporting **per-user partitioning** and maintaining clean architecture by keeping dependencies out of shared service models. Overall, these tools provide a robust way to manage **client request volumes** across all available communication pathways.