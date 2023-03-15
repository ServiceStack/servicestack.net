---
title: C# and F# Jupyter Notebooks
url: https://docs.servicestack.net/releases/v5.12#generate-c-jupyter-notebooks
image: /img/whatsnew/v5.12/jupyter-lab-visual-example.png
---

In addition to Python we've also extended support for generating customized pre-populated
**C#** and **F#** Jupyter Notebooks by leveraging dotnet/interactive Jupyter kernel’s which
allows C# and F# .NET Developers to join Jupyter's interactive live programming paradigm
which they can either choose to run locally in the next gen JupyterLab UI or directly within
VS Code using .NET Interactive's VS Code extension.

Notebooks have also become a popular medium for sharing institutional data and computational
knowledge thanks to being able to capture and embed execution output and support for exporting
in multiple popular document formats as used by GitHub with their Auto Preview support for
Notebooks. We also simplify configuring a Notebook GitHub repo to support executing C# and
F# Notebooks in [mybinder.org](https://mybinder.org) FREE cloud hosting services with our
`docker-jupyter` mix template.
