---
title: Query JSON like any other property in OrmLite
summary: ServiceStack v10.4 lets typed OrmLite queries read straight into complex type properties with x.Address.City or x.Lines.Any(...), using the native JSON functions of SQLite, PostgreSQL, SQL Server and MySQL, plus a complete tour of everything else OrmLite can do with JSON
tags: [servicestack, ormlite, json]
author: Demis
image: ./img/posts/ormlite-json/bg.webp
---

JSON columns are the pragmatic answer to data that doesn't fit neatly into columns: a customer's addresses and tags, an order's lines, an event's payload, settings that differ by tenant. Every database can now store them and query inside them. The catch is that every database does it  differently. SQLite has `json_extract()`, PostgreSQL has `jsonb_path_query_first()`, SQL Server has `JSON_VALUE()` and MySQL has `JSON_EXTRACT()`, each with its own path syntax and its own rules for nulls, so a JSON query becomes the one place your App stops being portable and typed.

OrmLite has been closing that gap one release at a time. v10.2 added `Sql.Json<T>()` for querying JSON in `string` columns, which we covered in [Type-safe JSON access and Upserts](/posts/omlite-json-upsert). **ServiceStack v10.4** takes the last step. When a property is a class or a `List`, OrmLite already stores it as JSON, so there's no longer anything to wrap. You query it like any other property:

```csharp
public class Customer
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public Address Address { get; set; }       // stored as JSON
    public List<string> Tags { get; set; }     // stored as JSON
    public List<OrderLine> Lines { get; set; } // stored as JSON
}

var q = db.From<Customer>()
    .Where(x => x.Address.Country.Code == "UK" && x.Tags.Contains("vip") && x.Lines.Count > 1)
    .OrderBy(x => x.Address.City)
    .Select(x => new { x.Name, City = x.Address.City });
```

That's an ordinary typed query. It compiles, refactors with your model, and runs unchanged on **SQLite**, **PostgreSQL**, **SQL Server** and **MySQL/MariaDB**, each using its own native JSON functions.

## What you can write

| Expression | Queries |
|-|-|
| `x.Address.City == "London"` | A property, at any depth: `x.Address.Country.Code` |
| `x.Tags.Contains("vip")` | Whether a list or array has a value |
| `x.Lines.Count > 1` | How many items a list has, or `Length` of an array |
| `x.Lines[0].Quantity >= 2` | An item of a list by its position |
| `x.Lines.Any(l => l.Sku == "A-1" && l.Quantity > 1)` | Whether a list has an item matching a condition |
| `x.Lines.All(l => l.Shipped)` | Whether every item matches a condition |
| `x.Lines.Count(l => l.Quantity > 10) >= 2` | How many items match a condition |

They work wherever a typed expression does, so you can filter, sort, select, count, update and delete by what's inside a JSON property, including on joined tables:

```csharp
db.Count<Customer>(x => x.Address.City == "London");
db.UpdateOnly(() => new Customer { Name = "Londoner" }, where: x => x.Address.City == "London");
db.Delete<Customer>(x => x.Lines.Count == 0);

var q = db.From<Customer>()
    .Join<Order>((c, o) => c.Id == o.CustomerId)
    .Where<Customer, Order>((c, o) => o.Source.Channel == "web" && c.Tags.Contains("vip"));
```

Values are always sent as db params, so they're safe to take from user input, and the queries work in compiled queries and [connection filters](/posts/ormlite-multitenancy) too.

### Conditions on the items of a list

`x.Lines[0]` can only look at one item, and `x.Lines[0].Sku == sku && x.Lines[1].Quantity > 1` could be matching two different lines. `Any()`, `All()` and `Count()` check each item against a condition, so the *same* item has to match all of it. Conditions can use every property of the item, the text functions of its properties, lists of values, and even the row's own columns:

```csharp
// The same item has the Sku and the Quantity, unlike x.Lines[0]
db.Select<Customer>(x => x.Lines.Any(l => l.Sku == sku && l.Quantity > 1));

db.Select<Customer>(x => x.Lines.Any(l => !l.Shipped && l.Quantity >= x.MinQuantity)); // the row's columns
db.Select<Customer>(x => x.Tags.Any(t => t.StartsWith("vip")));                      // lists of values
db.Select<Customer>(x => x.Lines.Count(l => l.Quantity > 10) >= 2);
```

They're a subquery over the list's items, `EXISTS (SELECT 1 FROM ... WHERE ...)`, using `json_each()` in SQLite, `jsonb_path_query()` in PostgreSQL, `OPENJSON()` in SQL Server and `JSON_TABLE()` in MySQL 8.0.4+ and MariaDB 10.6+.

Rows without the list, or with an empty one, have no items, so `All()` matches them and `Any()` doesn't.

### PostgreSQL arrays too

PostgreSQL stores `string[]`, `int[]` and `long[]` in its own array types like `text[]` rather than JSON. They're queried the same way as lists, with PostgreSQL's array functions:

```csharp
db.Select<Article>(x => x.Tags.Contains("vip"));              // :0 = ANY("tags")
db.Select<Article>(x => x.Tags.Length > 2);                   // cardinality("tags") > :0
db.Select<Article>(x => x.Tags.Any(t => t.StartsWith("v")));  // EXISTS (SELECT 1 FROM unnest("tags") ...)
db.Select<Article>(x => x.Scores.Count(s => s >= 90) >= 2);
```

### Complex types need to be stored as JSON

To query a property, OrmLite needs to have saved it as JSON, as an RDBMS's JSON functions can't read any other format.

That's the default for dialects configured with `AddOrmLite()`, and can be enabled on others:

```csharp
// The default of dialects configured with AddOrmLite()
services.AddOrmLite(options => options.UsePostgres(connectionString));

// Or set on a dialect provider
PostgreSqlDialect.Provider.UseJson = true;
```

Querying a complex property on a dialect that doesn't store JSON throws a `NotSupportedException` that says how to enable it, rather than silently returning nothing. If you're switching an existing App to `UseJson`, note that it changes how complex types are saved, so rows saved as JSV need to be converted to JSON before they can be queried.

## JSON in string columns

Sometimes the JSON isn't a property of your model. It's an event body, an integration response or an
audit snapshot that your App stores as text. A `string` has no properties to query, so `Sql.Json<T>()` says what the document in it looks like, with a C# Data Model:

```csharp
public class OrderEvent
{
    public long Id { get; set; }
    public string Data { get; set; }            // JSON of an OrderDocument
    public OrderDocument Document { get; set; } // A complex property, also stored as JSON
}

var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.Json<OrderDocument>(x.Data).Customer.Address.State == "WA" &&
        Sql.Json<OrderDocument>(x.Data).Tags.Contains("priority") &&
        Sql.Json<OrderDocument>(x.Data).Lines[0].Quantity > 1);
```

Nested member access becomes a nested JSON path, array indexes become zero-based JSON array indexes (constants or captured values), `[DataMember(Name = "shipping_state")]` is honored, and operations on an extracted scalar like `.State.Length == 2` continue through OrmLite's normal expression translation.

Selecting a scalar member extracts its C# value, and selecting an object or collection returns a JSON fragment that OrmLite deserializes into your Data Model:

```csharp
var q = db.From<OrderEvent>()
    .Select(x => new {
        x.Id,
        State = Sql.Json<OrderDocument>(x.Data).Customer.Address.State,
        Total = Sql.Json<OrderDocument>(x.Data).Total,
        Address = Sql.Json<OrderDocument>(x.Data).Customer.Address,
    });

var summaries = db.Select<OrderSummary>(q);

// Or a single typed fragment
var address = db.Scalar<Address>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x => Sql.Json<OrderDocument>(x.Data).Customer.Address));
```

| JSON is in | Use |
|-|-|
| A complex type property, on a dialect with `UseJson` | The property: `x.Address.City` |
| A `string` column | `Sql.Json<T>(x.Data)` with the type of its document |
| A complex type property, on a dialect without `UseJson` | `Sql.Json(x.Address)` |
| A property with the type of a table the query joins | `Sql.Json(x.Customer)` |

The last row is a subtle one. In a query that joins `Customer`, OrmLite has always resolved `x.Customer.Name` to the `Name` column of the joined table. If the property is *also* stored as JSON, e.g. a copy of the customer as they were when an invoice was created, use `Sql.Json(x.Customer).Name` to query the copy instead of the table.

## Explicit paths for everything else

Some JSON questions don't have a C# Data Model. The document may have no fixed shape, the path may only be known at runtime, or you may want to ask something about the JSON itself rather than its values. For those there's an explicit SQL/JSON path API. Paths begin with `$` and use the portable subset every database supports: members, quoted members and zero-based array indexes, e.g. `$.Customer.Address.shipping_state` or `$.Lines[0].Quantity`.

```csharp
var statePath = "$.Customer.Address.shipping_state"; // chosen at runtime

var q = db.From<OrderEvent>()
    .Where(x =>
        Sql.JsonValue<string>(x.Data, statePath) == "WA" &&
        Sql.JsonExists(x.Data, "$.Tags[0]"))
    .OrderByDescending(x => Sql.JsonValue<decimal?>(x.Data, "$.Total"));
```

Query values are db params, and paths are emitted as escaped SQL string literals for the dialect. The full set is:

| Task | Typed expression | Explicit path API |
| --- | --- | --- |
| Read scalar | `Sql.Json<T>(json).Member` | `Sql.JsonValue<TValue>(json, path)` |
| Read object or array | `Sql.Json<T>(json).Member` | `Sql.JsonQuery<TValue>(json[, path])` |
| Array length | `Sql.Json<T>(json).Items.Count` | `Sql.JsonArrayLength(json[, path])` |
| Scalar array membership | `Sql.Json<T>(json).Items.Contains(value)` | `Sql.JsonArrayContains(json[, path], value)` |
| Array indexing | `Sql.Json<T>(json).Items[index]` | Include `[index]` in the path |
| Validate JSON | - | `Sql.IsJson(json)` |
| Path exists | - | `Sql.JsonExists(json, path)` |
| Read JSON type | - | `Sql.JsonType(json[, path])` |
| Document containment | - | `Sql.JsonContains(json, candidate[, path])` |

### Missing, null and absent

JSON has a distinction most SQL doesn't: a property can be missing, present with a `null` value, or present with a value. The portable API keeps all three distinguishable where the databases allow it, with `JsonExists()` telling you whether the path exists at all and `JsonType()` returning a normalized `JsonValueType` (`Null`, `String`, `Number`, `Boolean`, `Array` or `Object`) independent of each database's native type names:

| Expression | JSON `null` | Missing path | Object or array |
| --- | --- | --- | --- |
| `JsonExists()` | `true` | `false` | `true` |
| `JsonType()` | `JsonValueType.Null` | `null` | `Object` or `Array` |
| `JsonValue<T>()` | SQL `NULL` | SQL `NULL` | SQL `NULL` |
| `JsonQuery<T>()` | SQL `NULL` | SQL `NULL` | JSON fragment |
| `JsonArrayLength()` | SQL `NULL` | SQL `NULL` | Count for arrays; `NULL` for objects |

Use them together to tell a property that was never set from one that was explicitly cleared:

```csharp
// true when the first element exists, even when it is JSON null
Sql.JsonExists(x.Data, "$.NullableTags[0]")

var type = db.Scalar<JsonValueType?>(db.From<OrderEvent>()
    .Where(x => x.Id == id)
    .Select(x => Sql.JsonType(x.Data, "$.Customer.Address"))); // JsonValueType.Object
```

### Validate and contain

`Sql.IsJson()` tests whether a string holds a valid JSON value, which is useful for finding bad rows before they break a query:

```csharp
var validJsonRows = db.Count<OrderEvent>(x => Sql.IsJson(x.Data) == true);
```

Extraction functions can report an RDBMS error given malformed JSON, and a database is free to evaluate predicates in any order, so don't rely on `IsJson(...) && ...` to protect another JSON operation. Validate JSON when it's written, or use a database constraint.

On PostgreSQL and MySQL, `Sql.JsonContains()` tests whether a document contains a partial document, with the candidate sent as a db param:

```csharp
var candidate = new {
    Customer = new { Address = new { shipping_state = "WA" } }
};

var q = db.From<OrderEvent>()
    .Where(x => Sql.JsonContains(x.Data, candidate));

var requiredTags = new[] { "priority" };
var tagged = db.From<OrderEvent>().Where(x => Sql.JsonContains(x.Data, requiredTags, "$.Tags"));
```

SQLite and SQL Server throw `NotSupportedException`, as they have no equivalent operation with the same semantics.

## One query, four databases

Each API is translated to the native functions of the configured database:

| Operation | SQLite | PostgreSQL | SQL Server | MySQL |
| --- | --- | --- | --- | --- |
| Validate | `json_valid` | `IS JSON` | `ISJSON` | `JSON_VALID` |
| Scalar value | `json_extract` | `jsonb_path_query_first` | `JSON_VALUE` | `JSON_EXTRACT` |
| Object/array | `json_extract` | `jsonb_path_query_first` | `JSON_QUERY` | `JSON_EXTRACT` |
| Exists | `json_type` | `jsonb_path_exists` | `JSON_PATH_EXISTS` | `JSON_CONTAINS_PATH` |
| Type | `json_type` | `jsonb_typeof` | `OPENJSON` | `JSON_TYPE` |
| Array length | `json_array_length` | `jsonb_array_length` | `OPENJSON` | `JSON_LENGTH` |
| Array membership | `json_each` | `jsonb` containment | `OPENJSON` | `JSON_CONTAINS` |
| Document containment | - | `@>` | - | `JSON_CONTAINS` |

SQL Server 2016-2019 can use `JsonValue()`, `JsonQuery()`, `JsonType()`, `JsonArrayLength()` and `JsonArrayContains()`.
Use `SqlServer2022Dialect.Provider` when you need the complete API, including `JsonExists()`.

You can always see what was generated. JSON expressions are normal `SqlExpression<T>` queries, so `ToSelectStatement()` and `Params` show the SQL and its parameters, and they work with the async APIs too.

## Keeping JSON queries fast

A query of a JSON property reads the JSON of every row, which is fine until the table gets large. When a property is queried often, e.g. to find customers by `x.Address.City`, store it in a column of its own and index it with `[Index]`.
That works the same way on every database:

```csharp
public class Customer
{
    [Index]
    public string City { get; set; }
    public Address Address { get; set; }
}
```

SQLite and PostgreSQL can also index the expression a query reads the property with. Copy the expression from the SQL of the query, as it has to match exactly, and create the index in a migration:

```csharp
var q = db.From<Customer>().Where(x => x.Address.City == "London");
var sql = q.ToSelectStatement();
// ... WHERE (CASE WHEN json_type("Address", '$.City') NOT IN ('object','array','null')
//           THEN json_extract("Address", '$.City') END = @0)

Db.ExecuteSql("""
    CREATE INDEX ix_customer_city ON "Customer" ((CASE WHEN json_type("Address", '$.City')
        NOT IN ('object','array','null') THEN json_extract("Address", '$.City') END))
    """);
```

Check the index is used with `EXPLAIN QUERY PLAN` on SQLite or `EXPLAIN` on PostgreSQL, and check it again after upgrading OrmLite, as it's only used while the query's SQL stays the same. SQL Server and MySQL can only index an expression through a computed or generated column, so a column of its own is the better choice for them. The new
`db.Explain()` and the Slowest Queries view in the Admin UI help find the queries worth indexing.

## Get Started

Querying complex type properties is available in **ServiceStack v10.4**, and works on every dialect configured with `AddOrmLite()`. Upgrade your `ServiceStack.OrmLite.*` packages and remove the `Sql.Json()` wrappers around your complex properties, if you have any.

See the docs for the complete reference:

- [OrmLite JSON Support](https://docs.servicestack.net/ormlite/json) - complex type queries, `Sql.Json<T>()`,
  explicit paths, validation, containment and indexing
- [Type-safe JSON access and Upserts](/posts/omlite-json-upsert) - the v10.2 introduction to `Sql.Json<T>()`
- [v10.4 Release Notes](https://docs.servicestack.net/releases/v10_04) - everything else in this release
