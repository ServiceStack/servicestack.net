---
title: FREE Access to the worlds most popular AI Models
url: /posts/okai-chat
image: /img/posts/okai-chat/okai-chat.webp
order: 3
---

As part of the development of [okai](/posts/okai-models) for generating [Blazor CRUD Apps from a text prompt](/posts/text-to-blazor)
using your preferred AI Models, we've also made available a generic **chat** prompt that can be used as a
convenient way to conduct personal research against many of the worlds most popular Large Language Models - for Free!

No API Keys, no Signups, no installs, no cost, you can just start immediately using the `npx okai chat` script to ask LLMs
for assistance:

```sh
npx okai chat "command to copy a folder with rsync?"
```

This will use the default model (currently codestral:22b) to answer your question.

You can also use your preferred model with the `-m <model>` flag with either the model **name** or its **alias**,
e.g you can use [Microsoft's PHI-4 14B](https://techcommunity.microsoft.com/blog/aiplatformblog/introducing-phi-4-microsoft%E2%80%99s-newest-small-language-model-specializing-in-comple/4357090) model with:

```sh
npx okai -m phi chat "command to copy folder with rsync?"
```
