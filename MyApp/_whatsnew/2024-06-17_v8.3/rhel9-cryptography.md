---
title: Support for RHEL 9's hardened cryptography policy
url: https://docs.servicestack.net/rhel9-cryptography
image: /img/posts/rhel9-cryptography/bg-redhat.webp
order: 4
---

A consequence of RedHat Enterprise Linux 9's hardened
[system-wide cryptographic policies](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/security_hardening/using-the-system-wide-cryptographic-policies_security-hardening)
is that it's incompatible with ServiceStack's current licensing which uses RSA encryption and SHA1 hashing algorithm
to validate license keys.

Unfortunately this makes it no longer possible to use License Keys to run unrestricted ServiceStack Apps on default
installs of RHEL 9 or any of its variants.

### Generate License Key for RHEL 9+

Starting from **ServiceStack v8.3+** Customers can regenerate a new License Key with a stronger **SHA512** Hash Algorithm
that's compatible with RHEL 9's default hardened cryptography policy by visiting:

:::{.text-2xl .text-indigo-600}
https://account.servicestack.net/regenerate-license
:::
