---
title: Richer APIs and Auto UIs with API Schemas
summary: Every ServiceStack API now includes a portable schema that lets generic UIs describe, render and execute it
tags: [servicestack, json-schema, vue, ai]
url: https://media.servicestack.com/podcasts/go-rust-ruby-zig-typed-apis.mp3
media: {size:4729745,duration:333.926168,format:mp3}
---

ServiceStack has introduced a new **API Schema** feature that automatically generates portable, machine-readable contracts and interactive user interfaces for every endpoint. 

By utilizing existing **DTO metadata**, the system creates a searchable index at a dedicated URL where users can explore, validate, and execute requests without writing any frontend code. 

This approach replaces monolithic metadata files with **focused, per-API schemas**, significantly improving performance and scalability for large applications. 

These schemas are highly versatile, powering **reusable Vue and React components** and enabling AI models to generate reliable human-in-the-loop approval forms. Ultimately, the update ensures that **server-side definitions** remain the single source of truth for documentation, testing tools, and automated integrations.
