---
title: OrmLite new Configuration Model and Defaults
summary: Learn about OrmLite's new fluent Configuration Model, new defaults & features
tags: [db,ormlite]
author: Demis Bellot
url: https://media.servicestack.com/podcasts/ormlite-new-configuration.mp3
media: {size:15673349,duration:1113.652245,format:mp3}
---

The episode provides a technical overview of **OrmLite's new configuration model** and associated updates, 
emphasizing its alignment with **ASP.NET Core conventions** through a fluent API that uses `services.AddOrmLite()`. 

A major change is the replacement of JSV serialization with **JSON for complex types**, leveraging native 
database support, and updates to defaults for specific providers, such as **PostgreSQL dropping the 
snake_case naming strategy** and **SQL Server defaulting to the 2022 dialect**. 

The updates also introduce **improved observability features**, like connection tagging and command execution timing, 
as well as utility enhancements, including **new APIs for checking existence by ID** and resetting sequences in PostgreSQL. 

Finally, it details internal refactors, such as the use of the new **TableRef struct** to unify table 
referencing across different APIs.