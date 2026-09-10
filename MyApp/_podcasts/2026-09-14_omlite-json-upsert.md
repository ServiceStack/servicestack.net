---
title: OrmLite gets type-safe JSON access and Upserts
summary: Query JSON columns with typed C# expressions that run unchanged on SQLite, PostgreSQL, SQL Server and MySQL, and insert-or-update rows in a single native statement with the new Upsert APIs
tags: [servicestack, ormlite]
url: https://media.servicestack.com/podcasts/omlite-json-upsert.mp3
media: {size:1574816,duration:109.064127",format:mp3}
---

**ServiceStack v10.2** introduces significant updates to **OrmLite**, focusing on enhanced **JSON integration** and native **Upsert functionality**. 

Developers can now perform **type-safe JSON queries** using standard C# expressions that automatically translate into optimized SQL for **SQLite, PostgreSQL, SQL Server, and MySQL**. The new **Upsert API** streamlines data synchronization by allowing users to **insert or update records** in a single, atomic database statement, effectively eliminating race conditions. 

This release prioritizes **database portability**, ensuring that complex document filtering and conditional updates remain consistent across different platforms. 

By combining these features, the update simplifies the management of **semi-structured data** while maintaining strict **type safety** and high performance.