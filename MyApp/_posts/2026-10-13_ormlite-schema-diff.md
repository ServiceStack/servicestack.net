---
title: Keep your database in sync with your C# models
summary: ServiceStack v10.4 adds Schema Diff to OrmLite, which finds every difference between your C# models and their tables, from columns and types to defaults, indexes, foreign keys and constraints, then writes the migration for you to review, on SQLite, PostgreSQL, SQL Server, MySQL and MariaDB
tags: [servicestack, ormlite, db]
author: Demis
image: ./img/posts/ormlite-schema-diff/bg.webp
---

:::youtube chmFo1TE-Wc
Keep Your Database in Sync With Your C# Models: Schema Diff for .NET
:::

In a code-first App your C# classes are your schema. You add two properties to an `Invoice`, build and deploy:

```csharp
public class Invoice
{
    [AutoIncrement]
    public int Id { get; set; }
    [StringLength(200)]
    public string Reference { get; set; }
    [Index]
    public int CustomerId { get; set; }
    public decimal Total { get; set; }
    public DateTime? PaidDate { get; set; } // new
    public string Currency { get; set; }    // new
}

db.CreateTableIfNotExists<Invoice>(); // the table exists, so it's unchanged
var unpaid = db.Select<Invoice>(x => x.PaidDate == null);
```

But the table was created months ago, and `CreateTableIfNotExists` only creates tables that don't exist. Nothing
tells you the table didn't change with its model, until the first query that uses the new columns fails:

```
SqlException: Invalid column name 'PaidDate'.
Invalid column name 'PaidDate'.
Invalid column name 'Currency'.
```

When that happens in production, it's the first you hear of it.

**ServiceStack v10.4** adds **Schema Diff** to OrmLite: one call that compares your models with their tables, tells
you everything that's different, and writes the migration that fixes it for you to review.

## One call, every difference

```csharp
var diff = db.GetSchemaDiff(typeof(Invoice), typeof(Customer));

if (diff.HasChanges)
    log.LogWarning("The database doesn't match its models:\n{Diff}", diff);
```

```
Invoice
  ~ Reference  VARCHAR(50) NOT NULL -> VARCHAR(200) NULL
  + PaidDate  DATETIME NULL
  + Currency  VARCHAR(8000) NULL (renamed from LegacyCode?)
  - LegacyCode  VARCHAR(8000) NULL (not in Invoice) (renamed to Currency?)
  + index idx_invoice_customerid
Customer
  + table isn't in the database
```

`+` is in your model and not the database, `-` is in the database and not your model, and `~` is in both, but
different. The two new columns, a `Reference` column that's now larger and allows nulls, a column the model no longer
has, a missing index and a missing table, all in one readable report.

It doesn't guess what types your C# maps to. It creates the model's columns in a temporary table and compares them as
your database reports them, so a table created from its model never has false differences, whichever
[type converters](https://docs.servicestack.net/ormlite/type-converters) or naming strategy you use. Common equivalent
types in tables that weren't created by OrmLite, e.g. by Entity Framework, like `TEXT` vs `VARCHAR(n)` or `INTEGER`
vs `BIGINT`, aren't reported either.

## More than columns

Your models already describe far more of your schema than their columns, and this release lets them describe even
more, with attributes for filtered and covering indexes, enum checks and generated columns, instead of SQL you write
by hand:

```csharp
[CompositeIndex(nameof(TenantId), nameof(Status), Include = [nameof(Name), nameof(Size)])]
public class Upload
{
    [AutoIncrement]
    public int Id { get; set; }
    public int TenantId { get; set; }

    [Index(Unique = true, Where = "{DeletedDate} IS NULL")] // unique among rows that aren't deleted
    public string Name { get; set; }

    [CheckEnum]                                              // only allow UploadStatus values
    public UploadStatus Status { get; set; }

    public long Size { get; set; }

    [Compute("{Size} / 1024"), Persisted]                    // calculated by the database
    public long SizeKb { get; set; }

    public DateTime? DeletedDate { get; set; }
}
```

Because it's all in your model, Schema Diff compares all of it. Change a `PurchaseOrder`'s default, make its foreign
key cascade deletes, restrict its `Status` to its enum's values and add a filtered index:

```csharp
public class PurchaseOrder
{
    [AutoIncrement]
    public int Id { get; set; }

    [ForeignKey(typeof(Supplier), OnDelete = "CASCADE")] // was no action
    public int SupplierId { get; set; }

    [CheckEnum]                                          // was any string
    public OrderStatus Status { get; set; }

    [Default(5)]                                         // was Default(1)
    public int Quantity { get; set; }

    public DateTime CreatedDate { get; set; }

    [Index(Where = "{ShippedDate} IS NULL")]             // the unshipped orders
    public DateTime? ShippedDate { get; set; }
}
```

And each one is found:

```
PurchaseOrder
  ~ Quantity  default DEFAULT ((1)) -> DEFAULT ((5))
  ~ foreign key FK_PurchaseOrder_Supplier_SupplierId  (SupplierId) REFERENCES Supplier (Id)
      -> (SupplierId) REFERENCES Supplier (Id) ON DELETE CASCADE
  + constraint CHK__PurchaseOrder_Status  CHECK ("Status" IN ('Pending','Shipped','Delivered'))
  + index idx_purchaseorder_shippeddate
```

Schema Diff compares:

- **Tables and columns**: missing tables, missing and extra columns, and columns of another type, size or nullability
- **Defaults**: a `[Default]` that changed, or a default the property doesn't have
- **Indexes**: by their columns, order, uniqueness, `Include` columns and `Where` condition
- **Foreign keys**: the table they reference and their `OnDelete` and `OnUpdate` actions
- **Constraints**: `[Unique]`, `[UniqueConstraint]`, `[CheckConstraint]` and `[CheckEnum]`
- **Primary keys** with other columns, and **full-text indexes** of [`[FullTextIndex]`](https://docs.servicestack.net/ormlite/full-text-search) models

Databases rewrite conditions, e.g. PostgreSQL writes an `IN` list as `= ANY (ARRAY[...])`, so index conditions, check
constraints and defaults are compared the way your database writes them, not as false differences.

## Built not to lose your data

A diff that's quick to drop the wrong thing is worse than no diff at all, so Schema Diff errs on the side of keeping
your data.

**Likely renames are suggested, never assumed.** A column that's no longer in the model and a new column of the same
type are probably the same column renamed, so the diff says so: `Currency (renamed from LegacyCode?)`. It's only a
guess, so it's never renamed for you. You decide.

**Destructive changes are marked.** Every change that can lose data or fail with the rows already in a table, like
dropping a column, shrinking one, making an index unique or adding a check constraint, has `IsDestructive` set, and
isn't made unless you allow it.

**Hand-added indexes are kept.** Someone added an index to the database to speed up a slow query? It's never dropped,
even when destructive changes are allowed. Instead the diff tells you the exact attribute to add, so your model has it
too:

```csharp
// CREATE INDEX ix_purchaseorder_status_created ON "PurchaseOrder" ("Status", "CreatedDate")

var diff = db.GetSchemaDiff<PurchaseOrder>();
db.ApplySchemaDiff(diff, allowDestructive: true); // Makes 0 changes: the index is kept
```

```
PurchaseOrder
  ! index ix_purchaseorder_status_created  (Status, CreatedDate)
      (not in PurchaseOrder, kept: add [CompositeIndex("Status", "CreatedDate",
       Name = "ix_purchaseorder_status_created")] to PurchaseOrder)
```

## The migration, written for you to review

Knowing what's different is half the job. `ToMigration()` writes the other half, as an OrmLite
[DB Migration](https://docs.servicestack.net/ormlite/db-migrations):

```csharp
File.WriteAllText("Migrations/Migration1005.cs",
    diff.ToMigration("Migration1005", "MyApp.Migrations"));
```

```csharp
#warning Generated by Schema Diff: review this migration before running it, then delete this line

public class Migration1005 : MigrationBase
{
    public class Invoice
    {
        [AutoIncrement]
        public int Id { get; set; }
        [StringLength(200)]
        public string Reference { get; set; }
        public DateTime? PaidDate { get; set; }
        public string Currency { get; set; }
    }

    public override void Up()
    {
        // Reference is VARCHAR(50) NOT NULL
        Db.AlterColumn<Invoice>(x => x.Reference);
        Db.AddColumn<Invoice>(x => x.PaidDate);
        // Currency is likely LegacyCode renamed. If it is, rename it instead of adding it:
        // Db.RenameColumn<Invoice>(x => x.Currency, "LegacyCode");
        Db.AddColumn<Invoice>(x => x.Currency);
        // LegacyCode (VARCHAR(8000) NULL) isn't in Invoice. If it was renamed, rename it instead:
        // Db.RenameColumn<Invoice>("LegacyCode", "Currency");
        // Db.DropColumn<Invoice>("LegacyCode");
        Db.ExecuteSql("CREATE INDEX idx_invoice_customerid ON \"Invoice\" (\"CustomerId\");");
    }

    public override void Down() { /* ... */ }
}
```

The migration has its own copy of the model, with only the properties that change, so it keeps working after your
model changes again. Look at the likely rename: the migration adds `Currency`, and leaves dropping `LegacyCode` as
commented-out code with the rename to use instead, so no data is dropped unless you decide it should be.

:::warning
A generated migration is a guide, not a finished migration. Schema Diff is new, so every migration it writes starts
with a `#warning` that's reported each time your App is built, until you've reviewed it and deleted it.
:::

## From your browser, or the command line

If you use ServiceStack, the [Database Admin UI](https://docs.servicestack.net/admin-ui-database#schema-diff) has a
**Schema Diff** for each database. It compares the data models of your AutoQuery APIs and the tables your migrations
create, shows each difference with the SQL that fixes it and marks the destructive ones. Comparing doesn't change
your tables:

<screenshot src="/img/posts/ormlite-schema-diff/database-schema-diff.webp" title="Schema Diff in the Database Admin UI"></screenshot>

With the migration class next to them, ready to copy into your App:

<screenshot src="/img/posts/ormlite-schema-diff/database-migration-class.webp" title="Migration class generated from Schema Diff"></screenshot>

Or have the `migrate.new` [App Task](https://docs.servicestack.net/app-tasks) write it straight into your App's
`Migrations` folder, named after your last migration:

:::sh
dotnet run --AppTasks=migrate.new
:::

It doesn't write anything when your database already matches its models, and never replaces a migration that's
already there.

## Find out when your App starts, not in production

Better than finding out when a query fails is finding out before it can. Turn on `LogSchemaDiff` in development and
the differences of each database are logged in the background every time your App starts:

```csharp
services.AddPlugin(new AdminDatabaseFeature {
    LogSchemaDiff = context.HostingEnvironment.IsDevelopment(),
});
```

```
Schema Diff: the tables of the main database aren't the same as their models
Invoice
  ~ Reference  VARCHAR(50) NOT NULL -> VARCHAR(200) NULL
  + PaidDate  DATETIME NULL
  + Currency  VARCHAR(8000) NULL (renamed from LegacyCode?)
  - LegacyCode  VARCHAR(8000) NULL (not in Invoice) (renamed to Currency?)
  + index idx_invoice_customerid
Ignored: AspNetUsers
```

Or make it a test, so a model that changed without its migration fails the build before it's ever deployed:

```csharp
[Test]
public void Database_matches_its_models()
{
    using var db = dbFactory.OpenDbConnection();
    var diff = db.GetSchemaDiff(typeof(Invoice), typeof(Customer));
    Assert.That(diff.HasChanges, Is.False, diff.ToString());
}
```

Tables OrmLite doesn't manage, like ASP.NET Core Identity's `AspNet*` tables and EF Core's `__EFMigrationsHistory`,
are ignored by default, and you can ignore others by name, wildcard or model:

```csharp
OrmLiteConfig.SchemaDiff.IgnoreTables.Add("Legacy*");
OrmLiteConfig.SchemaDiff.IgnoreTypes.Add(typeof(AuditArchive));
```

## Keep dev databases in sync

While you're developing, `ApplySchemaDiff()` makes the changes for you. By default only safe ones, like creating
tables, adding columns and indexes, making columns larger or allowing nulls, are applied:

```csharp
var diff = db.GetSchemaDiff(typeof(Invoice), typeof(Customer));

var applied = db.ApplySchemaDiff(diff);                // safe changes only
db.ApplySchemaDiff(diff, allowDestructive: true);      // also drop and alter columns that can lose data
```

It's for development and test databases. The databases you deploy to should get reviewed migrations that are run
once and recorded.

## SQLite, rebuilt

SQLite can't alter a column, its default, foreign keys or constraints. The only way to change them is to create the
table again and copy its rows. So on SQLite those changes are made by rebuilding the table, and the diff says so:

```
PurchaseOrder
  ~ Quantity  default DEFAULT 1 -> DEFAULT 5 (by rebuilding the table)
  ~ foreign key FK_PurchaseOrder_Supplier_SupplierId  (SupplierId) REFERENCES Supplier (Id)
      -> (SupplierId) REFERENCES Supplier (Id) ON DELETE CASCADE (by rebuilding the table)
  + constraint CHK__PurchaseOrder_Status  CHECK ("Status" IN ('Pending','Shipped','Delivered'))
      (by rebuilding the table)
  + index idx_purchaseorder_shippeddate
  ~ rebuild table to change the default of Quantity, foreign key FK_PurchaseOrder_Supplier_SupplierId,
    constraint CHK__PurchaseOrder_Status
```

The new `RebuildTable<T>()` API does it from your model, and is also available to your own migrations:

```csharp
db.RebuildTable<PurchaseOrder>();
```

It runs in a transaction, keeping the table's rows, its indexes (including ones added by hand), its triggers and its
next `AUTOINCREMENT` id. If a row breaks the new table, e.g. it fails a new check constraint, the table is left as it
was.

## Know the limits

Schema Diff is built to tell you the truth about your database, so here's the truth about Schema Diff:

- **Generated migrations are a guide to review**, not finished migrations you can trust without reading
- **`ApplySchemaDiff()` is for development and test databases**, and applies changes one at a time, not in a
  transaction
- **A primary key with other columns is only reported**, as changing it needs its foreign keys and data migrated too
- **Not compared**: the order of columns, the expressions of generated columns and comments
- **Temporary tables**: your connection's user needs to be able to create them, e.g. MySQL's `CREATE TEMPORARY TABLES`
  privilege, otherwise column types aren't compared and `diff.Warnings` says why

Within those limits, your models stay the source of truth, and you find out the moment your database drifts from them.

## Get Started

Schema Diff is available in **ServiceStack v10.4** on **SQLite, PostgreSQL, SQL Server, MySQL** and **MariaDB**.
Upgrade your `ServiceStack.OrmLite.*` packages, then either open the Schema Diff in the Database Admin UI, turn on
`LogSchemaDiff`, or call `db.GetSchemaDiff()` with your models to see how far your database has drifted.

See the docs for the complete reference:

- [Schema Diff](https://docs.servicestack.net/ormlite/schema-diff) - everything that's compared, the changes, ignoring
  tables, generated migrations and rebuilding SQLite tables
- [Schema Attributes](https://docs.servicestack.net/ormlite/ddl-attributes) - filtered and covering indexes, enum
  checks, generated columns and comments declared on your models
- [DB Migrations](https://docs.servicestack.net/ormlite/db-migrations) - writing, running and reverting OrmLite migrations
- [Database Admin UI](https://docs.servicestack.net/admin-ui-database) - browse, query and compare your databases
- [v10.4 Release Notes](https://docs.servicestack.net/releases/v10_04) - everything else in this release
