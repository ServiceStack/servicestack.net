---
title: Vite+ - React, Next.js and Vue Templates upgraded to one unified toolchain
url: https://docs.servicestack.net/releases/v10_05#react-next.js-vue-templates-upgraded-to-vite
image: /img/posts/vite-plus-templates/bg.webp
order: 1
---

Every React, Next.js and Vue template now uses **Vite+**, the unified toolchain from VoidZero, the team behind Vite, Vitest, Rolldown and Oxc. One `vp` CLI and one `vite.config.ts` replace separate configs for ESLint, `tsc` and Vitest, and `npm run check` formats with **Oxfmt**, lints with type-aware **Oxlint** and type checks with **TypeScript 7** in a single pass, whilst Vite 8's **Rolldown** bundler builds the Vite templates.

Every template shares the same npm scripts and includes a **VS Code Workspace** that formats and fixes on save, a GitHub Actions job that checks, tests and builds every push, and updated `AGENTS.md` guidance, so your editor, CI and AI Agent all follow the same rules.
