---
title: Typed ServiceStack APIs for Go, Rust, Ruby and Zig
summary: Add ServiceStack Reference now brings end-to-end typed APIs to 15 of the world's most popular programming languages-from websites and mobile apps to cloud services and systems software.
tags: [servicestack, go, rust, ruby, zig]
author: Demis
image: ./img/posts/go-rust-ruby-zig-typed-apis/bg.webp
---

## 15 languages. One API.

ServiceStack has always been built around a simple idea: define your APIs once, then make them feel native everywhere they are used.

<div class="-mt-8 not-prose flex items-center justify-evenly">
    <a href="https://docs.servicestack.net/go-add-servicestack-reference">
        <img class="size-40" src="/img/langs/go.svg">
    </a>
    <a href="https://docs.servicestack.net/rust-add-servicestack-reference">
        <img class="size-20" src="/img/langs/rust.svg">
    </a>
    <a href="https://docs.servicestack.net/ruby-add-servicestack-reference">
        <img class="size-20" src="/img/langs/ruby.svg">
    </a>
    <a href="https://docs.servicestack.net/zig-add-servicestack-reference">
        <img class="size-20" src="/img/langs/zig.svg">
    </a>
</div>

With first-class support for **Go, Rust, Ruby and Zig**, Add ServiceStack Reference now generates end-to-end typed API integrations for **15 of the world's most popular programming languages**:

- **.NET:** C#, F# and VB.NET
- **Web and scripting:** TypeScript, JavaScript, Python, PHP and Ruby
- **Mobile:** Swift, Java, Kotlin and Dart
- **Cloud and systems:** Go, Rust and Zig

This is more than generating classes from JSON. Each language gets clean native DTOs and an idiomatic, feature-rich Service Client that understands the API contract: request and response types, HTTP method, routes, authentication, structured errors, validation failures, AutoQuery conventions and more.

Your ServiceStack Request DTO remains the source of truth. Developers add a reference to the running API and receive the types and client integration needed to call it naturally from their chosen platform.

One backend can now serve a TypeScript website, a Swift or Kotlin mobile App, a Python automation, a Ruby business system, a Go cloud service, a Rust application and Zig systems software-without maintaining a separate hand-written SDK for each one.

## One API. 15 Languages. Zero Hand-Written SDKs.

Define your contract once. Every developer gets clean native DTOs, an idiomatic feature-rich Service Client, editor autocomplete, and compile-time confidence - generated directly from a running API, not hand-written and left to drift.

In this video, see how Add ServiceStack Reference replaces brittle JSON parsing, manual route wiring, and the ongoing maintenance of bespoke SDKs with a single, end-to-end typed source of truth across 15 modern programming languages (now including Go, Rust, Ruby, and Zig).

<div class="not-prose mx-auto my-10 w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 shadow-2xl dark:border-slate-700">
  <lite-youtube class="block w-full aspect-video" videoid="Rp9JIcNLdKQ"
                style="max-width: none; background-image: url('https://img.youtube.com/vi/Rp9JIcNLdKQ/maxresdefault.jpg')">
  </lite-youtube>
</div>

## The world's most important API, in every language

The OpenAI-compatible Chat Completions API may be the most consequential API introduced in modern software development. It has become a common interface between applications and increasingly capable AI models, powering assistants, agents, search, document intelligence, automation and entirely new product experiences.

It also makes an ideal demonstration of what end-to-end typed APIs provide. `ChatCompletion` is not a trivial request: it contains nested messages, polymorphic content, model settings and a rich response graph. With Add ServiceStack Reference, that entire contract becomes native code in every supported language.

Choose a language below to see the same typed `ChatCompletion` API called from all 15 languages:

:::{.-ml-60 .w-auto .not-prose}
<open-ai-chat class="w-7xl"></open-ai-chat>
:::

The important part is not that each example can send HTTP. Every language can send HTTP. The difference is that developers work with the API as native types, with editor completion and compile-time feedback, whilst the Service Client handles serialization, routes, headers, authentication and response deserialization.

There are no hand-written URLs, anonymous JSON objects or duplicated response models. The request DTO knows which response it returns and the generated integration tells the client how it should be sent.

## Add a reference, not another SDK project

Traditional SDK development multiplies work. Every API change must be reflected in documentation, models and client code for each platform. Generated SDKs can reduce that work, but often introduce large toolchains, verbose output and clients that feel foreign to the language using them.

Add ServiceStack Reference takes a lighter approach. It reads the rich metadata already published by your ServiceStack App and generates a single source file containing native DTOs tailored to the target language.

Two steps in any language - add the client, then generate the DTOs:

<dto-quick-start class="-ml-[25%] w-6xl" selected="go"></dto-quick-start>

Run the same command whenever the API changes. New APIs and fields appear in the generated DTOs; removed or changed members become visible to the language's own compiler, type checker or development tools.

This keeps the integration coupled to the API contract instead of to a manually maintained document. API descriptions and validation metadata travel with the generated types, so the code developers consume is also the documentation they see in their editor.

The result is a development loop that scales cleanly:

1. Define or update a typed ServiceStack Request DTO.
2. Implement it once on the server.
3. Refresh the ServiceStack Reference in any client.
4. Call the API with native types.

No schema translation layer. No parallel SDK release train. No drift between a wiki and the API that is actually deployed.

## Go: simple, typed APIs for cloud software

Go has become a natural home for cloud services, infrastructure, networking tools and operational software. Its appeal comes from simplicity, fast builds, straightforward deployment and excellent concurrency support. The new [`servicestack-go`](https://github.com/ServiceStack/servicestack-go) client preserves those qualities.

Generated request DTOs carry their response type and HTTP method, allowing Go's generic ServiceStack client to infer the complete API call:

```go
res, err := ss.Send(client, dtos.Hello{Name: "World"})
if err != nil {
    log.Fatal(err)
}
fmt.Println(res.Result)
```

The library uses Go's standard library with no external runtime dependencies. It provides `context.Context` variants for cancellation and deadlines, structured `ResponseStatus` errors, field validation errors, typed AutoQuery responses, multipart uploads, batched and one-way requests, and authentication using Basic Auth, API Keys, JWTs, refresh tokens or session cookies.

That makes it suitable for everything from a small command-line tool to a long-running cloud service. Go developers retain familiar `error` handling and context propagation whilst gaining a client that understands ServiceStack APIs.

## Rust: correctness from the wire to application code

Rust is chosen when performance, memory safety and correctness matter together: secure services, developer tooling, cross-platform applications and high-performance systems.

The [`servicestack`](https://crates.io/crates/servicestack) crate brings the same priorities to API integration. Generated DTOs implement the traits that associate each request with its response, route and HTTP method, so calls remain concise and strongly typed:

```rust
let response = client.send(&Hello {
    name: "World".to_string(),
}).await?;

println!("{}", response.result);
```

The async client is the default, with an optional blocking client for applications that prefer synchronous execution. It supports structured ServiceStack errors, authentication and automatic token refresh, typed AutoQuery, multipart uploads, batch and one-way calls, and access to the underlying `reqwest` configuration when an application needs finer control.

Most importantly, the generated contract turns changes at the API boundary into ordinary Rust compiler feedback. Developers do not need to scatter `serde_json::Value` through business logic or manually specify response types at every call site. The API becomes part of the program's type system.

## Ruby: ServiceStack productivity in a dynamic language

Ruby remains one of the most productive languages for building web products, internal systems, automation and integrations. Its expressiveness lets teams move quickly, but remote APIs can still become a source of runtime surprises when their contracts live only in documentation.

The [`servicestack`](https://rubygems.org/gems/servicestack) Ruby gem provides generated DTOs with explicit properties and API metadata, giving editors and developers a discoverable model of every request and response:

```ruby
client = ServiceStack::JsonServiceClient.new(base_url)

response = client.send(Hello.new(name: 'World'))
puts response.result
```

It is implemented with Ruby's standard library and has no external runtime dependencies. The client includes structured `WebServiceException` errors, field validation details, authentication, typed AutoQuery conventions, batch calls, one-way requests, custom URLs and file uploads.

Ruby keeps its natural named-argument syntax and fast feedback loop. ServiceStack adds a consistent contract, rich metadata and a client that removes repetitive integration code-bringing more confidence without making Ruby feel like another language.

## Zig: explicit, efficient APIs for systems software

Zig gives systems developers precise control over memory, allocation and platform behavior with a small language and toolchain. It is increasingly attractive for native utilities, embedded-adjacent software, games, libraries and performance-sensitive applications.

[`servicestack-zig`](https://github.com/ServiceStack/servicestack-zig) is built in the same spirit. It uses Zig's standard library with no third-party dependencies, infers the response type at compile time and makes ownership explicit:

```zig
var client = try ss.JsonServiceClient.init(allocator, base_url);
defer client.deinit();

var response = try client.send(dtos.Hello{
    .name = "World",
});
defer response.deinit();
```

The caller supplies the allocator and owns the parsed response lifecycle. At the same time, the client still provides the higher-level behavior expected from ServiceStack: structured errors, validation details, authentication, session cookies, typed AutoQuery, batch and one-way requests, custom URLs and multipart uploads.

Zig applications can therefore consume rich business APIs without giving up the explicit resource management and minimal dependency surface that brought them to Zig in the first place.

## One consistent capability set, expressed natively

The four clients do not try to force a single language's style everywhere. Go returns values and errors. Rust supports async results and optional blocking calls. Ruby uses natural constructors and exceptions. Zig makes allocation and cleanup visible.

What remains consistent is the capability of the integration:

- **Typed request and response DTOs** generated from the live ServiceStack API
- **Response and HTTP method inference** from request metadata
- **Structured errors** including `ResponseStatus` and field validation failures
- **Authentication** using the mechanisms supported by each platform, including API Keys, Bearer tokens, JWTs and sessions
- **Typed AutoQuery responses** for querying rich data APIs without hand-building query plumbing
- **Batch and one-way APIs** for efficient workflows and messaging patterns
- **Multipart and file uploads** for APIs that go beyond JSON-only requests
- **Custom routes and URLs** when an integration needs direct HTTP control

This balance is what makes a generated integration feel like a real client library instead of a dump of data classes. ServiceStack standardizes the behavior and contract whilst each implementation stays idiomatic to its ecosystem.

## Typed APIs are an architectural advantage

End-to-end typing is often described as developer convenience, but its larger value is architectural.

An API contract is a boundary between teams, applications and release schedules. If that boundary is represented by copied JSON examples, every consumer has to interpret and maintain it independently. Small server changes become latent runtime failures spread across a fleet of clients.

With Add ServiceStack Reference, the deployed API publishes the machine-readable contract used to create each native integration. Consumers can refresh it on demand and let their existing language tools identify affected code. Validation errors return in a common structured format. Authentication and transport behavior live in the reusable client instead of being reimplemented by every team.

This is especially valuable for organizations with a polyglot architecture. A mobile team and a systems team do not need to agree on one programming language to share the same precise API contract. Each can use the platform best suited to its product whilst the ServiceStack backend remains consistent.

## From websites to systems software

The addition of Go, Rust, Ruby and Zig completes an unusually broad client story.

ServiceStack APIs can now be consumed natively from the dominant .NET languages, every major browser and server scripting ecosystem, the leading mobile platforms, and the languages increasingly used to build modern cloud infrastructure and systems software.

That opens up practical combinations which previously required custom client work:

- A TypeScript web App and Swift/Kotlin mobile Apps sharing the same backend
- Go workers and command-line tools automating operational APIs
- Rust desktop software consuming authenticated business services
- Ruby applications integrating with an organization's ServiceStack platform
- Zig utilities calling the same APIs from a minimal native binary
- AI features exposed once through `ChatCompletion` and used from all of them

The backend team continues to design ordinary typed ServiceStack APIs. Every client team gets native models, native tooling and a capable Service Client in the language they already use.

## Build the API once. Use it everywhere.

Supporting another platform should not require inventing another integration architecture.

Add ServiceStack Reference turns your existing API metadata into the native contract each client needs. The new Go, Rust, Ruby and Zig libraries extend that experience to 15 languages spanning websites, mobile Apps, cloud services, automation and systems software.

Your APIs are already typed. Now virtually every application your organization wants to build can be typed end to end as well.

## Get Started

Nothing needs to be installed or configured on the server. Every ServiceStack App already publishes the metadata `get-dtos` reads, so you can point it at an API you run - or one of ours - right now:

<shell-command>npx get-dtos go https://vue-spa.web-templates.io</shell-command>

Then add the client library for your language and make the first call:

- **Go** - [servicestack-go](https://github.com/ServiceStack/servicestack-go) · [docs](https://docs.servicestack.net/go-add-servicestack-reference)
- **Rust** - [servicestack crate](https://crates.io/crates/servicestack) · [docs](https://docs.servicestack.net/rust-add-servicestack-reference)
- **Ruby** - [servicestack gem](https://rubygems.org/gems/servicestack) · [docs](https://docs.servicestack.net/ruby-add-servicestack-reference)
- **Zig** - [servicestack-zig](https://github.com/ServiceStack/servicestack-zig) · [docs](https://docs.servicestack.net/zig-add-servicestack-reference)

Run `npx get-dtos` with no arguments to list all 15 supported languages.

---

This is the first post in our latest release series. Next we look at the AI capabilities added to ServiceStack Apps in this release, starting with [AI Chat v4](/posts/ai-chat-v4).
