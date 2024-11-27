---
title: .NET 8 Templates now using Kamal for deployments
url: /posts/kamal-deployments
image: /img/posts/kamal-deployments/kamal-splash.png
order: 2
---

We've updated the built-in GitHub Actions for all Identity Auth templates to use the [Kamal deployment](https://kamal-deploy.org/) tool
for customers considering their potential [cloud exit cost savings](https://world.hey.com/dhh/our-cloud-exit-savings-will-now-top-ten-million-over-five-years-c7d9b5bd)
by exploring the shift in deployment strategy for self-hosting their .NET Docker Apps on their own servers or 
in-expensive cloud providers like [hetzner.com](https://www.hetzner.com) 

Previously, a less streamlined process involving [SSH and Docker Compose](https://docs.servicestack.net/kamal-deploy) was used. 
Now, all Identity Auth templates utilize Kamal, a CLI tool simplifying deployments to any Linux server accessible via SSH.
Kamal automates tasks such as reverse proxy setup and TLS certificate management whilst providing useful 
local management tools via Kamal's commands.
