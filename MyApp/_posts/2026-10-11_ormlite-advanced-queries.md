---
title: Advanced SQL queries in typed OrmLite
summary: ServiceStack v10.4 adds typed recursive queries, named sub queries, window functions with TopPerGroup, Union/Intersect/Except, SeekAfter keyset paging and async streaming, so the queries that used to need hand-written SQL stay typed, parameterized and portable
tags: [servicestack, ormlite, sql]
author: Demis
image: ./img/posts/ormlite-advanced-queries/bg.webp
---

Typed queries cover the first 90% of an App's SQL very well. Then comes the query that's easy to describe and awkward
to write: *every subject under Fiction, at any depth*, *each customer's 3 latest orders*, *everyone who has written
or reviewed a book*, *the next page of 50 after the last row I saw*. Those are the queries that sent code back to
hand-written SQL strings, with their string concatenation, their per-database differences and their lack of
refactoring.

**ServiceStack v10.4** adds typed support for the ones that come up most, in the same fluent `SqlExpression` style as
the rest of OrmLite. They're parameterized, they compose with your filters, joins and
[connection filters](/posts/ormlite-multitenancy), and they run on the databases that support them:

- **`WithRecursive()`** for hierarchies like categories, org charts and threaded comments
- **`With()`** to name sub queries as common table expressions
- **Window functions** for rankings, running totals, previous rows, and `TopPerGroup()`
- **`Union()`, `Intersect()` and `Except()`** to combine queries
- **`SeekAfter()`** for fast, stable keyset paging
- **`SelectLazyAsync()`** to stream large result sets with `await foreach`

## Query hierarchical data with WithRecursive

Hierarchies are everywhere, and walking one used to mean a recursive common table expression written by hand.
`WithRecursive()` starts with the rows of a seed query and repeatedly adds the rows matching a relationship:

<generated-sql>

```csharp
// Fiction and every subject under it, at any depth
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Fiction"),
        recurse: (parent, child) => child.ParentId == parent.Id);

var subjects = db.Select(q);
```

```sql
WITH RECURSIVE "cte" ("Id", "ParentId", "Name", "Active") AS (
  SELECT "Id", "ParentId", "Name", "Active"
  FROM "Subject"
  WHERE ("Name" = @0)
  UNION ALL
  SELECT "c"."Id", "c"."ParentId", "c"."Name", "c"."Active"
  FROM "Subject" "c" INNER JOIN "cte" ON ("c"."ParentId" = "cte"."Id")
)
SELECT "Id", "ParentId", "Name", "Active"
FROM "cte" "Subject"
-- @0 = 'Fiction'
```

</generated-sql>

Swapping the relationship walks up the hierarchy instead, e.g. the path from a subject to the root:

```csharp
var ancestors = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Id == subjectId),
        recurse: (child, parent) => parent.Id == child.ParentId);
```

The rest of the query applies to all the rows found, so typed filters, ordering, projections, `Count()`, paging, async
APIs and keyset pagination work as usual:

<generated-sql>

```csharp
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Id == 1),
        recurse: (parent, child) => child.ParentId == parent.Id)
    .Where(x => x.Active)
    .OrderBy(x => x.Name)
    .Select(x => x.Name);

var names = await db.ColumnAsync<string>(q);
```

```sql
WITH RECURSIVE "cte" ("Id", "ParentId", "Name", "Active") AS (
  SELECT "Id", "ParentId", "Name", "Active"
  FROM "Subject"
  WHERE ("Id" = @0)
  UNION ALL
  SELECT "c"."Id", "c"."ParentId", "c"."Name", "c"."Active"
  FROM "Subject" "c" INNER JOIN "cte" ON ("c"."ParentId" = "cte"."Id")
)
SELECT "Name"
FROM "cte" "Subject"
WHERE "Active"=1
ORDER BY "Name"
-- @0 = 1
```

</generated-sql>

Real data has edge cases, and the options cover them. `maxDepth` limits how many levels are selected,
`Sql.RecursiveDepth()` is the level of each row, and `detectCycles` stops at rows that were already visited, for data
that can have loops:

```csharp
// Books, its children and grandchildren, a level at a time
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Books"),
        recurse: (parent, child) => child.ParentId == parent.Id,
        maxDepth: 2,
        detectCycles: true)
    .OrderBy(x => Sql.RecursiveDepth())
    .Select(x => new { x.Id, x.Name, Depth = Sql.RecursiveDepth() });
```

Raw SQL statements that start with a CTE, e.g. `WITH roots AS (...) SELECT ...`, are now also executed as-is on all
databases.

## Name sub queries with With

`With()` names a sub query as a common table expression, which the rest of the query reads like a table. A sub query
that's needed in several places is written once, and a complex query can be built in steps that are each simple to
read. The columns of the sub query are described by a class, in the order it selects them:

<generated-sql>

```csharp
public class AuthorTotal
{
    public string Author { get; set; }
    public int Books { get; set; }
    public decimal Total { get; set; }
}

var totals = db.From<Book>()
    .GroupBy(x => x.Author)
    .Select(x => new { x.Author, Books = Sql.Count("*"), Total = Sql.Sum(x.Price) });

// Each book since 1970, with how many books its author has
var q = db.From<Book>()
    .With<AuthorTotal>(totals)
    .Join<AuthorTotal>((b, t) => b.Author == t.Author)
    .Where(b => b.Year >= 1970)
    .Select<Book, AuthorTotal>((b, t) => new { b.Title, b.Author, t.Books });
```

```sql
WITH "AuthorTotal" ("Author", "Books", "Total") AS (
  SELECT "Author", Count(*) AS Books, Sum("Price") AS Total
  FROM "Book"
  GROUP BY "Author"
)
SELECT "Book"."Title", "Book"."Author", "AuthorTotal"."Books" AS "Books"
FROM "Book" INNER JOIN "AuthorTotal" ON ("Book"."Author" = "AuthorTotal"."Author")
WHERE ("Book"."Year" >= @0)
-- @0 = 1970
```

</generated-sql>

As the sub query is named after a class, it's used with the same typed APIs as a table, including `db.From<AuthorTotal>()`
to select from it. A query can have several sub queries where each can read the ones before it, and they can be
combined with `WithRecursive()`.

## Rankings, running totals and top rows per group

Window functions calculate a value for each row from the rows related to it, like its rank within a group, a
running total or the previous row's value. They're the right tool for a whole family of reporting questions, and they
now have typed APIs instead of raw SQL:

<generated-sql>

```csharp
var q = db.From<Order>()
    .Select(x => new {
        x.Id,
        x.Customer,
        x.Total,
        Rank = Sql.Rank(w => w.PartitionBy(x.Customer).OrderByDescending(x.Total)),
        RunningTotal = Sql.Sum(x.Total, w => w.PartitionBy(x.Customer).OrderBy(x.CreatedDate)),
        PreviousTotal = Sql.Lag(x.Total, w => w.PartitionBy(x.Customer).OrderBy(x.CreatedDate)),
        WeeklyAverage = Sql.Avg(x.Total, w => w.OrderBy(x.CreatedDate).RowsBetween(6, 0)),
    });
```

```sql
SELECT "Id", "Customer", "Total",
  RANK() OVER (PARTITION BY "Customer" ORDER BY "Total" DESC) AS "Rank",
  SUM("Total") OVER (PARTITION BY "Customer" ORDER BY "CreatedDate") AS "RunningTotal",
  LAG("Total") OVER (PARTITION BY "Customer" ORDER BY "CreatedDate") AS "PreviousTotal",
  AVG("Total") OVER (ORDER BY "CreatedDate" ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS "WeeklyAverage"
FROM "Order"
```

</generated-sql>

`RowNumber`, `Rank`, `DenseRank`, `Ntile`, `Lag`, `Lead`, `FirstValue`, `LastValue` and the `Sum`, `Count`, `Min`,
`Max` and `Avg` aggregates are supported.

### Top rows of each group

*Each customer's 3 latest orders* is one of the most common queries that needs window functions, and one of the
easiest to get subtly wrong. `TopPerGroup()` returns the first rows of each group in the order of the query:

<generated-sql>

```csharp
// Each customer's 3 latest orders
var latest = db.Select(db.From<Order>()
    .OrderByDescending(x => x.CreatedDate)
    .TopPerGroup(x => x.Customer, take: 3));
```

```sql
SELECT "Id", "Customer", "Total", "CreatedDate"
FROM (
  SELECT "Order".*, ROW_NUMBER() OVER (PARTITION BY "Customer" ORDER BY "CreatedDate" DESC) AS "_rn"
  FROM "Order"
) "Order"
WHERE "Order"."_rn" <= 3
ORDER BY "CreatedDate" DESC
```

</generated-sql>

Window functions are supported on PostgreSQL, SQL Server, SQLite 3.25+, MySQL 8+, MariaDB and Oracle.

## Combine queries with Union, Intersect and Except

Typed queries can now be combined with `Union()`, `UnionAll()`, `Intersect()` and `Except()`, without dropping down
to raw SQL. Each query selects the same number of compatible columns, and its params are merged automatically:

<generated-sql>

```csharp
// Everyone who has written or reviewed a book
var q = db.From<Book>().Select(x => x.Author)
    .Union(db.From<BookReview>().Select(x => x.Reviewer));
var people = db.Column<string>(q);

// Fantasy books or anything under $9
var q2 = db.From<Book>().Where(x => x.Genre == Genre.Fantasy).Select(x => x.Title)
    .Union(db.From<Book>().Where(x => x.Price < 9m).Select(x => x.Title));
```

```sql
-- Everyone who has written or reviewed a book
SELECT "Author" FROM "Book"
UNION
SELECT "Reviewer" FROM "BookReview"

-- Fantasy books or anything under $9
SELECT "Title" FROM "Book" WHERE ("Genre" = @0)
UNION
SELECT "Title" FROM "Book" WHERE ("Price" < @1)
-- @0 = 'Fantasy', @1 = 9
```

</generated-sql>

`Intersect()` returns rows in both queries, and `Except()` returns rows in the first query that aren't in the other,
which is a tidy way to ask what's missing:

<generated-sql>

```csharp
var available = db.From<Book>().Where(x => x.Available).Select(x => x.Id);
var reviewed  = db.From<BookReview>().Select(x => x.BookId);

var availableAndReviewed = db.Column<int>(available.Clone().Intersect(reviewed));
var awaitingReviews      = db.Column<int>(available.Clone().Except(reviewed));
```

```sql
-- availableAndReviewed
SELECT "Id" FROM "Book" WHERE "Available"=1
INTERSECT
SELECT "BookId" FROM "BookReview"

-- awaitingReviews
SELECT "Id" FROM "Book" WHERE "Available"=1
EXCEPT
SELECT "BookId" FROM "BookReview"
```

</generated-sql>

`OrderBy()`, `Skip()` and `Take()` on the first query apply to the combined results, and `Count()` counts them, so a
combined query can be paged like any other. Queries being combined keep their own `OrderBy()` and `Take()`:

<generated-sql>

```csharp
// Page through everyone, sorted by name
var q = db.From<Book>().Select(x => x.Author)
    .Union(db.From<BookReview>().Select(x => x.Reviewer))
    .OrderBy(x => x.Author)
    .Skip(20).Take(10);

// Fantasy books plus the 2 cheapest books
var q2 = db.From<Book>().Where(x => x.Genre == Genre.Fantasy).Select(x => x.Title)
    .UnionAll(db.From<Book>().OrderBy(x => x.Price).Take(2).Select(x => x.Title));
```

```sql
-- Page through everyone, sorted by name
SELECT * FROM (
  SELECT "Author" FROM "Book"
  UNION
  SELECT "Reviewer" FROM "BookReview"
) q
ORDER BY "Author"
LIMIT 10 OFFSET 20

-- Fantasy books plus the 2 cheapest books
SELECT "Title" FROM "Book" WHERE ("Genre" = @0)
UNION ALL
SELECT * FROM (SELECT "Title" FROM "Book" ORDER BY "Price" LIMIT 2) q1
-- @0 = 'Fantasy'
```

</generated-sql>

Combined queries work with `Select()` into POCOs and the async APIs. Oracle uses `MINUS` for `Except()`, and Firebird,
which doesn't support `INTERSECT` or `EXCEPT`, throws a `NotSupportedException`.

## Fast, stable paging with SeekAfter

`Skip(n).Take(m)` gets slower the deeper you page, as the database still reads every skipped row, and rows can be
skipped or repeated when data changes between requests. `SeekAfter()` pages through results by continuing after the
last row of the previous page (keyset pagination), so every page is fast and stable:

<generated-sql>

```csharp
var q = db.From<Order>()
    .OrderByDescending(x => x.CreatedDate).ThenBy(x => x.Id)  // end with a unique column
    .Take(50);
if (lastRow != null)
    q.SeekAfter(lastRow);  // continue after the last row of the previous page

var page = db.Select(q);
```

```sql
SELECT "Id", "Customer", "Total", "CreatedDate"
FROM "Order"
WHERE (("CreatedDate" <= @0) AND (("CreatedDate" < @0) OR ("CreatedDate" = @0 AND "Id" > @1)))
ORDER BY "CreatedDate" DESC, "Id"
LIMIT 50
-- @0 = '2026-09-30 00:00:00', @1 = 42
```

</generated-sql>

It generates `(a > @0) OR (a = @0 AND b > @1)` conditions from the query's `ORDER BY`, which work on every database,
including with mixed sort directions, after an `a >= @0` bound that lets the database seek to the page in an index.

| | Skip / Take | SeekAfter |
|-|-|-|
| Deep pages | Slower the deeper you page | Same speed at any depth |
| Rows added or removed between requests | Rows can be skipped or repeated | Continues where it left off |
| Jump to page N | Yes | No, pages are sequential |

That makes it a fit for feeds, infinite scrolling, exports and sync APIs. In an API, pass the `ORDER BY` values
directly from a cursor, and it combines with filters and with user-selected sort orders from
[OrderBySafe()](/posts/ormlite-safe-sql):

```csharp
var page = db.Select(db.From<Book>()
    .Where(x => x.Available)
    .OrderBy(x => x.Price).ThenByDescending(x => x.Year).ThenBy(x => x.Id)
    .SeekAfter(cursor.Price, cursor.Year, cursor.Id)
    .Take(50));
```

Call it after `OrderBy()`, end the order with a unique column such as the primary key, and sort by non-nullable
columns.

## Stream large result sets

Large exports and background processing shouldn't have to load an entire table into memory or block a thread.
`SelectLazyAsync()` and `ColumnLazyAsync()` stream results one row at a time with `await foreach`:

```csharp
await foreach (var order in db.SelectLazyAsync(
    db.From<Order>().Where(x => x.Status == Status.Shipped), token))
{
    await writer.WriteAsync(order);
}

await foreach (var email in db.ColumnLazyAsync<string>(db.From<Customer>().Select(x => x.Email)))
    ...
```

Queries can be typed, parameterized or use [`Sql.Fmt()`](/posts/ormlite-safe-sql). Breaking out of the loop or
cancelling the token closes the reader straight away, so the connection can be reused immediately.

## Row-returning, locking and joined writes

Three more additions solve the same kind of problem: a write that needs to be one statement to be correct.

`UpdateOnlyReturning()` and `DeleteReturning()` return the rows affected by an UPDATE or DELETE in the same
statement, instead of a separate query that could see different rows. Deleting and returning in one statement also
makes a simple work queue, as each row is only ever returned to one caller:

```csharp
List<Order> shipped = db.UpdateOnlyReturning(() => new Order { Status = "Shipped" },
    where: x => x.Status == "Packed");

List<EmailJob> jobs = db.DeleteReturning<EmailJob>(x => x.Queue == "emails");
```

`ForUpdate()` locks the rows a query selects until the end of the transaction, to prevent lost updates on balances,
counters and stock levels, and `ForUpdate(skipLocked: true)` lets multiple workers take different items from the same
queue table. It uses `FOR UPDATE [SKIP LOCKED]` on PostgreSQL, MySQL 8+, MariaDB 10.6+ and Oracle,
`WITH (UPDLOCK, ROWLOCK[, READPAST])` on SQL Server, and is ignored on SQLite so the same code runs in development:

```csharp
using var trans = db.OpenTransaction();

var account = db.Single(db.From<Account>().Where(x => x.Id == id).ForUpdate());
account.Balance -= amount;   // other transactions wait until this one ends
db.Update(account);

trans.Commit();
```

`UpdateFrom()` updates rows with values from joined tables in a single statement, without reading them into .NET or
writing RDBMS-specific SQL:

```csharp
// Apply each UK warehouse's markup to the price of its parts
var q = db.From<Part>()
    .Join<Warehouse>((p, w) => p.WarehouseId == w.Id)
    .Where<Warehouse>(w => w.Country == "UK");

int updated = db.UpdateFrom<Part, Warehouse>((p, w) => new Part { Price = p.Price * w.Markup }, q);
```

## Get Started

These queries are available in **ServiceStack v10.4**. Upgrade your `ServiceStack.OrmLite.*` packages and replace the
raw SQL you were maintaining for hierarchies, rankings and paging.

See the docs for the complete reference, which has more examples and the database support of each API:

- [Recursive Queries](https://docs.servicestack.net/ormlite/recursive-queries) - ancestors, multiple roots, depth,
  cycles and paging
- [Named Sub Queries](https://docs.servicestack.net/ormlite/common-table-expressions) - building queries in steps and
  combining with recursion
- [Window Functions](https://docs.servicestack.net/ormlite/window-functions) - rankings, running totals, moving
  averages, `TopPerGroup()` and joins
- [Union, Intersect & Except](https://docs.servicestack.net/ormlite/set-operations) - paging and ordering combined
  queries
- [Keyset Pagination](https://docs.servicestack.net/ormlite/keyset-pagination) - cursors in APIs and user-supplied
  sort orders
- [Streaming Results](https://docs.servicestack.net/ormlite/streaming) - `SelectLazyAsync()` and `ColumnLazyAsync()`
- [Returning Rows](https://docs.servicestack.net/ormlite/returning), [Locking Rows](https://docs.servicestack.net/ormlite/locking)
  and [Update from Joined Tables](https://docs.servicestack.net/ormlite/update-from)
- [v10.4 Release Notes](https://docs.servicestack.net/releases/v10_04) - everything else in this release
