---
title: RDBMS Bulk Inserts
url: https://docs.servicestack.net/releases/v6_10#rdbms-bulk-inserts
image: /img/whatsnew/v6.10/bulk-inserts.png
order: 3
---

The latest release of OrmLite includes Bulk Inserts implementations for each supported RDBMS to support the most 
efficient ways for inserting large amounts of data, which is encapsulated behind OrmLite's new BulkInsert API
which are up to **138x times faster** than traditional single INSERT statements.

In addition to an optimal default Bulk Insert implementation, it can also be configured to execute batched 
SQL Insert statements with configurable batch sizes which enjoys broad support across all RDBMS's.