---
title: .NET 8 Templates migrated to use Kamal for deployments
summary: All Identity Auth templates now use Kamal for deployments, simplifying the process of deploying .NET Apps to any Linux server.
tags: [github-actions,docker,devops]
url: https://media.servicestack.com/podcasts/kamal-deployments.mp3
media: {size:5227532,duration:1306.824000,format:mp3}
---

This episode explores the shift in deployment strategy for .NET applications using the [Kamal deployment](https://kamal-deploy.org/) tool. 

Previously, a less streamlined process involving SSH and Docker Compose was used. Now, all Identity Auth 
templates utilize Kamal, a CLI tool simplifying deployments to any Linux server accessible via SSH. 
Kamal automates tasks such as reverse proxy setup and TLS certificate management. 

The integration with GitHub Actions maintains CI/CD benefits while improving local management via Kamal's commands. 
The authors express enthusiasm for Kamal's ease of use and potential for community growth.

### Videos

:::youtube -mDJfRG8mLQ
Use Kamal with GitHub Actions to deploy .NET Apps to any Linux server
:::

### Links

- [Blog Post](/posts/kamal-deployments)
