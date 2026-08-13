---
title: PDF Studio - from AI design to production PDFs
url: /pdf
image: /img/posts/servicestack-pdf/bg.webp
order: 5
---

ServiceStack's new PDF support covers the whole document lifecycle: design [Typst](https://typst.app) templates in **PDF Studio** at `/chat/pdf` with live preview and AI-assisted editing - describe changes in plain English, or attach a screenshot of an existing document for a vision model to recreate as a reusable template and JSON data contract. Publishing validates the template, checks every named fixture against its schema, compiles them all, exercises C# model generation and saves an immutable revision.

Administrators manage what production can render at **/admin-ui/pdf**, test the exact deployed template against real data and generate strongly typed C# models. `IPdfRenderer` then renders documents from ordinary APIs, Commands and background jobs - deterministically, with **no LLM in the runtime path**. `PdfFeature` deploys independently of `ChatFeature`, so production rendering needs neither an AI provider nor an API key.
