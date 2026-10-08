---
title: Advanced Queries - recursive, window functions, Union and keyset paging
url: /posts/ormlite-advanced-queries
image: /img/posts/ormlite-advanced-queries/bg.webp
order: 5
---

OrmLite v10.4 adds typed APIs for the queries that used to need hand-written SQL. **`WithRecursive()`** walks hierarchies like categories and org charts, **`With()`** names sub queries as common table expressions, and typed **window functions** calculate rankings, running totals and previous rows, with `TopPerGroup()` returning each group's first rows. Typed queries can also be combined with **`Union()`**, **`UnionAll()`**, **`Intersect()`** and **`Except()`**.

**`SeekAfter()`** adds fast and stable keyset pagination that stays quick at any depth, **`SelectLazyAsync()`** streams large results with `await foreach`, and `UpdateOnlyReturning()`, `DeleteReturning()`, `ForUpdate(skipLocked: true)` and `UpdateFrom()` handle row-returning, locking and joined writes in a single statement. All are parameterized, compose with filters and joins, and run on the databases that support them.
