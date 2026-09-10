---
title: OrmLite gets type-safe JSON access and Upserts
summary: Query JSON columns with typed C# expressions that run unchanged on SQLite, PostgreSQL, SQL Server and MySQL, and insert-or-update rows in a single native statement with the new Upsert APIs
tags: [servicestack, ormlite]
author: Demis
image: ./img/posts/omlite-json-upsert/bg.webp
---

## Two everyday data problems, solved properly

Two tasks come up in almost every data-driven application, and both have traditionally forced an awkward
compromise.

**Querying JSON columns.** Semi-structured data - order payloads, event bodies, settings, integration
responses - fits naturally in a JSON column. But the moment you need to filter on something inside it, you
either give up typed queries and hand-write provider-specific JSON SQL, or flatten the document into columns
it doesn't naturally fit.

**Insert-or-update.** Imports, synchronization jobs, event consumers and retryable workers all want the same
thing: *create this row, or bring the existing one up to date*. Doing that safely has meant querying whether
the row exists first - an extra round trip, with a race window between the check and the write.

**ServiceStack v10.2** makes both first-class in OrmLite, with the same typed APIs across **SQLite**,
**PostgreSQL**, **SQL Server** and **MySQL**:

```csharp
// Filter on values inside a JSON document with ordinary C#
var priorityWaOrders = db.Select(db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address.State == "WA" &&
        Sql.Json<OrderDocument>(x.Data).Tags.Contains("priority")));

// Insert the row if it's new, update it if it isn't - in one statement
db.Upsert(customer);
```

## Portable, type-safe JSON queries

`Sql.Json<T>()` marks a column as a JSON document with C# Data Model `T`, then translates ordinary member
access, collection membership and array indexes into the configured database's **native JSON functions**:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address.State == "WA" &&
        Sql.Json<OrderDocument>(x.Data).Tags.Contains("priority") &&
        Sql.Json<OrderDocument>(x.Data).Lines[0].Quantity > 1);

var orders = db.Select(q);
```

You keep the flexibility of document-shaped data without giving up what makes OrmLite queries valuable:
they're compiled, refactor-safe, and committed to C# rather than to one database's dialect. Rename a property
on `OrderDocument` and the query refactors with it. Move from SQLite in development to PostgreSQL in
production and the same query compiles and runs unchanged.

<json-portability></json-portability>

### The example documents

The examples use an `OrderEvent` table with a JSON column, described by an ordinary C# Data Model:

```csharp
public class OrderEvent
{
    public long Id { get; set; }

    public string Data { get; set; }            // JSON stored and queried as text
    public OrderDocument Document { get; set; } // Complex property serialized as JSON
}

public class OrderDocument
{
    public Customer Customer { get; set; }
    public List<OrderLine> Lines { get; set; }
    public List<string> Tags { get; set; }
    public decimal Total { get; set; }
}

public class Customer { public Address Address { get; set; } }

public class Address
{
    [DataMember(Name = "shipping_state")]
    public string State { get; set; }
}

public class OrderLine
{
    public string Sku { get; set; }
    public int Quantity { get; set; }
}
```

With the current fluent configuration, complex properties like `Document` are stored as JSON by default on
all four databases - so typed documents can be inserted like any other Data Model:

```csharp
services.AddOrmLite(options => options.UseSqlite(connectionString));
// or options.UsePostgres(...) / UseSqlServer(...) / UseMySql(...)
```

### Everything you'd expect C# to do

Nested member access becomes a nested JSON path, and scalar results are converted to the member's C# type.
`[DataMember(Name=...)]` is honored, so `State` above maps to `$.Customer.Address.shipping_state`:

```csharp
var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address.State == "WA" &&
        Sql.Json<OrderDocument>(x.Data).Total >= 100m);
```

Arrays and lists work the way they read - zero-based indexes (constants or captured variables), `Contains()`
for membership and `Count` or `Length` for size:

```csharp
var index = 0;

var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Lines[index].Sku == "A-1" &&
        Sql.Json<OrderDocument>(x.Data).Lines.Count > 0 &&
        Sql.Json<OrderDocument>(x.Data).Tags.Contains("priority"));
```

Once a scalar is extracted, further operations go through OrmLite's normal expression translation - so
`Sql.Json<OrderDocument>(x.Data).Customer.Address.State.Length == 2` extracts the string and then applies the
database's own string-length function.

When the column is already a JSON-serialized complex property, its document type is inferred:

```csharp
var q = db.From<OrderEvent>()
    .Where(x => Sql.Json(x.Document).Customer.Address.State == "WA");
```

### Project straight into typed results

Selecting a scalar member extracts its C# value. Selecting an object or collection returns a JSON fragment
that OrmLite **deserializes back into its C# Data Model** - so a single query can mix relational columns,
JSON scalars and whole nested objects:

```csharp
var q = db.From<OrderEvent>()
    .Select(x => new {
        x.Id,
        State   = Sql.Json<OrderDocument>(x.Data).Customer.Address.State,
        Total   = Sql.Json<OrderDocument>(x.Data).Total,
        Address = Sql.Json<OrderDocument>(x.Data).Customer.Address,
    });

// OrderSummary { long Id; string State; decimal Total; Address Address; }
List<OrderSummary> summaries = db.Select<OrderSummary>(q);

Address address = db.Scalar<Address>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x => Sql.Json<OrderDocument>(x.Data).Customer.Address));
```

## Dynamic documents and runtime paths

Not every document has a C# Data Model, and not every path is known at compile time. An explicit SQL/JSON path
API covers those cases - and the operations that have no member-access equivalent:

<json-api-choice></json-api-choice>

```csharp
var totalPath = "$.Total";

var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.JsonValue<string>(x.Data, "$.Customer.Address.shipping_state") == "WA" &&
        Sql.JsonValue<decimal?>(x.Data, totalPath) >= 100m)
    .OrderByDescending(x => Sql.JsonValue<decimal?>(x.Data, totalPath));
```

The complete API includes validation, path existence, type inspection, arrays and containment:

| Task | Preferred typed expression | Explicit path API |
| --- | --- | --- |
| Read a scalar | `Sql.Json<T>(json).Member` | `Sql.JsonValue<TValue>(json, path)` |
| Read an object or array | `Sql.Json<T>(json).Member` | `Sql.JsonQuery<TValue>(json[, path])` |
| Array length | `Sql.Json<T>(json).Items.Count` | `Sql.JsonArrayLength(json[, path])` |
| Scalar array membership | `Sql.Json<T>(json).Items.Contains(value)` | `Sql.JsonArrayContains(json[, path], value)` |
| Array indexing | `Sql.Json<T>(json).Items[index]` | Include `[index]` in the path |
| Validate JSON | - | `Sql.IsJson(json)` |
| Test whether a path exists | - | `Sql.JsonExists(json, path)` |
| Read a JSON value's type | - | `Sql.JsonType(json[, path])` |
| Document containment | - | `Sql.JsonContains(json, candidate[, path])` |

A few of these are worth calling out:

```csharp
// Count rows holding valid JSON
var validRows = db.Count<OrderEvent>(x => Sql.IsJson(x.Data) == true);

// Rows where a path exists - a present JSON null still counts
var withTags = db.Select(db.From<OrderEvent>()
    .Where(x => Sql.JsonExists(x.Data, "$.Tags")));

// A normalized JsonValueType, whatever the database calls it
var type = db.Scalar<JsonValueType?>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x => Sql.JsonType(x.Data, "$.Customer.Address")));
// JsonValueType.Object

// PostgreSQL & MySQL: does the document contain this partial document?
var candidate = new { Customer = new { Address = new { shipping_state = "WA" } } };
var matching = db.Select(db.From<OrderEvent>()
    .Where(x => Sql.JsonContains(x.Data, candidate)));
```

### `null` and missing aren't the same thing

Most JSON wrappers blur JSON `null`, a missing property and SQL `NULL` together. OrmLite keeps them
distinguishable wherever the databases allow it: `Sql.JsonExists()` is `true` for a present JSON `null` and
`false` for a missing path, while `Sql.JsonType()` returns `JsonValueType.Null` for JSON `null` and C# `null`
for a missing path. Together they let an application tell "explicitly cleared" apart from "never set".

## Safe and predictable by construction

- **Values are parameters.** Query values and containment candidates are sent as database parameters, never
  concatenated into SQL. JSON paths are emitted as escaped string literals for the selected dialect.
- **Unsupported means an exception, not a surprise.** Operations a database can't express faithfully throw
  `NotSupportedException` while the expression is being built, rather than emitting SQL that quietly means
  something else.
- **It's still just a `SqlExpression<T>`.** JSON expressions compose with every other OrmLite filter,
  projection and ordering, work with the async APIs, and expose their SQL for inspection:

```csharp
var sql = q.ToSelectStatement();
var parameters = q.Params;

var results = await db.SelectAsync(q);
```

Inspecting the generated SQL is also the best way to decide when a frequently queried JSON property deserves
a generated column or JSON index in your database.

<json-support></json-support>

## Native Upsert APIs

OrmLite's new `Upsert` APIs express the insert-or-update workflow directly. When the Primary Key is new the
row is inserted; when it already exists the row is updated:

```csharp
var customer = new Customer {
    Id = 1,
    Name = "Initial Name",
    Email = "initial@example.org",
};

db.Upsert(customer); // Inserts Id=1

customer.Name = "Updated Name";
db.Upsert(customer); // Updates Id=1
```

On SQLite, PostgreSQL, SQL Server and MySQL/MariaDB this compiles to each database's **native
single-statement conflict handling**. There's no separate existence query as with `Save()`, and no race
window between checking for a row and writing it. Whether a message is delivered once or three times, or a
job succeeds on its first attempt or its fifth, the table converges on the same state.

<upsert-compare></upsert-compare>

| Database | Generated operation |
| --- | --- |
| SQLite | `INSERT ... ON CONFLICT (PrimaryKey) DO UPDATE` |
| PostgreSQL | `INSERT ... ON CONFLICT (PrimaryKey) DO UPDATE` |
| SQL Server | `MERGE ... WITH (HOLDLOCK)` matching the Primary Key |
| MySQL / MariaDB | `INSERT ... ON DUPLICATE KEY UPDATE` |

Other providers fall back to `Save()`-style behavior with the same semantics, using an existence check
followed by an `INSERT` or `UPDATE`.

### Update only the fields you own

Real rows often have fields owned by different parts of an application. A typed `updateOnly` expression
restricts which fields change when the row already exists - while a new row still gets every insertable field:

```csharp
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    [IgnoreOnUpdate]
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}

db.Upsert(customer,
    updateOnly: x => new { x.Name, x.Email });
```

That makes it safe to submit a complete Data Model from a sync job without clobbering columns maintained
elsewhere. Primary Key and RowVersion fields can never be updated, and `[IgnoreOnUpdate]` properties like
`CreatedDate` stay excluded from updates - so the original creation time survives every subsequent upsert.

When the field set is chosen at runtime, use the string field-name overload:

```csharp
var fields = includeEmail
    ? new[] { nameof(Customer.Name), nameof(Customer.Email) }
    : new[] { nameof(Customer.Name) };

db.Upsert(customer, updateOnly: fields);
```

### Batches, async and auto-increment keys

`UpsertAll` inserts new rows and updates existing ones together **in a transaction**, and accepts the same
`updateOnly` options:

```csharp
db.UpsertAll(customers);

db.UpsertAll(customers,
    updateOnly: x => new { x.Name, x.Email });
```

Every single-row, batch, typed-field and runtime-field API has an async equivalent with optional
`CancellationToken` support:

```csharp
await db.UpsertAsync(customer, token: cancellationToken);

await db.UpsertAllAsync(customers,
    updateOnly: x => new { x.Name, x.Email },
    token: cancellationToken);
```

Auto-increment models work too. An `[AutoIncrement]` Primary Key with its default value inserts a new row and
populates the generated ID, and subsequent calls use that ID as the conflict key:

```csharp
var customer = new Customer { Name = "New Customer", Email = "new@example.org" };

db.Upsert(customer);      // Inserts and populates customer.Id

customer.Name = "Updated Customer";
db.Upsert(customer);      // Updates the same row
```

:::info
MySQL and MariaDB's `ON DUPLICATE KEY UPDATE` can also be triggered by a secondary `UNIQUE` constraint. Apps
that require strict Primary-Key-only matching can set `MySqlDialect.Instance.UseNativeUpsert = false` to use
OrmLite's existence-check fallback instead.
:::

<write-chooser></write-chooser>

## Better together

The two features fit naturally in the kind of code that motivated them. An event consumer can upsert
document-shaped payloads idempotently, and the rest of the application can query inside them with typed,
portable expressions:

```csharp
// Idempotent: replaying the same events converges on the same rows
await db.UpsertAllAsync(events.Map(e => new OrderEvent {
    Id = e.Id,
    Document = e.Order,
}), token: token);

// Typed queries inside the stored documents, on any supported database
var toShip = await db.SelectAsync(db.From<OrderEvent>()
    .Where(x =>
        Sql.Json(x.Document).Tags.Contains("paid") &&
        Sql.Json(x.Document).Lines.Count > 0));
```

## Get Started

JSON queries and Upsert are available in **ServiceStack v10.2** - upgrade your `ServiceStack.OrmLite.*`
packages and both are ready to use on SQLite, PostgreSQL, SQL Server and MySQL/MariaDB, with nothing new to
install or configure.

See the docs for the complete reference:

- [OrmLite JSON Support](https://docs.servicestack.net/ormlite/json) - supported operations, typed
  projections, dynamic paths, null semantics and database-specific capabilities
- [OrmLite Upsert](https://docs.servicestack.net/ormlite/upsert) - batch and async APIs, auto-increment keys,
  selective updates and choosing between `Upsert`, `Save`, `Insert` and `Update`
- [v10.2 Release Notes](https://docs.servicestack.net/releases/v10_02) - everything else in this release
