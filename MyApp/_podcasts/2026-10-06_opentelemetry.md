---
title: Follow every request with OpenTelemetry
summary: ServiceStack v10.3 emits standard OpenTelemetry traces and metrics that follow a request from its API call through outbound HTTP calls, MQ messages and Background Jobs, even across servers, in Jaeger, Grafana Tempo, Honeycomb, Datadog or the .NET Aspire Dashboard
tags: [servicestack, api, performance]
url: https://media.servicestack.com/podcasts/opentelemetry.mp3
media: {size:1322352,duration:89.280726,format:mp3}
---

**ServiceStack v10.3** introduces integrated support for **OpenTelemetry**, enabling developers to monitor complex, distributed requests across multiple services and servers. 

By emitting standardized **traces and metrics**, the platform allows for the seamless tracking of an API call as it triggers **MQ messages**, **Background Jobs**, and outbound HTTP requests. 

This update simplifies debugging by connecting disparate events into a single timeline that can be viewed in popular backends like **Jaeger, Grafana, and Datadog**. Additionally, an enhanced **Profiling UI** within the Admin dashboard provides instant visibility into database queries and execution spans without requiring external tools. 

The system is designed for high performance, ensuring that **metrics and logs** remain lightweight while offering deep insights into application health and error rates. Developers can easily integrate these features into **.NET 8+** applications to gain a unified perspective on their system's internal operations.