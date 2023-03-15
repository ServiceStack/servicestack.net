---
title: Templates upgrades to #Script
url: https://docs.servicestack.net/releases/v5.5#script-fka-servicestack-templates
image: /img/whatsnew/v5.5/sharpscript.png
---

As we continue enhancing ServiceStack's scripting support with exciting new features, it no longer made sense to call our dynamic scripting language
"Templates" which is just one of the many use-cases `#Script` enables.

[#Script](https://sharpscript.net) is typical of a popular dynamic template language you'd find in other platforms, using the ubiquitously familiar mix of
[JavaScript Expressions](https://sharpscript.net/docs/expression-viewer) which for increased wrist-friendly readability can be easily composed
together using the Unix `|` operator as embraced by [Vue.js filters](https://vuejs.org/v2/guide/syntax.html#header) and
[Angular's Template Expressions](https://angular.io/guide/template-syntax#template-expression-operators)
whist the [Script Statement Blocks](https://sharpscript.net/docs/blocks) adopt the universally adopted Handlebars-like syntax that's ideal for
rendering dynamic pages.
