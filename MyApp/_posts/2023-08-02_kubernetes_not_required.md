---
title: Kubernetes Not Required - Using GitHub for Auto Deployments
summary: A cost-effective and straightforward web app deployment pattern using GitHub and a single Linux server
tags: github,deployment,devops
image: https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?crop=entropy&fit=crop&h=1000&w=2000
author: Darren Reid
draft: true
---


## Introduction

Every developer knows the struggle: you've written a fantastic application, it works flawlessly on your local machine, but now you need to get it out there in the world. The traditional cloud-native way often involves complex orchestration platforms like Kubernetes, which, while extremely powerful, can be overwhelming and overkill for smaller projects or applications with low traffic.

This is why we're going to explore an alternative, simpler, and cost-effective approach in this blog post: deploying your web applications directly from GitHub to a Linux server, without the need for Kubernetes. This approach not only allows for affordable deployment of your applications but also promotes a quick and straightforward process, making it an excellent option for proof of concept or low-traffic applications.

This pattern we'll discuss consists of some core components: GitHub and its various functionalities, Docker Compose files, SSH for remote deployments, and a Linux server setup with an NGINX reverse proxy and LetsEncrypt companion containers for automation of routing, TLS, and certificate management.

By the end of this post, you will understand how to set up this simple deployment pattern. We will walk you through each step in detail, focusing on actionable, practical advice that you can apply right away.

Whether you're a .NET developer or working with other technologies, this pattern is flexible and can be adapted to your unique needs. As we progress, we will highlight how cost-effective and efficient this deployment strategy is for hosting your proof-of-concept or lower environment applications, and discuss the cases where horizontal scaling is not a necessity.

## Understanding the Core Components

Before we get our hands dirty with deployment, let's take a moment to understand the essential components involved in this process. We'll also explain why we've chosen each one and how they contribute to our simple, cost-effective deployment pipeline.

### GitHub and Its Functions

The backbone of our deployment pipeline is GitHub, a platform that provides a host of features to support our goals. Here are the key GitHub features we'll leverage:

- **GitHub Actions**: These are automated workflows that will handle the process of Continuous Integration (CI) for our application. It checks out code, sets up .NET Core, builds, tests, and creates releases. We'll go into detail about this in the practical section.
- **GitHub Action Secrets**: Sensitive information like login credentials, tokens, or keys shouldn't be exposed in your codebase. GitHub Action Secrets are encrypted and allow us to store such information securely, which is essential for building and pushing Docker images.
- **GitHub Container Registry (GHCR)**: This is where our Docker images will be stored and versioned. GitHub Actions will build and push Docker images to GHCR, from where our Linux server will pull them during deployment.
- **GitHub Repository**: The central location where our application's codebase is stored. This is also where we'll configure GitHub Actions and store our Docker Compose files.

### Docker Compose

Docker Compose is a tool that simplifies the management of multi-container Docker applications. It allows us to define our application's environment in a YAML file (`docker-compose.yml`), enabling consistent setups across different environments. We will use it to configure our Linux server for application hosting.

### Secure Shell (SSH)

SSH is a protocol used for securely connecting to a remote server. In our deployment process, we'll use SSH for copying Docker Compose files and executing commands on the Linux server, such as pulling Docker images and running Docker Compose.

### Linux Server, NGINX, and LetsEncrypt

Our Linux server is where the magic happens. It's where our application will be hosted, and where the Docker Compose file will be executed. But that's not all; we'll set up NGINX reverse proxy on this server to manage requests and responses between clients and our application.

We're also adding LetsEncrypt into the mix. LetsEncrypt will work in conjunction with NGINX to automate routing, provide Transport Layer Security (TLS), and manage SSL certificates. This combination will ensure our application is secure and readily accessible.

By understanding these core components, we can now piece together our deployment pipeline. But before we proceed, it's essential to ensure you have access to the required tools. Make sure you have a GitHub account, Docker installed on your local machine, access to a Linux server, and the necessary knowledge to work with these tools. Don't worry if you're unsure about any steps; we'll guide you through each stage as we move forward.

In the next section, we'll dive into setting up the Linux server and installing the necessary components to prepare for deployment. Stick with us as we go step by step towards achieving a seamless, cost-effective deployment process.

## Setting Up Your Linux Server

The heart of your web application deployment, the Linux server, requires proper setup and configuration to ensure seamless deployment and operation of your applications. Here, we'll be using Ubuntu 22.04 as our target server, although you can adapt these instructions for other distributions as well.

Firstly, you need to ensure you have a Linux server at your disposal. This could be a virtual private server (VPS) from any cloud provider, a dedicated server, or even a Linux machine in your local network.

Once you have access to your server, follow these steps:

### Installing Docker and Docker-Compose

Docker is a crucial component that enables us to build, ship, and run applications inside containers. Docker Compose, on the other hand, simplifies the process of managing multi-container Docker applications. Here's how to install them:

1. **Update your server:** Before we start, let's make sure our server has the latest updates. Run the following commands:
    ```
    sudo apt update
    sudo apt upgrade -y
    ```
2. **Install Docker:** Docker provides an official guide to install Docker Engine on Ubuntu, which you can follow [here](https://docs.docker.com/engine/install/ubuntu/).

3. **Install Docker-Compose:** Similarly, Docker Compose can be installed by following the official Docker Compose guide available [here](https://docs.docker.com/compose/install/).

After the installation, confirm that Docker and Docker-Compose have been correctly installed by running `docker --version` and `docker-compose --version`. The terminal should print the version of Docker and Docker-Compose, respectively.

### Setting up NGINX and LetsEncrypt

Next, we will set up NGINX and LetsEncrypt in Docker containers. These are responsible for handling client requests, routing, SSL encryption, and certificate management.

1. **Pull the NGINX and LetsEncrypt Docker images:** Use the following commands to pull the Docker images for NGINX and LetsEncrypt:
    ```
    docker pull jwilder/nginx-proxy
    docker pull jrcs/letsencrypt-nginx-proxy-companion
    ```
2. **Setup the NGINX reverse proxy and LetsEncrypt companion containers:** We will use Docker Compose to manage these containers. Create a `docker-compose.yml` file in a suitable directory using your preferred text editor (like nano, vi, etc.). This `docker-compose.yml` should look something like this:
    ```yml
    version: '3'
    services:
      nginx-proxy:
        container_name: nginx-proxy
        image: jwilder/nginx-proxy
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - "/etc/nginx/vhost.d"
          - "/usr/share/nginx/html"
          - "/var/run/docker.sock:/tmp/docker.sock:ro"
          - "/etc/nginx/certs"

      letsencrypt-companion:
        container_name: letsencrypt-companion
        image: jrcs/letsencrypt-nginx-proxy-companion
        volumes:
          - "/var/run/docker.sock:/var/run/docker.sock:ro"
          - "/etc/nginx/certs"
        depends_on:
          - nginx-proxy
    ```
   This configuration sets up the NGINX reverse proxy and LetsEncrypt containers, ensuring they can communicate with other Docker containers and handle certificates.

3. **Start the containers:** Use the command `docker-compose up -d` in the directory containing your `docker-compose.yml` file to start the NGINX reverse proxy and LetsEncrypt containers.

With Docker, Docker-Compose, NGINX, and LetsEncrypt setup, your Linux server is ready for deployments. Note that these are one-off tasks. Once set up, you won't need to repeat them for deploying additional applications.

For subsequent deployments, GitHub Actions will take care of creating necessary directories and SCP copying the `docker-compose.yml` file from the repository to the target Linux server. This allows your deployment pipeline to be simple, repeatable, and reliable.


## GitHub: The Backbone of Your Deployment Pipeline

In this section, we'll explore how to set up a GitHub-based deployment pipeline, using GitHub Actions for automation, GitHub Secrets for security, and the GitHub Container Registry for Docker image storage. You'll see how these tools can provide a powerful, end-to-end solution for building and deploying your applications.

### Understanding GitHub Actions

GitHub Actions allow you to create custom software development life cycle (SDLC) workflows directly in your GitHub repository. These workflows are described in YAML files and can be triggered by GitHub events (such as pushing code, creating releases, etc.), on a schedule, or manually.

In the provided YAML, the deployment workflow is triggered on three events:

1. A new GitHub release is published.
2. The build workflow has completed on `main` or `master` branches.
3. Manual trigger for rolling back to a specific release or redeploying the latest version.

The jobs are divided into two parts: `push_to_registry` and `deploy_via_ssh`. The first job builds a Docker image from the repository's code and pushes it to GitHub's container registry. The second job deploys the image to a remote server via SSH.

### Configuring GitHub Action Secrets

GitHub Secrets are encrypted environment variables created in your repository settings. They're a secure way to store and use sensitive information in GitHub Actions, like credentials, SSH keys, tokens, etc. Without them, this sensitive information would be exposed in your public repository.

The YAML script uses the following secrets:

- `DEPLOY_HOST`: The IP address or domain name of the server where the application is deployed.
- `DEPLOY_USERNAME`: The username used for SSHing into the deployment server.
- `DEPLOY_KEY`: The private SSH key for the deployment server.
- `LETSENCRYPT_EMAIL`: The email used for Let's Encrypt certificate registration.

These secrets can be set up in your repository settings under the `Secrets` section.

```markdown
Go to `Settings` -> `Secrets` -> `New repository secret`
```

### Leveraging GitHub Container Registry

The GitHub Container Registry is a place to store Docker images within GitHub, which can then be used in your GitHub Actions workflows or pulled directly to any server with Docker installed.

In the provided YAML, the image is built and pushed to the registry in the `push_to_registry` job with the `docker/build-push-action@v3` action.

```yml
- name: Build and push Docker images
  uses: docker/build-push-action@v3
  if: ${{ github.event.inputs.version == '' || github.event.inputs.version == 'latest' }}
  with:
    file: Dockerfile
    context: .
    push: true
    tags: ghcr.io/${{ env.image_repository_name }}:${{ env.TAG_NAME }}
```

After building the Docker image, it is tagged and pushed to the GitHub Container Registry.

## Using GitHub Action Secrets for Multiple Applications

In the YAML provided, the secrets are used in multiple places:

- `GITHUB_TOKEN`: This is a system-generated token used by GitHub Actions to authorize interactions with the GitHub API and other services. Within the context of this workflow, `GITHUB_TOKEN` is used to authenticate Docker, allowing it to push images to and pull images from the GitHub Container Registry. This is generated for you based on the permissions you give the GitHub Actions workflow.
- `DEPLOY_HOST`: This secret represents the hostname to which SSH connections will be made during the deployment phase. This could be an IP address or a subdomain, as long as it's correctly set with an A record pointing to your server.
- `DEPLOY_USERNAME`: This secret corresponds to the username required for logging into the deployment server via SSH. The value for this secret can vary depending on your server setup. For example, it could be 'ubuntu', 'ec2-user', 'root', etc., depending on the operating system and configuration of the deployment server.
- `DEPLOY_KEY`: This is the private SSH key used for remote access to your deployment server or application host. This secret is crucial for securing your SSH connections. It's important to generate this key securely and to store it safely within your GitHub secrets to ensure your server remains secure.
- `LETSENCRYPT_EMAIL`: This secret represents the email address used for Let's Encrypt certificate registration. Let's Encrypt provides free automated TLS (Transport Layer Security) certificates, which help secure the communication between your server and its clients. The email is used to receive important notices.

These secrets are utilized in both jobs, and they provide a secure way to use sensitive data across multiple steps. This helps maintain a secure and DRY (Don't Repeat Yourself) codebase.

```yml
- name: copy compose file via scp
  uses: appleboy/scp-action@v0.1.3
  with:
    host: ${{ secrets.DEPLOY_HOST }}
    username: ${{ secrets.DEPLOY_USERNAME }}
    port: 22
    key: ${{ secrets.DEPLOY_KEY }}
    source: ".deploy/${{ github.event.repository.name }}/docker-compose.yml"
    target: "~/"
```

In the example above, secrets are used to provide the `scp-action` with necessary information to copy files to the remote server.


