---
title: Using llama.cpp to self-host Large Language Models in Production 
summary: A practical guide to self-hosting LLMs in production using llama.cpp's llama-server with Docker compose and Systemd
tags: [ai-server,ai,gpt]
author: Demis Bellot
url: https://media.servicestack.com/podcasts/hosting-llama-server.mp3
media: {size:9138932,duration:863.928000,format:mp3}
---

This episode covers [llama-server](https://github.com/ggml-org/llama.cpp/blob/master/examples/server/README.md), 
a production-focused tool built on llama.cpp for self-hosting large language models, contrasting it with 
user-friendly local alternatives. 

It details how to deploy llama-server using Docker, including GPU-accelerated configurations, and natively with 
Systemd for optimized performance. 

The episode also introduces [AI Server](https://docs.servicestack.net/ai-server/), an open-source managed gateway 
designed to streamline AI integrations by centralizing management of multiple LLM providers, including 
llama-server instances and cloud-based APIs. 

It explains how to use AI Server by registering llama-server endpoints, creating API keys for applications, 
and utilizing typed APIs in various programming languages for synchronous, queued, and callback-based interactions.