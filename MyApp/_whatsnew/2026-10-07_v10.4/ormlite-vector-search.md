---
title: Vector Search - find similar rows with OrmLite [Vector] columns
url: https://docs.servicestack.net/ormlite/vectors
image: /img/posts/ormlite-vector-search/bg.webp
order: 3
---

OrmLite v10.4 adds first-class **vector columns** for storing the embeddings of an AI model. Add `[Vector]` to a `float[]` property and order by `Sql.CosineDistance()`, `Sql.L2Distance()` or `Sql.NegativeInnerProduct()` to find the rows most similar to a piece of text, in the same typed query as your filters, joins and [connection filters](/posts/ormlite-multitenancy). It uses the vector support of **PostgreSQL** (pgvector), **SQL Server 2025**, **MariaDB**, **MySQL** and **SQLite** (sqlite-vec), and works with Microsoft.Extensions.AI's `ReadOnlyMemory<float>` embeddings.

Adding `[Index]` creates HNSW or IVFFlat vector indexes with tunable options, `SetVectorSearch()` configures how they're searched, and half-precision vectors halve the size of vectors and their index. New `[FullTextIndex]` support adds `Sql.Matches()` and `Sql.MatchRank()` over each database's native full-text search, which combine with vector search for hybrid search.
