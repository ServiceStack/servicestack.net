---
title: In Depth Interactive API Analytics for PostgreSQL, SQL Server & MySQL
summary: Comprehensive and Interactive RDBMS API Analytics in Admin UI, deep insights into API usage, performance, users, API Keys & IPs
tags: [analytics,admin-ui,apis,postgresql,sqlserver,mysql]
author: Demis Bellot
url: https://media.servicestack.com/podcasts/rdbms_analytics.mp3
media: {size:14480259,duration:983.510204,format:mp3}
---

This episode details a significant update to ServiceStack's **API Analytics features**, restoring parity for 
**PostgreSQL, SQL Server, and MySQL** through the new `DbRequestLogger`, which replaces the previous SQLite-only 
request logging system. This new implementation enables a comprehensive and interactive Admin UI for 
**monitoring API usage, performance, and security insights**. 

Key functionalities include visual dashboards that track overall system metrics like 
**response times and request volume** across various dimensions, as well as the ability to drill down into 
**individual analytics** for specific APIs, authenticated Users, API Keys, and source IP Addresses. 

The system is designed for **high-volume logging** by batching inserts to reduce network latency, and it 
specifically leverages **PostgreSQL's native table partitioning** for efficient data management.
