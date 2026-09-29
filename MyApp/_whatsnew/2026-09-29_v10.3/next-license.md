---
title: Next License - sell offline-verified licenses for your desktop apps
url: /posts/next-license
image: /img/posts/next-license/bg.webp
order: 3
---

**Next License** is a new .NET 10, ServiceStack and Next.js 16 template for selling perpetual licenses for your **.NET** and **Electron** desktop apps. Customers buy with Stripe Checkout and copy an **ES256-signed JWT** license key from their account. Your app then verifies it **offline** against an embedded public key, so there's no activation server to run and customers never depend on your server to use software they paid for.

Licenses never expire. Instead they cover every build released on or before their `updatesThrough` date, so changing the clock changes nothing and renewals only matter for newer builds. Payments are verified against Stripe before a license is signed, downloads and changelogs are served from your **GitHub releases**, and an Operations Center manages products, licenses, orders, refunds and license terms.