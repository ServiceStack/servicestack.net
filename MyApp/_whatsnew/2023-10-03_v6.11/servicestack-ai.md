---
title: ServiceStack.AI
url: https://docs.servicestack.net/releases/v6_11
image: /img/whatsnew/v6.11/servicestack-ai.png
order: 1
---

ServiceStack.AI covers a Free suite implementation-agnostic abstractions for different AI and GPT Providers to enable 
AI features in .NET Apps under the new **ServiceStack.AI** namespace in the dep-free `ServiceStack.Interfaces` package.

The implementations for these abstractions are maintained across NuGet packages in accordance with their dependencies:

- `ServiceStack.Aws` - AI & GPT Providers for Amazon Web Services
- `ServiceStack.Azure` - AI & GPT Providers for Microsoft Azure
- `ServiceStack.GoogleCloud` - AI & GPT Providers for Google Cloud
- `ServiceStack.AI` - AI & GPT Providers for OpenAI APIs and local Whisper and Node TypeChat installs

These abstractions and implementations enable .NET projects to add AI-powered natural language features whilst 
decoupling their Speech-to-text and ChatGPT requirements from any single implementation where they're easily substituted