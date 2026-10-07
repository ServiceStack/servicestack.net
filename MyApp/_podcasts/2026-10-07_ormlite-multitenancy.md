---
title: Multitenancy that cannot be forgotten
summary: ServiceStack v10.4 moves tenant isolation from every query to the database connection, with OrmLite connection filters and write rules that confine selects, updates, deletes, inserts and AutoQuery APIs to the request's tenant, fail closed until it's known, and record trusted audit columns on every write
tags: [servicestack, ormlite, autoquery]
url: https://media.servicestack.com/podcasts/ormlite-multitenancy.mp3
media: {size:18552230,duration:1312.322177,format:mp3}
---

**ServiceStack v10.4** introduces robust multitenancy capabilities by shifting tenant isolation responsibilities from individual queries directly to the database connection. 

Through the implementation of **connection filters** and **write rules**, applications can automatically restrict data access, enforce correct insertion values, and record trusted audit details without requiring manual tenant checks in every query. 

This approach ensures that connections **fail closed** if a tenant is not explicitly resolved, significantly reducing human error and security risks in multi-tenant environments. 

Developers can define centralized **filter sets** to govern operations across all tenant-owned tables, while maintaining a single, easily auditable **opt-out mechanism** for cross-tenant tasks. 

Ultimately, this framework simplifies codebase maintenance, enhances data security, and standardizes operations for modern SaaS applications.
