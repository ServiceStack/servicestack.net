---
title: Universal Blazor API Components
url: https://youtu.be/66DgLHExC9E
image: /img/whatsnew/v6.5/blazor-universal-components.png
---

The recommendation to access DB's directly in Blazor Server components encourages a more tightly-coupled and less reusable & testable architecture than the traditional well-defined API dev model used in client/server Mobile & Desktop Apps or Web SPA Apps like Blazor WASM.

To achieve the best of both worlds, we've enabled support for utilizing the In Process Service Gateway in Blazor Server Apps which lets you retain the traditional client/server dev model for invoking your Server APIs In Process - avoiding any serialization, HTTP networking or even Kestrel middleware overhead to invoke your APIs directly!

This enables using the exact same source code to call APIs in Blazor Server and WASM which allows us to develop reusable Blazor Components to invoke the same Server APIs that serve Web, Mobile and Desktop Apps in Blazor Server Apps.
