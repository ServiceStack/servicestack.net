---
title: ServiceStack.Swift client library rewritten for Swift 6
summary: ServiceStack.Swift has been rewritten to take advantage of Swift 6 features, now dependency-free.
tags: [api,service-reference,swift]
author: Demis Bellot
image: ./img/posts/swift6-upgrade/bg.webp
---

![](https://docs.servicestack.net/img/pages/servicestack-reference/swift-logo-banner.jpg)

As part of the release of [AI Server](/posts/ai-server) we've upgraded all generic service client libraries 
to support multiple file uploads with API requests to take advantage of AI Server APIs
that accept file uploads like [Image to Image](https://docs.servicestack.net/ai-server/image-to-image), 
[Speech to Text](https://docs.servicestack.net/ai-server/speech-to-text) or its 
[FFmpeg Image](https://docs.servicestack.net/ai-server/transform/image) and 
[Video Transforms](https://docs.servicestack.net/ai-server/transform/video).

## ServiceStack.Swift rewritten for Swift 6

[ServiceStack.Swift](https://github.com/ServiceStack/ServiceStack.Swift) received the biggest upgrade, 
which was also rewritten to take advantage of Swift 6 features, including Swift promises which replaced the previous 
[PromiseKit](https://github.com/mxcl/PromiseKit) dependency - making it now dependency-free! 

For example you can request a [Speech to Text](https://docs.servicestack.net/ai-server/speech-to-text) 
transcription by sending an audio file to the `SpeechToText` API using the new `postFilesWithRequest` method:

### Calling AI Server to transcribe an Audio Recording

```swift
let client = JsonServiceClient(baseUrl: "https://openai.servicestack.net")
client.bearerToken = apiKey

let request = SpeechToText()
request.refId = "uniqueUserIdForRequest"

let response = try client.postFilesWithRequest(request:request, 
    file:UploadFile(fileName:"audio.mp3", data:mp3Data, fieldName:"audio"))

Inspect.printDump(response)
``` 

### Async Upload Files with API Example

Alternatively use the new `postFileWithRequestAsync` method to call the API asynchronously
using [Swift 6 Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
new **async/await** feature:

```swift
let response = try await client.postFileWithRequestAsync(request:request, 
    file:UploadFile(fileName:"audio.mp3", data:mp3Data, fieldName:"audio"))
    
Inspect.printDump(response)
```

### Multiple file upload with API Request examples

Whilst the `postFilesWithRequest` methods can be used to upload multiple files with an API Request. e.g:

```swift
let request = WatermarkVideo()
request.position = .BottomRight

let response = try client.postFilesWithRequest(request: request,
    files: [
        UploadFile(fileName: "video.mp4", data:videoData, fieldName:"video"),
        UploadFile(fileName: "mark.jpg", data:imgData, fieldName:"watermark")
    ])
```

Async Example:

```swift
let response = try await client.postFilesWithRequestAsync(request: request,
    files: [
        UploadFile(fileName: "video.mp4", data:videoData, fieldName:"video"),
        UploadFile(fileName: "mark.jpg", data:imgData, fieldName:"watermark")
    ])
```

### Sending typed Open AI Chat Ollama Requests with Swift

Even if you're not running AI Server you can still use its typed DTOs to call any compatible
Open AI Chat Compatible API like a self-hosted [Ollama](https://ollama.com) API. 

To call an Ollama endpoint from Swift:

1. Include `ServiceStack` package in your projects `Package.swift`

```swift
dependencies: [
    .package(url: "https://github.com/ServiceStack/ServiceStack.Swift.git",
        Version(6,0,0)..<Version(7,0,0)),
],
```

2. Download AI Server's Swift DTOs:

:::copy
`npx get-dtos swift https://openai.servicestack.net`
:::

You'll then be able to call Ollama by sending the OpenAI Chat compatible `OpenAiChatCompletion` 
Request DTO with the `JsonServiceClient`:

```swift
import Foundation
import ServiceStack

let ollamaBaseUrl = "http://localhost:11434"
let client = JsonServiceClient(baseUrl:ollamaBaseUrl)

let request = OpenAiChatCompletion()
request.model = "mixtral:8x22b"
let msg =  OpenAiMessage()
msg.role = "user"
msg.content = "What's the capital of France?"
request.messages = [msg]
request.max_tokens = 50

let result:OpenAiChatResponse = try await client.postAsync(
    "/v1/chat/completions", request:request)
```

