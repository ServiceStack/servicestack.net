---
title: Hardened ServiceStack - A Codebase-Wide Security & Reliability Audit
summary: ServiceStack v10.2 ships the results of an AI-assisted security and reliability audit across 36 packages, with every fix published for review - your Apps get safer defaults just by upgrading
tags: [servicestack, ai, security]
author: Demis
image: ./img/posts/hardened-security/bg.webp
---

## Security that arrives with the upgrade

Most of the code that decides whether your App is secure isn't code you wrote. It's the request pipeline
that parses every body, the serializer that turns hostile JSON into objects, the auth providers that compare
password hashes, the virtual file system that resolves paths and the background workers that keep running
long after deployment. When that layer has a weakness, every App built on it inherits it - and no amount of
careful application code can compensate.

For **ServiceStack v10.2** we put that entire layer through a codebase-wide, AI-assisted security and
reliability audit. The review covered ServiceStack's core runtime, authentication, data access, messaging,
cloud integrations, UIs, serialization, image processing and client libraries - **36 packages** in all - and
resolved the issues it found.

The value for existing Apps is that **this work happens beneath your code**. The trust boundaries, parsers
and background workers your App already relies on now handle malformed input, hostile input and concurrent
load more defensively. There's nothing new to install or learn: upgrade your packages and the hardening comes
with them.

Every change is published in a per-package
`SECURITY_CHANGES.md` report that your security team can review line by line.

<hardening-pillars></hardening-pillars>

## Hostile input can no longer become code

The most serious class of framework vulnerability is the one where data becomes behavior. Several paths where
an attacker-controlled payload could influence which types get created have been closed:

- **Untrusted runtime types are restricted.** `[Serializable]` has been removed from the attributes that permit
  polymorphic type creation in ServiceStack.Text. Many built-in .NET types carry that attribute, which made it
  far too broad an allowlist. Runtime types now require `[RuntimeSerializable]` or `[DataContract]`.
- **A process-wide deserialization bypass is gone.** Constructing the Azure Service Bus MQ server previously
  set `JsConfig.AllowRuntimeType = _ => true` - silently disabling runtime type validation for the *entire
  host process*. That global assignment has been removed.
- **`BinaryFormatter` paths are deprecated.** The legacy Redis `ObjectSerializer`, `OptimizedObjectSerializer`
  and `SerializingRedisClient` relied on `BinaryFormatter` and are now marked `[Obsolete]` with a clear warning.
  The primary `RedisClient` APIs never used them.

## Hostile documents can't take down your process

A server that can be crashed by one request isn't secure, whatever else it gets right. The parsers that read
untrusted input now bound the work any single document can cause:

- **Stack exhaustion is prevented.** Deeply nested or cyclic JSON and JSV payloads could previously recurse
  until an *uncatchable* `StackOverflowException` terminated the host. Every JSON, JSV, collection and
  dictionary parser now tracks depth and throws a normal `SerializationException` past `JsConfig.MaxDepth`
  (default `50`).
- **XML is parsed safely.** `XmlSerializer.DeserializeFromStream` now reads through an `XmlReader` that
  prohibits DTD processing and limits document size - closing **XXE**, **SSRF** and "billion laughs"
  entity-expansion attacks.
- **Regex backtracking is bounded.** Patterns vulnerable to catastrophic backtracking (ReDoS) in markup
  stripping, SQL fragment validation, cache key matching, user-agent parsing and OpenAPI filters were rewritten
  or given explicit match timeouts.
- **Caches can't be flooded.** Random `__type` names could previously grow the type-lookup cache without limit;
  negative lookups are now held in a separate cache capped at 1,000 entries.

## Queries, pages and exports mean what you wrote

Injection bugs are about attacker-controlled text changing the meaning of something - a SQL statement, an
HTML page or a spreadsheet:

- **SQL fragment validation can't be bypassed with an unclosed quote.** OrmLite verifies user-supplied
  fragments such as `q.OrderBy(userInput)`. An input with an unmatched quote like `'; DROP TABLE Users; --`
  previously caused everything after the quote to be stripped before verification, so the empty remainder
  passed as safe. Unclosed quotes are now treated as unsafe and rejected, and schema names are quoted in
  generated DDL.
- **CSV exports are safe to open in Excel.** Cells beginning with `=`, `+`, `-` or `@` can execute formulas
  when a user opens an exported file. `CsvConfig.EscapeFormulas` is now **enabled by default**, prefixing
  dangerous non-numeric cells so spreadsheets treat them as text - and unescaping them transparently when read
  back.
- **Dynamic HTML and JavaScript are encoded.** Values embedded in HTML format pages, Swagger UI and Blazor
  HTML helpers are now properly encoded, including escaping `<`, `>` and `&` in JavaScript strings so a value
  can't break out of a `<script>` block.
- **Desktop process arguments are escaped** so file names and URLs can't inject shell arguments.

## Paths and redirects stay inside their boundary

Virtual file access now behaves consistently across every storage provider, so a crafted path can't reach
beyond the directory it was meant for.

A good example of how subtle these bugs are: `FileSystemVirtualFiles` checked that a resolved path *started
with* the base path. With a base of `/var/app`, the relative path `../app_secret/file.txt` resolves to
`/var/app_secret/file.txt` - which starts with `/var/app` and was reported as safe. Paths must now match the
base exactly or continue past a directory separator.

- `..` segments are now resolved and contained in **S3**, **Azure Blob** and **Google Cloud Storage** virtual
  files, as well as local files.
- Blazor sign-in and sign-up pages now only honor **local return URLs**, so a link like
  `?return=https://attacker.com` can no longer bounce a freshly authenticated user to a phishing site.
- Service Clients reject unsafe redirect targets and URI schemes, and desktop file names are sanitized.

## Access control that holds

Authorization bugs matter most because nothing downstream can catch them. The audit corrected checks that
could admit the wrong user, tenant or connection:

- **Blazor Server circuit isolation.** Queued render actions were held in a `static` collection shared by every
  connected user, so one user's queued UI actions could run in another user's circuit. They're now scoped to
  each component instance.
- **Tenant identities are preserved.** `StripeGateway` accepted a Stripe Connect account but never sent the
  `Stripe-Account` header, so requests for connected merchants ran against the platform account. Redis ACL
  identities are likewise preserved across connections.
- **Distributed locks can't release someone else's lock.** A `RedisLock` that outlived its timeout could
  previously delete the lock a second client had since acquired. Release is now a check-and-delete that only
  removes a lock the instance still owns.

## Authentication that leaks nothing through timing

Password, digest and anti-forgery verification now use **fixed-time comparisons**, so an attacker can't
learn how much of a guess was correct from how long the comparison took. Random-number generation and
certificate loading were modernized, malformed hashes and signatures are rejected instead of throwing
unhandled errors, and native cryptographic handles are disposed deterministically.

`HttpUtils`' default `HttpClient` also no longer sends the current Windows identity (NTLM/Kerberos) to every
remote endpoint it calls - ambient credentials are now opt-in.

## Reliability you'll feel under load

A security audit that only chased CVE-shaped bugs would miss the failures that bring down real systems at
3am. The same review fixed:

- **Race conditions** in distributed locks, caches, serializers, background workers and type registries.
- **Leaks** of temporary files, sockets, streams, native memory, OS handles and event subscriptions - the
  slow kind that degrade a long-running server.
- **Sync-over-async and retry defects**, with cancellation now propagated where it was being dropped.
- **Deterministic disposal and shutdown**, so one failing callback no longer aborts the rest of the cleanup.
- **Correctness issues** in master/replica routing, cache key and update semantics, OpenAPI schema
  generation, route parameters, multipart requests, configuration parsing, image resizing, database metadata,
  query generation and message acknowledgement.

Together these changes make failures explicit instead of silently losing data, stop malformed external input
escalating into process-wide failures, and make behavior more predictable under concurrency, cancellation and
partial infrastructure outages.

## Safer defaults, with a documented way back

A few fixes change default behavior. Each is the safer choice for the vast majority of Apps, and each has a
documented opt-out for the rare App that depends on the old behavior:

| Default | Now |
| --- | --- |
| Polymorphic types via `[Serializable]` | Not allowed - use `[RuntimeSerializable]` or `[DataContract]` |
| JSON/JSV nesting depth | Limited to `50` levels |
| CSV formula escaping | Enabled |
| Ambient Windows credentials in `HttpUtils` | Not sent |
| XML DTD processing | Prohibited |
| `BinaryFormatter`-based Redis serializers | `[Obsolete]` - use the typed `RedisClient` APIs |

The preferred migration for polymorphic DTOs is to annotate them with `[RuntimeSerializable]` or
`[DataContract]`. Where an App genuinely needs the previous behavior, it can be restored at startup:

```csharp
// Allow [Serializable] types in polymorphic deserialization
JsConfig.AllowRuntimeTypeWithAttributesNamed.Add(nameof(SerializableAttribute));

// Allow deeper JSON/JSV object graphs
JsConfig.MaxDepth = 100;

// Export raw spreadsheet formulas in CSV
CsvConfig.EscapeFormulas = false;

// Send the current Windows identity from HttpUtils requests
HttpUtils.HttpClientHandlerFactory = () => new HttpClientHandler {
    UseDefaultCredentials = true,
    AutomaticDecompression = DecompressionMethods.Brotli
        | DecompressionMethods.Deflate | DecompressionMethods.GZip,
};
```

## Every change, published for review

Security teams shouldn't have to take an upgrade on faith. Each package's `SECURITY_CHANGES.md` describes
every finding it addressed - what the issue was, its severity, what changed and how to configure or revert
it where that applies:

<audit-reports></audit-reports>

## Upgrade to get it

The hardening is included in **ServiceStack v10.2**. There are no new packages to install and no new APIs to
adopt - upgrade your `ServiceStack.*` package references and your App runs on the hardened framework.

Before deploying, review the [safer defaults](#safer-defaults-with-a-documented-way-back) above against your
App, and skim the audit reports for the packages you use. See the
[v10.2 Release Notes](https://docs.servicestack.net/releases/v10_02) for everything else in this release.
