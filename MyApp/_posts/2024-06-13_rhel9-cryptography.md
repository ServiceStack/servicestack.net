---
title: Support for RHEL 9's hardened cryptography policy
summary: Regenerate your License Key to support RedHat Enterprise Linux 9 Default Cryptography Policy
tags: [.net8,servicestack,licensing]
author: Demis Bellot
image: https://images.unsplash.com/photo-1564296787121-726de5b37bf1?crop=entropy&fit=crop&h=1000&w=2000
draft: true
---

A consequence of RedHat Enterprise Linux 9's hardened 
[system-wide cryptographic policies](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/security_hardening/using-the-system-wide-cryptographic-policies_security-hardening) 
is that it's incompatible with ServiceStack's current licensing mechanism which uses RSA encryption and SHA1 hashing algorithm
to protect and validate license keys.

Unfortunately this makes it no longer possible to use License Keys to run unrestricted ServiceStack Apps on default 
installs of RHEL 9. The difficulty being we can't both support RHEL 9's hardened cryptography policy and 
maintain compatibility with being able to use newer License Keys on all previous versions of ServiceStack - vital
for enabling frictionless rotation of License Keys. 

As a system-wide policy we're unable to work around this restriction in the library to allow usage of RSA+SHA1 to just
validate License Keys which is the only place it's used. As it only affected a small number of users initially we recommend 
that they just switch to use
[RHEL's Legacy Cryptography Policy](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/security_hardening/using-the-system-wide-cryptographic-policies_security-hardening)
which allows for maximum compatibility with existing software.

### Road to Solution

But as more customers upgraded to RHEL 9 and started experiencing the same issue, we've decided to invest time to 
try and address this issue starting with adding support for a configurable Hashing algorithm when creating and validating
License Keys. We still have the issue of not being able to generate a new License Key that would be compatible with both
default RHEL 9 and all previous versions of ServiceStack.

The solutions under consideration were:
 - Generate a new License Key that's compatible with RHEL 9's hardened cryptography policy, but inform customers that 
they'll be unable to use the new License Key on their existing versions of ServiceStack and to continue to use their 
existing License Key for existing versions
 - Generate 2 License Keys, and explain to Customers which key to use for previous versions of ServiceStack and which key 
to use for RHEL 9 
 - Provide a way for customers to regenerate their License Key to support RHEL 9's hardened cryptography policy

Since this issue only affected a minority of our Customers we decided to go with the last option to avoid inflicting any
additional complexity on the majority of our Customers who are unaffected by this issue.

### Generate License Key for RHEL 9+

Starting from ServiceStack v8.3+ Customers can regenerate a new License Key with a stronger **SHA512** Hash Algorithm 
that's compatible with RHEL 9's default hardened cryptography policy by visiting:

:::{.text-3xl .text-indigo-600}
https://account.servicestack.net/regenerate-license
:::

### Future

We'll need to wait at least 1-2 years before we can make the stronger Hash Algorithm the default in order to reduce the
impact of not being able to use new License Keys on versions of ServiceStack prior to **v8.2**.

After the switch is made regenerating license keys will no longer be necessary.