---
title: JSON Patch secrets into appsettings.json
summary: Simplify managing App secrets by JSON patching them into your appsettings.json with during deployments
tags: [x,json,devops,github-actions]
url: https://media.servicestack.com/podcasts/using-json-patch.mp3
draft: true
---

This episode talks about JSON Patching, a method for modifying JSON files by adding, removing, 
replacing, copying, moving, or testing elements within the JSON structure. 

This method is particularly useful for managing and altering configurations in a precise 
and granular way, especially when automating changes from a continuous integration environment. 

The ServiceStack x dotnet tool supports JSON Patching, offering developers a convenient way 
to apply JSON patches to their JSON configurations. 

It further illustrates the use of JSON Patching by providing a practical example of injecting 
SMTP settings into an appsettings.json file and showcasing how this process can be automated 
within a CI environment like GitHub Actions. 

By securely storing sensitive data in GitHub secrets and using JSON Patching to inject them 
during the CI process, developers can avoid hardcoding sensitive information directly into 
their application code, improving security and maintainability.

### Links

- [Blog Post](/posts/using-json-patch)
