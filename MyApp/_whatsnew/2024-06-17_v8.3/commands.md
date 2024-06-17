---
title: Use Commands to build robust and observable systems
url: https://docs.servicestack.net/commands
image: /img/whatsnew/v8.3/commands.png
order: 2
---

How code-bases are structured is largely a matter of developer preference, however we believe we've also been able to 
add value in this area with the new appealing managed Commands Feature.

### When to restructure

Times when you may want to consider moving logic out of your Service include:

- **Code Reuse**: Make it easier to reuse your Service logic in other Services
- **Complexity**: Break down complex logic into smaller more manageable pieces
- **Testability**: Make it easier to test your Logic in isolation
- **Observability**: Make it easier to log and monitor
- **Robustness**: Make it easier to handle, retry and recover from errors
- **Flexibility**: Make it easier to run in parallel or in a different managed thread

We'll look at how the new **Commands Feature** can help in these areas.