---
title: Streamlined Development for creating Flutter Apps
url: https://docs.servicestack.net/releases/v6_8#flutter
image: /img/whatsnew/v6.8/flutter-todos.jpg
---

We've greatly improved the end-to-end development experience of creating Flutter Mobile Apps that integrate with your ServiceStack APIs. 
To demonstrate the seamless development experience, we've created a [video walk through](https://www.youtube.com/watch?v=t4WcXo4Vnio) 
creating a new Blazor Server project that we use **mix flutter** to create a new Flutter App that we can use to quickly build 
a Mobile App to call its existing Todo .NET APIs using the built-in [Typed Dart DTOs](https://docs.servicestack.net/dart-add-servicestack-reference) integration.

This release also includes improvements to generated Dart DTOs and servicestack Dart client library with new simplified APIs
that greatly improves usage in Reactive UIs by encapsulates Successful and Failed API Responses in a single `ApiResult<TResponse>` 
value which can be passed down and bound to reactive components without any inhibitive `try/catch` statements.