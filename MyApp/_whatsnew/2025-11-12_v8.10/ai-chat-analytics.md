---
title: AI Chat history persistence and Admin Analytics UI
url: https://docs.servicestack.net/ai-chat-analytics
image: /img/whatsnew/v8.10/admin-chat-costs.webp
order: 2
---

ServiceStack's AI Chat now includes chat history persistence and analytics, providing visibility into AI usage patterns, costs, and performance. Maintain a complete audit trail of all AI interactions from the Chat UI, OpenAI endpoints, and internal `IChatStore` requests.

Choose between `DbChatStore` for universal RDBMS compatibility or `PostgresChatStore` for optimized PostgreSQL performance with monthly table partitioning. Both use indexed queries to ensure consistent performance as history grows.

The Admin UI Analytics dashboard provides three key views: 
- **Cost Analysis** - shows spending across providers and models
- **Token Usage** - tracks consumption patterns
- **Activity Log** - maintains an audit trail with full conversation details. 

These insights enable data-driven decisions about provider selection, cost optimization, and help debug AI features in production.
