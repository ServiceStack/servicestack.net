---
title: Redis Streams - work queues that survive worker crashes
url: https://docs.servicestack.net/redis/streams
image: /img/posts/redis-streams-work-queue/bg.webp
order: 5
---

ServiceStack.Redis v10.5 adds **Redis Streams** with typed JSON entries, **consumer groups** that share work between workers, explicit `XAck` acknowledgments and **`XAutoClaim`** to reclaim a crashed worker's pending messages, plus pipelined bulk appends of thousands of entries.

Pools can now be capped with an opt-in **`MaxLiveConnections`**, where callers wait in line or fail fast instead of opening more connections than your Redis plan allows, and pool waits can be **cancelled** with a `CancellationToken`. Async connections are now **fully async** from DNS to TLS and AUTH under one `ConnectTimeout`, and connection strings accept IPv6 addresses and `rediss://` URIs.
