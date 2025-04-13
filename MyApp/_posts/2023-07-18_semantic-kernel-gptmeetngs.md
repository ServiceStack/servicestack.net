---
title: Trying Microsoft's Semantic Kernel
summary: Incorporating the Semantic Kernel into our GPT Meeting Agent gives developers more flexibility when working with LLMs  
tags: [dotnet, ai, semantic-kernel, gpt]
image: ./img/posts/semantic-kernel-gptmeetngs/bg.webp
author: Darren Reid
---

In the rapidly evolving landscape of AI, a constant challenge that developers face is the integration and use of advanced models, like OpenAI's Large Language Models (LLMs), into our applications. To help bridge the gap between developers and these intricate models, Microsoft has introduced Semantic Kernel, a .NET library that offers a robust and more interactive platform to leverage OpenAI's ChatGPT API.

## The Journey So Far

Our [initial demonstration of the GPT Meeting Agent](https://github.com/NetCoreApps/GPTMeetingAgent/tree/42e18e9c6e7f9809760e3fecf40208d5759b18a3) offered an exciting glimpse into how developers could leverage the reasoning capability of Large Language Models such as `gpt-3.5-turbo` with the ServiceStack framework. We [showcased an application](https://github.com/NetCoreApps/GPTMeetingAgent) that could use In Context Learning, Chain Of Thought Prompting, and the defining of your own ServiceStack services using TypeScript definition format.

<div class="flex justify-center">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="7vChIGHWPuI" style="background-image: url('https://img.youtube.com/vi/7vChIGHWPuI/maxresdefault.jpg')"></lite-youtube>
</div>

The LLM was then able to determine which ServiceStack service should be called and what parameter values to use. This demonstration included APIs for searching for users, checking availability, reserving meeting room resources, and creating a booking. The application was then integrated with ServiceStack's Vue.js library, generating UI forms for each service the AI called. This not only illustrated what the Agent was doing but also gave the user control of more critical APIs like booking the actual meeting.

This integration was accomplished directly through OpenAI's ChatGPT API. While it served its purpose, we wanted to make it easier for those that had projects that already leveraged OpenAI integration. Microsoft's Semantic Kernel library offered a solution that would allow us to do just that, and is looking to be a promising avenue for future development.

## The Shift to Semantic Kernel

Enter [Microsoft's Semantic Kernel](https://github.com/microsoft/semantic-kernel). This .NET Library makes the integration with OpenAI's ChatGPT API far more flexible and developer-friendly. It allows developers to interact with LLMs as 'functions', catering to a wide range of use cases.

By switching the API integration with Semantic Kernel for the GPT Meeting Agent, we've made it easier to incorporate a custom Agent with your ServiceStack services, and this is by just switching over how the LLM APIs are integrated. The Semantic Kernel makes configuration easier and opens the door to the use of Open Source Large Language Models without the need for significant changes to the codebase, as well as future improvements as this library evolves.

```csharp
var kernel = Kernel.Builder
    .WithOpenAIChatCompletionService("gpt-3.5-turbo", chatGptApiKey)
    // Easy to switch out to custom implementations.
    //.WithOobaboogaApiChatCompletionService("http://localhost:5010/api/v1/generate");
    .Build();
```

## Advantages of Semantic Kernel

Semantic Kernel allows you to encapsulate your interaction with the LLMs, giving you the ability to use the model as a function. This abstraction facilitates the implementation of use cases where you need the model to serve as an endpoint that can handle and respond to a diverse array of requests. It means your application can stay relatively lean, focusing more on managing the responses from these models than worrying about their specific implementation details.

## Moving Forward: ServiceStack and LLM Integration

Currently, at the time of writing, the `function` support from OpenAI is not yet available via the Semantic Kernel library. But, we see this as a future improvement opportunity, which could further enhance the Semantic Kernel library's functionality and streamline its integration with OpenAI's APIs.

Our vision for the future involves evaluating further integration with Semantic Kernel to add more value to your ServiceStack projects if they need to leverage LLMs.

The goal is to create a more efficient and streamlined development experience that simplifies the integration of LLMs into your ServiceStack applications. The developer's focus should be on the business logic, the services that they are creating, and not on the technical complexities of integrating with AI models, this is where we think we can add value to .NET developers.

In the context of the GPT Meeting Agent demonstration, this would mean even smoother interactions between the AI agent and the ServiceStack services, resulting in a more intuitive and responsive user experience. By being able to leverage ServiceStack UI features like our Vue.js library's AutoForm components, we hope to make it a lot easier to create new ways of interacting with these models, like the ways we have demonstrated in the GPT Meetings applications.

## Wrapping Up

Microsoft's Semantic Kernel provides an avenue for developers to interact more flexibly with Large Language Models, opening up new possibilities and potential use cases. By integrating the Semantic Kernel library in our GPT Meeting Agent demonstration, we've made our application more configurable and opened the door for integrating Open Source Large Language Models without major codebase alterations.

Through further development, we aim to make this technology easier to leverage in your ServiceStack applications, helping you to create more intelligent, responsive, and effective software.