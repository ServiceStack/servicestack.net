---
title: JSON Patch secrets into appsettings.json
summary: Simplify managing App secrets by JSON patching them into your appsettings.json with during deployments
tags: [devops, github-actions]
image: https://images.unsplash.com/photo-1563089145-599997674d42?crop=entropy&fit=crop&h=1000&w=2000
author: Darren Reid
---

Another useful feature in the ServiceStack `x` [dotnet tool](https://docs.servicestack.net/dotnet-tool) I wanted to highlight
is its built-in support for JSON Patching. This feature provides you with a robust mechanism for modifying your JSON files, 
providing a precise and granular way to manage configurations, that's especially useful when automating changes from a 
continuous integration environment.

## What is JSON Patching?

JSON Patch, as specified in [RFC 6902](https://tools.ietf.org/html/rfc6902), is a format for expressing a sequence of 
operations to apply to a JSON document. It allows us to add, remove, replace, copy, move and test elements within 
the JSON structure, making it a versatile tool in managing and altering configurations.

Here's a quick overview of the supported operations:

| Operation   | Notes                                                                                                  |
|-------------|--------------------------------------------------------------------------------------------------------|
| **add**     | Adds a new property or array element. For an existing property, it sets a new value.                   |
| **remove**  | Removes a property or array element.                                                                   |
| **replace** | Same as 'remove' followed by 'add' at the same location.                                               |
| **move**    | Same as 'remove' from the source followed by 'add' to the destination using the value from the source. |
| **copy**    | Same as 'add' to the destination using the value from the source.                                      |
| **test**    | Returns a success status code if the value at the path equals the provided value.                      |

The `x` dotnet tool implements these operations, making it a handy utility for managing your JSON configurations.

## An Example with SMTP Settings

Let's dive into a practical example. We'll be working with an `appsettings.json` file, a common sight in .NET projects, 
which often houses sensitive settings like SMTP config. Suppose we have the following structure with an empty `smtp` object:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "smtp": {}
}
```

We need to fill this `smtp` object with settings such as username, password, host, port, and more. To automate filling 
these values, we can use the ServiceStack `x` tool to apply a `json.patch`. 

The `json.patch` file to accomplish this would look something like:

```json
[
  {
    "op": "add",
    "path": "/smtp",
    "value": {
      "UserName": "AWS_ACCESS_KEY_ID",
      "Password": "AWS_SECRET_ACCESS_KEY",
      "Host": "email-smtp.us-east-1.amazonaws.com",
      "Port": 587,
      "From": "email address",
      "FromName": "From Name",
      "Bcc": "bcc email address"
    }
  }
]
```

Once this patch is applied, our `appsettings.json` transforms into:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "smtp": {
    "UserName": "AWS_ACCESS_KEY_ID",
    "Password": "AWS_SECRET_ACCESS_KEY",
    "Host": "email-smtp.us-east-1.amazonaws.com",
    "Port": 587,
    "From": "email address",
    "FromName": "From Name",
    "Bcc": "bcc email address"
  }
}
```

You can apply this patch using the `x` tool's `patch` command:

```bash
x patch appsettings.json.patch
```

This expects both the `appsettings.json.patch` and `appsettings.json` files to be local. Optionally, you can specify 
both files if their names differ.

```bash
x patch changes.json.patch appsettings.json
```

## Using in CI Environments

Another significant benefit of this feature is the convenience it provides in CI environments, such as GitHub Actions. 
Secrets and other environment-specific configurations often need to be injected during the CI process. 
This is where JSON patching can be extremely useful.

Consider the following step in a GitHub Actions workflow:

```yml
- name: Apply SMTP Settings
  working-directory: ./MyApp
  run: | 
    cat <<EOF >> appsettings.json.patch
    ${{ secrets.APPSETTINGS_PATCH}}
    EOF
    x patch appsettings.json.patch
```

Here, the SMTP settings are stored securely as GitHub secrets as JSON patch syntax, and then added to the `appsettings.json` 
file during the CI process using the `x` tool. This ensures that sensitive data like your SMTP password remains secure 
and is not hardcoded into your app's source code.

## Wrapping Up

The ability to use JSON Patch files to manipulate JSON data adds a powerful tool to your .NET developer toolkit. 
Whether you're managing complex configurations or securing sensitive data in CI processes, 
ServiceStack's `x` [dotnet tool](https://docs.servicestack.net/dotnet-tool) and its JSON Patching feature gives you 
an easier way to automate changes to JSON files.
