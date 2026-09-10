---
title: Gemini RAG - AI Answers Customers can Verify from your Content
summary: Turn the files, docs and websites you already maintain into managed knowledge bases, then publish a citation-backed AI Assistant and instant, model-free Website Search to any site with one script tag
tags: [ai, gemini, rag]
author: Demis
image: ./img/posts/gemini-rag/bg.webp
---

## Put the content you already have to work

Every organization already has the knowledge its customers are looking for. It's in the documentation
repo, the product site, the blog, the support PDFs and the pages of a sister site nobody remembers the
URL of. The problem is rarely that the answer doesn't exist - it's that nobody can find it, and nobody
can tell whether an AI's confident reply actually came from it.

Building a trustworthy RAG system to fix that normally means assembling a crawler, a document
catalogue, a vector database, synchronization jobs, an administration UI, an embeddable chat widget and a
search box - before a single customer gets an answer.

**Gemini RAG** replaces that project with a built-in [AI Chat](/posts/ai-chat-v4) extension. It combines
Google Gemini's [File Search](https://ai.google.dev/gemini-api/docs/file-search) retrieval with
ServiceStack's content ingestion, metadata management, local data ownership and AI Chat UI - living
inside the ServiceStack App you already run, using its users, its database and its security boundary.

Import files, documentation repositories or entire websites into isolated **File Stores**, curate them
with metadata, then publish two public experiences from the same content:

- a citation-backed **Website Assistant** that answers from your approved documents, and
- an instant **Website Search** answered entirely by your own database, at **no cost per query**.

Both are embedded in any website with a single script tag.

<screenshot src="/img/posts/gemini-rag/gemini-28-chat-ask.webp" title="A grounded answer with citations beside every supported claim"></screenshot>

:::tip You've probably used it already
The **Search** box and **Ask AI** assistant on [docs.servicestack.net](https://docs.servicestack.net) are
both published Gemini RAG deployments, indexed from the same Markdown and Razor pages that power the site.
:::

<gemini-pipeline></gemini-pipeline>

## Everything needed to run a trusted knowledge system

| Capability | Customer benefit |
| --- | --- |
| **Managed File Stores** | Separate knowledge by product, team, customer, access boundary or lifecycle. |
| **Multiple ingestion paths** | Upload files and ZIPs, synchronize maintained folders, or crawl complete websites. |
| **Previewable synchronization** | See new, changed, removed and unchanged documents before committing an import or paying for embedding work. |
| **Cross-site knowledge** | Combine several websites and repositories behind one Assistant and one Search box. |
| **Metadata-scoped retrieval** | Search only the category, doc type, status, locale, product, version and tags relevant to each experience. |
| **Grounded answers and citations** | Keep responses anchored to indexed content and let readers open the evidence behind every claim. |
| **Embeddable Website Assistants** | A branded, responsive AI support experience on any site with one script tag. |
| **Model-free Website Search** | Instant <kbd>⌘K</kbd> documentation search answered by your own RDBMS, at no cost per query. |
| **Search & traffic analytics** | See what visitors search for, what returns nothing, and optionally chart first-party traffic without a third-party tracker. |
| **Conversation review** | Read what customers actually ask, find documentation gaps and improve the source material. |
| **Operational visibility** | Monitor uploads, audit metadata coverage and reconcile your catalogue with Gemini's indexed state. |

## Your knowledge base lives in your App

Most hosted RAG services ask you to hand over your content, manage another set of user accounts and
trust an opaque index you can't inspect. Gemini RAG takes the opposite approach.

AI Chat keeps the **authoritative** document catalogue, cached source files, imports, metadata, local
Search index, published widgets, analytics, Assistants and conversation history in your App and its
OrmLite database. Gemini File Stores hold only the indexed copies used for semantic retrieval.

<data-ownership></data-ownership>

That split has practical consequences:

- **You can always see what's indexed** - and what isn't - without asking a third party.
- **Your existing users manage it** - Gemini RAG inherits AI Chat's [Integrated Auth](https://docs.servicestack.net/chat/auth),
  so File Stores and catalogues are managed with the accounts and roles your App already has, and
  write access can be restricted to a role like `Admin`.
- **Your backups cover it** - back up the database and AI Chat's `App_Data` together and you have
  everything needed to rebuild the index.
- **No Google SDK dependency** - the extension talks directly to Gemini's HTTP APIs.

## Bring files, folders and websites into one pipeline

Whatever shape your knowledge is in today, there's an ingestion path that doesn't require writing an
indexer:

<screenshot src="/img/posts/gemini-rag/gemini-import-methods.webp" title="Upload files, synchronize folders or crawl a website"></screenshot>

### Upload files and ZIPs

Drop in PDFs, Markdown, HTML, CSV, JSON, YAML and other supported documents. A ZIP is expanded safely
and its folder structure becomes browsable categories automatically, while hidden files, dependencies
and build output are excluded for you. HTML and Razor `.cshtml` pages are converted to clean Markdown
first, so rendered content is searchable without leaking server-side directives into results.

### Synchronize maintained folders

Point a folder import at a documentation repo with include/exclude globs, a category root and metadata
rules, then **save it as a recurring import**. Re-run it whenever the source moves on and only the
documents that actually changed are embedded again - the saved source key identifies the same document
across runs while separate content and metadata hashes decide what changed.

When an upstream file disappears its indexed copy is removed and a visible tombstone is kept, while a
deletion safety rail refuses an unexpectedly large removal - protecting you from a mistyped path or an
incomplete source listing.

Import configuration can also live alongside the content itself in a versioned `import.json`, with
nested manifests inheriting and overriding settings for the folders beneath them:

```json
{
  "version": 1,
  "metadata": {
    "defaults": {
      "product": "ServiceStack",
      "status": "published",
      "tags": ["docs"]
    },
    "rules": [
      { "match": "auth/**/*.md", "set": { "tags": ["auth"] } }
    ]
  },
  "transforms": [
    {
      "match": "**/*.md",
      "pattern": "\\nEdit this page.*$",
      "replacement": "",
      "flags": "gim"
    }
  ]
}
```

### Crawl a website you don't own the source of

Enter a start URL and crawl the site into a **private Markdown workspace**. Include and exclude paths,
page and depth limits, query-string handling, `robots.txt`, `noindex`, canonical URLs and duplicate
content are all handled explicitly. Ordered regex transforms then strip navigation and boilerplate, and a
read-only page browser lets you inspect the cleaned result **before anything is sent to Gemini**.

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4"
    :images="{
      'Define crawl boundaries': '/img/posts/gemini-rag/gemini-04-import-web-crawl-config.webp',
      'Clean pages with previewable transforms': '/img/posts/gemini-rag/gemini-06-import-web-crawl-transforms-applied.webp',
    }"></screenshots-gallery>

### See the diff before you pay for it

Folder and website imports are always previewed first. Every document is classified as **added**,
**updated**, **metadata-only**, **unchanged**, **missing** or **failed**, so embedding work and
destructive changes are visible before they're applied. Only **Import N documents** commits the
change.

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4"
    :images="{
      'Configure a folder import': '/img/posts/gemini-rag/gemini-23-import-folder.webp',
      'Preview what will change': '/img/posts/gemini-rag/gemini-25-import-folder-preview.webp',
    }"></screenshots-gallery>

Uploads use bounded concurrency with retries, and pending work is tracked in the database rather than
an in-memory queue - so an App restart mid-import resumes where it left off instead of silently losing
documents.

<gemini-workflow></gemini-workflow>

## One Assistant that knows every site you maintain

A File Store isn't tied to one website. Point as many saved imports at it as you like - docs repos,
blog posts, Razor marketing pages, product sites you only have the HTML of - and every one of them lands
in the same catalogue, behind **one Assistant** and **one Search box**.

The File Store behind our own documentation combines **five saved imports from four independently
maintained sites** - [docs.servicestack.net](https://docs.servicestack.net/),
[servicestack.net](https://servicestack.net/), [react-templates.net](https://react-templates.net/) and
[sharpscript.net](https://sharpscript.net/) - into 813 documents:

<screenshot src="/img/posts/gemini-rag/gemini-27-explore.webp" title="Five imports, four websites, one File Store"></screenshot>

- **Your users ask once.** Nobody has to guess which of your sites holds the answer, or repeat the
  same question in three different search boxes.
- **Answers cross site boundaries.** "How do I use SharpScript in a Razor page?" can draw on the docs,
  the SharpScript reference and a blog post at once - a connection no single-site search can make.
- **Each source stays its own folder.** Every import lands under its own top-level category, so one
  site's content can be browsed, filtered, re-synced or deleted without touching the rest.
- **There's one thing to run.** One store to sync, one Assistant to configure, one widget to embed and
  one analytics dashboard - instead of a separate RAG stack per website.

## Retrieve the right knowledge, not merely more of it

A large corpus only becomes useful when retrieval can exclude the stale, the unapproved and the
irrelevant. Every document carries structured metadata - **category, doc type, status, locale,
product, versions and tags** - that becomes a server-enforced filter:

```sql
status="published" AND product="servicestack"
  AND versions:"v10" AND NOT status="deprecated"
```

The Explorer turns that metadata into navigable categories, facet filters and **coverage reports**
that find the documents missing the metadata your filters depend on - before a customer finds the gap
for you. Metadata can be corrected with **staged bulk edits** that show how many documents will change,
then pushed to Gemini as one intentional re-indexing pass.

<screenshot src="/img/posts/gemini-rag/gemini-30-explore-filters.webp" title="Facet filters compose into the same filter Gemini File Search receives"></screenshot>

### Citations that lead somewhere useful

An answer is only verifiable if its citation opens the real page. **Source URL templates** build a
canonical public link for every document from path variables, a Razor page's `@page` route, or a regex
over the filename:

:::copy
`https://docs.example.com/{pathNoExt}`
:::

:::copy
`https://servicestack.net{route}`
:::

:::copy
`https://servicestack.net/posts/{name:/^[^_]+_(.+)$/}`
:::

The last template turns `2026-09-04_servicestack-pdf.md` into
`https://servicestack.net/posts/servicestack-pdf`, which is exactly how this blog's posts are cited.
Enable **Require a Source URL** and documents that can't resolve to a public page - like Razor layouts
and partials - are excluded from the index entirely.

<screenshot src="/img/posts/gemini-rag/gemini-import-webcrawl-sharpscript-import-metadata.webp" title="Metadata defaults and a regex Source URL template"></screenshot>

## Ask grounded questions and inspect the evidence

Start a chat over the whole File Store, a single document, or the **exact filtered view** currently on
screen. The filter you see in Explorer is the filter passed to Gemini, so what you test is what a
published experience will retrieve - and a public product assistant and an internal research chat can
share a corpus without sharing a scope.

Grounded answers stream as Markdown with citation markers beside supported claims. Expand **Sources**
to read the retrieved excerpt behind each claim or follow it to its canonical URL. Citations are retained
as the conversation continues, so an answer stays auditable instead of asking readers to trust fluent
output.

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4"
    :images="{
      'Chat scoped to the filtered view': '/img/posts/gemini-rag/gemini-31-chat-filters.webp',
      'The evidence behind it': '/img/posts/gemini-rag/gemini-29-chat-ask-sources.webp',
    }"></screenshots-gallery>

## Publish a Website Assistant with one script tag

Any File Store - or a server-enforced slice of one - becomes a branded, citation-backed support
experience on any website:

```html
<script
  src="https://app.example.com/chat/ext/gemini/public/assistants/widget.js?g=abc123"
  async>
</script>
```

The self-contained widget streams Markdown answers with citations, suggested questions and a welcome
message, supports maximized reading and <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd> launch, and keeps
each visitor's session across page loads. It renders inside a **Shadow DOM**, so the host site's CSS
can't break it and its keyboard handling can't trigger the site's shortcuts. Float it in a corner, or
mount its launcher inside your own nav bar.

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4"
    :images="{
      'Identity and suggested questions': '/img/posts/gemini-rag/gemini-41-assistant-identity.webp',
      'Server-enforced document scope': '/img/posts/gemini-rag/gemini-43-assistant-document.webp',
    }"></screenshots-gallery>

### The host page can style it. It can't weaken it.

Retrieval scope, the private system prompt, model selection, allowed origins and rate limits stay on the
server - they never appear in the embed code. The host page may override safe presentation choices like
theme, accent color, launcher icon and position, and nothing else.

Answers can be held to an evidence standard that's enforced on the server, not merely requested in a
prompt. With **Require retrieved evidence** enabled, a response that comes back with fewer than your
**minimum citations** is replaced by your fallback message - and streaming is buffered until the
evidence has been checked, so unsupported text is never shown to a visitor.

<screenshot src="/img/posts/gemini-rag/gemini-assistant-required-citations.webp" title="Server-enforced grounding controls"></screenshot>

### Purpose-built assistants from one knowledge base

Seven editable **behavior templates** - documentation guide, technical troubleshooter, customer support,
developer/API assistant, product advisor, onboarding guide and policy & procedures - provide strong
starting points. Combined with response styles, custom prompts and document scopes, the same knowledge
base can power several focused experiences without duplicating its content.

Every Assistant is fully brandable with **Auto**, **Light**, **Dark**, **Nord**, **Matrix** and
**Soft Pink** themes, each a preset you can override color by color, plus a customizable launcher:

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-2 md:grid-cols-4 gap-4"
    :images="{
      'Light': '/img/posts/gemini-rag/gemini-44-assistant-appearance-light.webp',
      'Dark': '/img/posts/gemini-rag/gemini-45-assistant-appearance-dark.webp',
      'Nord': '/img/posts/gemini-rag/gemini-46-assistant-appearance-nord.webp',
      'Matrix': '/img/posts/gemini-rag/gemini-12-assistant-appearance-matrix.webp',
    }"></screenshots-gallery>

Assistants follow a complete draft, publish, unpublish, archive and restore lifecycle. Regenerating a
deployment ID invalidates old embeds immediately, and **Run diagnostics** checks publication, store
access, indexed documents, model selection, allowed origins and the widget URL before customers ever
see it.

## Publish site search that costs nothing per query

The same imported documents also build a **full-text index inside the database your App already uses**,
so one content pipeline powers two public experiences. **Website Search** is completely independent of
Gemini: queries never reach a model, never incur usage costs and never leave your App.

```html
<script
  src="https://app.example.com/chat/ext/gemini/public/searches/widget.js?g=abc123"
  async>
</script>
```

<search-engine-matrix :columns="2"></search-engine-matrix>

The widget gives visitors the interaction they already expect from a documentation site:
<kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd> and <kbd>/</kbd> shortcuts, keyboard navigation, grouped
results with match highlighting, infinite scrolling and recently opened links. Results open the
document's canonical page and anchor, or a rendered in-place preview when it has none.

<screenshot src="/img/posts/gemini-rag/gemini-61-search-widget.webp" title="The published Website Search widget"></screenshot>

### Tune relevance against real results

One consistent ranking model runs across every database, with tunable weights for titles, headings, body
text, exact phrases, exact titles, content freshness and preferred document types. Every adjustment
re-queries immediately against the same term, so relevance is tuned against actual results instead of
guessed at - and across a multi-site store you decide which sources and document types should win.

<screenshot src="/img/posts/gemini-rag/gemini-59-search-ranking.webp" title="Ranking weights beside live test results"></screenshot>

<two-experiences></two-experiences>

## Learn what your visitors are looking for

### Search analytics

Every published Search reports its own demand and quality signals without adding any model usage:
total searches, click-through rates, popular documents and the latest queries with their originating
page. Related queries are grouped by normalized wording so near-identical phrasings count as one intent,
and **no-result searches point directly at the documentation you haven't written yet**.

<screenshot src="/img/posts/gemini-rag/gemini-search-searches.webp" title="Customer searches grouped by intent, with no-result queries"></screenshot>

### Optional first-party website analytics

Because the Search script is already on every page, it can optionally double as a lightweight website
analytics system - page views, visitors, sessions, bounce rate, load times, referrers, campaigns,
devices and platforms, charted over 24 hours, 7, 30 or 90 days.

It's **off by default** and privacy-respecting by design: no cookies, no precise location, IPs
anonymized to an IPv4 `/24` or IPv6 `/48`, Do Not Track honored, known bots and your own IPs excluded,
retention enforced automatically, and an optional consent callback to gate collection entirely. IP
geography is only resolved if you explicitly register a resolver. The data stays in your database
rather than a third party's.

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4"
    :images="{
      'Website traffic': '/img/posts/gemini-rag/gemini-search-analytics-results.webp',
      'Privacy controls': '/img/posts/gemini-rag/gemini-62-search-analytics.webp',
    }"></screenshots-gallery>

### Close the loop with every conversation

Website Assistant conversations, messages and citations are retained server-side for your team to
review, with each conversation showing the page it started on. Discover what visitors actually need,
find weak or missing coverage and improve the source material - then the next synchronized import
improves every Assistant and search result grounded in it.

<screenshot src="/img/posts/gemini-rag/gemini-assistant-conversations.webp" title="Reviewing customer conversations and their citations"></screenshot>

## Maintainable long after the first demo

The hard part of a knowledge base isn't the first import - it's knowing months later what's indexed,
what drifted and what quietly failed. Gemini RAG is built for that second year:

- **Restart-safe workers** - both the Gemini upload worker and the local Search indexer track desired and
  completed hashes in the database, so interrupted work resumes instead of disappearing.
- **Failures stay visible** - a failed document keeps its provider error for inspection and one-click
  retry rather than silently vanishing from the corpus.
- **Reconciliation** - **Sync Store** compares your catalogue against Gemini and reports missing
  documents, metadata drift and duplicate indexed copies, with links straight to the affected filter.
- **Index health** - total, indexed, pending, stale and failed counts, the active database provider,
  last successful index time and recent errors, at a glance.
- **Pre-flight diagnostics** - validate every Search and Assistant deployment before customers hit it.
- **Deletion you can reason about** - destructive operations summarize exactly what they cascade through
  and require typed-name confirmation.

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-3 gap-4"
    :images="{
      'Index health': '/img/posts/gemini-rag/gemini-search-index-health.webp',
      'Local and remote reconciliation': '/img/posts/gemini-rag/gemini-21-filestore-sync.webp',
      'Deployment diagnostics': '/img/posts/gemini-rag/gemini-search-deployment-diagnostics.webp',
    }"></screenshots-gallery>

## No vector database bill

Managed RAG architectures commonly carry a recurring charge just to keep embeddings stored. With Gemini
File Search, Google currently charges for embeddings when documents are **indexed**, while **file storage
and query-time embeddings are free**:

<storage-economics></storage-economics>

An organization can therefore maintain durable knowledge bases and pay primarily when content is indexed
and when users actually ask - while previewed imports, content hashing and deduplication make sure the
same document is never paid for twice. Website Search adds no model cost at all.

:::info
Pricing and limits are Google's and can change - check the current
[Gemini File Search pricing and limits](https://ai.google.dev/gemini-api/docs/file-search) before deploying.
:::

## Get Started

Gemini RAG is a built-in AI Chat extension for **.NET 8+** ServiceStack Apps. It enables itself
automatically once the App has a Gemini API key and an `IDbConnectionFactory` for its local catalogue.

**1. Add AI Chat** to your App:

<shell-command>npx add-in chat</shell-command>

**2. Add a Gemini API key** from [Google AI Studio](https://aistudio.google.com/) to the App's
environment, and make sure at least one Google Gemini chat model is enabled in AI Chat:

```bash
GOOGLE_API_KEY=your_api_key
# or
GEMINI_API_KEY=your_api_key
```

**3. Create a File Store** from the **Gemini** icon in the `/chat` toolbar, then import a few documents.
The quickest start is a folder import pointed at the docs folder of a repo you already have.

**4. Ask your first grounded question** from **New Chat** and expand **Sources** to inspect the
evidence.

**5. Publish** a **Search** widget for instant navigation and an **Assistant** for grounded answers -
two script tags, one set of curated documents.

See the [Gemini RAG](https://docs.servicestack.net/rag) overview, or dive into the docs:

- [Overview & Setup](https://docs.servicestack.net/chat/gemini-rag)
- [Importing Documents](https://docs.servicestack.net/chat/gemini-imports)
- [Crawling Websites](https://docs.servicestack.net/chat/gemini-crawling)
- [Metadata & Source URLs](https://docs.servicestack.net/chat/gemini-metadata)
- [Explore & Ask](https://docs.servicestack.net/chat/gemini-explore)
- [AI Assistants](https://docs.servicestack.net/chat/gemini-assistants)
- [Website Search](https://docs.servicestack.net/chat/gemini-search)
- [Search Analytics & Privacy](https://docs.servicestack.net/chat/gemini-analytics)
- [Operations & Troubleshooting](https://docs.servicestack.net/chat/gemini-operations)
