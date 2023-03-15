---
title: .NET Core Windows Desktop Apps!
url: https://docs.servicestack.net/releases/v5.4#net-core-windows-desktop-apps
image: https://raw.githubusercontent.com/ServiceStack/docs/master/docs/images/app/netcore-chromium-splash.png
---

Our new [app](https://www.nuget.org/packages/app) build tool is packed with features for "Chromitizing" any
.NET Core Web App into a **.NET Core Windows Desktop App** that's as easy as installing the `app` tool:

```bash
$ dotnet tool install -g app
```

and using it to run your .NET Core Web App's `.dll`, e.g:

```bash
$ app MyApp.dll
```

Where it will run your .NET Core App and host it inside an Chromium Embedded Framework (CEF) browser.

This provides instant utility for being able to deploy .NET Core Apps end users can run locally using Chrome's leading and consistent rendering engine
within a Windows Desktop Application.
