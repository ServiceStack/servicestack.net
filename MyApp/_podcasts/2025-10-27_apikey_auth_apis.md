---
title: Protect same APIs with API Keys or Identity Auth
summary: Learn how to create ServiceStack APIs that can be protected with API Keys or Identity Auth
tags: [apikeys,identity-auth,auth]
author: Demis Bellot
url: https://media.servicestack.com/podcasts/apikey_auth_apis.mp3
media: {size:10636765,duration:719.203265,format:mp3}
---

This episode covers two distinct authentication paradigms for modern APIs: **Identity Auth** and 
**API Keys**, designed to serve different client types and use cases. **Identity Auth** is primarily 
intended for scenarios involving a human user with interactive workflows, requiring credentials and 
establishing user sessions with roles and permissions. Conversely, **API Keys** are built for non-interactive 
**machine-to-machine** communication or user agents, offering simpler token-based authentication, 
superior performance, and fine-grained access control through scopes. 

Maintaining two separate APIs to support both models is cumbersome, and covers how ServiceStack's new 
API Keys Identity Auth feature allows developers to protect a single API with **both** Identity Auth and 
API Keys simultaneously. 

This unified approach simplifies maintenance while enabling users to access protected APIs using an API Key 
attached to their Identity Auth Cookie.