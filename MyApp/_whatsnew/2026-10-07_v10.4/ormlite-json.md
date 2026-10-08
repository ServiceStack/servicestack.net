---
title: JSON Queries - query complex type properties like any other property
url: https://docs.servicestack.net/ormlite/json
image: /img/posts/ormlite-json/bg.webp
order: 4
---

OrmLite v10.4 lets typed queries read straight into **complex type properties**, which are stored as JSON, without wrapping them in `Sql.Json()`. Filter, sort, select, update and delete by `x.Address.City`, `x.Tags.Contains("vip")`, `x.Lines.Count > 1` or `x.Lines[0].Quantity`, and use `Any()`, `All()` and `Count()` to match conditions on the **same item** of a list. It uses the native JSON functions of **SQLite**, **PostgreSQL**, **SQL Server** and **MySQL/MariaDB**, and PostgreSQL's `text[]` and `int[]` arrays are queried the same way.

The post is also a tour of everything else OrmLite does with JSON: `Sql.Json<T>()` for JSON in `string` columns, explicit path queries with `JsonValue()` and `JsonQuery()`, path existence and JSON type checks that tell a missing property from a `null`, validation, document containment, and how to index a JSON property so queries stay fast.
