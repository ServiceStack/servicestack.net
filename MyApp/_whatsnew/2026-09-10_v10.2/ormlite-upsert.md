---
title: OrmLite Upsert - native insert-or-update in a single statement
url: https://docs.servicestack.net/ormlite/upsert
image: /img/posts/omlite-json-upsert/bg.webp
order: 3
---

OrmLite's new `Upsert` APIs insert a row when its Primary Key is new, otherwise update the existing row - using each database's native single-statement conflict handling on **SQLite, PostgreSQL, SQL Server and MySQL/MariaDB**. Unlike `Save()` there's no extra existence query and no race window between checking for a row and writing it, making it a natural fit for imports, synchronization, event consumers and retryable jobs.

A typed `updateOnly` expression limits which fields change for existing rows while still inserting every field for new ones, so fields owned by other parts of your App are preserved. `UpsertAll` handles batches in a transaction, auto-increment models are supported, and every API has an async equivalent with `CancellationToken` support.
