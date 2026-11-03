---
title: JSON Queries - query complex type properties like any other property
url: https://docs.servicestack.net/ormlite/json
image: /img/posts/ormlite-json/bg.webp
order: 4
---

OrmLite v10.4 lets typed queries read straight into **complex type properties** stored as JSON, so you can filter, sort, select, update and delete by nested properties at any depth, check whether a list contains a value, count its items or read an item by its position, just like any other property. **`Any()`**, **`All()`** and **`Count()`** match conditions against the **same item** of a list. It uses the native JSON functions of **SQLite**, **PostgreSQL**, **SQL Server** and **MySQL/MariaDB**, and PostgreSQL arrays are queried the same way.

The post is also a tour of everything else OrmLite does with JSON: **`Sql.Json<T>()`** for JSON in string columns, explicit path queries with `JsonValue()` and `JsonQuery()`, telling a missing property apart from a null, validation, document containment, and how to index a JSON property so queries stay fast.
