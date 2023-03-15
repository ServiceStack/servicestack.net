---
title: Spanified ServiceStack
url: https://docs.servicestack.net/releases/v5.2#spanified-servicestack
image: /img/logo-text.svg
---

Major rework was performed across the ServiceStack.Text and ServiceStack.Common foundational libraries to replace its internal usage of `StringSegment`
with .NET's new high-performance
[Span and Memory Types](https://www.codemag.com/article/1807051/Introducing-.NET-Core-2.1-Flagship-Types-Span-T-and-Memory-T) primitives
which are now used for all JSON/JSV deserialization and many other String utilities.

The new `Span<T>` and `ReadOnlyMemory<char>` Types is the successor to `StringSegment` which are both allocation-free, but Span also enjoys additional runtime support as a JIT intrinsic for improved performance.

This change was primarily an internal refactor so there shouldn't be any user visible differences except for the addition of the
[System.Memory](https://www.nuget.org/packages/System.Memory) dependency which contains the new Memory types. As a general rule we're averse to adopting
new dependencies but the added performance of these new primitives makes it a required dependency for maintaining high-performance libraries.