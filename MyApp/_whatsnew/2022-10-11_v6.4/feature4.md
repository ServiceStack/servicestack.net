---
title: Debug DB Migrations from IDE
url: https://docs.servicestack.net/releases/v6_4#db-migrations
image: /img/whatsnew/v6.4/database-migrations-youtube.jpg
---

We've continued improving our story around [Code-First DB Migrations](/ormlite/db-migrations) and have created a [new video](https://www.youtube.com/embed/NIVFqute7JQ) demonstrating how it can be used to maintain DB Schema migrations under a typical development workflow.

As they encourage a structured workflow for incremental development of new App features we've upgraded all modern [jamstacks.net](https://jamstacks.net)
templates to adopt DB Migrations for creating and populating their App DB.

A benefit of DB Migrations being implemented in a library instead of wrapped up behind an external tool, is that it's better integrated and more versatile in supporting more executable options like being able to run from code, a feature the new `MigrationTasks` Explicit TestFixture benefits from enabling DB Migrations to be run or debugged directly from within your IDE.
