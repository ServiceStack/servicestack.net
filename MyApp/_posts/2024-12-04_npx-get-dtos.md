---
title: DTOs in all languages downloadable without .NET
summary: ServiceStack Typed DTOs for all languages can now be downloaded and uploaded without .NET installed
tags: [api,service-reference,js]
author: Demis Bellot
image: https://images.unsplash.com/photo-1639262498805-17c7dc422d37?crop=entropy&fit=crop&h=1000&w=2000
draft: true
---

To make it easier to consume ServiceStack APIs in any language, we've added the ability to download and upload Typed DTOs 
in all languages without needing .NET installed with the new `npx get-dtos` npm script.

It has the same syntax and functionality as the `x` dotnet tool for adding and updating ServiceStack References where
in most cases you can replace `x <lang>` with `npx get-dtos <lang>` to achieve the same result.

Running `npx get-dtos` without any arguments will display the available options:

    get-dtos <lang>                  Update all ServiceStack References in directory (recursive)
    get-dtos <file>                  Update existing ServiceStack Reference (e.g. dtos.cs)
    get-dtos <lang>     <url> <file> Add ServiceStack Reference and save to file name
    get-dtos csharp     <url>        Add C# ServiceStack Reference            (Alias 'cs')
    get-dtos typescript <url>        Add TypeScript ServiceStack Reference    (Alias 'ts')
    get-dtos javascript <url>        Add JavaScript ServiceStack Reference    (Alias 'js')
    get-dtos python     <url>        Add Python ServiceStack Reference        (Alias 'py')
    get-dtos dart       <url>        Add Dart ServiceStack Reference          (Alias 'da')
    get-dtos php        <url>        Add PHP ServiceStack Reference           (Alias 'ph')
    get-dtos java       <url>        Add Java ServiceStack Reference          (Alias 'ja')
    get-dtos kotlin     <url>        Add Kotlin ServiceStack Reference        (Alias 'kt')
    get-dtos swift      <url>        Add Swift ServiceStack Reference         (Alias 'sw')
    get-dtos fsharp     <url>        Add F# ServiceStack Reference            (Alias 'fs')
    get-dtos vbnet      <url>        Add VB.NET ServiceStack Reference        (Alias 'vb')
    get-dtos tsd        <url>        Add TypeScript Definition ServiceStack Reference    
    
    Options:
        -h, --help, ?             Print this message
        -v, --version             Print tool version version
            --include <tag>       Include all APIs in specified tag group
            --qs <key=value>      Add query string to Add ServiceStack Reference URL
            --verbose             Display verbose logging
            --ignore-ssl-errors   Ignore SSL Errors

## Reusable DTOs and Reusable Clients in any language

A benefit of [Add ServiceStack Reference](https://docs.servicestack.net/add-servicestack-reference) is that only an 
API DTOs need to be generated which can then be used to call any remote instance running that API. E.g. DTOs generated
for our deployed AI Server instance at [openai.servicestack.net](https://openai.servicestack.net) can be used to call
any self-hosted AI Server instance, likewise the same generic client can also be used to call any other ServiceStack API.

### Typed Open AI Chat & Ollama APIs in 11 Languages

A good example of its versatility is in the [Typed OpenAI Chat & Ollama APIs](/posts/typed-openai-chat-ollama-apis) 
in which AI Server's Typed DTOs can be used to call **any Open AI Chat compatible API** in its 11 supported languages.

### TypeScript Example

For example you can get the TypeScript DTOs for the just released [AI Server](/posts/ai-server) by:

1. Installing the `@servicestack/client` npm package:

:::copy
npm install @servicestack/client
:::

2. Download AI Server's TypeScript DTOs:

:::copy
`npx get-dtos typescript https://openai.servicestack.net`
:::

Which just like the `x` tool will add the TypeScript DTOs to the `dtos.ts` file

### Calling Ollama from TypeScript

Call Ollama by sending `OpenAiChatCompletion` Request DTO with JsonServiceClient:

```ts
import { JsonServiceClient } from "@servicestack/client"
import { OpenAiChatCompletion } from "./dtos"

const client = new JsonServiceClient(baseUrl)

const response = await client.postToUrl("/v1/chat/completions",
    new OpenAiChatCompletion({
        model: "mixtral:8x22b",
        messages: [
            { role: "user", content: "What's the capital of France?" }
        ],
        max_tokens: 50
    })
)

const answer = response.choices[0].message.content
```

### Update TypeScript DTOs

And later update all TypeScript ServiceStack References in the current directory with:

:::sh
`npx get-dtos typescript`
:::

### Install and Run in a single command

This can be used as a more flexible alternative to the `x` tool where it's often easier to install node in CI environments
than a full .NET SDK and easier to use npx scripts than global dotnet tools. For example you can use the `--yes` flag
to implicitly install (if needed) and run the `get-dtos` script in a single command, e.g:

:::sh
`npx --yes get-dtos typescript`
:::

### C# Example

As such you may want want to replace the `x` dotnet tool with `npx get-dtos` in your C#/.NET projects as well which
can either use the language name or its more wrist-friendly shorter alias, e.g:

:::sh
`npx get-dtos cs https://openai.servicestack.net`
:::

Then later update all C# DTOs in the current directory (including sub directories) with:

:::sh
`npx get-dtos cs`
:::