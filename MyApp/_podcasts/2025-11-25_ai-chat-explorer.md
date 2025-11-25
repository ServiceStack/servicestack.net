---
title: Creating a custom Explorer UI for OpenAIs Chat API
summary: Learning how to create a customized API Explorer API UIs like ChatCompletion's UI
tags: [llms,ai,openai,chat]
author: Demis Bellot
url: https://media.servicestack.com/podcasts/ai-chat-explorer.mp3
media: {size:12740170,duration:898.287166,format:mp3}
---

The episode discusses the process of **creating a custom API Explorer UI** specifically for OpenAI's Chat API, 
contrasting it with generic interfaces like Swagger UI. It asserts that **generic UIs fall short** when dealing 
with complex APIs, offering minimal assistance and poor usability, while ServiceStack's API Explorer provides a 
more functional, **hand-crafted application UI experience**. 

The key to this improved usability lies in **optimizing UI components** for different data types—such as using 
number inputs for numeric fields and Comboboxes for options like **Model** and **Service Tier**—along with 
providing concise **help text hints** and client-side validation. 

Furthermore, the episode explains how custom components, like the specialized **ChatMessages component**, can be 
integrated to handle complex properties, all driven by declarative **[Input]** and **[FieldCss]** attributes on 
the Request Data Transfer Object (DTO).