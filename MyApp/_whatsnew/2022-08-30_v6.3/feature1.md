---
title: Simple Code-First DB Migrations
url: https://docs.servicestack.net/releases/v6_03#code-first-db-migrations
image: /img/whatsnew/v6.3/db-migrations.png
---

We're excited to share the next release of ServiceStack which sees the introduction of our simple Database Migration solution with Code-First DB Migrations which advances OrmLite's light-weight code-first development approach with a simple change based migration solution that facilitates the code-first development workflow of OrmLite.

Starting from a seamless quick install and supporting multiple running options from command-line tooling, IDE run npm scripts, run, debug & verify from unit tests and integrated with our GitHub Action deployments where only successful migrations are deployed.

Instead of relying on generation by an opaque tool, this code-first approach treats DB Migrations like any other maintainable & logically structured code written by developers where it maintains a connected audit history in source control together with the feature that needs the schema changes.
