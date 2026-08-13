---
title: API Tools - expose your ServiceStack APIs to LLMs & MCP
url: /posts/api-tools
image: /img/posts/api-tools/bg.webp
order: 2
---

**API Tools** let AI Models discover, learn and call your existing ServiceStack APIs through three stable tools - `api_search`, `api_describe` and `api_call` - so Models progressively find the capabilities relevant to a request instead of being handed every schema up front. There's no parallel AI schema, no bespoke function-calling gateway and no AI-specific backend: your typed Request DTOs, validation, authorization and Services remain the single source of truth.

Everything executes as the **authenticated user**, so APIs a caller can't access can't be discovered, described or invoked. Writes and destructive operations pause and render an editable approval form generated from the API's own schema. The same capabilities are available to external AI Assistants like OpenCode, Claude Code, Cursor and VS Code through the built-in **MCP Server** at `/chat/mcp`.
