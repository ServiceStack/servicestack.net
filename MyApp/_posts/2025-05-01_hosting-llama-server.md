---
title: Using llama.cpp to self-host Large Language Models in Production 
summary: We look at 
tags: [ai-server,ai,gpt]
author: Demis Bellot
image: ./img/posts/hosting-llama-server/bg.webp
---

[Ollama](https://ollama.com), [LM Studio](https://lmstudio.ai) and [Jan](https://jan.ai) 
have become popular choices for AI enthusiasts looking to run large language models 
(LLMs) locally which provide a UX-friendly intuitive interfaces for downloading, installing and running a variety of open-source models on personal workstations, acceleratable with GPUs.

However, when scaling beyond personal use, these tools reveal their limitations which weren't 
designed with production deployment in mind, often lacking flexible and robust resource 
management, fine-grained authorized usage and optimizations necessary for sustained, high-demand 
environments.

## Enter llama-server: The Production workhorse

The technology underpinning these applications is 
[llama.cpp](https://github.com/ggml-org/llama.cpp), a groundbreaking C/C++ implementation that 
enables running sophisticated language models on consumer hardware. 
This remarkable project, created by Georgi Gerganov, revolutionized the LLM landscape by making 
previously cloud-only models accessible to everyday users through clever quantization techniques 
and memory-efficient operations.

While Ollama and LM Studio provide user-friendly wrappers around this technology, llama.cpp's
[llama-server](https://github.com/ggml-org/llama.cpp/tree/master/examples/server) leverages the 
same core but strips away the overhead to focus exclusively on performance and stability. 
By directly utilizing the llama.cpp library and its server component, organizations can bypass the 
abstractions introduced by desktop applications and tap into the raw power of the underlying engine whose 
[highly configurable runtime](https://github.com/ggml-org/llama.cpp/tree/master/examples/server#usage)
allows for optimized self-hosting of authorized models.

This direct approach eliminates unnecessary layers that might introduce latency or unexpected 
behaviors, providing a more consistent and predictable experience necessary for production environments. 
For DevOps teams and system administrators, this translates to fewer surprises during deployment 
and operation — a crucial factor when incorporating self-hosting AI solutions into critical business applications.

## Hosting llama-server with Docker

Organizations that have incorporated container based deployment solutions will most likely prefer 
a docker solution of which is available in a number of different hardware optimized configurations including CPU, CUDA for NVIDIA GPUs, ROCm for AMD GPUs and MUSA for Moore Threads GPUs.

Docker containers requiring NVIDIA GPU accelearation will require installing the
[NVidia Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) which allows you to run the `llama.cpp:server-cuda` CUDA optimized image with the `--gpus` flag to utilize your hardwares NVIDIA GPUs, e.g:

```sh
docker run -p 8080:8080 -v /path/to/models:/models --gpus all \
    ghcr.io/ggml-org/llama.cpp:server-cuda -m models/phi-4.Q4_K_M.gguf \
    -c 512 --host 0.0.0.0 --port 8080 --n-gpu-layers 999
```

llama.cpp can run models in the [GGUF File format](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md) that are commonly [hosted on hugging face](https://huggingface.co/models?library=gguf&sort=trending). As of this writing Microsoft, Google and Mistral AI have released some of the best quantized LLMs you can run on consumer GPUs:

 - [Phi-4 14B](https://huggingface.co/bartowski/phi-4-GGUF/tree/main) by Microsoft
 - [Gemma3 27B](https://huggingface.co/google/gemma-3-27b-it-qat-q4_0-gguf/tree/main) by Google
 - [Mistral Small 3.1 24B](https://huggingface.co/openfree/Mistral-Small-3.1-24B-Instruct-2503-Q8_0-GGUF/tree/main) by Mistral AI

### Docker compose

Docker compose is a great solution for hosting llama-server in production environments which simplifies managing multiple services within declarative configurations, making deployments more repeatable and scalable.

```yml
version: '3'

services:
  phi:
    image: ghcr.io/ggml-org/llama.cpp:server-cuda
    environment:
      - LLAMA_ARG_N_GPU_LAYERS=999
      - LLAMA_ARG_MODEL=/models/phi-4.Q4_K_M.gguf
    ports:
      - "8000:8080"
    volumes:
      - ./models:/models
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
  gemma:
    image: ghcr.io/ggml-org/llama.cpp:server-cuda
    environment:
      - LLAMA_ARG_N_GPU_LAYERS=999
      - LLAMA_ARG_MODEL=/models/gemma-3-27b-it-qat-q4_0-gguf
    ports:
      - "8001:8080"
    volumes:
      - ./models:/models
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
  mistral:
    image: ghcr.io/ggml-org/llama.cpp:server-cuda
    environment:
      - LLAMA_ARG_N_GPU_LAYERS=999
      - LLAMA_ARG_MODEL=/models/mistral-small-3.1-24b-instruct-2503-q8_0.gguf
    ports:
      - "8002:8080"
    volumes:
      - ./models:/models
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

After saving this to `docker-compose.yml` along with the models:

```files
/models
  phi-4.Q4_K_M.gguf
  gemma-3-27b-it-qat-q4_0-gguf
  mistral-small-3.1-24b-instruct-2503-q8_0.gguf
docker-compose.yml
```

You'll be able to run and test them with:

:::sh
docker compose up
:::

This will launch 3 container instances of llama-server configured to run different models accessible via an [OpenAI compatible API](https://platform.openai.com/docs/api-reference/chat) on ports `8000`, `8001` and `8002` which you can test using llama-server's Chat Web UI.

### Dedicated GPUs

Docker containers can also be configured to run llama-server on different dedicated GPUs, 
identified by their GPU index:

```yml
- driver: nvidia
  device_ids: ['0'] # Assign to GPU 0
  capabilities: [gpu]
```

### Typed Open AI Chat APIs in 11 Languages

Since [AI Server](https://openai.servicestack.net) is written in ServiceStack we're able to use
its OpenAI Compatible Chat API DTOs to enable typed integrations in its
[11 supported languages](https://docs.servicestack.net/ai-server/openai-chat-all-languages).

### Access llama-server from C#

1. Create an empty console application:

:::sh
dotnet new console
:::

2. Add the **ServiceStack.Client** NuGet package:

:::sh
dotnet add package ServiceStack.Client
:::

3. Download AI Server's Typed C# DTOs:

:::sh
npx get-dtos csharp https://openai.servicestack.net
:::

4. Call llama-server's OpenAI Chat API from C#: 

```csharp
// Program.cs
using ServiceStack;
using ServiceStack.Text;
using AiServer.ServiceModel;

var client = new JsonApiClient("https://localhost:8000");
var result = await client.PostAsync<OpenAiChatResponse>("/v1/chat/completions",
    new OpenAiChatCompletion {
        Messages = [
            new () { Role = "user", Content = "What's the capital of France?" }
        ],
        MaxTokens = 50
    });

result.PrintDump();
```

Run the program:

:::sh
dotnet run
:::

### Access llama-server from [Node](https://nodejs.org) or [Bun](https://bun.sh) with TypeScript

1. Add the `@servicestack/client` client library:

:::sh
npm install @servicestack/client
:::

2. Download AI Server's TypeScript DTOs:

:::sh
npx get-dtos typescript https://openai.servicestack.net
:::

Call llama-server with TypeScript DTOs and the generic `JsonServiceClient`

```ts
import { JsonServiceClient, Inspect } from "@servicestack/client"
import { OpenAiChatCompletion } from "./dtos"

const client = new JsonServiceClient("https://localhost:8000")

const result = await client.postToUrl("/v1/chat/completions",
    new OpenAiChatCompletion({
        messages: [
            { role: "user", content: "What's the capital of France?" }
        ],
        max_tokens: 50
    })
)

Inspect.printDump(result)
```

