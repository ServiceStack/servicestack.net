---
title: Mix'n'Match .NET Core Apps
url: https://docs.servicestack.net/releases/v5.6#mix-n-match-net-core-apps
image: https://raw.githubusercontent.com/ServiceStack/docs/master/docs/images/mix/example-validation-900.gif
---

To complete the picture of making it easy as possible to compose ASP.NET Core Apps we've created the `mix` dotnet tool to easily
install features which can be installed with:

```bash
$ dotnet tool install --global mix
```

The `mix` tool is designed around applying ASP.NET Core features captured in GitHub gists to your local .NET Core projects.

Then choosing which features you want to add to your project with `mix <name>`, e.g:

```bash
$ mix redis
```
