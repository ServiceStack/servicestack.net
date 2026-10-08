---
title: Safe SQL by default in OrmLite
summary: ServiceStack v10.4 adds Sql.Fmt() for interpolated SQL where every value is a db param, OrderBySafe() for user-selected sort orders, and stronger SQL injection protection across fragment validation, identifier quoting and inlined values
tags: [servicestack, ormlite, security]
author: Demis
image: ./img/posts/ormlite-safe-sql/bg.webp
---

Typed queries have always been the safe way to use OrmLite. Every value in `db.Select<Book>(x => x.Author == author)` is
sent as a db parameter, so there's nothing to inject into. SQL injection creeps in where typed queries stop being
convenient, and it almost always arrives the same two ways:

- **Concatenating a value into raw SQL**, usually with C# string interpolation, because `$"Author = '{author}'"` is
  so much nicer to write than a parameter object.
- **Letting users choose the sort order**, e.g. `?orderBy=-Price`, which is a column name rather than a value, so
  it can't be a parameter and ends up pasted into `ORDER BY`.

**ServiceStack v10.4** gives both a safe API that's as easy to write as the unsafe one, and hardens the defences
around everything else:

- **`Sql.Fmt()`** keeps writing natural C# interpolated strings, but every interpolated value is sent as a db param
- **`OrderBySafe()`** resolves user-supplied field names to properly quoted columns, so only real fields can be used
- **Stronger injection protection** for SQL fragments, identifiers, inlined values and schema queries

## Safe interpolated SQL with Sql.Fmt

The unsafe version and the safe version differ by a single method call:

```csharp
// Unsafe: the value is embedded in the SQL
db.Select<Book>($"Author = '{request.Author}'");

// Safe: the value is sent as a db param
db.Select<Book>(Sql.Fmt($"Author = {request.Author}"));
```

`Sql.Fmt()` is a C# interpolated string handler. Rather than building a string, it records the SQL with a placeholder
for each interpolated value, and OrmLite generates the SQL and params for your RDBMS:

<generated-sql>

```csharp
var author = request.Author; // user input is never embedded in SQL
var books = db.Select<Book>(Sql.Fmt($"Author = {author} AND Price < {request.MaxPrice}"));
```

```sql
SELECT "Id", "Title", "Author", "Genre", "Price", "Year", "Available"
FROM "Book"
WHERE Author = @p0 AND Price < @p1
-- @p0 = 'J.R.R. Tolkien', @p1 = 20
```

</generated-sql>

A value that would otherwise be an injection attack is just a value that doesn't match anything:

```csharp
var malicious = "x' OR '1'='1";
db.Select<Book>(Sql.Fmt($"Author = {malicious}")); // returns no rows
```

Values are converted the same way as in typed queries, so enums, dates, decimals and bools just work, and
collections are expanded into `IN` lists:

<generated-sql>

```csharp
var genres = new[] { Genre.Fantasy, Genre.Science };
var books = db.Select<Book>(Sql.Fmt($"Genre IN ({genres}) AND Year >= {since}"));
```

```sql
SELECT "Id", "Title", "Author", "Genre", "Price", "Year", "Available"
FROM "Book"
WHERE Genre IN (@v0,@v1) AND Year >= @p1
-- @v0 = 'Fantasy', @v1 = 'Science', @p1 = 1960
```

</generated-sql>

Empty collections match nothing, rather than generating invalid SQL.

### Works with every raw SQL API

`Sql.Fmt()` is accepted anywhere OrmLite takes a SQL string, sync or async: `SqlList`, `SqlColumn` and `SqlScalar`,
the shorthand `Select`, `Single`, `Exists`, `Column` and `Scalar` APIs, `ExecuteSql`, `Delete`, the collection APIs
`ColumnDistinct`, `Lookup`, `Dictionary` and `KeyValuePairs`, `RowCount` and the lazy streaming APIs:

```csharp
var genres = new[] { Genre.Fiction, Genre.Science };

Dictionary<string, List<string>> titlesByAuthor = db.Lookup<string, string>(
    Sql.Fmt($"SELECT Author, Title FROM Book WHERE Genre IN ({genres})"));

db.Delete<Book>(Sql.Fmt($"Author = {author} AND Year < {1950}"));
```

It's an explicit opt-in, so existing `string` APIs keep their current behaviour, and passing an interpolated string
directly to one still concatenates the value.

### Table and column references

Values are the only thing that can be a parameter. Table and column names can't, and are the other thing people
end up concatenating. `Sql.Fmt()` embeds them as names quoted by the RDBMS dialect, including their schema and
naming convention. Naming the references after their table and column keeps the SQL readable, and makes it clear
which parts of the SQL are names and which are params:

<generated-sql>

```csharp
var Book = db.TableRef<Book>();
var (Title, Author, Price) = db.ColumnRefs<Book>(x => new { x.Title, x.Author, x.Price });

var titles = db.SqlColumn<string>(Sql.Fmt($"SELECT {Title} FROM {Book} WHERE {Author}={author}"));
db.ExecuteSql(Sql.Fmt($"UPDATE {Book} SET {Price} = {Price} * {0.9m} WHERE {Author} = {author}"));
```

```sql
SELECT "Title" FROM "Book" WHERE "Author"=@p0
-- @p0 = 'J.R.R. Tolkien'

UPDATE "Book" SET "Price" = "Price" * @p0 WHERE "Author" = @p1
-- @p0 = 0.9, @p1 = 'J.R.R. Tolkien'
```

</generated-sql>

The quoted names also make the SQL portable, as they use the table's `[Alias]` and the RDBMS naming convention, e.g.
PostgreSQL's convention stores the `BookReview` table as `book_review` and its `BookId` column as `book_id`.

A table can also be referenced by its type, and joins can qualify columns with their table using `prefixTable: true`:

<generated-sql>

```csharp
var (Book, BookReview) = db.TableRefs<Book, BookReview>();
var (Id, Title) = db.ColumnRefs<Book>(x => new { x.Id, x.Title }, prefixTable:true);
var (BookId, Rating) = db.ColumnRefs<BookReview>(x => new { x.BookId, x.Rating }, prefixTable:true);

var reviewed = db.SqlColumn<string>(Sql.Fmt(
  $"SELECT DISTINCT {Title} FROM {Book} JOIN {BookReview} ON {Id}={BookId} WHERE {Rating}>={4}"));
```

```sql
SELECT DISTINCT "Book"."Title"
FROM "Book" JOIN "BookReview" ON "Book"."Id"="BookReview"."BookId"
WHERE "BookReview"."Rating">=@p0
-- @p0 = 4
```

</generated-sql>

Anything else that really is trusted SQL, like a sort direction you chose in code, can be embedded verbatim with
`Sql.Raw()`. It's a signal that the value is SQL rather than data, so it's never used with user input.

### Mix it with typed queries

`Sql.Fmt()` also works inside typed `SqlExpression` queries through `Where`, `And`, `Or` and `Having`, which is
useful for conditions that are hard to express in C#, like aggregates in a `HAVING` clause:

<generated-sql>

```csharp
var Year = db.ColumnRef<Book>(x => x.Year);

var q = db.From<Book>()
    .Where(x => x.Available)
    .And(Sql.Fmt($"{Year} >= {minYear}"));

// Genres with at least 2 books, one published since 1980
var byGenre = db.From<Book>()
    .GroupBy(x => x.Genre)
    .Having(Sql.Fmt($"COUNT(*) >= {2} AND MAX({Year}) >= {1980}"))
    .Select(x => x.Genre);
```

```sql
-- q
SELECT "Id", "Title", "Author", "Genre", "Price", "Year", "Available"
FROM "Book"
WHERE "Available"=1 AND "Year" >= @0
-- @0 = 1970

-- byGenre
SELECT "Genre"
FROM "Book"
GROUP BY "Genre"
HAVING COUNT(*) >= @0 AND MAX("Year") >= @1
-- @0 = 2, @1 = 1980
```

</generated-sql>

Format specifiers like `{date:yyyy-MM-dd}` are rejected with a `FormatException`, since params are sent as typed
values rather than text. Pass the typed value, or format it before interpolating it.

## Let users choose the sort order with OrderBySafe

A sort order is a column name, so it can't be a parameter, and it's the most common way user input ends up in SQL.
Passing `?orderBy=-Price` straight to `OrderBy(string)` is only ever as safe as the validation behind it. 
`OrderBySafe()` never embeds its input at all. It resolves field names to properly quoted columns, so only real
fields can ever be used:

```csharp
// ?orderBy=-Price,Title&skip=20&take=10
var q = db.From<Book>()
    .OrderBySafe(request.OrderBy, [nameof(Book.Title), nameof(Book.Price), nameof(Book.Year)])
    .Skip(request.Skip).Take(request.Take);
```

`orderBy` is a comma-delimited list of field names:

| orderBy                 | SQL                               |
|-------------------------|-----------------------------------|
| `Price`                 | `ORDER BY "Price"`                |
| `-Price`                | `ORDER BY "Price" DESC`           |
| `Price DESC`            | `ORDER BY "Price" DESC`           |
| `price asc, title`      | `ORDER BY "Price", "Title"`       |
| `-Year,Title`           | `ORDER BY "Year" DESC, "Title"`   |

Fields can be prefixed with `-` or suffixed with `DESC` to sort descending, names are case-insensitive and are
resolved to the RDBMS column name, e.g. `in_stock` for `InStock` on PostgreSQL.

### Only the fields you allow

The list of fields users can sort by does more than prevent injection. Sorting by a field reveals information
about its values, even if the field itself is never returned, so an unrestricted sort lets a client probe the
contents of fields it can't see, like a `PasswordHash` or `ApiKey`, by watching how the results are ordered:

```csharp
static readonly string[] SortableFields = [nameof(Book.Title), nameof(Book.Price), nameof(Book.Year)];

db.From<Book>().OrderBySafe("-Year", SortableFields);    // OK
db.From<Book>().OrderBySafe("Author", SortableFields);   // throws ArgumentException
```

Limiting sorting to fields with an index also keeps sorting large tables fast. `OrderBySafe(orderBy)` without a list
allows any field on the queried tables, including joined tables, so only use it on tables without sensitive fields.

### Everything else is rejected

Input is only ever treated as field names and sort directions. Anything else throws an `ArgumentException`, which
ServiceStack returns to API clients as a `400 Bad Request`:

```csharp
q.OrderBySafe("Unknown");                        // not a field
q.OrderBySafe("Id--");                           // not a field
q.OrderBySafe("Id;DROP TABLE Book");             // not a field
q.OrderBySafe("(SELECT 1)");                     // not a field
q.OrderBySafe("Id SIDEWAYS");                    // invalid direction
```

An empty `orderBy` leaves the query's existing order unchanged, so it's easy to keep a default sort:

```csharp
var q = db.From<Book>()
    .Join<BookReview>((b, r) => b.Id == r.BookId)
    .OrderBy(x => x.Title)                      // default order
    .OrderBySafe(request.OrderBy);              // e.g. "-Rating, Reviewer"
```

It also works with the new [keyset pagination](https://docs.servicestack.net/ormlite/keyset-pagination), so a
user-selected sort order stays fast on large tables:

<generated-sql>

```csharp
// ?orderBy=-Price,Id
var q = db.From<Book>().OrderBySafe(request.OrderBy, [nameof(Book.Price), nameof(Book.Id)])
    .SeekAfter(lastRow).Take(50);
```

```sql
SELECT "Id", "Title", "Author", "Genre", "Price", "Year", "Available"
FROM "Book"
WHERE (("Price" <= @0) AND (("Price" < @0) OR ("Price" = @0 AND "Id" > @1)))
ORDER BY "Price" DESC, "Id"
LIMIT 50
-- @0 = 12.99, @1 = 42
```

</generated-sql>

[AutoQuery](https://docs.servicestack.net/autoquery/rdbms) APIs already support validated `?orderBy=` sorting out of
the box, so `OrderBySafe()` is for the APIs you write yourself.

## Stronger SQL injection protection

Some APIs accept SQL fragments by design, like `Where(string)`, `OrderBy(string)` and `Select(string)`. OrmLite
validates those fragments and throws an `ArgumentException` if one looks like SQL injection. Validation is a safety
net rather than a substitute for params, but it's the last line of defence for apps that pass fragments around, so
this release closes the ways it could be bypassed:

- **Tighter fragment validation**: comments (`--`, `/* */`) and statement separators (`;`) are now rejected anywhere
  in a fragment, closing several ways to bypass the validation. Values quoted with MySQL-style backslash escapes can
  no longer disguise SQL either, as quoted strings are checked as both ANSI SQL and MySQL would parse them.
- **Safer identifiers on every database**: table, column and schema names containing quote characters are now always
  escaped, including on Oracle and Firebird, which previously left most names unquoted.
- **Escaped date formats and currency symbols**: formats in `x.Created.ToString(format)` and the SQL date format and
  currency helpers are now always escaped. Previously a runtime value could inject SQL on SQLite and MySQL.
- **Safer schema queries**: the catalog queries that check whether tables and schemas exist, and that reset
  sequences, now escape the names they use on PostgreSQL, Oracle and Firebird, as do Firebird's schema lookups
  like `GetTable()` and `GetColumns()`. Savepoint names are now validated.
- **Escaped spatial values on SQL Server**: `SqlGeography`, `SqlGeometry` and `SqlHierarchyId` values inlined in SQL
  now have embedded quotes escaped.
- **`Contains()` values are always db params**: the value of `x.Tags.Contains(value)` on a list or array property
  was previously written into the SQL as it was, so a value from a user could change the query. It's now a param of
  a JSON query, and throws where the property can't be queried.

Some fragments that were accepted before are now rejected, e.g. `x--y` or a `;` in the middle of a fragment. If you
hit one, pass values as parameters or use `Sql.Fmt()`. For trusted SQL you wrote yourself, the `Unsafe*` APIs skip
validation:

```csharp
q.UnsafeWhere("Id IN (SELECT BookId FROM BookReview WHERE Rating >= {0})", 4); // {0} is sent as a param
q.UnsafeOrderBy("CASE WHEN Available THEN 0 ELSE 1 END, Title");
```

## Choose the safe API for each job

| You need to...                                  | Use                                                     |
|-------------------------------------------------|---------------------------------------------------------|
| Filter by user input                            | Typed `Where()`, or params with raw SQL                 |
| Write raw SQL with interpolated values          | `Sql.Fmt()`                                             |
| Let users choose the sort order                 | `OrderBySafe()`                                         |
| Reference a table name in raw SQL               | `db.TableRef<T>()` or `typeof(T)` in `Sql.Fmt()`        |
| Reference a column name in raw SQL              | `db.ColumnRef<T>()`, `db.ColumnRefs<T>()` in `Sql.Fmt()` |
| Embed trusted SQL that fails validation         | `Unsafe*` APIs, e.g. `q.UnsafeWhere()`                  |

## Get Started

`Sql.Fmt()`, `OrderBySafe()` and the stronger injection protection are available in **ServiceStack v10.4**, on every
database OrmLite supports. Upgrade your `ServiceStack.OrmLite.*` packages and replace the interpolated strings you
pass to raw SQL APIs with `Sql.Fmt()`.

See the docs for the complete reference:

- [Interpolated SQL](https://docs.servicestack.net/ormlite/sql-fmt) - every supported API, table and column
  references, and inspecting the generated SQL
- [Dynamic Sorting](https://docs.servicestack.net/ormlite/order-by-safe) - syntax, allowed fields, defaults and paging
- [SQL Injection Protection](https://docs.servicestack.net/ormlite/sql-injection) - fragment validation, identifier
  quoting, `Unsafe*` APIs and how to customize validation
- [v10.4 Release Notes](https://docs.servicestack.net/releases/v10_04) - everything else in this release
