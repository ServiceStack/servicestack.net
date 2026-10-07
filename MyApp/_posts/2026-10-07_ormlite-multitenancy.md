---
title: Multitenancy that can't be forgotten
summary: ServiceStack v10.4 moves tenant isolation from every query to the database connection, with OrmLite connection filters and write rules that confine selects, updates, deletes, inserts and AutoQuery APIs to the request's tenant, fail closed until it's known, and record trusted audit columns on every write
tags: [servicestack, ormlite, autoquery]
author: Demis
image: ./img/posts/ormlite-multitenancy/bg.webp
---

Multi-tenant Apps live and die by one rule: every query needs to include the tenant. It only takes one forgotten
`Where()`, or one `SingleById()`, for a customer to see another customer's data, and nothing fails when it happens.
The query runs, the page renders and the tests pass, as they only ever had one tenant's data to look at.

:::youtube 86ff8gs4h3w
Multi-Tenant .NET Apps: Enforce Tenant Isolation on the Connection, Not Every Query
:::

Code reviews and conventions reduce that risk, but every new query, AutoQuery API and background job adds to it.
The [Next SaaS](/posts/next-saas) template we released last week had exactly this pattern throughout, a hand-written
tenant condition in every query for customer data:

```csharp
var widget = Db.Single<Widget>(x =>
    x.Id == request.Id &&
    x.WorkspaceId == context.Workspace.Id)
    ?? throw new HttpError(404, "WidgetNotFound", "The widget was not found.");
```

**ServiceStack v10.4** moves that responsibility from each query to the database connection. OrmLite's new
**connection filters** and **write rules** are defined once, then enforced on everything the connection does:

| | What you get |
|-|-|
| **Isolation by default** | Every select, update and delete only reaches the tenant's rows, including lookups by id, joins and AutoQuery |
| **Fails closed** | A request that hasn't resolved its tenant throws instead of returning every tenant's rows |
| **Less code** | Queries and inserts no longer mention the tenant, and can't get it wrong |
| **Audit columns you can trust** | Who changed a row and when is recorded on every write, and can't be set by mistake |
| **A reviewable opt-out** | Working across tenants is one explicit call you can search for |
| **No rewrite** | Existing Services and AutoQuery APIs don't change. It's one extension method and one AppHost filter |

With it, the query above is just the query:

```csharp
var widget = Db.SingleById<Widget>(request.Id)  // null if it's another organization's widget
    ?? throw new HttpError(404, "WidgetNotFound", "The widget was not found.");
```

## Mark the tables a tenant owns

Tenant-owned tables are marked with an interface, so a single rule covers all of them, including tables you add
later:

```csharp
public interface IHasTenantId
{
    int TenantId { get; }
}

public class Order : IHasTenantId, IAudit
{
    [AutoIncrement]
    public int Id { get; set; }
    public int TenantId { get; set; }
    public int CustomerId { get; set; }
    public decimal Total { get; set; }
    public bool IsDeleted { get; set; }

    // IAudit
    public string CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public string ModifiedBy { get; set; }
    public DateTime ModifiedDate { get; set; }
}
```

Every table is then either owned by a tenant, with a required tenant column, or it isn't, like shared lookup
tables of plans and countries, or tables the platform runs itself like a webhook inbox.

## Define your rules once

Your App's rules are declared once in a `FilterSet`, which reads its values from a scope that each connection
provides:

```csharp
public record TenantUser(int TenantId, string UserId);

public static readonly FilterSet<TenantUser> UserRules = FilterSet.Create<TenantUser>(f => {
    // The tenant's rows are the only rows it can read or change, and the rows it writes are the tenant's
    f.Ensure<IHasTenantId>(x => x.TenantId, s => s.TenantId);

    // Record who changed a row and when
    f.OnInsert<IAudit>(x => x.CreatedBy, s => s.UserId);
    f.OnInsert<IAudit>(x => x.CreatedDate, _ => DateTime.UtcNow);
    f.OnWrite<IAudit>(x => x.ModifiedBy, s => s.UserId);
    f.OnWrite<IAudit>(x => x.ModifiedDate, _ => DateTime.UtcNow);
});

public static IDbConnection ForUser(this IDbConnection db, int tenantId, string userId) =>
    db.UseFilters(UserRules.For(new TenantUser(tenantId, userId)));
```

The scope is typed, so using a set with the wrong scope doesn't compile. Rules can only read values from the scope,
so a set behaves the same for every connection that uses it.

There are 3 kinds of rules:

| Rule | What it does |
|-|-|
| `Filter` | Restricts the rows a connection can read, update and delete |
| `OnInsert`, `OnUpdate`, `OnWrite` | Set a column on every row a connection writes |
| `Ensure` | Both: filters to a value, and writes rows with it |

`Ensure` guards both sides. Without the filter, an update could move another tenant's row into the connection's
tenant, and without the write rule, an insert could be written for another tenant.

## One filter covers your whole App

ServiceStack opens the connections used by `Db` in your Services, AutoQuery, AutoQuery CRUD and the API Keys
feature for the current request. The new `DbConnectionRequestFilters` in your AppHost configure every one of them,
so your rules are registered in one place:

```csharp
public override void Configure()
{
    DbConnectionRequestFilters.Add((db, req) => {
        var userId = req.GetUserId(); // the signed in user, or the user of an API Key
        if (userId != null)
            db.ForUser(GetTenantId(userId), userId); // GetTenantId() is defined by your App
    });
}
```

A filter can also refuse the request, e.g. by throwing an `HttpError` for a user that can't access the tenant
it's for. The connection is disposed for you and the error is returned to the client.

That's the whole integration. Your existing Services and AutoQuery APIs don't change:

```csharp
public class QueryOrders : QueryDb<Order> { }

public class OrderServices : Service
{
    public object Get(GetOrder request) =>
        Db.SingleById<Order>(request.Id)   // null if it's another tenant's order
        ?? throw HttpError.NotFound("Order not found");
}
```

Return `404` for a row that isn't found rather than `403`, as saying a row exists in another tenant leaks
information.

## Isolation that doesn't depend on each query

Your code is written as if the tenant's rows were the only rows in the table:

<generated-sql>

```csharp
var order = db.SingleById<Order>(1);
```

```sql
SELECT "Id", "TenantId", "CustomerId", "Total", "IsDeleted", "CreatedBy", "CreatedDate", "ModifiedBy", "ModifiedDate"
FROM "Order"
WHERE ("Order"."TenantId" = @_f0) AND ("Id" = @Id)
-- @Id = 1, @_f0 = 1
```

</generated-sql>

Filters are mandatory conditions that other conditions can narrow but never widen. An `Or()` is wrapped inside the
filter, so a client can't escape it with the conditions it sends to an AutoQuery API:

<generated-sql>

```csharp
var q = db.From<Order>().Where(x => x.Total > 100).Or(x => x.CustomerId == 1);
var orders = db.Select(q);
```

```sql
SELECT "Id", "TenantId", "CustomerId", "Total", "IsDeleted", "CreatedBy", "CreatedDate", "ModifiedBy", "ModifiedDate"
FROM "Order"
WHERE ("Order"."TenantId" = @0) AND (("Total" > @1) OR ("CustomerId" = @2))
-- @0 = 1, @1 = 100, @2 = 1
```

</generated-sql>

They apply wherever OrmLite creates the SQL: joined tables, sub queries, SQL fragments, referenced rows loaded with
`LoadSelect()`, and updates and deletes, so a connection can't change rows it can't see:

<generated-sql>

```csharp
db.UpdateOnly(() => new Order { Total = 200 }, where: x => x.Id == 1);
db.DeleteById<Order>(99);
```

```sql
UPDATE "Order" SET "Total"=@Total WHERE ("Order"."TenantId" = @0) AND (("Id" = @1))
-- @0 = 1, @1 = 1, @Total = 200

DELETE FROM "Order" WHERE "Id" = @0 AND ("Order"."TenantId" = @_f0)
-- @0 = 99, @_f0 = 1
```

</generated-sql>

Another tenant's rows are treated as if they don't exist: updates and deletes affect 0 rows, and `Save` and `Upsert`
try to insert them, which fails on the primary key instead of overwriting the row.

### Writes are protected too

Inserts get the connection's tenant, and writing a row for another tenant throws instead of quietly succeeding,
as it's a bug in your App:

```csharp
db.Insert(new Order { CustomerId = 1, Total = 100 }); // inserted with the connection's TenantId

// InvalidOperationException: Order.TenantId must be '1' on this connection
db.Insert(new Order { TenantId = 2, CustomerId = 1, Total = 100 });

// Rows can't be moved to another tenant either
db.UpdateOnly(() => new Order { TenantId = 2 }, where: x => x.Id == 1);
```

### Faster than writing the condition yourself

Each filter's SQL is generated once and reused by every connection, which only adds the scope's values as db
params, so a filtered query is quicker to create than one with the same condition written in it.

Conditions that only read the scope are decided before the SQL is generated, so each case gets its own SQL. With
this filter an admin's queries don't have a tenant condition at all, and everyone else's only have
`"TenantId" = @0`:

```csharp
public static readonly FilterSet<UserAccess> AccessFilters = FilterSet.Create<UserAccess>(f =>
    f.Filter<IHasTenantId>((x, s) => s.IsAdmin || x.TenantId == s.TenantId));
```

## Fails closed

Confining a connection when it's opened needs the tenant to be known then. Often it isn't. Working out which tenant a
request is for usually needs the database, e.g. to look up the user's membership, and a connection that's left
unconfined until then is one where a forgotten check returns every tenant's rows.

Rules read their scope for each statement, so a connection can refuse to touch tenant data until the request's tenant
is resolved:

```csharp
public class TenantScope
{
    public int? TenantId { get; set; }

    public int AssertTenantId() => TenantId
        ?? throw new InvalidOperationException("Resolve the request's tenant before using tables owned by a tenant.");
}

public static readonly FilterSet<TenantScope> TenantFilters = FilterSet.Create<TenantScope>(f =>
    f.Ensure<IHasTenantId>(x => x.TenantId, s => s.AssertTenantId()));

public static IDbConnection ForTenant(this IDbConnection db, TenantScope scope) =>
    db.UseFilters(TenantFilters.For(scope));

// Confine a connection to a tenant that's already known, e.g. in a background job
public static IDbConnection ForTenant(this IDbConnection db, int tenantId) =>
    db.ForTenant(new TenantScope { TenantId = tenantId });
```

| When | Tenant-owned tables |
|-|-|
| Before the tenant is resolved | Any query or write throws |
| After it's resolved | Confined to the tenant |

Keeping the scope in `IRequest.Items` means every connection the request opens shares it, including the one
AutoQuery opens:

```csharp
public static TenantScope GetTenantScope(this IRequest req)
{
    if (req.Items.TryGetValue(nameof(TenantScope), out var existing) && existing is TenantScope scope)
        return scope;
    req.Items[nameof(TenantScope)] = scope = new TenantScope();
    return scope;
}
```

When users can belong to more than one tenant, APIs can say which tenant they're for in their
Request DTO, so users can work in different tenants in different browser tabs. The first connection the request
opens checks the user is a member before resolving the scope:

```csharp
public interface IRequireTenant
{
    int TenantId { get; set; }
}

public class QueryOrders : QueryDb<Order>, IRequireTenant
{
    public int TenantId { get; set; }
}

DbConnectionRequestFilters.Add((db, req) =>
{
    var scope = req.GetTenantScope();
    db.ForTenant(scope);

    if (req.Dto is IRequireTenant requireTenant && scope.TenantId == null)
    {
        // Whether the user is a member isn't known yet, so it's looked up across tenants
        var userId = req.GetUserId();
        if (!db.WithoutFilters().Exists<TenantMember>(x => x.TenantId == requireTenant.TenantId && x.UserId == userId))
            throw HttpError.Forbidden("You do not have access to this tenant");

        scope.TenantId = requireTenant.TenantId;
    }
});
```

An API that uses a tenant-owned table and forgets `IRequireTenant` then fails on its first request in development,
instead of returning another tenant's data in production.

## Audit columns you can trust

Write rules set columns on every row a connection writes. They replace any value from your App, and add themselves
to updates of only some columns:

<generated-sql>

```csharp
db.UpdateOnly(() => new Order { Total = 120 }, where: x => x.Id == 1);
```

```sql
UPDATE "Order" SET "Total"=@Total, "ModifiedBy"=@ModifiedBy, "ModifiedDate"=@ModifiedDate
WHERE ("Order"."TenantId" = @0) AND (("Id" = @1))
-- @0 = 1, @1 = 1, @Total = 120, @ModifiedBy = 'alice', @ModifiedDate = '2026-10-01 09:30:00'
```

</generated-sql>

They apply to every insert and update API, including `BulkInsert`, `UpdateFrom` and `Upsert`, so there's no write
path where the housekeeping is forgotten. The objects you write are left with the values that were saved, so a new
row can be returned from your API without reading it back:

```csharp
var order = new Order { CustomerId = 1, Total = 100 };
db.Insert(order);

order.TenantId;  // 1
order.CreatedBy; // alice
```

## Soft deletes, and anything else every query needs

The same APIs enforce any condition that every query needs. A `Filter` restricts the rows a connection sees without
changing what it writes, and combines with your other filters:

<generated-sql>

```csharp
public static readonly FilterSet SoftDeletes = FilterSet.Create(f =>
    f.Filter<Order>(x => !x.IsDeleted));

db.ForUser(tenantId, userId).UseFilters(SoftDeletes);

var orders = db.Select<Order>(x => x.Total > 100);
```

```sql
SELECT "Id", "TenantId", "CustomerId", "Total", "IsDeleted", "CreatedBy", "CreatedDate", "ModifiedBy", "ModifiedDate"
FROM "Order"
WHERE "Order"."IsDeleted"=0 AND ("Order"."TenantId" = @0) AND (("Total" > @1))
-- @0 = 1, @1 = 100
```

</generated-sql>

A row is soft deleted with an update, after which the connection can no longer see or change it:

```csharp
db.UpdateOnly(() => new Order { IsDeleted = true }, where: x => x.Id == id);

db.SingleById<Order>(id); // null
```

## An opt-out you can review

Some code legitimately works across tenants: finding which tenants a user belongs to, a check that must be unique
across tenants, admin tasks and reports. `WithoutFilters()` returns the same connection and transaction without its
filters and rules:

```csharp
var allOrders = db.WithoutFilters().Select<Order>(x => x.Total > 100);

// Is the address taken by any tenant?
var taken = db.WithoutFilters().Exists<Tenant>(x => x.Slug == slug);
```

It's the only way to opt-out, as filters can't be removed from a connection or ignored in a query. That makes tenant
isolation auditable: searching your code base for one method finds every place it's bypassed. Wrap it in a method
of your own and limit which files can call it, e.g. with a test, so each new use is reviewed.

The connection it returns can use filter sets of its own, so you can drop the tenant filter and keep the rest, e.g.
an admin connection that sees every tenant and still records who is writing:

```csharp
public static IDbConnection AcrossTenants(this IDbConnection db, string userId) =>
    db.WithoutFilters().UseFilters(AuditRules.For(userId));
```

For platform APIs that act on a single customer, confine the request to that customer instead of opting out, so
the rest of the API can't reach anyone else's rows:

```csharp
public object Any(GetCustomer request)
{
    RequireAdmin();
    Request.GetTenantScope().TenantId = request.TenantId; // every query below is for this customer
    //...
}
```

## Background jobs

A connection a job opens itself isn't confined. Put the tenant in the job's request and confine its connection
before it reads anything, so an id for another tenant's row is treated as if it doesn't exist:

```csharp
public class DeleteFile
{
    public int TenantId { get; set; }
    public int FileId { get; set; }
}

using var db = dbFactory.Open().ForTenant(request.TenantId);
var file = db.SingleById<StoredFile>(request.FileId); // null if it isn't this tenant's
```

## API Keys for each tenant

The built-in API Key APIs and UIs now use the request's connection, so a filter on its table confines users to
seeing and managing the API Keys of their own tenant:

```csharp
static readonly FilterSet<string> TenantApiKeys = FilterSet.Create<string>(f =>
    f.Filter<ApiKeysFeature.ApiKey>((x, tenantId) => x.RefIdStr == tenantId));

DbConnectionRequestFilters.Add((db, req) => db.UseFilters(TenantApiKeys.For(GetTenantId(req))));
```

APIs protected with `[ValidateIsAuthenticated]` can also now be called with a user's API Key, by registering API
Keys as an ASP.NET Core Authentication scheme with the new `AddApiKeyAuth()`:

```csharp
services.AddAuthentication().AddApiKeyAuth();
```

Requests with a User API Key are authenticated as the user it belongs to, so a tenant's API Keys call the same
authenticated APIs as its users, through the same confined connections. See
[Allow Authenticated User APIs to API Keys](https://docs.servicestack.net/auth/apikeys#allow-authenticated-user-apis-to-api-keys)
for how to limit what an API Key can call.

## One set of tests for every table

As tenant-owned tables share an interface, one set of tests can cover all of them, including tables added later.
The [Untyped APIs](https://docs.servicestack.net/ormlite/untyped-apis) can now read rows of a table when all you
have is its `Type`, and they apply connection filters like the typed APIs:

```csharp
static readonly Type[] TenantTables = typeof(IHasTenantId).Assembly.GetTypes()
    .Where(x => x.IsClass && !x.IsAbstract && typeof(IHasTenantId).IsAssignableFrom(x))
    .ToArray();

[TestCaseSource(nameof(TenantTables))]
public void A_confined_connection_only_reads_its_tenants_rows(Type table)
{
    using var db = dbFactory.Open().ForTenant(1);
    Assert.That(SelectTenantIds(db, table), Is.EqualTo(new[] { 1 }));
}

static int[] SelectTenantIds(IDbConnection db, Type table) =>
    db.CreateTypedApi(table).Select().Cast<IHasTenantId>().Select(x => x.TenantId).ToArray();
```

Seed two tenants, then assert a confined connection can't select, update or delete the other tenant's rows, that
inserts get its tenant, and that an unresolved connection throws. The same APIs make it easy to export or delete
everything a tenant owns, without listing each table.

## What isn't covered

Filters and rules apply to the typed APIs where OrmLite creates the SQL. A few things are still your App's
responsibility:

| Not covered | What to do |
|-|-|
| Complete SQL statements in `SqlList`, `SqlScalar` and `ExecuteSql` | Include the tenant in the statement. SQL fragments in typed APIs are filtered |
| Connections you open yourself, e.g. `dbFactory.Open()` in a job | Confine them, e.g. with `.ForTenant(tenantId)` |
| Files, caches and other stores | Include the tenant in their keys |
| Authorization | Confinement decides which rows are reachable. Roles and permissions are still checked by your App |

## Used throughout Next SaaS

These features were developed alongside the [Next SaaS](https://react-templates.net/docs/next-saas) template,
which now uses them for everything its organizations own. Besides replacing its hand-written tenant conditions,
it's a working example of what a production SaaS App needs around them:

[![](/img/posts/next-saas/bg.webp)](/posts/next-saas)

- APIs **say which organization they're for** in their Request DTO, so users can work in different organizations in
  different browser tabs
- Requests **fail closed** until the user is checked to be a member of that organization
- Platform operators working on a customer are **confined to that customer**
- **Background jobs** carry their organization and confine their connection
- **Export and deletion** of an organization cover every table it owns, including tables added later
- **API Keys** are bound to an organization, and only call the APIs that allow them
- One set of **isolation tests** runs against every tenant-owned table

Each is explained with its code in the new [Multitenancy Guide](https://docs.servicestack.net/ormlite/multitenancy/guide).

## Get Started

Connection filters and write rules are available in **ServiceStack v10.4** on every database OrmLite supports.
Upgrade your `ServiceStack.*` packages, define a `FilterSet` and register it in a `DbConnectionRequestFilter`.

See the docs for the complete reference:

- [Multitenancy](https://docs.servicestack.net/ormlite/multitenancy/overview) - how to build a shared-database
  multi-tenant App, with a checklist for each table and for your App
- [Multitenancy Guide](https://docs.servicestack.net/ormlite/multitenancy/guide) - how Next SaaS applies each of
  these in a complete SaaS App
- [Connection Filters & Write Rules](https://docs.servicestack.net/ormlite/connection-filters) - every API,
  including soft deletes, conditional filters and state kept with a connection
- [v10.4 Release Notes](https://docs.servicestack.net/releases/v10_04) - everything else in this release
