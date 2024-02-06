---
title: System.Text.Json APIs
url: https://docs.servicestack.net/releases/v8_00#asp.net-core-identity-auth-in.net-8-templates
image: /img/whatsnew/v8.1/system-text-json.png
order: 2
---

ServiceStack Endpoint Routing APIs now utilize **System.Text.Json** - the default high-performance async 
JSON serializer used in .NET Apps for serializing its JSON APIs.

### Enhanced System.Text.Json

ServiceStack uses a custom `JsonSerializerOptions` to improve compatibility with existing ServiceStack DTOs and 
ServiceStack's rich ecosystem of generic 
[Add ServiceStack Reference Service Clients](https://docs.servicestack.net/add-servicestack-reference), which is configured to:

- Uses `CamelCaseNamingPolicy` for property names
- Supports Case Insensitive Properties
- Not serialize `null` properties
- Serializes `TimeSpan` and `TimeOnly` Data Types with XML Schema Time format
- Supports `[DataContract]` annotations
- Supports Custom Enum Serialization