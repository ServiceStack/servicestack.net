---
title: ServiceStack.Swift client library rewritten for Swift 6
url: /posts/swift6-upgrade
image: https://docs.servicestack.net/img/pages/servicestack-reference/swift-logo-banner.jpg
order: 5
---

All generic service client libraries have been upgraded to support multiple file uploads with API requests 
to take advantage of AI Server APIs that accept file uploads like Image to Image, Speech to Text or its 
FFmpeg Image and Video Transforms.

ServiceStack.Swift received the biggest upgrade, which was also rewritten to take advantage of Swift 6 features, 
including Swift promises which replaced the previous PromiseKit dependency - making it now dependency-free!