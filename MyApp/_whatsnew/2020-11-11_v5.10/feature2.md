---
title: Studio User Admin
url: https://docs.servicestack.net/releases/v5.10#studio-user-management-ui
image: https://raw.githubusercontent.com/ServiceStack/docs/master/docs/images/studio/studio-home.png
---

We've caught a glimpse of the new User Admin Feature in the [Bookings CRUD demo](https://youtu.be/XpHAaCTV7jE) who utilizes it to create **Employee** and **Manager** users. The `AdminUsersFeature` provides Admin User Management APIs enabling remote programmatic access to your registered [User Auth Repository](https://docs.servicestack.net/authentication-and-authorization#user-auth-repository), featuring:

- Works with existing `IUserAuthRepository` sync or async providers
- Utilizes Progressive enhancement, e.g. search functionality utilizes `IQueryUserAuth` (if exists) performing a wildcard search over multiple fields, otherwise falls back to exact match on `UserName` or `Email`
- Supports managing Auth Repositories utilizing custom `UserAuth` data models
- Flexible UI options for customizing which fields to include in Search Results and Create/Edit UIs
- Rich Metadata aggregating only App-specific Roles & Permissions defined in your App
- User Events allow you to execute custom logic before & after each Created/Updated/Deleted User
