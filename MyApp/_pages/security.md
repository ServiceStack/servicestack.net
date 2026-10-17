---
title: Security Policy
layout: _LayoutContent
---

## Report a security vulnerability

Thank you for helping keep ServiceStack secure. Please report suspected vulnerabilities privately.

For ServiceStack libraries, use [GitHub private vulnerability reporting](https://github.com/ServiceStack/ServiceStack/security/advisories/new).
You will need a GitHub account, but do not need a ServiceStack account or paid subscription.
For ServiceStack-operated websites, other ServiceStack products, or as an alternative reporting channel, use the [security reporting portal](https://account.servicestack.net/security).
Please submit through one channel; there is no need to send duplicate reports.

**Do not post security vulnerabilities or exploit details in public issues, discussions, or pull requests.**
For non-security bug reports, use [ServiceStack/Issues](https://github.com/ServiceStack/Issues).
The main ServiceStack repository has public issues disabled. For product questions, see [Support](/support).

## Scope and safe reproduction

This policy covers ServiceStack-maintained libraries and products, and websites operated by ServiceStack.
For a vulnerability in a third-party application using ServiceStack, contact that application's owner; report any underlying ServiceStack library issue to us.

Reproduce issues using your own local test environment or systems you have permission to test.
Avoid accessing other people's data, interrupting services, or changing production systems.
A minimal reproduction is preferable to testing against a live service.

## What to include

- The affected repository, NuGet package, website, and exact version or commit.
- Runtime, operating system, relevant configuration, and required authentication or permissions.
- Clear reproduction steps and a minimal proof of concept, where possible.
- Expected and observed behavior, impact, and any known prerequisites or mitigations.
- How we can contact you, and whether you would like to be credited.

Remove passwords, tokens, personal information, and other sensitive data from attachments.
If you cannot provide a full reproduction, please share enough detail for us to investigate.

## Response and coordinated disclosure

We aim to acknowledge reports within **three business days** and provide an initial assessment within **ten business days**.
These are response targets, not guaranteed resolution times. Investigation and remediation depend on the issue's severity and complexity.
We will communicate through the reporting channel and coordinate disclosure with you while investigating and preparing a fix.

Please keep exploit details private during this process. We will agree researcher credit before publication.
If you have not received an acknowledgment within the target, please follow up through the same channel or use the alternative channel and reference the original report.

## Versions, fixes, and advisories

Please report suspected vulnerabilities in any version, including pre-release packages, and include the exact version.
We use this information to determine affected versions and provide upgrade guidance.
Use the latest stable release where possible and follow the fixed-version guidance in each advisory.

[Published security advisories](https://github.com/ServiceStack/ServiceStack/security/advisories) describe affected packages and versions, impact, available fixes, and mitigations.
A fix available in a pre-release package is identified separately from a stable release; do not assume an older stable package contains that fix.

Our machine-readable reporting information is available in [security.txt](/.well-known/security.txt).
