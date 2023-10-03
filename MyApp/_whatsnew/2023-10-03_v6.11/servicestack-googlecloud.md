---
title: ServiceStack.GoogleCloud
url: https://docs.servicestack.net/releases/v6_11#google-cloud-solution
image: /img/whatsnew/v6.11/servicestack-googlecloud.png
order: 3
---

The new `ServiceStack.GoogleCloud` package contains functionality for integrating with Google's Cloud Platform,
including `GoogleCloudVirtualFiles` [Virtual Files](https://docs.servicestack.net/virtual-file-system) Provider
enabling usage of Google Cloud's managed Storage that's easily substitutable with other VFS providers from
AWS S3, Azure Blob storage, Cloudflare R2 or local File System. 

The `GoogleCloudSpeechToText` provider implements ServiceStack.AI's Speech-to-Text abstraction for providing
transcription services using Google Cloud's [Speech-to-Text v2 API](https://cloud.google.com/speech-to-text/v2/docs) 