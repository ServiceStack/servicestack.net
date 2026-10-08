---
title: Multitenancy - tenant isolation enforced by the database connection
url: https://docs.servicestack.net/ormlite/multitenancy/overview
image: /img/posts/ormlite-multitenancy/bg.webp
order: 1
---

ServiceStack v10.4 moves multitenancy from every query to the database connection. OrmLite's new **connection filters** and **write rules** are defined once in a `FilterSet`, then enforced on every select, update, delete and insert, including lookups by id, joins and **AutoQuery** conditions sent by clients. Existing Services and AutoQuery APIs don't change, as a single `DbConnectionRequestFilters` entry in your AppHost confines the connection of every request.

A request that hasn't resolved its tenant **fails closed** instead of returning every tenant's rows, writing a row for another tenant throws, and **audit columns** recording who changed a row and when can't be set by mistake.