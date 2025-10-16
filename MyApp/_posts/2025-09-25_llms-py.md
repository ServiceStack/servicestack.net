---
title: llms.py - Lightweight OpenAI compatible CLI and server gateway for multiple LLMs
summary: Support for Text, Image and Audio generation. Seamlessly mix and match local models with premium cloud LLMs
tags: [llms,ai,python]
author: Demis Bellot
image: ./img/posts/llms-py/bg.webp
---

# Introducing llms.py 🚀

We're excited to announce the release of **[llms.py](https://github.com/ServiceStack/llms)** - a super lightweight CLI tool and OpenAI-compatible server 
that acts as a **configurable gateway** over multiple configurable Large Language Model (LLM) providers.

As part of our work in developing a new OSS AI Generation platform we were in need of a lightweight
LLM gateway for usage within [ComfyUI](https://www.comfy.org). Unfortunately the popular option for Python **litellm**
is anything but - requiring [60 deps!](https://github.com/BerriAI/litellm/blob/main/requirements.txt)
where its VC funded development sees its scope creep into Enterprise features.

This is a deal breaker within an open Python plugin ecosystem like ComfyUI where every dependency has a chance to break
a Python environment. It's also unnecessary for a simple CLI tool and server gateway where the hard work
is already done by the LLM providers in their OpenAI-compatible APIs - a simplicity capitalized on by `llms.py`.

## 🎯 OpenRouter but Local

**llms.py** is designed as a **unified gateway** that seamlessly connects you to multiple LLM providers 
through a single, consistent interface. Whether using cloud APIs or local models, `llms` provides 
intelligent routing and automatic failover to ensure your AI workflows connect to your chosen providers in your
preferred priority - whether optimizing for cost, performance or availability.

### ⚡ Ultra-Lightweight Architecture

- **Single File**: Just one [llms.py](https://github.com/ServiceStack/llms/blob/main/llms/main.py) file (easily customizable)
- **Single Dependency**: Single `aiohttp` dependency
- **Zero Dependencies for ComfyUI**: Ideal for use in ComfyUI Custom Nodes
- **No Setup**: Just download and use, configure preferred LLMs in [llms.json](https://github.com/ServiceStack/llms/blob/main/llms/llms.json)


## 📦 Install

:::sh
pip install llms-py
:::

## 🔧 Quick Start

```bash
# Initialize configuration (saved in ~/.llms/llms.json)
llms --init

# Enable providers
llms --enable openrouter_free google_free groq openai anthropic grok

# List available providers and models
llms ls
llms ls openrouter_free groq

# Start chatting
llms "Explain quantum computing in simple terms"

# With preferred Model
llms -m grok-4-fast "jq command to sort openai models by created"

# With system prompt
llms -s "You are a quantum computing expert" "Explain quantum computing"

# Use with images
llms --image photo.jpg "What's in this image?"

# Use with audio
llms --audio talk.mp3 "Transcribe this audio file"

# Use with attached file
llms --file report.pdf "Summarize this PDF"

# With custom request template
llms --chat request.json "Explain quantum computing in simple terms"
llms --chat image-request.json --image photo.jpg "What's in this image?"
llms --chat audio-request.json --audio talk.mp3 "Transcribe this audio file"
llms --chat file-request.json --file report.pdf "Summarize this PDF"

# Set default model
llms --default grok-4-fast

# Run an Open AI Chat compatible server
llms --serve 8000
```

Example client usage:

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kimi-k2",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### 🌐 Configurable Multi-Provider Gateway

Acts as an intelligent gateway that can route requests for 160+ models across:

#### Cloud Providers with Free tiers
 
- OpenRouter
- Groq
- Codestral
- Google

#### Premium Cloud Providers 

 - OpenAI 
 - Anthropic
 - Google
 - Grok
 - Qwen
 - Mistral

#### Local Providers

- Ollama
  - Restrict access to custom models
  - Or auto-discovery of installed models
   
#### Custom Providers

Use JSON config to add any OpenAI-compatible API endpoints and models

### 🔄 Intelligent Request Routing

- **Automatic Failover**: If one provider fails, automatically retry with the next available provider
- **Cost Optimization**: Define free/cheap/local providers first to minimize costs
- **Model Mapping**: Use unified model names that map to different provider-specific names.

## 🚀 Key Features

### Multi-Modal Support
- **Text Generation**: Chat completions with any supported model
- **Vision Models**: Process images through vision-capable models (GPT-4V, Gemini Vision, etc.)
- **Audio Processing**: Handle audio inputs through audio-capable models

### Flexible Deployment Options
- **CLI Tool**: Interactive command-line interface for quick queries
- **HTTP Server**: OpenAI-compatible server at `http://localhost:{PORT}/v1/chat/completions`
- **Python Module**: Import and use programmatically in your applications
- **ComfyUI Node**: Embed directly in ComfyUI workflows

### Simple and Customizable
- **Environment Variables**: Secure API key management
- **Provider Management**: Easy enable/disable of providers
- **Custom Models**: Define your own model aliases and mappings
- **Unified Configuration**: Single [llms.json](https://github.com/ServiceStack/llms/blob/main/llms/llms.json) to configure all providers and models

## 🎯 Use Cases

### For Developers
- **API Gateway**: Centralize all LLM provider access through one endpoint
- **Cost Management**: Automatically route to cheapest available providers
- **Reliability**: Built-in failover ensures high availability
- **Testing**: Easily switch between models and providers for comparison

### For ComfyUI Users
- **Hybrid Workflows**: Combine local Ollama models with cloud APIs
- **Zero Setup**: No dependency management headaches
- **Provider Flexibility**: Switch providers without changing your workflow
- **Cost Control**: Use free tiers and local models when possible

### For Enterprises
- **Vendor Independence**: Avoid lock-in to any single LLM provider
- **Scalability**: Distribute load across multiple providers
- **Compliance**: Keep sensitive data local while using cloud for general tasks
- **Budget Control**: Intelligent routing to optimize costs


## 🌟 Why llms.py?

1. **Simplicity**: One file, one dependency, infinite possibilities
2. **Flexibility**: Works with any OpenAI-compatible client or framework
3. **Reliability**: Automatic failover ensures your workflows never break
4. **Economy**: Intelligent routing minimizes API costs
5. **Privacy**: Mix local and cloud models based on your data sensitivity
6. **Future-Proof**: Easily add new providers as they emerge

**llms.py** transforms the complexity of managing multiple LLM providers into a simple, unified experience. 
Whether you're researching capabilities of new models, building the next breakthrough AI application or just want 
reliable access to the best models available, llms.py has you covered.

Get started today and avoid expensive cloud lock-ins with the freedom of provider-agnostic AI development! 🎉

---

**Links:**
- 📚 [Documentation & Examples](https://github.com/ServiceStack/llms)
- 📦 [PyPI Package](https://pypi.org/project/llms-py/)
- 🔧 [Source Code](https://github.com/ServiceStack/llms)
