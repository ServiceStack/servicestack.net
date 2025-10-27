---
title: Protect same APIs with API Keys or Identity Auth
url: /posts/apikey_auth_apis
image: /img/whatsnew/v8.9/admin-ui-user-apikeys-create-dialog.webp
order: 3
---

Modern APIs need to serve different types of clients with distinct authentication requirements.
**Identity Auth** is designed for interactive user workflows with sessions, roles, and permissions,
while **API Keys** excel at machine-to-machine communication with simple token-based authentication,
superior performance, and fine-grained scope-based access control.

Previously, supporting both authentication models required maintaining two separate APIs—one protected
with `[ValidateIsAuthenticated]` and another with `[ValidateApiKey]`—resulting in duplicate endpoints
and documentation.

ServiceStack's enhanced API Keys feature now lets you protect the **same APIs and UIs** with both
authentication models. By adding a user's API Key to the `apikey` claim in their Identity Auth Cookie,
authenticated users can seamlessly access `[ValidateApiKey]` protected APIs without sending the key explicitly.
This unified approach eliminates API duplication while maintaining all the benefits of both authentication paradigms.