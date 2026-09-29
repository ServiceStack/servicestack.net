---
title: OpenTelemetry - follow every request across APIs, MQ and Background Jobs
url: https://docs.servicestack.net/admin-ui-profiling#opentelemetry-tracing
image: /img/posts/opentelemetry/bg.webp
order: 5
---

ServiceStack v10.3 emits standard **OpenTelemetry traces and metrics** that follow a request from its API call through outbound HTTP calls, **MQ messages** and **Background Jobs**, even across servers and retries. You open one trace and see everything the request caused, in order, in Jaeger, Grafana Tempo, Honeycomb, Datadog, the .NET Aspire Dashboard or any other OTLP backend. Add it to any .NET 8+ App with `npx add-in opentelemetry`.

API metrics for duration, activity and errors are low-cardinality and only count **5xx responses and unhandled exceptions** as errors, so alerts mean something is actually broken. Request bodies, user ids and exception messages are never recorded. The **Profiling UI** now groups OrmLite, Redis, HttpClient, MQ and Job events by Trace Id in a new Trace view, with a link out to your trace backend. ServiceStack doesn't depend on the OpenTelemetry SDK, so Apps that don't use it pay nothing.
