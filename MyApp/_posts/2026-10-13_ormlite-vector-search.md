---
title: Vector search in OrmLite
summary: ServiceStack v10.4 adds first-class [Vector] columns to OrmLite, so the embeddings of an AI model are stored with your data and the rows most similar to a question are found in the same typed query as your filters, joins and tenant rules, on PostgreSQL, SQL Server, MariaDB, MySQL and SQLite
tags: [servicestack, ormlite, ai]
author: Demis
image: ./img/posts/ormlite-vector-search/bg.webp
---

Retrieval-augmented generation, semantic search and "more like this" all come down to one operation: given a piece of text, find the stored rows whose **meaning** is closest to it. AI models do this by turning text into an **embedding**, a vector of numbers where similar text lands close together, then comparing vectors by distance.

The usual way to add it to an App is a separate vector store, which comes with a second system to host, a second set of credentials, and a synchronization job that keeps it matching your database. It also can't answer the questions
your App actually asks:

> Of the documents this customer can see, which best answer this question?

needs the vector search, the permissions and the customer's rows in one place, and with a separate store that's an over-fetch followed by filtering in your App code.

Most databases can now store and compare vectors themselves. **ServiceStack v10.4** makes that a first-class OrmLite feature: add `[Vector]` to a `float[]` property and order by its distance to what you're searching for:

```csharp
public class Passage
{
    [AutoIncrement]
    public int Id { get; set; }
    public int BookId { get; set; }
    public string Text { get; set; }

    [Vector(1536)]
    public float[] Embedding { get; set; }
}

float[] questionVector = await embeddings.CreateAsync(question); // from your AI model

// The 5 passages most similar to the question
var nearest = db.Select(db.From<Passage>()
    .OrderBy(x => Sql.CosineDistance(x.Embedding, questionVector))
    .Take(5));
```

The dimensions of a `[Vector]` are the size of the embeddings of the model that creates them, e.g. `1536` for OpenAI's
`text-embedding-3-small`. Vectors are saved and read back with every API like any other property:

```csharp
db.Insert(new Passage { BookId = book.Id, Text = text, Embedding = vector });

db.UpdateOnly(() => new Passage { Embedding = newVector }, where: x => x.Id == id);

float[] saved = db.SingleById<Passage>(id).Embedding;
```

## One query for vectors, filters and joins

Because the distance is part of a typed query, it combines with the rest of your SQL in one statement. Here are the best matches from books that are in stock, with a score, leaving out weak matches:

```csharp
public class PassageMatch
{
    public int Id { get; set; }
    public string Text { get; set; }
    public double Distance { get; set; }
}

var matches = db.Select<PassageMatch>(db.From<Passage>()
    .Join<Book>((p, b) => p.BookId == b.Id)
    .Where<Book>(b => b.Available)
    .And(x => Sql.CosineDistance(x.Embedding, questionVector) < 0.35)
    .OrderBy(x => Sql.CosineDistance(x.Embedding, questionVector))
    .Take(10)
    .Select(x => new { x.Id, x.Text, Distance = Sql.CosineDistance(x.Embedding, questionVector) }));
```

The joins, filters, score and cut-off all run in the database, and only the 10 rows you want come back.

Smaller is more similar, and there's a distance for each way of comparing vectors:

| API | Distance | Supported by |
|-|-|-|
| `Sql.CosineDistance()` | The angle between 2 vectors, ignoring their length. The usual choice for text embeddings | All |
| `Sql.L2Distance()` | The straight-line (Euclidean) distance | All |
| `Sql.NegativeInnerProduct()` | The inner (dot) product negated, for normalized vectors | PostgreSQL, SQL Server, MySQL |

The same methods also calculate the distance of 2 vectors in memory, e.g. `Sql.CosineDistance(vectorA, vectorB)`.

### Confined to the tenant

On a connection with the new [connection filters](/posts/ormlite-multitenancy), a vector search is confined to the connection's tenant like every other query, so one customer's search never returns another's passages. There's no tenant condition to remember to add to the most security-sensitive query in a RAG App, whose results are about to be
handed to an AI model as trusted context.

## Works with the embeddings you already have

Microsoft.Extensions.AI's `Embedding<float>.Vector` is a `ReadOnlyMemory<float>`, so a vector can be one too, and embeddings are saved and compared without copying them to an array:

```csharp
[Vector(1536)]
public ReadOnlyMemory<float> Embedding { get; set; }

var embedding = await generator.GenerateAsync(question);
var nearest = db.Select(db.From<Passage>()
    .OrderBy(x => Sql.CosineDistance(x.Embedding, embedding.Vector))
    .Take(5));
```

## Every database's vector support, one API

OrmLite uses the vector support of each RDBMS where it's enabled, so the same model and queries run on all of
them:

| RDBMS | Requires | Cosine distance |
|-|-|-|
| PostgreSQL | The [pgvector](https://github.com/pgvector/pgvector) extension | `"embedding" <=> :0::vector` |
| SQL Server | SQL Server 2025 or Azure SQL | `VECTOR_DISTANCE('cosine', "Embedding", CAST(@0 AS VECTOR(1536)))` |
| MariaDB | MariaDB 11.7+ | ``VEC_DISTANCE_COSINE(`Embedding`, @0)`` |
| MySQL | MySQL 9 HeatWave or Enterprise | ``DISTANCE(`Embedding`, @0, 'COSINE')`` |
| SQLite | The [sqlite-vec](https://github.com/asg017/sqlite-vec) extension | `vec_distance_cosine("Embedding", @0)` |

That includes SQLite, so you can develop and test against a local file and deploy to PostgreSQL. Enabling it is one line per database. PostgreSQL needs `CREATE EXTENSION IF NOT EXISTS vector;`, and SQLite loads the
[sqlite-vec](https://www.nuget.org/packages/sqlite-vec) extension when a connection opens:

```csharp
SqliteDialect.Provider.OnOpenConnection = db =>
    ((SqliteConnection)db.ToDbConnection()).LoadExtension("vec0");
```

Other databases throw a `NotSupportedException`.

## Indexes for large tables

Without an index every row is compared, which is fine for thousands of rows. For more, add `[Index]` to create a vector index on the databases that have one, which finds approximate matches much faster:

```csharp
public class Passage
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Text { get; set; }

    [Vector(1536, Distance = VectorDistance.Cosine), Index, Required]
    public float[] Embedding { get; set; }
}
```

| RDBMS | Index created |
|-|-|
| PostgreSQL | `CREATE INDEX ... USING hnsw ("embedding" vector_cosine_ops)` |
| MariaDB | `CREATE VECTOR INDEX ... DISTANCE=cosine`, which needs a `[Required]` column |
| SQL Server, MySQL, SQLite | None |

The index can be tuned with the options of `[Vector]`, where the RDBMS has them: HNSW's `M` and `EfConstruction`, and PostgreSQL's IVFFlat indexes with `IndexType = VectorIndexType.IvfFlat` and `Lists`. Options an RDBMS doesn't
have throw a `NotSupportedException` before the table is created, instead of being ignored.

How a connection searches an index is set with `SetVectorSearch()`:

```csharp
db.SetVectorSearch(new() { EfSearch = 100, IterativeScan = true });
```

`IterativeScan` is worth knowing about on PostgreSQL. An index finds approximate matches, and some databases apply a filter to the candidates the index returns, so a filter that only matches a few rows, like a small tenant in a multi-tenant App, can return fewer rows than you asked for. With `IterativeScan` the search continues until enough
rows match the query's filters.

### Half the size

Embeddings are large, so `Precision = VectorPrecision.Half` stores each value in 16 bits instead of 32, halving the size of a table's vectors and their index for a small loss of precision. The property is still a `float[]`:

```csharp
[Vector(1536, Precision = VectorPrecision.Half), Index, Required]
public float[] Embedding { get; set; }
```

It uses PostgreSQL's `halfvec` type and SQL Server 2025's `VECTOR(n, float16)`.

## Hybrid search with full-text indexes

Embeddings are good at meaning and weak at exact terms like product names, error codes and identifiers, which is where keyword search is strongest. v10.4 also adds `[FullTextIndex]`, which creates a full-text index of a table's
text columns using each database's native full-text search: SQLite's FTS5, PostgreSQL's `tsvector`, MySQL's `FULLTEXT` and SQL Server's Full-Text Search:

```csharp
[FullTextIndex(nameof(Title), nameof(Content))]
public class Article
{
    [AutoIncrement]
    public long Id { get; set; }
    public string Title { get; set; }
    [StringLength(StringLengthAttribute.MaxText)]
    public string Content { get; set; }
    public string Category { get; set; }
}

var q = db.From<Article>()
    .Where(x => Sql.Matches(x, request.Search) && x.Category == request.Category)
    .OrderByDescending(x => Sql.MatchRank(x, request.Search))
    .Take(20);
```

`Sql.Matches()` finds the rows with every word of a search and `Sql.MatchRank()` orders them by relevance. Words match as users type, so `data` matches `database`, and `"quoted phrases"` match words that follow each other. The search is
only ever sent as a db param and only its words and phrases are searched for, so it can't use the operators of a database's full-text syntax.

As both are conditions of one typed query, they combine into hybrid search. These are the passages that mention a question's keywords, ordered by how similar they are to it:

```csharp
var q = db.From<Passage>()
    .Where(x => Sql.Matches(x, question))
    .OrderBy(x => Sql.CosineDistance(x.Embedding, questionVector))
    .Take(10);
```

Rows are indexed as they're inserted, updated and deleted with every API, and `CreateFullTextIndex<T>()` adds the index to a table that already has rows, e.g. in a migration.

## Fits the rest of a RAG pipeline

Search over a vector is the retrieval step. Embeddings come from an `IEmbeddingGenerator`, passages are rows in a table you already back up, secure and migrate, and the answer comes from an AI model, which the [AI Chat](/posts/ai-chat-v4) and [Gemini RAG](/posts/gemini-rag) features cover. With v10.4 a RAG App can keep its passages, embeddings, permissions and tenants in one database, queried with one typed query.

## Get Started

Vector columns and full-text indexes are available in **ServiceStack v10.4**. Upgrade your  `ServiceStack.OrmLite.*` packages, enable vectors in your database, and add `[Vector]` to a property.

See the docs for the complete reference:

- [Vector Search](https://docs.servicestack.net/ormlite/vectors) - supported databases, enabling each one, distances,
  indexes and search settings
- [Full-Text Search](https://docs.servicestack.net/ormlite/full-text-search) - searching, ranking, keeping indexes up
  to date and adding them to existing tables
- [v10.4 Release Notes](https://docs.servicestack.net/releases/v10_04) - everything else in this release
