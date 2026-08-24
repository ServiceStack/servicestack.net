---
title: Instant CRUD Apps with AutoQuery Schemas
summary: Give AutoQuerySchema one /auto/{DataModel}.json document and it renders a complete, authorized CRUD application
tags: [servicestack, autoquery, json-schema, vue]
author: Demis
image: ./img/posts/autoquery-schema/bg.webp
---

## Every AutoQuery model is now a complete App

If your App has AutoQuery APIs, open `/auto` and you already have an admin application: a searchable list of your data models, and behind each one a working CRUD app with a results grid, paging, sorting, filters, saved preferences, Create and Edit forms, reference lookups and guarded Delete actions.

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
  'Searchable data model gallery': '/img/posts/autoquery-schema/auto-gallery.webp',
  'Populated Booking CRUD grid': '/img/posts/autoquery-schema/booking-grid.webp',
}"></screenshots-gallery>

No frontend project, no generated source files, no scaffolding step. Every action it offers is one the signed-in user is authorized to perform, because the page is assembled at runtime from your APIs and the current session.

That changes what a data UI costs. A back-office screen that would have been a sprint of grid, form, validation, lookup and permission work is now the thing you get *before* deciding whether a bespoke UI is worth building.

ServiceStack's [AutoQuery](https://docs.servicestack.net/autoquery/rdbms) has long been one of the fastest ways to servicify an existing database or add production-ready data APIs to a new application. Where an [API Schema](/posts/api-schema) describes how one `/api/{RequestDto}` endpoint can be rendered and executed, an AutoQuery Schema describes the whole data capability: its Query API, returned model and every authorized Create, Update, Patch, Delete or Save API.

Available in .NET 8+ ServiceStack Apps, the new schema routes and UIs are registered automatically with ServiceStack's Metadata feature:

```text
/auto
/auto/{ModelName}
```

Just as with ServiceStack's new [API Schemas](/posts/api-schema), add `.json` to retrieve the portable schema powering the UI:

```text
/auto/{ModelName}.json
```

The integration is deliberately small: fetch that one document and give it to the generic `AutoQuerySchema` component. It uses the embedded `/api/{RequestDto}` definitions to query and mutate the data, rendering the grid, filters, paging, preferences, forms, lookups and guarded actions itself.

```html
<AutoQuerySchema :schema="schema" />
```

Those embedded operation schemas are reusable beyond the CRUD page. Because each write operation carries its own [API Schema](/posts/api-schema), AI Chat can render an editable preview and approval form whenever a Model proposes an AutoQuery Create, Update, Patch, Delete or Save — so an assistant that can change your data still puts the exact record in front of a person first, for every model, with no per-API Chat component to write.

<live-auto-query-example></live-auto-query-example>

## Where this fits alongside Locode

ServiceStack already ships [Locode](https://docs.servicestack.net/locode/), an Auto UI over the same AutoQuery APIs — so the obvious question is which to reach for.

| | `/auto` | Locode | Custom UI |
| --- | --- | --- | --- |
| **Best for** | Embedding data UIs in your own App | A complete standalone admin App | Product surfaces users live in |
| **Loads** | One model's schema at a time | The App's full metadata | Whatever you build |
| **Customization** | Compose the Vue/React components yourself | Locode's customization model | Total |
| **Runs where** | Built-in page *or* inside your App | Built-in page | Your App |

They aren't competing and neither is going away. Locode remains the fuller standalone back-office experience. `/auto` is the schema-driven equivalent that scales to very large API surfaces and — the part that matters most — can be *taken apart*: the grid, the forms, the lookups and the field inputs are components you can drop into your own application's navigation and design system.

If Locode already does what you need, keep using it.

## Browse your data APIs at `/auto`

The `/auto` home page groups AutoQuery CRUD APIs by the data model they operate on. Instead of showing five disconnected Request DTOs for Query, Create, Update, Delete and Save, it presents one coherent application capability.

Each model card identifies its available actions and their underlying Request DTOs. Models can be searched by name, title, tags and API names, making the browser equally useful for developers who think in code and users who think in business concepts.

The catalog only includes models with a Query API the current user can access. Within each model, it only advertises CRUD operations authorized for that session.

This makes `/auto` an instant launchpad for:

- Internal administration
- Back-office data management
- Database exploration
- Customer support tools
- Content and configuration management
- Rapid application prototyping
- AutoQuery API testing

<screenshot src="/img/posts/autoquery-schema/tag-filter.webp" title="AutoQuery APIs filtered by tag"></screenshot>

## The same elegant pattern, at CRUD scale

An ordinary API Schema pairs one `/schema/{RequestDto}.json` description with one executable `/api/{RequestDto}` endpoint. An AutoQuery Schema applies the same idea at model scale, describing a model and all the APIs available for working with it in one envelope.

`/auto/Booking.json` can include:

```json
{
  "name": "Booking",
  "title": "Booking",
  "primaryKey": "Id",
  "model": {
    "type": "object",
    "properties": {}
  },
  "query": {
    "$id": "/api/QueryBookings",
    "method": "GET",
    "operation": "Query",
    "properties": {}
  },
  "create": {
    "$id": "/api/CreateBooking",
    "method": "POST",
    "operation": "Create",
    "properties": {}
  },
  "update": {
    "$id": "/api/UpdateBooking",
    "method": "PATCH",
    "operation": "Patch",
    "properties": {}
  },
  "delete": {
    "$id": "/api/DeleteBooking",
    "method": "DELETE",
    "operation": "Delete",
    "properties": {}
  }
}
```

The actual schema contains the complete properties, constraints, UI metadata and authorization requirements for every included operation.

It also distinguishes between the model used for writes and the view model returned by `IQueryDb<From, Into>`. This matters when a query joins, projects or enriches stored data: grids should display the returned view, whilst Create and Edit forms must still use the writable model and Request DTOs.

The result is a self-contained description of an application's data capability, not merely a database table schema.

<auto-query-app-showcase></auto-query-app-showcase>

Like the per-API `/schema/{RequestDto}.json` endpoints, this model-level envelope avoids requiring the complete `MetadataApp` graph used by the traditional `/ui` API Explorer. Even applications with thousands of APIs only load the schemas for the selected model and any referenced models opened through a lookup. Browser transfer, parsing, memory and rendering costs therefore scale with the current data UI instead of the application's total API surface.

## A full AutoQuery grid with no frontend code

The built-in UI is powered by the `AutoQuerySchema` and `SchemaResults` components in `@servicestack/vue`.

The results grid calls the schema's Query API and provides:

- Server-side paging with first, previous, next and last navigation.
- Per-column sorting.
- AutoQuery's typed filter conventions.
- Multiple filters and sort expressions.
- Selectable visible columns.
- Configurable page sizes.
- Formatted values from `[Intl]` and `[Format]` metadata.
- Persistent preferences stored per model.
- Responsive light and dark modes.

Query state is kept in the URL, so a filtered view can be bookmarked, refreshed or shared:

```text
/auto/Booking?RoomType=Queen&orderBy=-StartDate&skip=20
```

That URL is not a screenshot of a transient client state. It is a durable link back to the same server-side query.

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
  'Grid filters, ordering and pagination': '/img/posts/autoquery-schema/grid-filters.webp',
  'Query preferences': '/img/posts/autoquery-schema/query-preferences.webp',
}"></screenshots-gallery>

## Schema-driven Create, Edit and Delete

When a model has an authorized Create API, `/auto/{Model}` displays a New action. The form is generated from the Create Request DTO rather than from assumptions about the database table.

Selecting a row opens the Edit form when an Update or Patch API is available. Delete is shown only when the caller can access the selected Delete API.

Each form preserves the exact behavior of its API:

- Required values and validation constraints are shown before submission.
- Server validation errors bind back to their fields.
- Enums and allowable values become selections.
- Nested objects and collections remain editable.
- File properties use multipart uploads when required.
- Reference properties open searchable record pickers.
- HTTP methods and payloads come from the schema.

Patch APIs receive only changed values. When a user clears an existing field, the UI adds ServiceStack's `reset` instruction so the server can distinguish “set this to empty” from “leave this field unchanged.”

This is the kind of edge case custom CRUD UIs frequently get wrong. A shared schema renderer solves it once for every model.

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
  'Generated Create Booking form': '/img/posts/autoquery-schema/create-booking.webp',
  'Edit dialog with guarded delete': '/img/posts/autoquery-schema/edit-booking.webp',
}"></screenshots-gallery>

## References become live lookup UIs

Foreign keys are often the point where generated CRUD tools stop feeling like real applications. Asking a user to remember that “Customer 1042” is “Acme Inc.” is technically accurate and practically unusable.

AutoQuery Schemas preserve reference metadata from `[Ref]`, `[References]`, `[ForeignKey]` and related attributes. The Vue renderer uses it to display a lookup control that can resolve the current label and open a full searchable `SchemaResults` picker for the referenced model.

The picker has the same paging, sorting, filters and column preferences as the main grid. Referenced model schemas are loaded on demand from `/auto/{ReferencedModel}.json`, so the parent schema remains compact.

This creates a composable graph of data UIs: each model describes itself, and relationships link to other independently discoverable model schemas.

<screenshot src="/img/posts/autoquery-schema/customer-lookup.webp" title="Reference lookup opened from the Booking form"></screenshot>

## Authorization shapes the App

Generated UIs are only useful when they preserve the application's security model.

The AutoQuery catalog, model schema and CRUD UI are all generated for the current authenticated session:

- A model is only listed when its Query API can be accessed.
- Create appears only when the user can call the Create API.
- Rows become editable only when Update or Patch is available.
- Delete appears only when the selected Delete API is authorized.
- Each action can carry different roles, permissions, claims, scopes or API-key requirements.

The schema's auth metadata allows the UI to explain an unavailable operation, whilst the API continues to enforce authorization on every request.

This is more precise than a single “admin page” permission. A support user may have read access, an operator may create and edit, and an administrator may also delete—all from the same generated UI.

## Smart conventions for real AutoQuery APIs

ServiceStack derives the most useful CRUD surface when several API shapes are available:

- Query access is required because a data UI needs a readable model.
- `IPatchDb<T>` is preferred over `IUpdateDb<T>` when both exist.
- A single-row Delete API is preferred over a bulk delete operation.
- Create, Update, Delete and Save are included only when available and authorized.
- The primary key is discovered from `[PrimaryKey]`, `[AutoIncrement]`, `Id` or `{Model}Id` conventions.
- Query view models are represented separately when they differ from write models.

These conventions let AutoQuery Schema work with generated CRUD APIs, hand-written AutoQuery Request DTOs and mixed applications where only selected operations are exposed.

## Use `AutoQuerySchema` in your own Vue Apps

The built-in `/auto/{Model}` page is a reference host around reusable `@servicestack/vue` components. Applications can fetch the same schema and embed the full CRUD experience in their own navigation and design system:

```html
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AutoQuerySchema } from '@servicestack/vue'

const schema = ref()

onMounted(async () => {
    schema.value = await fetch('/auto/Booking.json')
        .then(r => r.json())
})
</script>

<template>
  <AutoQuerySchema
      v-if="schema"
      :schema="schema" />
</template>
```

`AutoQuerySchema` deliberately renders no surrounding page chrome, leaving the host application free to provide its own title, navigation and layout. It composes `SchemaResults`, `SchemaInput` and the standard ServiceStack inputs, dialogs, error summaries and confirmation controls.

As in ServiceStack's Vue templates, the host installs the `ServiceStackVue` plugin and a Vue Router instance so filters, sorting, paging and the selected row can remain synchronized with the URL.

### The same App in React

`@servicestack/react` ships the same components with the same names, so a React App embeds the identical CRUD experience:

```tsx
import { useEffect, useState } from 'react'
import { AutoQuerySchema } from '@servicestack/react'

export default function Bookings() {
    const [schema, setSchema] = useState(null)

    useEffect(() => {
        fetch('/auto/Booking.json').then(r => r.json()).then(setSchema)
    }, [])

    return schema ? <AutoQuerySchema schema={schema} /> : null
}
```

This is the payoff of publishing a portable contract instead of generating a frontend: the server didn't need to know which framework was asking. Teams on Vue and teams on React consume the same `/auto/{Model}.json` and get native components in their own ecosystem, with no second UI schema to keep in step.

For more specialized experiences, both libraries expose the lower-level components independently:

- `SchemaResults` for a schema-powered query grid.
- `SchemaInput` for individual generated fields.
- `JsonSchemaForm` for arbitrary nested JSON Schema forms.
- `SchemaLookup` for reference pickers.
- `SchemaGrid` and `SortableColumn` for building a custom results view.

The same schema can therefore power the built-in page, a complete embedded CRUD tool or a custom workflow that only reuses selected pieces.

## A portable UI architecture

Traditional generated admin pages couple server metadata to one generated frontend. AutoQuery Schemas instead define a portable capability document delivered at runtime.

That architecture has several advantages:

- **Always current** — schemas are generated from the APIs running in the deployed application.
- **No generated source drift** — there is no second frontend model to regenerate and commit.
- **Incrementally customizable** — use the built-in page first, then embed or replace only the pieces that need a tailored experience.
- **Framework reusable** — the JSON contract can be rendered outside Vue by any client that understands its schema and UI hints.
- **Security aware** — the available operations reflect the current user's authorization.
- **Automation friendly** — tests, scripts and AI tools can consume the same `.json` representation.

The server publishes what can be done. Clients decide how it should look.

## From database to App in minutes

AutoQuery already makes it possible to expose an existing database with very little code. For example:

```csharp
[Tag("Bookings")]
[Route("/bookings", "GET")]
public class QueryBookings : QueryDb<Booking> { }

[ValidateHasRole("Employee")]
[AutoApply(Behavior.AuditCreate)]
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse>
{
    [ValidateNotEmpty]
    public string Name { get; set; } = "";

    public RoomType RoomType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
```

Once the AutoQuery CRUD APIs exist, `/auto/Booking` is immediately useful. Add descriptions, validation, references and input metadata to refine both the APIs and their generated experience.

This changes the economics of internal application development. Teams can begin with a secure, working data application, validate the workflow with users and invest in bespoke UI only where it creates real value.

<screenshot src="/img/posts/autoquery-schema/dto-to-crud.webp" title="Schema-generated Booking CRUD application"></screenshot>

## The structured foundation for AI-operated data

AutoQuery Schemas are also a natural complement to ServiceStack's [API Tools](/posts/api-tools).

AI Assistants can search for AutoQuery APIs, inspect their schemas and call them as the authenticated user. The model schema explains the records returned by a query, whilst the action schemas explain how records can be created or changed.

This supports experiences such as:

- “Show overdue invoices over $5,000, ordered by customer.”
- “Find tomorrow's bookings and move this one to the available conference room.”
- “Create a follow-up task for every high-priority support case assigned to me.”
- “Find products below their reorder threshold and prepare updates for approval.”

For writes, AI.Chat can render the proposed Request DTO with the same schema-driven inputs used by `/auto`. Since the renderer consumes the operation's API Schema, this works automatically for every discoverable AutoQuery write API. The user reviews and can edit the exact fields before approving the operation, whilst AutoQuery validation, authorization and audit behaviors remain server-side.

The grid UI and AI Assistant are two clients over the same typed capability layer: one starts with visual exploration, the other starts with natural language.

<screenshot src="/img/posts/autoquery-schema/chat-approval.webp" title="Schema-generated approval form"></screenshot>

## AutoQuery APIs that build their own Apps

With `/auto` and `/auto/{Model}`, ServiceStack's AutoQuery APIs no longer stop at delivering data. They describe the model, advertise its authorized operations and provide everything needed to render a complete CRUD application.

The built-in UI is immediately useful, the underlying Vue components are reusable and the JSON schema remains open to any future client—including AI Assistants.

Start with your data model. Add focused AutoQuery APIs. Open `/auto`.

The App is already there.

<screenshot src="/img/posts/autoquery-schema/autoquery-overview.webp" title="AutoQuery schema overview"></screenshot>

## Get Started

Nothing to install. `/auto` is registered with the Metadata feature, so any .NET 8+ ServiceStack App with AutoQuery APIs already serves it.

Run your App and open:

<text-block :rows="['/auto','/auto/{ModelName}','/auto/{ModelName}.json']"></text-block>

Every model with a Query API the signed-in user can access appears immediately. To get more out of the generated App, improve the APIs rather than the UI — `[Description]`, validation attributes, `[Input]`, `[Ref]` and `[Intl]`/`[Format]` all show up in the grid and forms.

To embed the components in your own App:

<shell-command class="mb-2">npm install @servicestack/vue</shell-command>
<shell-command>npm install @servicestack/react</shell-command>

And to withhold the built-in pages whilst keeping the JSON schemas your own components and AI Chat consume:

```csharp
services.ConfigurePlugin<MetadataFeature>(feature => {
    feature.DisableAutoQuerySchema = true;
});
```
