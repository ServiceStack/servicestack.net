---
title: .NET 8 Templates migrated to use Kamal for deployments
summary: All Identity Auth templates now use Kamal for deployments, simplifying the process of deploying .NET Apps to any Linux server.
tags: [github-actions,docker,devops]
author: Darren Reid
image: https://images.unsplash.com/photo-1494961104209-3c223057bd26?crop=entropy&fit=crop&h=1000&w=2000
---

Since introducing GitHub Actions support to our templates, we've promoted the simplified deployments, focusing on tooling like SSH and Docker Compose to give the most portability to projects by default. This was partly inspired by the fact that cloud providers value offerings have been decreasing, especially over the last 5 years. We then showed in a [previous blog post how much money can be saved](/posts/hetzner-cloud) by considering the use of hosting providers like Hetzner (who we have been using for many years), and moved all our templates and live demos to Hetzner resulting in a roughly $0.50 per month cost per application.

Along with this decreasing in value from the major cloud vendors, and the general hardware improvements, we've also been leaning into the use of SQLite, using it as the primary database for some of our larger example applications like PVQ.app, BlazorDiffusion, and most recently, AI Server.

We were delighted to see that the folks over at BaseCamp doubled down on these same types of tooling by releasing the MRSK project, which is now known as Kamal.

### Use Kamal to deploy .NET Apps to any Linux server

:::youtube -mDJfRG8mLQ
Use Kamal with GitHub Actions to deploy .NET Apps to any Linux server
:::

## What is [Kamal](https://kamal-deploy.org/)?

Kamal is a tool that offers the same flexibility by wrapping up the use of fundamental tooling like SSH and Docker into a great CLI tool that tries to make the management of containerized applications, enabling them to be deployed anywhere there is a Linux host that is accessible via SSH. It handles reverse proxy of web traffic automatically, as well as even the initial setup of the reverse proxy and related tooling to any target Linux host. 

This means you get the same great ergonomics of just pointing your DNS and configuration file to a server, and *Kamal takes care of the rest*, including TLS certificates via LetsEncrypt.

It even has commands that allow you to check on your running applications, view logs etc and all you need to do is run the commands from your local repository directory.

While our own templates have used the same approach for GitHub Actions, the usage was always awkward and lacked any dedicated CLI tooling you could run locally to check on your running applications.

## What's in the templates?

We still believe that having a CI process is important, and while Kamal deployments are repeatable from your local machine and uses locking to avoid multiple developers deploying changes, the single consistent process of a CI is hard to beat. So while we have moved the templates to use Kamal, we've incorporated GitHub Actions by default so you can still get the benefits of running commands like `kamal app logs` locally from your development machine when looking at production issues, but have that consistent workflow for deployment on your repositories GitHub Actions.

## How it works

One of the big benefits of Kamal is the focus on ergonomics and the really well done documentation that the BaseCamp team has put together. So if you need to know more about Kamal, [checkout their docs](https://kamal-deploy.org/docs/). For the ServiceStack templates, you will need to add a valid `PRIVATE_SSH_KEY` as a GitHub Actions secret to get it working along with the customization of your `config/deploy.yml` file which is a part of any Kamal setup. In short, you will need:

- Get a Linux host running with SSH access
- Update your DNS configuration with an A record pointing to that hosts IP address
- Create a new project using one of our updated templates using a command like:

:::sh
x new blazor-vue MyApp
:::

Update the `config/deploy.yml` with the following details:

### GitHub Container Registry Image

Update with your preferred container image name:

```yml
# Name of the container image
image: my-user/myapp
```

### Server Web

Configure with your Linux Host IP Address:

```yml
servers:
  # IP address of server, optionally use env variable
  web:
    - 123.123.123.123
```

Alternatively, you can use an environment variable for the server IP address, e.g:

```yml
  web:
    - <%= ENV['KAMAL_DEPLOY_IP'] %>
```

### Proxy Host

Configure with your domain pointing to the same IP as your host:

```yml
proxy:
  ssl: true
  host: myapp.example.com
```

### Health Checks

The template includes the use of ASP.NET Core Health Checks, that use the default Kamal path of `/up` to check if the application is running before deploying.

```csharp
public class HealthCheck : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken token = default)
    {
        // Perform health check logic here
        return HealthCheckResult.Healthy();
    }
}
```

Kamal checks this path before deploying your application, so you can add any custom health checks to this path to ensure your application is ready to receive traffic.

## GitHub Repository

With your application created and configured for deployment, you can create a new GitHub Repository and add the GitHub Actions Secret of `PRIVATE_SSH_KEY` which should be a separate SSH key for deployments that has access to your Linux host.

You can use the GitHub CLI to do of these steps.

```bash
gh repo create
```

When prompted, create an empty repository.

Then add the `PRIVATE_SSH_KEY` secret.

```
gh secret set PRIVATE_SSH_KEY < deploy-key
```

Where `deploy-key` is your deployment specific SSH key file.

Once created, you can follow the steps in your empty repository to init your templated `MyApp` project and push your initial commit. If you're deploy.yml config and DNS was setup correctly, the GitHub Action will do the following:

- Build and test your application running the MyApp.Tests project by default
- Publish your application as a Docker container to GitHub's `ghcr.io` repository
- Use Kamal to initialize your Linux host to be able to run Kamal applications and use their default `kamal-proxy`
- Fix volume permissions your for application due to ASP.NET containerization not running as root user in the container.
- Run your `AppTasks=migrate` command before running your application initializing the SQLite database
- Run your AppHost using `kamal deploy -P --version latest` command.

## Summary

We're excited to be moving our templates to Kamal for deployments as it has distilled the simple approach we have baked in our templates for a number of years while massively improving the ergonomics. We're excited to see what the BaseCamp team does with the project, and we're looking forward to seeing the community grow around it. If you have any questions about the templates or Kamal, feel free to reach out to us on our Discord, GitHub Discussions or Customer Forums.