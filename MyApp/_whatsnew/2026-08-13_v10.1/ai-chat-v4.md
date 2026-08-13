---
title: AI Chat v4 - a complete AI platform inside your ServiceStack App
url: /chat
image: /img/posts/ai-chat-v4/bg.webp
order: 1
---

**AI Chat v4** is a complete rewrite that turns ServiceStack's built-in AI experience into a modular AI application platform. Register `ChatFeature` and your existing users get multi-provider chat, reasoning models, tools, skills, voice input, image and audio generation, media galleries, projects, Agent Profiles, analytics, Retrieval Augmented Generation and PDF Studio at **/chat** - all behind the authentication your App already uses.

Every capability ships as an encapsulated extension that installs its own routes, tools, UI components and lifecycle behavior, so Apps can disable what they don't need, replace individual UI building blocks and add their own capabilities without maintaining a fork. Conversation data lives in your App's database, per-user state is scoped to the authenticated identity, and higher-risk tools like filesystem access and code execution stay off unless you enable them.
