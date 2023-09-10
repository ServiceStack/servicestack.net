---
title: Implementing TypeChat's GPT CoffeeShop in .NET
summary: Guide to implementing Voice Transcriptions and TypeChat GPT in .NET    
tags: [autoquery, c#, dev, servicestack]
image: https://images.unsplash.com/photo-1678483789107-0029c61fdcca?crop=entropy&fit=crop&h=1000&w=2000
author: Demis Bellot
draft: true
---

In [Part 1 of our GPT CoffeeShop in .NET](/posts/building-typechat-coffeeshop-modelling) we looked at how we could easily
implement a TypeChat's CoffeeShop Application Database and Management UI which was able to dynamically generate TypeChat's
[coffeeShopSchema.ts](https://github.com/microsoft/TypeChat/blob/main/examples/coffeeShop/src/coffeeShopSchema.ts)
in .NET using:

 - [CoffeeShopPromptProvider.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop.ServiceInterface/CoffeeShopPromptProvider.cs):
To create the `ScriptContext` containing all data and functionality our [#Script](https://sharpscript.net) is executed with
 - [/coffeeshop/schema.ss](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/gpt/coffeeshop/schema.ss):
**#Script** Template that generates the TypeScript Schema

The result of which produces a functionally equivalent
[/coffeeshop/schema.ts](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/gpt/coffeeshop/schema.ts) powered
by the data in CoffeeShop's Database.

## CoffeeShop UI

The purpose of which is to implement a CoffeeShop Menu which can fulfil ordering any of the products along with any 
toppings, customizations and preparation options allowed by the App's database and resulting TypeScript Schema.

The resulting App implements a standard Web UI to navigate all categories and products offered in the CoffeeShop Menu,
in addition it also supports an Audio Interface that lets customers order from the Menu with their **Voice** - which
is where we make use of Microsoft's [TypeChat](https://github.com/microsoft/TypeChat) and Open AI's GPT services:

<h3 class="not-prose text-center pb-8">
    <a class="text-4xl text-blue-600 hover:underline" href="https://coffeeshop.netcore.io">https://coffeeshop.netcore.io</a>
</h3>

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-ui.png)](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-ui.png)
:::

The Web UI adopts the same build-free [Simple, Modern JavaScript](/posts/javascript) approach that was used to create vue-mjs's [Client Admin UI](/posts/admin-uis)
to create the CoffeeShop's reactive frontend UI utilizing progressive Vue.mjs, which is maintained in the
[Index.cshtml](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/Pages/Index.cshtml) Home page.

This post explains how we implemented this functionality in .NET along with the different providers you can use to
transcribe audio recordings, save uploaded files and use GPT to convert natural language to order item requests
we can add to our cart.

### Implementing Voice Command Customer Orders

Before we're able to enlist Chat GPT to do our bidding for us, we need to capture our Customer's CoffeeShop Order
Voice Recording and transcribe it to text.

We have a few options when it comes to real-time Speech-to-Text translation services you can choose from, including:

 - [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text/) - Starts from **$0.016** /minute or **$0.012** 
if you're ok with Google to use your recordings to improve their AI models
 - [Amazon Transcribe](https://aws.amazon.com/transcribe/) - Starts from **$0.024** /minute
 - [Azure AI Speech](https://aws.amazon.com/transcribe/) - Starts from **$0.0167** /minute
 - [OpenAI Whisper API](https://openai.com/research/whisper) - Flat rate of **$0.006** /minute for using their online API
 - [OpenAI Whisper Local](https://github.com/openai/whisper) - Whisper is also available as an OSS project you can run yourself
if you prefer to manage your own servers and local Whisper install

### Managed Cloud Solution

As we also want to upload and store our Customer voice recordings in managed storage (and be able to later measure their effectiveness) 
we decided to build the initial implementation with **Google Cloud** since it offers the best value. This generally means
you'll also want to use their [Google Cloud Storage](https://cloud.google.com/storage) for best latency since you'll  
only need to upload it once to Google Cloud Storage which can be referenced directly by their Speech-to-text services. 

### Local Solution

We also enabled support for a minimal infrastructure dependency solution by storing voice recordings to local disk
then using either Open AI's Whisper API or a local Whisper installation to do the transcribing. 

At a minimum to use CoffeeShop's text or voice activated commands your pc will need the `OPENAI_API_KEY` Environment Variable 
configured with your [OpenAI API Key](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

## ServiceStack.Gpt Providers

As the AI landscape is actively changing we want our Apps to be able to easily switch to different Speech-to-text providers
so we're able to evaluate and use the best provider for each use-case. 

### ISpeechToText

To support this we're maintaining abstractions for different AI and GPT Providers in **ServiceStack.Gpt** starting with
`ISpeechToText` for abstracting Speech-to-text services behind a simple API:

```csharp
public interface ISpeechToText
{
    // Once only task that needs to be run out-of-band prior to usage
    Task InitAsync(List<string> phrases, CancellationToken token = default);
    
    // Transcribe the UserRequest and return a JSON API Result
    Task<TranscriptResult> TranscribeAsync(string request, CancellationToken token);
}
```

As of this of this writing CoffeeShop supports using 3 different Speech-to-text providers, defaulting to using 
Open AI's Whisper API, configurable in [appsettings.json](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/appsettings.json):

```json
{
  "SpeechProvider": "WhisperApiSpeechToText"
}
```

With all available providers configured in
[Configure.Speech.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/Configure.Speech.cs):

```csharp
var speechProvider = context.Configuration.GetValue<string>("SpeechProvider");
if (speechProvider == nameof(GoogleCloudSpeechToText))
{
    AppHost.AssertGoogleCloudCredentials();
    services.AddSingleton<ISpeechToText>(c => new GoogleCloudSpeechToText(
        c.Resolve<AppConfig>().CoffeeShopGoogleSpeechConfig(),SpeechClient.Create()));
}
else if (speechProvider == nameof(WhisperApiSpeechToText))
{
    services.AddSingleton<ISpeechToText, WhisperApiSpeechToText>();
}
else if (speechProvider == nameof(WhisperLocalSpeechToText))
{
    services.AddSingleton<ISpeechToText>(c => new WhisperLocalSpeechToText {
        WhisperPath = c.Resolve<AppConfig>().WhisperPath,
        TimeoutMs = c.Resolve<AppConfig>().NodeProcessTimeoutMs,
    });
}
```

To use `GoogleCloudSpeechToText` your pc needs to be [configured with Credentials](https://cloud.google.com/speech-to-text/docs/before-you-begin)
on a project with Speech-to-Text enabled.

To use `WhisperLocalSpeechToText` you'll need a [local install of OpenAI Whisper](https://github.com/openai/whisper)
that's either available from your `$PATH` or `WhisperPath` is configured in **appsettings.json**

## Virtual File System

By default CoffeeShop is configured to upload its recordings to the local file system, this can be changed to upload
to Google Cloud Storage in **appsettings.json** with:

```json
{
  "VfsProvider": "GoogleCloudVirtualFiles"
}
```

Which is configured in [Configure.Vfs.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/Configure.Vfs.cs):

```csharp
appHost.VirtualFiles = new GoogleCloudVirtualFiles(
    StorageClient.Create(), appHost.Resolve<AppConfig>().CoffeeShop.Bucket);
```

Or if preferred, you can configure it to use any of the other supported [Virtual File System](https://docs.servicestack.net/virtual-file-system)
providers including Azure's Blob Storage, AWS S3 or Cloudflare's R2.

### Managed File Uploads

The File Uploads themselves are managed by the [Managed File Uploads](https://docs.servicestack.net/locode/files-upload-filesystem)
feature which specifies the configuration below for **recordings**, which only allows uploading:

 - Known **Web Audio** File Types
 - Accepts uploads by **anyone**
 - A maximum size of **1MB**

Whose file upload location is derived from when it was uploaded:

```csharp
Plugins.Add(new FilesUploadFeature(
    new UploadLocation("recordings", VirtualFiles, 
        allowExtensions: FileExt.WebAudios, 
        writeAccessRole: RoleNames.AllowAnon,
        maxFileBytes: 1024 * 1024,
        resolvePath: ctx => $"/recordings/{ctx.DateSegment}/{DateTime.UtcNow.TimeOfDay.TotalMilliseconds}.{ctx.FileExtension}")
));
```

## Transcribe Audio Recording API

This feature allows the `CreateCoffeeShopRecording` [AutoQuery CRUD API](https://docs.servicestack.net/autoquery/crud) 
to declaratively support file uploads with the `[UploadTo("recordings")]` attribute: 

```csharp
public class CreateCoffeeShopRecording : ICreateDb<Recording>, IReturn<Recording>
{
    [Input(Type="file"), UploadTo("recordings")]
    public string Path { get; set; }
}
```

Where it will be uploaded to the `VirtualFiles` provider configured in the **recordings** File Upload location.

As we want the same API to also transcribe the recording we've implemented a [Custom AutoQuery implementation](https://docs.servicestack.net/autoquery/crud#custom-autoquery-crud-implementation) in 
[CoffeeShopServices.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop.ServiceInterface/CoffeeShopServices.cs)
that after creating the `Recording` entry with the populated relative `Path` of where the Audio file was uploaded
to, calls `ISpeechToText.TranscribeAsync()` to kick off the recording transcription request with the configured
Speech-to-text provider. 

After it completes its JSON Response is then added to the `Recording` row and saved to the configured VirtualFiles provider before
being returned in the API Response:

```csharp
public class CoffeeShopServices : Service
{
    //...
    public IAutoQueryDb AutoQuery { get; set; }
    public ISpeechToText SpeechToText { get; set; }
    
    public async Task<object> Any(CreateCoffeeShopRecording request)
    {
        var recording = (Recording)await AutoQuery.CreateAsync(request, Request);

        var transcribeStart = DateTime.UtcNow;
        await Db.UpdateOnlyAsync(() => new Recording { TranscribeStart = transcribeStart },
            where: x => x.Id == recording.Id);

        ResponseStatus? responseStatus = null;
        try
        {
            var response = await SpeechToText.TranscribeAsync(request.Path);
            var transcribeEnd = DateTime.UtcNow;
            await Db.UpdateOnlyAsync(() => new Recording
            {
                Provider = SpeechToText.GetType().Name,
                Transcript = response.Transcript,
                TranscriptConfidence = response.Confidence,
                TranscriptResponse = response.ApiResponse,
                TranscribeEnd = transcribeEnd,
                TranscribeDurationMs = (int)(transcribeEnd - transcribeStart).TotalMilliseconds,
                Error = response.ResponseStatus.ToJson(),
            }, where: x => x.Id == recording.Id);
            responseStatus = response.ResponseStatus;
        }
        catch (Exception e)
        {
            await Db.UpdateOnlyAsync(() => new Recording { Error = e.ToString() },
                where: x => x.Id == recording.Id);
            responseStatus = e.ToResponseStatus();
        }

        recording = await Db.SingleByIdAsync<Recording>(recording.Id);

        WriteJsonFile($"/speech-to-text/{recording.CreatedDate:yyyy/MM/dd}/{recording.CreatedDate.TimeOfDay.TotalMilliseconds}.json", 
            recording.ToJson());

        if (responseStatus != null)
            throw new HttpError(responseStatus, HttpStatusCode.BadRequest);

        return recording;
    }
}
```

### Capturing and Uploading Web Audio Recordings

Now that our Server supports it we can start using this API to upload Audio Recordings. To simplify reuse we've 
encapsulated Web Audio API usage behind the [AudioRecorder.mjs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/wwwroot/mjs/AudioRecorder.mjs)
class which can start recording Audio from the Users microphone with `start()`:

```js
import { AudioRecorder } from "/mjs/AudioRecorder.mjs"

let audioRecorder = new AudioRecorder()
await audioRecorder.start()
```

Which will capture audio chunks until `stop()` is called which stitches them into a `Blob` that it converts into
a Blob DataURL that is returned within a populated [Audio](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
Media element:

```js
const audio = await audioRecorder.stop()
```

Which supports the [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#instance_methods) API
allowing you to playback and pause recordings with:

```js
audio.play()
audio.pause()
```

The `AudioRecorder` also maintains the `Blob` of its latest recording in the `audioBlob` and the Mime Type that it was
captured with in `audioExt` field, which we can use to upload it to the `CreateCoffeeShopRecording` API, which
if successful will return a transcription of the Audio recording: 

```js
import { JsonApiClient } from "@servicestack/client"

const client = JsonApiClient.create()

const formData = new FormData()
formData.append('path', audioRecorder.audioBlob, `file.${audioRecorder.audioExt}`)
const api = await client.apiForm(new CreateCoffeeShopRecording(), formData)
if (api.succeeded) {
    transcript.value = api.response.transcript
}
```

## TypeChat API

Now that we have a transcript of the Customers recording we need to enlist the services of Chat GPT to convert it into 
an Order request that our App can understand. 

### ITypeChatProvider

Just as we've abstracted the Transcription Services our App binds to, we also want to abstract the TypeChat provider
our App uses so we can easily swap out and evaluate different solutions:

```csharp
public interface ITypeChatProvider
{
    Task<TypeChatResponse> TranslateMessageAsync(TypeChatRequest request, 
        CancellationToken token = default);
}
```

Whilst a simple API on the surface, different execution and customizations options are available in the 
`TypeChatRequest` which at a minimum requires the Schema & Prompt to use and the **UserMessage** to convert:

```csharp
// Request to process a TypeChat Request
public class TypeChatRequest
{
    public TypeChatRequest(string schema, string prompt, string userMessage)
    {
        Schema = schema;
        Prompt = prompt;
        UserMessage = userMessage;
    }

    /// TypeScript Schema
    public string Schema { get; set; }
    
    /// TypeChat Prompt
    public string Prompt { get; set; }
    
    /// Chat Request
    public string UserMessage { get; }
    
    /// Path to node exe (default node in $PATH)
    public string? NodePath { get; set; }

    /// Timeout to wait for node script to complete (default 120s)
    public int NodeProcessTimeoutMs { get; set; } = 120 * 1000;

    /// Path to node TypeChat script (default typechat.mjs)
    public string? ScriptPath { get; set; }
    
    /// TypeChat Behavior we want to use (Json | Program)
    public TypeChatTranslator TypeChatTranslator { get; set; }

    /// Path to write TypeScript Schema to (default Temp File)
    public string? SchemaPath { get; set; }
    
    /// Which directory to execute the ScriptPath (default CurrentDirectory) 
    public string? WorkingDirectory { get; set; }
}
```

### IPromptProvider

Whilst App's can use whichever strategy they prefer to generate their TypeScript `Schema` and Chat GPT `Prompt` texts, 
they can still benefit from implementing the same `IPromptProvider` interface to improve code reuse which should contain 
the App-specific functionality for creating its **TypeScript Schema** and **GPT Prompt** from a `TypeChatRequest`, 
which CoffeeShop implements in 
[CoffeeShopPromptProvider.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop.ServiceInterface/CoffeeShopPromptProvider.cs):

```csharp
// The App Provider to use to generate TypeChat Schema and Prompts
public interface IPromptProvider
{
    // Create a TypeChat TypeScript Schema from a TypeChatRequest
    Task<string> CreateSchemaAsync(CancellationToken token);

    // Create a TypeChat TypeScript Prompt from a User request
    Task<string> CreatePromptAsync(string userMessage, CancellationToken token);
}
```

### Semantic Kernel TypeChat Provider

The natural approach for doing this in .NET is to use [Microsoft's Semantic Kernel](https://github.com/microsoft/semantic-kernel)    
to talk to OpenAI's Chat GPT API directly which the CoffeeShop App can be configured to use by specifying to use
`KernelTypeChatProvider` in **appsettings.json**:

```json
{
  "TypeChatProvider": "KernelTypeChatProvider"
}
```

Which will configure to use the `KernelTypeChatProvider` in [Configure.Gpt.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/Configure.Gpt.cs)

```csharp
var kernel = Kernel.Builder.WithOpenAIChatCompletionService(
        Environment.GetEnvironmentVariable("OPENAI_MODEL") ?? "gpt-3.5-turbo", 
        Environment.GetEnvironmentVariable("OPENAI_API_KEY")!)
    .Build();
services.AddSingleton(kernel);
services.AddSingleton<ITypeChatProvider>(c => 
    new KernelTypeChatProvider(c.Resolve<IKernel>()));
```

## Using Chat GPT to process Natural Language Orders

We now have everything we need to start leveraging Chat GPT to convert our Customers **Natural Language** requests 
into Machine readable instructions that our App can understand, guided by TypeChat's TypeScript Schema.

The API to do this needs only a single property to capture the Customer request, that will be either provided from a 
free-text text input or a Voice Input captured by Web Audio:  

```csharp
public class CreateCoffeeShopChat : ICreateDb<Chat>, IReturn<Chat>
{
    public string UserMessage { get; set; }
}
```

That just like `CreateCoffeeShopRecording` is a custom AutoQuery CRUD Service that uses AutoQuery to create the 
initial `Chat` record, that is later updated with the GPT Chat API Response, executed from the configured
`ITypeChatProvider` provider:

```csharp
public class CoffeeShopServices : Service
{
    //...
    public IAutoQueryDb AutoQuery { get; set; }
    public IPromptProvider PromptProvider { get; set; }
    public ITypeChatProvider TypeChatProvider { get; set; }
    
    public async Task<object> Any(CreateCoffeeShopChat request)
    {
        var chat = (Chat)await AutoQuery.CreateAsync(request, Request);

        var chatStart = DateTime.UtcNow;
        await Db.UpdateOnlyAsync(() => new Chat { ChatStart = chatStart },
            where: x => x.Id == chat.Id);

        ResponseStatus? responseStatus = null;
        try
        {
            var schema = await PromptProvider.CreateSchemaAsync();
            var prompt = await PromptProvider.CreatePromptAsync(request.UserMessage);
            var typeChatRequest = CreateTypeChatRequest(schema, prompt, request.UserMessage);
            
            var response = await TypeChatProvider.TranslateMessageAsync(typeChatRequest);
            var chatEnd = DateTime.UtcNow;
            await Db.UpdateOnlyAsync(() => new Chat
            {
                Request = request.UserMessage,
                Provider = TypeChatProvider.GetType().Name,
                Schema = schema,
                Prompt = prompt,
                ChatResponse = response.Result,
                ChatEnd = chatEnd,
                ChatDurationMs = (int)(chatEnd - chatStart).TotalMilliseconds,
                Error = response.ResponseStatus.ToJson(),
            }, where: x => x.Id == chat.Id);
            responseStatus = response.ResponseStatus;
        }
        catch (Exception e)
        {
            await Db.UpdateOnlyAsync(() => new Chat { Error = e.ToString() },
                where: x => x.Id == chat.Id);
            responseStatus = e.ToResponseStatus();
        }

        chat = await Db.SingleByIdAsync<Chat>(chat.Id);
        
        WriteJsonFile($"/chat/{chat.CreatedDate:yyyy/MM/dd}/{chat.CreatedDate.TimeOfDay.TotalMilliseconds}.json", chat.ToJson());

        if (responseStatus != null)
            throw new HttpError(responseStatus, HttpStatusCode.BadRequest);
        
        return chat;
    }    
}
```

`CreateCoffeeShopChat` API returns Chat GPTs JSON Response directly to the client:  

```js
apiChat.value = await client.api(new CreateCoffeeShopChat({
    userMessage: request.toLowerCase()
}))

if (apiChat.value.response) {
    processChatItems(JSON.parse(apiChat.value.response.chatResponse).items)
} else if (apiChat.value.error) {
    apiProcessed.value = apiChat.value
}
```

Which parses and goes through all Cart Items that's in the structure of the TypeScript Schema and matches it against 
products and their customizations from the App's database before adding it to the user's cart in the 
[processChatItems(items)](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/Pages/Index.cshtml#L507) function.

### Trying it Out

Now that we've connected all the pieces together we can try it out! We'll hit the **Record** Icon to start our microphone 
recording so we can capture our Customer Order via Voice Input. 

We'll try with a Natural Language Order whose free-text input would be notoriously difficult to parse with traditional 
programming methods:  

> two tall lattes, the first one with no foam, the second one with whole milk. actually, make the first one a grande.

After the configured `ISpeechToText` provider has finished transcribing the uploaded Voice Recording it will display
the transcribed text whilst the request is being processed by Chat GPT:  

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-natural-language-1.png)](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-natural-language-1.png)
:::

Then if all was successful we should see the Customer Order magically get added to the Customer Cart:

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-natural-language-2.png)](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-natural-language-2.png)
:::

### Semantic Kernel Effectiveness

Most times you'll get the same desirable results when using Semantic Kernel to call Chat GPT from C# compared with
calling Chat GPT through node TypeChat as both are sending the same prompt to Chat GPT. 

Where they begin to differ is how they deal with invalid and undesirable responses from vague or problematic requests.

Lets take a look at an order from [TypeChat's input's](https://github.com/microsoft/TypeChat/blob/main/examples/coffeeShop/src/input.txt)
that Chat GPT had issues with: 

> i wanna latte macchiato with vanilla

That our Semantic Kernel Request translates into a reasonable Cart Item order:

```json
{
  "items": [
    {
      "type": "lineitem",
      "product": {
        "type": "LatteDrinks",
        "name": "latte macchiato",
        "options": [
          {
            "type": "Syrups",
            "name": "vanilla"
          }
        ]
      },
      "quantity": 1
    }
  ]
}
```

The problem being "vanilla" is close, but it's not an **exact match** for a **Syrup** on offer, so our order only gets partially filled:

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-kernel-vanilla-latte-macchiato.png)](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-kernel-vanilla-latte-macchiato.png)
:::

### TypeChat's Invalid Response Handling

So how does TypeChat fair when handling the same problematic prompt?

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/typechat-failed-vanilla-latte-macchiato.png)](/img/posts/building-typechat-coffeeshop-modelling/typechat-failed-vanilla-latte-macchiato.png)
:::

It expectedly fails in the same way, but as it's able to validate JSON responses against the TypeScript's schema it 
knows and can report back where the failure occurs through the TypeScript's compiler schema validation errors.

### Auto Retry Failed Requests

Interestingly before reporting back the schema validation error TypeChat had transparently sent a **retry** request back 
to Chat GPT with the original prompt with some additional context to help guide GPT into returning a valid response 
where it includes the invalid response it had received, an error message to say why it was invalid and the Schema
Validation Error:

```
//...
{
  "items": [
    {
      "type": "lineitem",
      "product": {
        "type": "LatteDrinks",
        "name": "latte macchiato",
        "options": [
          {
            "type": "Syrups",
            "name": "vanilla"
          }
        ]
      },
      "quantity": 1
    }
  ]
}
The JSON object is invalid for the following reason:
"""
Type '"vanilla"' is not assignable to type '"butter" | "strawberry jam" | "cream cheese" | "regular" | "warmed" | "cut in half" | "whole milk" | "two percent milk" | "nonfat milk" | "coconut milk" | "soy milk" | "almond milk" | ... 42 more ... | "heavy cream"'.
"""
The following is a revised JSON object:
```

Unfortunately in this case the schema validation error is incomplete and doesn't include the valid values for
the `Syrups` type, so ChatGPT 3.5 never gets it right.

### Custom Validation with C# Semantic Kernel

The benefit of TypeScript Schema validation errors are that they require little effort since they're automatically 
generated by TypeScript's compiler. Since TypeChat isn't able to resolve the issue in this case, can we do better?

As we already need to perform our own validation to match GPT's `Cart` response back to our database products, we
can construct our own auto-correcting prompt by specifying what was wrong and repeating the definition of the failed
`Syrups` type, e.g:

``` 
//...
JSON validation failed: 'vanilla' is not a valid name for the type: Syrups

export interface Syrups {
    type: 'Syrups';
    name: 'almond syrup' | 'buttered rum syrup' | 'caramel syrup' | 'cinnamon syrup' | 'hazelnut syrup' | 
        'orange syrup' | 'peppermint syrup' | 'raspberry syrup' | 'toffee syrup' | 'vanilla syrup';
    optionQuantity?: OptionQuantity;
}
```

Lo and behold we get what we're after, an expected valid response with the correct **vanilla syrup** value: 

```json
{
  "items": [
    {
      "type": "lineitem",
      "product": {
        "type": "LatteDrinks",
        "name": "latte macchiato",
        "options": [
          {
            "type": "Syrups",
            "name": "vanilla syrup"
          }
        ]
      },
      "quantity": 1
    }
  ]
}
```

This goes to show that interfacing with ChatGPT in C# with Semantic Kernel is a viable solution that whilst requires
more bespoke logic and manual validation, can produce a more effective response than what's possible with TypeChat.

If you need to maintain few interfaces with ChatGPT, building your solution all in .NET might be the best option, but if
you need to generate and maintain multiple schemas than using a generic library with automated retries like TypeChat utilizing 
TypeScript Schema validation errors is likely preferred.

### TypeChat with ChatGPT 4

As we're not able to achieve a successful response from this problematic request from GPT-3.5, would ChatGPT 4 fair
any better?

Lets try by setting the `OPENAI_MODEL` Environment Variable to **gpt-4** in our shell:

:::sh
set OPENAI_MODEL=gpt-4
:::

Then retry the request:

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/typechat-success-vanilla-latte-macchiato.png)](/img/posts/building-typechat-coffeeshop-modelling/typechat-success-vanilla-latte-macchiato.png)
:::

No sweat! GPT-4 didn't need the retry and gets it right in one-shot on the first try.

So the easiest way to improve the success rate of your TypeChat GPT solutions is to switch to GPT-4, or for a more cost
effective approach you can start with GPT-3.5 than retry failed requests with GPT-4.

## Node TypeChat Provider

As TypeChat uses **typescript** we'll need to call out to the **node** executable in order to be able to use it from
our .NET App.

To configure our App to talk to ChatGPT API via TypeChat we need to specify to use `NodeTypeChatProvider` in **appsettings.json**:

```json
{
  "TypeChatProvider": "NodeTypeChatProvider"
}
```

Which will configure to use the `NodeTypeChatProvider` in [Configure.Gpt.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/Configure.Gpt.cs)

```csharp
services.AddSingleton<ITypeChatProvider>(c => new NodeTypeChatProvider());
```

It works by executing an **external process** that invokes our custom
[typechat.mjs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/typechat.mjs) wrapper around TypeChat's
functionality to invoke it and return any structured error responses in a `ResponseStatus` format that our .NET App 
can understand, which you can also invoke manually from the command line with:

:::sh
node typechat.mjs json gpt\coffeeshop\schema.ts "i wanna latte macchiato with vanilla"
:::

Lets test this out this with `OPENAI_MODEL=gpt-4` so we can see the problematic prompt above working in our App:

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-nodegpt4-vanilla-latte-macchiato.png)](/img/posts/building-typechat-coffeeshop-modelling/coffeeshop-nodegpt4-vanilla-latte-macchiato.png)
:::

## Alternate Speech-to-Text Providers

//....

```json
{
    "SpeechProvider": "GoogleCloudSpeechToText"
}
```