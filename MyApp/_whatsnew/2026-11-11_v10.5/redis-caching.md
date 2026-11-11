---
title: Redis Caching - IDistributedCache, HybridCache and atomic TTLs
url: https://docs.servicestack.net/redis/distributed-cache
image: /img/posts/redis-caching/bg.webp
order: 4
---

On .NET 10, **ServiceStack.Redis** can back Microsoft's **IDistributedCache** with one `AddServiceStackRedisCache()` call, reusing your existing client manager, and acts as the shared **L2 cache behind HybridCache**. Absolute and sliding expirations run as atomic Lua scripts, so a refresh can never push an entry past its deadline, and `ICacheClient` expirations now set the value and its TTL in a **single atomic `SET PXAT`**.

New **`GETEX`**, **`GETDEL`** and **`UNLINK`** APIs read and expire, read and delete, or free large keys in the background, `UnlinkByPattern` clears key patterns with `SCAN` instead of blocking Redis with `KEYS`, and **hash field expiration** lets each field in a hash expire on its own schedule on Redis 7.4+.
