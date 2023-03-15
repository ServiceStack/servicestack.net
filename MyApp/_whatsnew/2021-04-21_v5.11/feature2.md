---
title: GitHub Actions Templates
url: https://docs.servicestack.net/releases/v5.11#githubaction-templates
image: /img/whatsnew/v5.11/github-actions-header.png
---

We've begun to fully embrace GitHub Actions from this release to help quickly setting up CI environments for
new and existing ServiceStack project templates by automating them into building and running tests on each **commit**
before publishing, dockerizing & deploying them on each **GitHub Release**.
The templates leverage [mix](https://docs.servicestack.net/mix-tool) to work like lego pieces where they can be combined to achieve your
preferred automation workflow.
