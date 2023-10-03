---
title: TypeChat Examples
url: https://docs.servicestack.net/releases/v6_11#all-typechat-examples
image: /img/whatsnew/v6.11/typechat-examples.png
order: 2
---

The TypeScript team have sought a simple approach to enable AI-powered features that instead of relying on engineering 
sophisticated prompts to instead use TypeScript type's system to define the machine readable model LLMs should return 
and then if necessary to use TypeScript compiler's Schema validation errors to enable auto correcting prompts to 
guide ChatGPT into returning valid responses that our App's can understand.

To show the versatility of this approach we've implemented the [All TypeChat Examples in .NET](https://typechat.netcore.io/) 
which in addition to supporting **5 different Speech-to-text** providers also supports utilizing a pure .NET approach 
of generating TypeChat's prompt in C# and using Semantic Kernel to connect with your preferred Chat GPT 
provider or utilizing node's TypeChat library to interface with ChatGPT where it benefits from 
TypeScript schema validation and auto-retry of invalid responses with auto correcting prompts.
