---
title: Capture Request Logs in Monthly Rolling SQLite DBs
url: https://docs.servicestack.net/sqlite-request-logs
image: /img/posts/sqlite-request-logs/sqlite-request-logs.webp
order: 2
---

SQLite's low latency, high-performance and embeddable nature make it ideal for self-managing 
isolated appliance black-box functionality like Request Logging which offers up to 
[35% faster disk performance](https://www.sqlite.org/fasterthanfs.html) than standard file logging.

### Rolling Monthly SQLite Databases

SQLite is unique in its ability to create lightweight databases on-the-fly where Requests 
will be persisted into isolated Monthly databases which can be easily archived 
into managed file storage instead of a singular growing database.

SQLite Request Logs also make it easier to generate monthly aggregate reports that provide 
key insights into the usage of your App.

#### AutoQuery Admin Logging UI

As SQLite Requests Logs also makes it efficiently possible to sort and filter through logs, 
the Admin Logging UI has been upgraded to using a fully queryable AutoQueryGrid when using 
`SqliteRequestLogger`