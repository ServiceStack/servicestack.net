---
title: Text to Blazor Vue CRUD Apps
summary: Discover how to quickly generate Blazor Admin CRUD Apps from a text description using the new okai tool
tags: [okai,ai,autoquery,blazor,vue]
author: Demis Bellot
image: ./img/posts/text-to-blazor/bg.webp
---

Text to Blazor is our first initiative for harnessing AI to help to rapidly generate new Blazor Admin CRUD 
Apps from just a text description.

<div class="flex justify-center">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="Bd283EYJKxM" style="background-image: url('https://img.youtube.com/vi/Bd283EYJKxM/maxresdefault.jpg')"></lite-youtube>
</div>

[![](/img/posts/text-to-blazor/text-to-blazor-prompt.webp)](/text-to-blazor)

<div class="pb-4 not-prose flex justify-center">
<a href="https://servicestack.net/text-to-blazor" class="text-3xl text-indigo-600 hover:text-indigo-800">https://servicestack.net/text-to-blazor</a>
</div>

This will query 5 different high quality AI models to generate 5 different Data Models, APIs, DB Migrations 
and Admin UIs which you can browse to find the one that best matches your requirements.

[![](/img/posts/text-to-blazor/text-to-blazor-gen.webp)](/text-to-blazor)

### Using AI to only generate Data Models

Whilst the result is a working CRUD App, the approach taken is very different from most AI tools
which uses AI to generate the entire App that ends up with a whole new code-base developers didn't write
which they'd now need to maintain.

Instead AI is only used to generate the initial Data Models within a **TypeScript Declaration file**
which we've found is the best format supported by AI models that's also the best typed DSL for defining
data models with minimal syntax that's easy for humans to read and write.

### Download preferred Blazor Vue CRUD App

Once you've decided on the Data Models that best matches your requirements, you can download your preferred 
generated Blazor Vue CRUD App:

[![](/img/posts/text-to-blazor/text-to-blazor-download.webp)](/text-to-blazor)

### Blazor Admin App

**Admin Only** - is ideal for internal Admin Apps where the Admin UI is the Primary UI

![](/img/posts/text-to-blazor/okai-blazor-admin.webp)

### Blazor Vue App

**UI + Admin** - Creates a new [blazor-vue](https://blazor-vue.web-templates.io) template that's ideal
for Internet or public facing Apps, sporting a full-featured public facing UI for a Web App's
users whilst enabling a back-office CRUD UI for Admin Users to manage their App's data.

![](/img/posts/text-to-blazor/okai-blazor-vue.webp)

Clicking on the **Admin UI** button will take you to the Admin UI at `/admin`:

![](/img/posts/text-to-blazor/okai-blazor-vue-admin.webp)

## Modular Code Generation

Instead of unleashing AI on your code-base unabated, we're only using AI to generate isolated functionality 
into grouped "no touch" source files that can be easily maintained and extended.

Creating a new Project with a similar prompt above would create a new project with the new source files
(marked with `*`) added to the existing project:

### APIs

```files
/MyApp.ServiceModel
    Bookings.cs
    api.d.ts*
    Employees.cs*
    Employees.d.ts*
```

### Migration

```files
/MyApp/Migrations
    Migration1000.cs
    Migration1001.cs*
```

### UI

```files
/MyApp/wwwroot/admin
    /sections
        Bookings.mjs
        Employees.mjs*
        index.mjs*
    index.html
```

Which after downloading a new project just needs to run the [DB Migrations](https://docs.servicestack.net/ormlite/db-migrations)
to create the tables required for any new functionality:

:::sh
npm run migrate
:::

## Run Migrations

In order to create the necessary tables for the new functionality, you'll need to run the DB Migrations.

If migrations have never been run before, you can run the `migrate` npm script to create the initial database:

:::sh
npm run migrate
:::

If you've already run the migrations before, you can run the `rerun:last` npm script to drop and re-run the last migration:

:::sh
npm run rerun:last
:::

Alternatively you can nuke the App's database (e.g. `App_Data/app.db`) and recreate it from scratch with `npm run migrate`.

## Instant CRUD UI

After running the DB migrations, you can hit the ground running and start using the Admin UI to manage the new 
Data Model RDBMS Tables:

:::youtube 8buo_ce3SNM
Using AutoQuery CRUD UI in a Text to Blazor App
:::

### Create new Records from Search Dialog

We're continually improving the UX of the [AutoQueryGrid Component](/vue/autoquerygrid) used in generating CRUD UIs to enable a more productive and seamless workflow. A change added to that end that you can see in the above video is the ability to add new Records from a Search dialog:

![](/img/posts/text-to-blazor/autoquerygrid-new2.webp)

This now lets you start immediately creating new records without needing to create any lookup entries beforehand.

## Audited Data Models

The TypeScript Data Models enable a rapid development experience for defining an App's Data Models which are used
to generate the necessary AutoQuery CRUD APIs to support an Admin UI.

An example of the productivity of this approach is the effortless support for maintaining a detailed audit history for changes to select tables by inheriting from the `AuditBase` base class, e.g:

```ts
export class Job extends AuditBase {
    ...
}
```

Which can then be regenerated using the name of the TypeScript Model definitions:

:::sh
npx okai Jobs.d.ts
:::

This will include additional `CreatedBy`, `CreatedDate`, `ModifiedBy`, `ModifiedDate`, `DeletedBy` and `DeletedDate`
properties to the specified Table and also generates the necessary
[Audit Behaviors](https://docs.servicestack.net/autoquery/crud#apply-generic-crud-behaviors)
on the AutoQuery APIs to maintain the audit history for each CRUD operation.

### AutoQuery CRUD Audit Log

As the **blazor-admin** and **blazor-vue** templates are configured to use the [AutoQuery CRUD Executable Audit Log](https://docs.servicestack.net/autoquery/audit-log)
in its [Configure.AutoQuery.cs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp/Configure.AutoQuery.cs)
the Audit Behaviors will also maintain an Audit Trail of all CRUD operations which can be viewed in the Admin UI:

![](/img/posts/text-to-blazor/okai-audit-form.webp)

## TypeScript Schema

In addition to being a great DSL for defining Data Models, using TypeScript also lets us define a schema
containing all the C# Types, interfaces, and attributes used in defining APIs, DTOs and Data Models in 
the accompanying [api.d.ts](https://okai.servicestack.com/api.d.ts) file.

This now lets us use TypeScript to define the [Bookings.cs](https://github.com/NetCoreTemplates/blazor-vue/blob/main/MyApp.ServiceModel/Bookings.cs) 
AutoQuery APIs and Data Models which blazor-admin uses instead in its [Bookings.d.ts](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp.ServiceModel/Bookings.d.ts):

```ts
/// <reference path="./api.d.ts" />
export type Config = {
    prompt:    "New Booking"
    api:       "~/MyApp.ServiceModel/Bookings.cs"
    migration: "~/MyApp/Migrations/Migration1001.cs"
    uiMjs:     "~/MyApp/wwwroot/admin/sections/Bookings.mjs"
}

export enum RoomType {
  Single,
  Double,
  Queen,
  Twin,
  Suite,
}

@Read.route("/bookings","GET")
@Read.route("/bookings/{Id}","GET")
@Read.description("Find Bookings")
@Create.route("/bookings","POST")
@Create.description("Create a new Booking")
@Update.notes("Find out how to quickly create a <a href='https://youtu.be/nhc4MZufkcM'>C# Bookings App from Scratch</a>")
@Update.route("/booking/{Id}","PATCH")
@Update.description("Update an existing Booking")
@Delete.route("/booking/{Id}","DELETE")
@Delete.description("Delete a Booking")
@tag("Bookings")
@icon({svg:"<svg>...</svg>"})
@notes("Captures a Persons Name & Room Booking information")
@description("Booking Details")
@validateHasRole("Employee")
export class Booking extends AuditBase {
  @autoIncrement()
  id: number
  @Create.description("Name this Booking is for")
  @validateNotEmpty()
  name: string
  roomType: RoomType
  @validateGreaterThan(0)
  roomNumber: number
  @intlDateTime(DateStyle.Long)
  bookingStartDate: Date
  @intlRelativeTime()
  bookingEndDate?: Date
  @intlNumber({currency:"USD"})
  @validateGreaterThan(0)
  cost: decimal
  @ref({model:"nameof(Coupon)",refId:"nameof(Coupon.Id)",refLabel:"nameof(Coupon.Description)"})
  @references("typeof(Coupon)")
  couponId?: string
  @reference()
  discount?: Coupon
  @input({type:"textarea"})
  notes?: string
  cancelled?: boolean
  @reference({selfId:"nameof(CreatedBy)",refId:"nameof(User.UserName)",refLabel:"nameof(User.DisplayName)"})
  employee: User
}

@tag("Bookings")
@icon({svg:"<svg>...</svg>"})
export class Coupon extends AuditBase {
  id: string
  description: string
  discount: number
  expiryDate: Date
}
```

The benefit of this approach being that you can make a change to the Data Models and rerun the okai tool
to regenerate the AutoQuery APIs, DB Migrations and Admin UIs.

:::sh
npx okai Bookings.d.ts
:::

Which will regenerate its:
- APIs: [MyApp.ServiceModel/Bookings.cs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp.ServiceModel/Bookings.cs)
- DB Migration: [MyApp/Migrations/Migration1000.cs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp/Migrations/Migration1000.cs)
- Admin UI: [/wwwroot/admin/sections/Bookings.mjs](https://github.com/NetCoreTemplates/blazor-admin/blob/main/MyApp/wwwroot/admin/sections/Bookings.mjs)

What files will be generated is controlled in the `Config` section: 

```ts
export type Config = {
    prompt:    "New Booking"
    api:       "~/MyApp.ServiceModel/Bookings.cs"
    migration: "~/MyApp/Migrations/Migration1001.cs"
    uiMjs:     "~/MyApp/wwwroot/admin/sections/Bookings.mjs"
}
```

So if you no longer want the code regeneration to update the DB Migration for it, you can just remove it
from the Config.

## Customize Data Models

The data models defined in the TypeScript Declaration file e.g. `Bookings.d.ts` is what drives the
generation of the Data Models, APIs, DB Migrations and Admin UIs.

This can be further customized by editing the TypeScript Declaration file and re-running the `okai` tool
with the name of the TypeScript Declaration file, e.g. `Bookings.d.ts`:

:::sh
npx okai Bookings.d.ts
:::

Which will re-generate the Data Models, APIs, DB Migrations and Admin UIs based on the updated Data Models.

![](/img/posts/text-to-blazor/okai-Employees.webp)

Or add `--watch` to watch the TypeScript Declaration file for changes and automatically re-generate the generated files on Save:

:::sh
npx okai Bookings.d.ts --watch
:::

:::tip
You only need to specify the `Bookings.d.ts` TypeScript filename (i.e. not the filepath) from 
anywhere within your .NET solution
:::

One challenge with this approach is that we only have a single class to use to define our
attributes for both Request and Response DTOs for all AutoQuery CRUD APIs and Data Models.

### API and Data Model attributes 

The okai tool resolves some of these issues with smart generation of attributes where "Data Model Attributes" 
like `[Icon]` class attribute and `[AutoIncrement]` property attributes are only generated on the Data Model:

```ts
@icon({svg:"<svg>...</svg>"})
export class Booking {
    @autoIncrement()
    id: number
    @intlNumber({currency:"USD"})
    cost: decimal
}
```

Whilst "API Attributes" like `[Tag]` and `[ValidateHasRole]` class attribute and `[ValidateGreaterThan]` 
property attributes and are only generated on the APIs Request DTOs:

```ts
@tag("Bookings")
@validateHasRole("Employee")
export class Booking {
    @validateGreaterThan(0)
    cost: decimal
}
```

### C# Types

As JavaScript only has a limited set of types, the TypeScript **api.d.ts** schema also includes the 
built-in C# Types used when defining APIs, DTOs and Data Models which you'll be able to use when your
APIs need to use a specific .NET type, e.g:

```ts
export class Booking extends AuditBase {
  id: number
  name: string
  roomNumber: number
  bookingStartDate: Date
  bookingEndDate?: DateOnly
  cost: decimal
  cancelled?: boolean
}
```
 
Which uses the `DateOnly` and `decimal` .NET Types to generate:

```csharp
public class Booking : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public int RoomNumber { get; set; }
    public DateTime BookingStartDate { get; set; }
    public DateOnly? BookingEndDate { get; set; }
    public decimal Cost { get; set; }
    public bool? Cancelled { get; set; }
}
```

### API Targeted Attributes

When you need to add attributes to a specific API Request DTO you can use a CRUD prefix to have it only
applied to that specific AutoQuery API, e.g:

```ts
@Read.route("/bookings","GET")
@Read.route("/bookings/{Id}","GET")
@Create.route("/bookings","POST")
```

Where it would only the generated on the AutoQuery API that it targets, e.g:

```csharp
[Route("/bookings", "GET")]
[Route("/bookings/{Id}", "GET")]
public class QueryBookings : QueryDb<Booking> { ... }

[Route("/bookings", "POST")]
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse> { ... }
```

In addition to `Create.`, `Read.`, `Update.`, `Delete.` attributes to target specific AutoQuery CRUD APIs, 
you can also use `Write.` to target all `Create.`, `Update.`, `Delete.` Write APIs.

### Ambiguous Attributes

Attributes that can be annotated on both the Data Model and API Request DTOs like `[Notes]` and `[Description]` 
are only generated on the Data Model and require using targeted attributes to apply to them to 
API Request DTOs, e.g:

```ts
@Read.description("Find Bookings")
@Create.description("Create a new Booking")
@Update.notes("Find out how to quickly create a <a href='https://youtu.be/nhc4MZufkcM'>C# Bookings App from Scratch</a>")
@Update.description("Update an existing Booking")
@Delete.description("Delete a Booking")
@notes("Captures a Persons Name & Room Booking information")
@description("Booking Details")
export class Booking extends AuditBase { ... }
```

Where the naked `@notes` and `@description` attributes are only generated on the Data Model whilst the 
targeted attributes are generated on their respective DTOs, e.g: 

```csharp
[Description("Find Bookings")]
public class QueryBookings : QueryDb<Booking> { ... }

[Description("Create a new Booking")]
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse> { ... }

[Notes("Find out how to quickly create a <a href='https://youtu.be/nhc4MZufkcM'>C# Bookings App from Scratch</a>")]
[Description("Update an existing Booking")]
public class UpdateBooking : IPatchDb<Booking>, IReturn<IdResponse> { ... }

[Description("Delete a Booking")]
public class DeleteBooking : IDeleteDb<Booking>, IReturnVoid { ... }
    
[Description("Booking Details")]
[Notes("Captures a Persons Name & Room Booking information")]
public class Booking : AuditBase { ... }
```

### Special Attribute Values

There's special behavior for `"nameof(...)"` and `"typeof(...)"` string attribute values where: 

```ts
export class Booking extends AuditBase {
    @ref({model: "nameof(Coupon)", refId: "nameof(Coupon.Id)", refLabel: "nameof(Coupon.Description)"})
    @references("typeof(Coupon)")
    couponId?: string
}
```

Will be generated with native C# syntax, i.e. instead of as strings:

```csharp
public class Booking : AuditBase
{
    [Ref(Model=nameof(Coupon),RefId=nameof(Coupon.Id),RefLabel=nameof(Coupon.Description))]
    [References(typeof(Coupon))]
    public string? CouponId { get; set; }
}
```

### Changing Default Attributes

To improve the default out-of-the-box experience some attributes are included by default, including:

 - `[Icon]` attribute on Data Models based on the Data Model name
   - prevent by adding empty `@icon()` attribute
 - `[AutoIncrement]` on `id` number properties if no other `[PrimaryKey]` attribute is defined
   - prevent by adding `@primaryKey()` or `@autoId()`
 - `[Validate*]` attributes added to Create/Update APIs on non-nullable properties
   - prevent by adding empty `@validate()` attribute

Here's an example which changes the default behavior for the default attributes above:

```ts
@icon()
export class Todo {
    @primaryKey()
    id: number
    @validate()
    name: string
}
```

Which will generate the C# APIs without the `[Icon]` and `[Validate]` attributes and replace `[AutoIncrement]`
with `[PrimaryKey]`, e.g:

```csharp
public class CreateTodo : ICreateDb<Todo>, IReturn<IdResponse>
{
    [ValidateGreaterThan(0)]
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Todo
{
    [PrimaryKey]
    public int Id { get; set; }
    public string Name { get; set; }
}
```

### Modifying ApplicationUser

In many cases the AI Models will want to generate a `User` class for their AI models. But as Blazor Apps
are already configured to use an ApplicationUser Identity Auth User class, the C# code generation only generates
the User class in a comment so you can merge it with your existing `User` class, e.g:

```csharp
/* merge with User DTO
/// <summary>
/// Interface defining the structure for a JobApplication.
/// Represents a user's application to a specific job.
/// </summary>
public class User
{
    [AutoIncrement]
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    /// <summary>
    /// Optional URL to the user's resume
    /// </summary>
    public string? ResumeUrl { get; set; }
}
*/
```

If you wish to add additional properties, you'll first need to add it your `ApplicationUser` class, e.g:

```csharp
public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? ProfileUrl { get; set; }
    /// <summary>
    /// Optional URL to the user's resume
    /// </summary>
    public string? ResumeUrl { get; set; }
}
```

You'll then need to regenerate the EF Migration to update the `AspNetUsers` table with the new columns by
running the `init-ef` npm script:

:::sh
npm run init-ef
:::

Which will delete the existing Migrations and create a new Migration to update the Identity Auth tables:

```json
{
    "scripts": {
        "init-ef": "node -e 'fs.readdirSync(`Migrations`).filter(x => !x.startsWith(`Migration`)).forEach(x => fs.rmSync(`Migrations/${x}`))' && dotnet ef migrations add CreateIdentitySchema",
    }
}
```

You can then delete your Primary Database (e.g. App_Data/app.db) and re-run the `migrate` npm script to recreate it:

:::sh
npm run migrate
:::

If you want the additional property to be included in API Responses you'll also need to add it to your `User` DTO, e.g:

```csharp
/// <summary>
/// Public User DTO
/// </summary>
[Alias("AspNetUsers")]
public class User
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? ProfileUrl { get; set; }
    public string? ResumeUrl { get; set; }
}
```

Which OrmLite and AutoQuery will use to query Identity Auth's `AspNetUsers` table.

### Custom APIs

When you need more fine-grained control over the generated APIs, you can "takeover" the generation of
an AutoQuery API by explicitly defining it yourself.

So if you prefer to use explicit API Request DTOs instead of targeting attributes or need to control
the exact properties that are generated in each API, you can define the API Request DTOs yourself
where when exists will skip generation for that API.

To showcase the differences between the single class approach, you can rewrite the above single class
approach with an explicit class for each API:

```ts
export enum RoomType {
  Single,
  Double,
  Queen,
  Twin,
  Suite,
}

@tag("Bookings")
@notes("Captures a Persons Name & Room Booking information")
@route("/bookings","GET")
@route("/bookings/{Id}","GET")
@autoApply(Behavior.AuditQuery)
@description("Find Bookings")
export class QueryBookings extends QueryDb<Booking> {
  id?: number
}

@tag("Bookings")
@route("/bookings","POST")
@autoApply(Behavior.AuditCreate)
@description("Create a new Booking")
@validateHasRole("Employee")
export class CreateBooking implements ICreateDb<Booking>, IReturn<IdResponse> {
  name?: string
  roomType?: RoomType
  @validateGreaterThan(0)
  roomNumber?: number
  bookingStartDate?: Date
  bookingEndDate?: Date
  @validateGreaterThan(0)
  cost?: decimal
  couponId?: string
  discount?: Coupon
  @input({type:"textarea"})
  notes?: string
  cancelled?: boolean
}

@tag("Bookings")
@route("/bookings","PATCH")
@autoApply(Behavior.AuditModify)
@description("Create a new Booking")
@validateHasRole("Employee")
export class UpdateBooking implements IPatchDb<Booking>, IReturn<IdResponse> {
  name?: string
  roomType?: RoomType
  @validateGreaterThan(0)
  roomNumber?: number
  bookingStartDate?: Date
  bookingEndDate?: Date
  @validateGreaterThan(0)
  cost?: decimal
  couponId?: string
  discount?: Coupon
  @input({type:"textarea"})
  notes?: string
  cancelled?: boolean
}

@tag("Bookings")
@route("/bookings/{Id}","DELETE")
@autoApply(Behavior.AuditSoftDelete)
@description("Delete a Booking")
@validateHasRole("Manager")
export class DeleteBookings implements IDeleteDb<Booking>, IReturnVoid {
  id?: number
}

@tag("Bookings")
@notes("Captures a Persons Name & Room Booking information")
@route("/bookings","GET")
@route("/bookings/{Id}","GET")
@description("Find Bookings")
export class Booking extends AuditBase {
  @autoIncrement()
  id: number
  @Create.description("Name this Booking is for")
  @Create.validateNotEmpty()
  name: string
  roomType: RoomType
  roomNumber: number
  @intlDateTime(DateStyle.Long)
  bookingStartDate: Date
  @intlRelativeTime()
  bookingEndDate?: Date
  @intlNumber({currency:"USD"})
  cost: decimal
  @ref({model:"nameof(Coupon)",refId:"nameof(Coupon.Id)",refLabel:"nameof(Coupon.Description)"})
  @references("typeof(Coupon)")
  couponId?: string
  @reference()
  discount?: Coupon
  @Write.input({type:"textarea"})
  notes?: string
  cancelled?: boolean
  @reference({selfId:"nameof(CreatedBy)",refId:"nameof(User.UserName)",refLabel:"nameof(User.DisplayName)"})
  employee: User
}

@description("Discount Coupons")
export class Coupon extends AuditBase {
  id: string
  description: string
  discount: number
  expiryDate: Date
}

@tag("Bookings")
@route("/coupons","GET")
@autoApply(Behavior.AuditQuery)
@description("Find Coupons")
export class QueryCoupons extends QueryDb<Coupon> {
  id?: string
}

@tag("Bookings")
@route("/coupons","POST")
@autoApply(Behavior.AuditCreate)
@description("Create a new Create")
@validateHasRole("Employee")
export class CreateCoupon implements ICreateDb<Coupon>, IReturn<IdResponse> {
  id: string
  description: string
  discount: number
  expiryDate: Date
}

@tag("Bookings")
@route("/coupons","PATCH")
@autoApply(Behavior.AuditModify)
@description("Create a new Coupon")
@validateHasRole("Employee")
export class UpdateCoupon implements IPatchDb<Coupon>, IReturnVoid {
  id: string
  description?: string
  discount?: number
  expiryDate?: Date
}

@tag("Bookings")
@route("/coupons/{Id}","DELETE")
@autoApply(Behavior.AuditSoftDelete)
@description("Delete a Coupon")
@validateHasRole("Manager")
export class DeleteCoupon implements IDeleteDb<Coupon>, IReturnVoid {
  id?: string
}
```