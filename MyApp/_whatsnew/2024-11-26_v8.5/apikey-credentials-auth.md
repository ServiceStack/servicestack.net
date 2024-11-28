---
title: API Keys Credentials Provider for .NET 8 Microservices
url: /posts/apikey-credentials-auth
image: /img/posts/apikey-credentials-auth/ai-server-auth-apiexplorer.png
order: 4
---

The usability of the **Simple Auth with API Keys** story has been significantly improved with the new 
`ApiKeyCredentialsProvider` which enables .NET Microservices to provide persistent UserSession-like 
behavior using simple API Keys which can be configured together with `AuthSecretAuthProvider` and 
`ApiKeysFeature` to enable a Credentials Auth implementation users can use with their API Keys 
to restrict access to Authorized Users or Admin AuthSecret to protect Admin UIs and APIs.

### Session Auth with API Keys

Behind the scenes this creates a Server Auth Session but instead of maintaining an Authenticated 
User Session it saves the API Key in the session then attaches the API Key to each request. 
This makes it possible to make API Key validated requests with just a session cookie instead of 
requiring resubmission of API Keys for each request.