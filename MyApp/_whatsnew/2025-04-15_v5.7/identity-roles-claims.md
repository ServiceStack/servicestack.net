---
title: Admin UI Management for Identity Claims and Roles
url: https://docs.servicestack.net/admin-ui-identity-roles
image: /img/posts/identityauth-claims-roles/identityauth-role-claims.webp
order: 2
---

This latest finalizes the transition to ASP .NET Core Identity Auth with complete Admin UI Management for 
Identity Auth features, now featuring Admin UIs for managing Identity Auth **Roles** and **Claims** for Users and Roles.

The new [Roles Admin UI](https://docs.servicestack.net/admin-ui-identity-roles) allows for easy addition and removal of roles. 
It also supports customization for Apps using extended IdentityRole data models or different PrimaryKey types and enables 
the addition and removal of Claims directly to a Role. These Role Claims behave as if they were individually applied to 
all Users with that Role, populating their Authenticated ClaimsPrincipal upon login.

For granular control, a new **User Claim Management UI** allows for assigning Claims to individual Users. 
This robust system enables the implementation of permission-like systems, where access to APIs can be restricted based 
on assigned Claims and allows developers to customize error messages for different missing claim types.