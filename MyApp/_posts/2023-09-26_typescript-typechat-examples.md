---
title: All of TypeScript's TypeChat Examples in .NET
summary: Guide to implementing Voice Transcriptions and TypeChat GPT in .NET    
tags: [autoquery, c#, dev, servicestack]
image: ./img/posts/typescript-typechat-examples/bg.webp
author: Demis Bellot
---

To explore how best to add AI features to .NET Apps we first looked at harnessing the reasoning capabilities of
ChatGPT by utilizing the [Chain-of-Thought](/posts/chat-gpt-agents) technique by constructing sophisticated prompts to
guide ChatGPT into desirable actionable responses which we demonstrate in the 
[ChatGPT Meeting Agent](https://gptmeetings.netcore.io) demo. 

### TypeScript's TypeChat

The TypeScript team have sought a simpler approach that instead of relying on engineering sophisticated prompts to instead 
use TypeScript type's system to define the machine readable model LLMs should return and then if necessary to use 
TypeScript compiler's Schema validation errors to enable auto correcting prompts to guide ChatGPT into returning 
valid responses that our App's can understand.

Whilst less ambitious then **Chain-of-Thought** in trying to leverage ChatGPT's reasoning abilities, it's a simpler 
and more reliable approach when wanting to add natural language features to your App.

TypeScript's TypeChat library and compiler being written in JavaScript presents challenges in being able to utilize
it within .NET Apps. To showcase how best to add TypeChat AI-Powered features into .NET Apps we've recreated 
TypeChat's CoffeeShop App in .NET which first uses [AutoQuery](https://docs.servicestack.net/autoquery/) to quickly
develop the CoffeeShop Data Models, Typed APIs and Management UI to dynamically generate its TypeScript's schema in:

- [Modelling TypeChat's CoffeeShop in .NET](/posts/building-typechat-coffeeshop-modelling)

We then show how to utilize the resulting TypeScript Schema with ChatGPT, which initially uses your choice of 
**5 different Speech-to-Text** providers from OpenAI, GoogleCloud, AWS and Azure to transcribe voice activated commands 
into text that's then submitted to ChatGPT using TypeChat's prompt to convert the natural language request into the 
machine readable response defined by the App's TypeScript Schema that is matched against its Database Products to 
create Item Order requests that are added to the Users Cart in:

- [Creating a Voice Activated CoffeeShop in .NET](/posts/voice-activated-typechat-coffeeshop)

### CoffeeShop

This results in an example of a working intelligent voice activated agent for a coffee shop which translates user intent 
into a list of CoffeeShop order items:

[![](/img/posts/typescript-typechat-examples/coffeeshop.png)](https://typechat.netcore.io/coffeeshop/)

:::{.my-8 .text-indigo-600 .text-center .text-xl}
[https://typechat.netcore.io/coffeeshop](https://typechat.netcore.io/coffeeshop)
:::

## All TypeChat Examples

To show the versatility of this approach we've implemented the [remaining TypeChat Examples](https://microsoft.github.io/TypeChat/docs/examples/)
in .NET which in addition to supporting 5 different Speech-to-text providers also supports utilizing a pure .NET
approach of generating TypeChat's prompt in C# and using [Semantic Kernel](https://servicestack.net/posts/semantic-kernel-gptmeetngs)
to connect with your preferred Chat GPT provider or utilizing node's TypeChat library to interface with ChatGPT where it
benefits from TypeScript schema validation and auto-retry of invalid responses with auto correcting prompts. 

But as we've discovered in [Custom Validation with C# Semantic Kernel](/posts/voice-activated-typechat-coffeeshop#custom-validation-with-c-semantic-kernel)
you can achieve more effective results with manual validation.

In addition all TypeChat examples supports uploading recordings to your preferred choice of **5 different Storage Providers**: 

- Local File System
- Google Cloud Storage
- Azure Blob Storage
- AWS S3
- Cloudflare R2

Feel free to explore to explore the different TypeChat examples for the implementation which best suits your use-case.

The source code for all Examples are maintained in a Combined App at:

:::{.my-8 .text-indigo-600 .text-center .text-xl}
[https://github.com/NetCoreApps/TypeChatExamples](https://github.com/NetCoreApps/TypeChatExamples)
:::

With a Live Demo of these examples available at:

:::{.my-8 .text-indigo-600 .text-center .text-2xl}
[https://typechat.netcore.io](https://typechat.netcore.io)
:::

[![](/img/posts/typescript-typechat-examples/typechat.png)](https://typechat.netcore.io/)

### Individual Examples

If you're only interested in one of the examples for your use-case, simpler examples of each App is available in the
individual GitHub Repos below:

- [https://github.com/NetCoreApps/CoffeeShop](https://github.com/NetCoreApps/CoffeeShop)
- [https://github.com/NetCoreApps/SentimentTypeChat](https://github.com/NetCoreApps/SentimentTypeChat)
- [https://github.com/NetCoreApps/CalendarTypeChat](https://github.com/NetCoreApps/CalendarTypeChat)
- [https://github.com/NetCoreApps/RestaurantTypeChat](https://github.com/NetCoreApps/RestaurantTypeChat)
- [https://github.com/NetCoreApps/MathTypeChat](https://github.com/NetCoreApps/MathTypeChat)
- [https://github.com/NetCoreApps/MusicTypeChat](https://github.com/NetCoreApps/MusicTypeChat)

Descriptions, Screenshots and Links for each TypeChat Example is available below:

### Sentiment

A sentiment classifier which categorizes user input as negative, neutral, or positive. This is TypeChat's "hello world!"

:::{.my-8 .text-indigo-600 .text-center .text-2xl}
[https://typechat.netcore.io/sentiment](https://typechat.netcore.io/sentiment)
:::

[![](/img/posts/typescript-typechat-examples/sentiment.png)](https://typechat.netcore.io/sentiment)
[![](/img/posts/typescript-typechat-examples/sentiment2.png)](https://typechat.netcore.io/sentiment)

### Calendar

An intelligent scheduler. This sample translates user intent into a sequence of actions to modify a calendar.

:::{.my-8 .text-indigo-600 .text-center .text-2xl}
[https://typechat.netcore.io/calendar](https://typechat.netcore.io/calendar)
:::

[![](/img/posts/typescript-typechat-examples/calendar.png)](https://typechat.netcore.io/calendar)
[![](/img/posts/typescript-typechat-examples/calendar2.png)](https://typechat.netcore.io/calendar)

### Restaurant

An intelligent agent for taking orders at a restaurant. Similar to the coffee shop example, but uses a more complex schema 
to model more complex linguistic input. 

The prose files illustrate the line between simpler and more advanced language models in handling compound sentences, 
distractions, and corrections. This example also shows how we can use TypeScript to provide a user intent summary.

:::{.my-8 .text-indigo-600 .text-center .text-2xl}
[https://typechat.netcore.io/restaurant](https://typechat.netcore.io/restaurant)
:::

[![](/img/posts/typescript-typechat-examples/restaurant.png)](https://typechat.netcore.io/restaurant)
[![](/img/posts/typescript-typechat-examples/restaurant2.png)](https://typechat.netcore.io/restaurant)

### Math

Translate calculations into simple programs given an API that can perform the 4 basic mathematical operators. 
This example highlights TypeChat's program generation capabilities.

:::{.my-8 .text-indigo-600 .text-center .text-2xl}
[https://typechat.netcore.io/math](https://typechat.netcore.io/math)
:::

[![](/img/posts/typescript-typechat-examples/math.png)](https://typechat.netcore.io/math)
[![](/img/posts/typescript-typechat-examples/math2.png)](https://typechat.netcore.io/math)

### Music

An app for playing music, creating playlists, etc. on Spotify through natural language. 
Each user intent is translated into a series of actions in which correspond to a simple dataflow program, 
where each step can consume data produced from previous step.

If you Sign In with a **premium Spotify Account** you'll also be able to use natural language to control what you're listening to:  

:::{.my-8 .text-indigo-600 .text-center .text-2xl}
[https://typechat.netcore.io/music](https://typechat.netcore.io/music)
:::

[![](/img/posts/typescript-typechat-examples/music.png)](https://typechat.netcore.io/music)
[![](/img/posts/typescript-typechat-examples/music2.png)](https://typechat.netcore.io/music)
