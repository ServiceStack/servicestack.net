---
title: API Schemas - every API now comes with its own UI
url: https://docs.servicestack.net/api-schema
image: /img/posts/api-schema/bg.webp
order: 3
---

Every ServiceStack API now publishes a portable JSON Schema at **/schema/{RequestDto}.json** describing its fields, nested types, validation, authorization requirements, HTTP method and execution URL. Remove the `.json` and the same route serves a complete executable UI - a responsive form, live request preview, copyable `curl` command, execution and response panel - with no application UI to write. Browse everything available to the current user at **/schema**.

Because each API carries its own self-contained contract, clients load one focused schema instead of the App's entire metadata graph, so an App can grow from ten APIs to ten thousand without making a single form heavier. The generic `ApiFormSchema` and `JsonSchemaForm` components are published in both `@servicestack/vue` and `@servicestack/react` for embedding in your own Apps - and they're what lets AI Chat render a trustworthy human-in-the-loop approval form for any API a Model proposes calling.
