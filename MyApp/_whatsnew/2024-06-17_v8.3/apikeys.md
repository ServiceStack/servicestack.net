---
title: Using API Keys to secure .NET 8 APIs
url: https://docs.servicestack.net/auth/apikeys
image: /img/whatsnew/v8.3/bg-security.webp
order: 1
---

API Keys are a simple and effective way to authorize access to your APIs, which are typically used for machine-to-machine
communication, where a client application needs to access an API without user intervention.
API Keys are often used to control access to specific resources or features in your API, providing a simple way
to manage access control.

### Redesigning API Keys

Building on our experience with API Keys in previous versions of ServiceStack, we've taken the opportunity to redesign
how API Keys work to provide a more flexible and powerful way to manage access control for your APIs.

Given the primary use-case for API Keys is for machine-to-machine communication where the client isn't a User,
nor do they want systems using their API Keys to have access to their User Account, we've changed
how API Keys work in .NET 8.
