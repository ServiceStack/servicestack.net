---
title: OrmLite JSON Queries - portable, type-safe JSON across every RDBMS
url: https://docs.servicestack.net/ormlite/json
image: /img/posts/omlite-json-upsert/bg.webp
order: 2
---

OrmLite can now query JSON columns with the same typed `SqlExpression<T>` API used for relational columns. `Sql.Json<T>()` translates ordinary C# member access, `.Contains()` and array indexes into each database's native JSON functions, so the same refactor-safe query runs unchanged on **SQLite, PostgreSQL, SQL Server and MySQL** without hand-writing provider-specific JSON SQL.

Nested scalars, objects and arrays can be filtered, ordered and projected, with typed JSON fragments deserialized back into C# models. For dynamic documents and runtime paths, explicit functions like `Sql.JsonValue<T>()`, `Sql.JsonQuery<T>()`, `Sql.JsonExists()`, `Sql.JsonArrayContains()` and `Sql.JsonContains()` cover validation, introspection and containment - all as normal sync or async OrmLite queries.
