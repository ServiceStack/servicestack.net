---
title: API Rate Limiting - ASP.NET Core rate limits for ServiceStack APIs
url: https://docs.servicestack.net/rate-limiting
image: /img/posts/rate-limiting/bg.webp
order: 4
---

ServiceStack v10.3 adds opt-in integration with ASP.NET Core's built-in rate limiter. You can bind a named policy to a Request DTO with `[RateLimiting]` or Microsoft's `[EnableRateLimiting]`, or share **one budget across a whole workflow** by binding a policy to a `[Tag]`. Over-limit requests are rejected with **HTTP 429** before their Request DTO is deserialized or your service runs, and fixed window, sliding window, token bucket, concurrency and per-user partitioned policies all work the same way.

Limits are enforced on **every route** an API can be called from, including explicit routes, `/api` URLs, format URLs and autobatch requests, so there's no unmetered back door. Conflicting bindings or configurations that could leave a route unmetered **fail on startup** instead of in production. The `[RateLimiting]` attribute lives in **ServiceStack.Interfaces**, so your shared DTOs stay free of ASP.NET Core dependencies.
