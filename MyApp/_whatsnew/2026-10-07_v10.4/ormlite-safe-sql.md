---
title: Safe SQL - Sql.Fmt, OrderBySafe and stronger SQL injection protection
url: https://docs.servicestack.net/ormlite/sql-fmt
image: /img/posts/ormlite-safe-sql/bg.webp
order: 6
---

OrmLite v10.4 makes the safe way to write raw SQL as easy as the unsafe one. **`Sql.Fmt()`** keeps C# interpolated strings but sends every interpolated value as a db param, expands collections into `IN` lists, and embeds table and column references as names quoted by your RDBMS dialect. It works with every raw SQL API, sync or async, and mixes with typed queries in `Where`, `And`, `Or` and `Having`.

**`OrderBySafe()`** lets users choose the sort order, e.g. `?orderBy=-Price`, by resolving field names to quoted columns from a list of allowed fields, so nothing from the request is ever embedded in SQL. Fragment validation also now rejects comments and statement separators anywhere, identifiers are always escaped on every database, and inlined date formats, schema queries and `Contains()` values are escaped or sent as params.
