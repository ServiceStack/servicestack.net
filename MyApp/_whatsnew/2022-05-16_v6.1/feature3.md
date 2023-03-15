---
title: Code-First Development Model
url: https://docs.servicestack.net/releases/v6_1#code-first
image: /img/whatsnew/v6.1/chinook-splash.png
---

[Code-First](https://docs.servicestack.net/locode/code-first) is the natural development model of [AutoQuery Services](https://docs.servicestack.net/autoquery-rdbms) which facilitates the majority of a
System and its UI can be developed from simple, declarative C# POCOs to define the underlying RDBMS Schema Data Models and the precise typed
API DTO Contracts of their surrounding AutoQuery & CRUD APIs. The Data and Service models can be further enhanced by ServiceStack's vast
[declarative attributes](https://docs.servicestack.net/locode/declarative) where a significant amount of behavior, functionality and customization can be defined, ranging from:

- Customize how [Data Models map to DB Tables](https://docs.servicestack.net/locode/declarative.html#table-data-model-attributes) & enlist RDBMS features
- [Customize Serialization & API behavior](https://docs.servicestack.net/locode/declarative.html#custom-serialization)
- [Define AutoQuery & CRUD API behavior](https://docs.servicestack.net/locode/declarative.html#autoquery-attributes)
- Define [Validation Rules](https://docs.servicestack.net/locode/declarative.html#type-validation-attributes) and [Authorization restrictions](https://docs.servicestack.net/locode/declarative.html#authentication-restrictions)
- [Annotate & Document APIs](https://docs.servicestack.net/locode/declarative.html#annotate-apis)
- [Customize UI Behavior & Appearance](https://docs.servicestack.net/locode/declarative.html#result-formatters)
