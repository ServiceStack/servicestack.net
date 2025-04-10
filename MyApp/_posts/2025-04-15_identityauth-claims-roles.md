---
title: Complete Admin UI Management for Identity Claims and Roles
summary: With support for adding Roles and User and Role Claims, the built-in Admin UI now offers complete Identity Auth management
tags: [identity-auth,admin-ui,auth]
author: Demis Bellot
image: https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?crop=entropy&fit=crop&h=1000&w=2000
---

The latest ServiceStack v8.7 Release completes our transition to [ASP .NET Core Identity Auth](https://docs.servicestack.net/auth/identity-auth) 
with management APIs and Admin UIs for managing Identity Auth Roles and Claims for both Users and Roles.

All ServiceStack Apps now includes a complete IdentityAuth Management Admin UI which can Add/Remove Roles from the 
new Identity **Roles** Admin UI:  

![](/img/posts/identityauth-claims-roles/identityauth-roles.webp)

If your App uses an extended `IdentityRole` data model, it can be configured with:

```csharp
services.AddPlugin(
    new AuthFeature(IdentityAuth.For<ApplicationUser,ApplicationRole>(...)));
```

If it's also configured to use a different `PrimaryKey` type, it can be configured with: 

```csharp
services.AddPlugin(
    new AuthFeature(IdentityAuth.For<AppUser,AppRole,int>(...)));
```

### IdentityAuth Role Claims

The Edit Role Admin UI can also be configured to Add/Remove Claims to a Role, e.g:

![](/img/posts/identityauth-claims-roles/identityauth-role-claims.webp)

Any Added or Removed Claims are applied after clicking **Update Role**, so you exit the UI without applying any 
changes by clicking **Cancel**.

Claims added to Roles have similar behavior to having Claims individually applied to all Users with that Role such that
when a User is Authenticated they're populated with all claims assigned to their Roles in addition to their individual User Claims. 

### IdentityAuth User Claims

Whilst the new User Claim Management UI allows you to assign Claims to individual Users: 

![](/img/posts/identityauth-claims-roles/identityauth-user-claims.webp)

## Validating Claims

Claims are attestations or attributes about a User which we can use to restrict access to APIs to only Users who
have been assigned that claim. We could use this to implement a permission system that restricts usage with a 
`todos:write` permission with something like:

```csharp
[ValidateHasClaim("perm", "todos:write")]
class CreateTodo {}
```

Normally this would result in the generic missing claims error message:

:::{.not-prose}
<error-summary :status="{message:`perm Claim with 'todos:write' is Required`}"></error-summary>
:::

But as the `perm` claim has a customized error message:

```csharp
HasClaimValidator.ClaimErrorMessages["perm"]= "`${Value} Permission Required`";
```

It will generate that Error Response instead:

:::{.not-prose}
<error-summary :status="{message:`'todos:write' Permission Required`}"></error-summary>
:::

Which is a good example showing how `HasClaimValidator.ClaimErrorMessages` can be used to add custom error messages
for your own custom claim validation. 

### Inspecting Claims inside Services

You can also inspect and validate a Users Claim by inspecting the Authenticated ClaimsPrincipal, e.g: 

```csharp
public class TodoServices : Service
{
    public object Any(CreateTodo request)
    {
        var user = Request.GetClaimsPrincipal();
        if (!user.HasClaim("perm", "todos:write"))
            throw HttpError.Forbidden("todos:write Permission Required");
        
        var allUserClaims = user.Claims.ToList();
        //...
    }
}
```
