---
title: AI Chat - OpenAI Chat API, UI and Gateway
url: https://docs.servicestack.net/ai-chat-api
image: /img/whatsnew/v8.9/llms-syntax.webp
order: 4
---

**AI Chat** is a refreshingly simple solution for integrating AI into your applications, built around a clean, 
serializable `ChatCompletion` DTO that maps directly to the OpenAI Chat API. Unlike complex frameworks with 
non-portable abstractions and breaking changes, AI Chat embraces the stability and ubiquity of the OpenAI 
ChatCompletion API itself - the most important API for accessing LLMs. 

The simple `ChatCompletion` DTO works everywhere: store requests in databases, send through message queues, 
use in client workflows, debug with plain JSON, and unlock all of ServiceStack's DTO-based features automatically.

AI Chat includes a customizable ChatGPT-like UI where you control the API keys, billing, and sanctioned providers 
your users can access - maintaining fast, local, and private AI access within your organization. 
The UI supports rich multimodal inputs including images, audio, and file attachments with vision-capable models, 
features full Markdown rendering with syntax highlighting for popular languages, and provides 200+ curated 
system prompts for various use cases. 
All chat history is stored locally in the browser's IndexedDB with import/export capabilities for backup and 
transfer between browsers.
