---
title: ASP.NET Core Output Caching
summary: How to use ASP.NET Core Output Caching to cache the response of a ServiceStack Service using ServiceStack.Redis
tags: [caching,.net8,redis]
url: https://media.servicestack.com/podcasts/redis-outputcache.mp3
---

This episode discusses how to use ASP.NET Core Output Caching to improve the performance of 
ServiceStack applications and how to enable Output Caching in the request pipeline, 
configure caching behaviors for ServiceStack Endpoints, and use the [OutputCache] attribute to 
apply caching at the service level. 

It also demonstrates how to implement a distributed cache using Redis, enabling scaling and 
sharing cache data across multiple servers and emphasizes the importance of using Output Caching 
strategically to optimize the performance of frequently accessed data, while acknowledging the 
need for appropriate cache invalidation strategies to ensure data freshness.