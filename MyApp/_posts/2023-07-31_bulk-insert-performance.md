---
title: Which RDBMS has the fastest Bulk Insert implementation?
summary: Measuring the different performance of RDBMS Bulk Insert implementations
tags: db,dev,dotnet
image: https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?crop=entropy&fit=crop&h=1000&w=2000
author: Demis Bellot
---

After having implemented Bulk Inserts in the latest release of [OrmLite](https://docs.servicestack.net/ormlite/) 
the main thing that stands out is how [each RDBMS](https://docs.servicestack.net/ormlite/installation) 
has very different ways for how best to insert large amounts of data, which is encapsulated behind OrmLite's new `BulkInsert` API:

```csharp
db.BulkInsert(rows);
```

## Bulk Insert Implementations

Where the optimal implementation for each RDBMS were all implemented differently:

- **PostgreSQL** - Uses PostgreSQL's [COPY](https://www.postgresql.org/docs/current/sql-copy.html) 
command via Npgsql's [Binary Copy](https://www.npgsql.org/doc/copy.html) import
- **MySql** - Uses [MySqlBulkLoader](https://dev.mysql.com/doc/connector-net/en/connector-net-programming-bulk-loader.html)
feature where data is written to a temporary **CSV** file that's imported directly by `MySqlBulkLoader` 
- **MySqlConnector** - Uses [MySqlConnector's MySqlBulkLoader](https://mysqlconnector.net/api/mysqlconnector/mysqlbulkloadertype/)
implementation which makes use of its `SourceStream` feature to avoid writing to a temporary file
- **SQL Server** - Uses SQL Server's `SqlBulkCopy` feature which imports data written to an in-memory `DataTable` 
- **SQLite** - SQLite doesn't have a specific import feature, instead Bulk Inserts are performed using batches of [Multiple Rows Inserts](https://www.tutorialscampus.com/sql/insert-multiple-rows.htm)
to reduce I/O calls down to a configurable batch size
- **Firebird** - Is also implemented using **Multiple Rows Inserts** within an [EXECUTE BLOCK](https://firebirdsql.org/refdocs/langrefupd20-execblock.html)
configurable up to Firebird's maximum of **256** statements

### SQL Multiple Row Inserts

It should be noted that all RDBMS's has broad support SQL's Multiple Insert Rows feature which is an efficient and compact
alternative to inserting multiple rows within a single INSERT statement:

```sql
INSERT INTO Contact (Id, FirstName, LastName, Age) VALUES 
(1, 'John', 'Doe', 27),
(2, 'Jane', 'Doe', 42);
```

Normally OrmLite APIs uses parameterized statements however for Bulk Inserts it uses inline rasterized values in order
to construct and send large SQL INSERT statements that avoids RDBMS's max parameter limitations, which if preferred can 
be configured to be used instead of its default optimal implementation:

```csharp
db.BulkInsert(rows, new BulkInsertConfig {
    Mode = BulkInsertMode.Sql
});
```

### Batch Size

**Multiple Row Inserts** are sent in batches of **1000** (Maximum for SQL Server), Firebird uses a maximum of **256** 
whilst other RDBMS's can be configured to use larger batch sizes:

```csharp
db.BulkInsert(rows, new BulkInsertConfig {
    BatchSize = 1000
});
```

## Benchmarks

[All benchmarks](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Benchmarks/Program.cs)
were run with [BenchmarkDotNet](https://benchmarkdotnet.org) running on an 
**macOS M2 Apple Macbook**, an **Ubuntu 22.04 Linux VM** and an **Windows 10 Intel iMac 5K**.   

<div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="3gO_OEWIyPo" style="background-image: url('https://img.youtube.com/vi/3gO_OEWIyPo/maxresdefault.jpg')"></lite-youtube>
</div>

Hopefully these benchmarks are informative in showing the performance you can expect from Bulk Inserts
for each popular RDBMS's across on different operating systems. For context, these benchmarks were run on the configurations below:

#### Apple M2 / 24GB RAM
 - macOS / ARM
 - .NET 6.0 / ARM
 - RDBMS run from local Docker containers

#### Linux VM / 7GB RAM
 - Ubuntu 22.04 LTS / x64
 - .NET 6.0 / x64
 - RDBMS run from local Docker containers

#### Intel iMac 5K / 24GB RAM
 - Windows 10 / x64
 - .NET 6.0 / x64
 - RDBMS run from local Windows installations

Performance is also affected by the quality and efficiency of the ADO .NET library implementations specific to each RDBMS,
which can result in non .NET languages yielding different results based on the quality of their data access implementations.

## Apple M2 Benchmarks

Apple M2 Benchmarks were run on an Apple M2 Macbook Air 15" / 24GB RAM, specifications reported by BenchmarkDotNet:

```txt
BenchmarkDotNet v0.13.6, macOS Ventura 13.4.1 (22F2083) [Darwin 22.5.0]
Apple M2, 1 CPU, 8 logical and 8 physical cores
.NET SDK 6.0.411
  [Host]     : .NET 6.0.19 (6.0.1923.31806), Arm64 RyuJIT AdvSIMD
  Job-VQWEED : .NET 6.0.19 (6.0.1923.31806), Arm64 RyuJIT AdvSIMD
```

All benchmarks were run against local databases with most RDBMS's installed and
[running from a Docker container](https://servicestack.net/posts/postgres-mysql-sqlserver-on-apple-silicon).

All Docker containers runs native ARM Builds whilst SQL Server's **AMD64** Docker image runs emulated on Rosetta using 
[Apple's Virtualization Framework](https://developer.apple.com/documentation/virtualization).

## Optimized Bulk Insert Performance

These benchmarks below uses the default optimal Bulk Insert implementation for each RDBMS:

<chart-js :data="{
    labels: [
        '1,000 Rows',
        '10,000 Rows',
        '100,000 Rows'
    ],
    datasets: [
        {
            label: 'SQLite Memory',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [1.812, 17.066, 166.747]
        },
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [2.330, 20.224, 199.697]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [6.123, 14.389, 115.645]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [9.676, 64.389, 310.966]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [8.778, 64.427, 308.574]
        },
    ]
}"></chart-js>

:::{.text-xs .text-gray-500 .text-center}
_SQL Server results removed due to poor outlier performance_
:::

:::{.table .table-striped .text-base}
#### Inserting 1,000 Rows

| Database       | Relative |         Mean |      Error |     StdDev |       Median |
|----------------|---------:|-------------:|-----------:|-----------:|-------------:|
| SQLite Memory  |       1x |     1.812 ms |  0.0355 ms |  0.0520 ms |     1.813 ms |
| SQLite Disk    |    1.29x |     2.330 ms |  0.0463 ms |  0.0664 ms |     2.331 ms |
| PostgreSQL     |    3.38x |     6.123 ms |  0.2952 ms |  0.8705 ms |     6.280 ms |
| MySqlConnector |    4.84x |     8.778 ms |  0.2387 ms |  0.6962 ms |     8.821 ms |
| MySql          |    5.34x |     9.676 ms |  0.2860 ms |  0.8159 ms |     9.575 ms |
| SqlServer      |    7.27x |    13.182 ms |  0.3376 ms |  0.9795 ms |    12.987 ms |

#### Inserting 10,000 Rows

| Database       | Relative |         Mean |      Error |     StdDev |       Median |
|----------------|---------:|-------------:|-----------:|-----------:|-------------:|
| PostgreSQL     |       1x |    14.389 ms |  0.4020 ms |  1.1533 ms |    14.181 ms |
| SQLite Memory  |    1.19x |    17.066 ms |  0.3119 ms |  0.4269 ms |    16.899 ms |
| SQLite Disk    |    1.41x |    20.224 ms |  0.3869 ms |  0.4139 ms |    20.212 ms |
| MySql          |    4.47x |    64.389 ms |  1.3736 ms |  3.9411 ms |    65.195 ms |
| MySqlConnector |    4.48x |    64.427 ms |  1.4085 ms |  3.9496 ms |    64.854 ms |
| SqlServer      |    6.24x |    89.821 ms |  2.9396 ms |  8.6213 ms |    91.203 ms |

#### Inserting 100,000 Rows

| Database       | Relative |         Mean |      Error |     StdDev |       Median |
|----------------|---------:|-------------:|-----------:|-----------:|-------------:|
| PostgreSQL     |       1x |   115.645 ms |  3.6250 ms | 10.5744 ms |   111.401 ms |
| SQLite Memory  |    1.44x |   166.747 ms |  0.4975 ms |  0.4154 ms |   166.742 ms |
| SQLite Disk    |    1.73x |   199.697 ms |  3.8056 ms |  5.9249 ms |   201.890 ms |
| MySqlConnector |    2.67x |   308.574 ms |  6.0372 ms |  7.8501 ms |   307.322 ms |
| MySql          |    2.69x |   310.966 ms |  6.2043 ms | 10.3660 ms |   308.421 ms |
| SqlServer      |    7.22x |   835.181 ms | 16.5847 ms | 15.5133 ms |   836.200 ms |

#### Inserting 1,000,000 Rows

| Database       | Relative |         Mean |      Error |     StdDev |       Median |
|----------------|---------:|-------------:|-----------:|-----------:|-------------:|
| PostgreSQL     |       1x |   980.558 ms | 18.6512 ms | 39.3418 ms |   973.302 ms |
| SQLite Memory  |    1.73x | 1,697.041 ms | 12.3617 ms | 11.5632 ms | 1,692.348 ms |
| SQLite Disk    |    2.01x | 1,975.092 ms | 15.7094 ms | 13.1181 ms | 1,971.127 ms |
| MySqlConnector |    2.71x | 2,654.076 ms | 37.9302 ms | 33.6241 ms | 2,662.150 ms |
| MySql          |    2.71x | 2,661.294 ms | 29.3865 ms | 26.0504 ms | 2,661.826 ms |
| SqlServer      |    8.67x | 8,517.809 ms | 55.3398 ms | 49.0573 ms | 8,514.901 ms |
:::

Effectively showing PostgreSQL binary COPY is the fastest Bulk Insert implementation of all RDBMS providers,
we're also seeing the overhead of running SQL Server's **AMD64** images on ARM having a significant
impact on its performance.

## Multiple Inserts Rows Performance

These benchmarks show the performance of executing **Multiple Row Inserts** in batches of **1000**
which is a good example to show the comparative performance of each RDBMS for executing large SQL Insert statements:

<chart-js :data="{
    labels: [
        '1,000 Rows',
        '10,000 Rows',
        '100,000 Rows'
    ],
    datasets: [
        {
            label: 'SQLite Memory',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [1.812, 17.066, 166.747]
        },
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [2.306, 20.149, 201.074]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [8.073, 48.502, 425.789]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [11.210, 98.179, 718.902]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [9.154, 79.905, 630.839]
        },
    ]
}"></chart-js>

:::{.text-xs .text-gray-500 .text-center}
_SQL Server results removed due to poor outlier performance_
:::

:::{.table .table-striped .text-base}
#### Inserting 1,000 Rows

| Database       | Relative |          Mean |       Error |      StdDev |
|----------------|---------:|--------------:|------------:|------------:|
| SQLite Memory  |       1x |      1.774 ms |   0.0331 ms |   0.0554 ms |
| SQLite Disk    |    1.30x |      2.306 ms |   0.0398 ms |   0.0531 ms |
| PostgreSQL     |    4.55x |      8.073 ms |   0.5297 ms |   1.5452 ms |
| MySqlConnector |    5.16x |      9.154 ms |   0.3355 ms |   0.9681 ms |
| MySql          |    6.32x |     11.210 ms |   0.3573 ms |   1.0252 ms |
| SqlServer      |   49.11x |     87.128 ms |   0.8415 ms |   0.7460 ms |

#### Inserting 10,000 Rows

| Database       | Relative |          Mean |       Error |      StdDev |
|----------------|---------:|--------------:|------------:|------------:|
| SQLite Memory  |       1x |     16.724 ms |   0.3183 ms |   0.3406 ms |
| SQLite Disk    |    1.20x |     20.149 ms |   0.2649 ms |   0.2212 ms |
| PostgreSQL     |    2.90x |     48.502 ms |   2.3704 ms |   6.9893 ms |
| MySqlConnector |    4.78x |     79.905 ms |   2.5416 ms |   7.4540 ms |
| MySql          |    5.97x |     98.179 ms |   2.5259 ms |   7.4080 ms |
| SqlServer      |   50.28x |    840.832 ms |   3.6211 ms |   2.8271 ms |

#### Inserting 100,000 Rows

| Database       | Relative |          Mean |       Error |      StdDev |
|----------------|---------:|--------------:|------------:|------------:|
| SQLite Memory  |       1x |    168.207 ms |   1.8704 ms |   1.4603 ms |
| SQLite Disk    |    1.20x |    201.074 ms |   3.7597 ms |   5.3920 ms |
| PostgreSQL     |    2.53x |    425.789 ms |   8.4799 ms |  12.6922 ms |
| MySqlConnector |    3.75x |    630.839 ms |  11.4516 ms |  19.1330 ms |
| MySql          |    4.27x |    718.902 ms |  14.0201 ms |  15.5833 ms |
| SqlServer      |   50.35x |  8,469.901 ms |  48.8046 ms |  43.2640 ms |

#### Inserting 1,000,000 Rows

| Database       | Relative |          Mean |       Error |      StdDev |
|----------------|---------:|--------------:|------------:|------------:|
| SQLite Memory  |       1x |  1,710.710 ms |   5.0494 ms |   4.2165 ms |
| SQLite Disk    |    1.34x |  1,949.376 ms |   7.3221 ms |   6.4909 ms |
| PostgreSQL     |    2.93x |  5,009.395 ms |  99.4490 ms |  93.0246 ms |
| MySqlConnector |    3.82x |  6,541.659 ms |  61.4450 ms |  57.4757 ms |
| MySql          |    4.04x |  6,905.332 ms |  72.1600 ms |  63.9680 ms |
| SqlServer      |   52.31x | 89,485.334 ms | 713.9731 ms | 596.1999 ms |

:::

Takeaways from these results show PostgreSQL continuing to be a star performer, consistently out-performing 
other distributed RDBMS's whilst SQL Server yields even worse comparative performances.

## Single Insert Performance

This benchmark measures the performance of multiple single inserts, i.e. using the traditional Single Insert ORM APIs 
when Bulk Insert is not available: 

<chart-js :data="{
    labels: [
        '1,000 Rows',
    ],
    datasets: [
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [224.2379]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [349.2328]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [1272.0975]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [1209.4689]
        },
        {
            label: 'SQL Server',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [978.0029]
        }
    ]
}"></chart-js>

:::{.table .table-striped .text-base}
#### Inserting 1,000 Rows

| Database       | Relative |           Mean |        Error |       StdDev |         Median |
|----------------|---------:|---------------:|-------------:|-------------:|---------------:|
| SQLite Memory  |       1x |    15,417.3 μs |  1,820.82 μs |  5,311.41 μs |    18,153.2 μs |
| SQLite Disk    |   14.54x |   224,237.9 μs |  1,777.94 μs |  1,388.10 μs |   224,184.8 μs |
| PostgreSQL     |   22.65x |   349,232.8 μs |  3,255.67 μs |  2,541.81 μs |   349,404.4 μs |
| SqlServer      |   63.44x |   978,002.9 μs | 19,327.88 μs | 19,848.30 μs |   982,696.9 μs |
| MySqlConnector |   78.45x | 1,209,468.9 μs | 24,150.34 μs | 38,305.00 μs | 1,201,763.9 μs |
| MySql          |   82.51x | 1,272,097.5 μs | 24,790.10 μs | 38,595.20 μs | 1,287,374.8 μs |

Where we can see that PostgreSQL/Npgsql holds the performance crown for Multiple Single Inserts, in addition to
Multiple Rows Inserts and Bulk Inserts implementations.

We can the use this compare the relative performance benefits of Bulk Inserts vs Multiple Rows Inserts 
vs Single Inserts of each database for **1,000** records:

| Database       | Bulk Inserts | Multiple Rows Inserts | Single Row Inserts |
|----------------|-------------:|----------------------:|-------------------:|
| SQLite Disk    |           1x |                    1x |             97.24x |
| PostgreSQL     |           1x |                 1.32x |             57.04x |
| MySqlConnector |           1x |                 1.04x |            137.78x |
| MySql          |           1x |                 1.16x |            131.47x |
| SqlServer      |           1x |                 6.61x |             74.19x |

Effectively showing the cost of Single Inserts multiple I/O calls vs Bulk or SQL Batch Inserts - confirming that
Bulk Inserts offer much better performance when needing to insert a significant number of rows.

Relative performance for Inserting **10,000** records:

| Database       | Bulk Inserts | Multiple Rows Inserts |
|----------------|-------------:|----------------------:|
| SQLite Disk    |           1x |                    1x |
| PostgreSQL     |           1x |                 3.37x |
| MySqlConnector |           1x |                 1.24x |
| MySql          |           1x |                 1.52x |
| SqlServer      |           1x |                 9.36x |

Relative performance for Inserting **100,000** records:

| Database       | Bulk Inserts | Multiple Rows Inserts |
|----------------|-------------:|----------------------:|
| SQLite Disk    |           1x |                 1.01x |
| PostgreSQL     |           1x |                 3.68x |
| MySqlConnector |           1x |                 2.04x |
| MySql          |           1x |                 2.31x |
| SqlServer      |           1x |                10.14x |

Showing large batched SQL Insert statements staying within 2-3.7x performance range of their efficient Bulk Insert 
implementations, except for SQL Server which is an order of magnitude slower than `SqlBulkCopy`

:::

## Ubuntu Linux VM Benchmarks

The Ubuntu Linux VM Benchmarks were run on a GitHub Actions VM which are reported to run on a 2 Core CPU with 
[7 GB of RAM](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources),
specifications reported by BenchmarkDotnet:

```txt
BenchmarkDotNet v0.13.6, Ubuntu 22.04.2 LTS (Jammy Jellyfish)
Intel Xeon Platinum 8370C CPU 2.80GHz, 1 CPU, 2 logical and 2 physical cores
.NET SDK 6.0.412
  [Host]     : .NET 6.0.20 (6.0.2023.32017), X64 RyuJIT AVX2
  Job-HXEVFT : .NET 6.0.20 (6.0.2023.32017), X64 RyuJIT AVX2
```

## Optimized Bulk Insert Performance

These benchmarks below uses the default optimal Bulk Insert implementation for each RDBMS:

<chart-js :data="{
    labels: [
        '1,000 Rows',
        '10,000 Rows',
        '100,000 Rows'
    ],
    datasets: [
        {
            label: 'SQLite Memory',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [3.025, 27.653, 303.348]
        },
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [4.520, 40.234, 417.378]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [5.646, 26.436, 211.951]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [10.597, 80.429, 670.859]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [53.698, 80.535, 693.690]
        },
        {
            label: 'SQL Server',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [12.201, 94.899, 986.676]
        }
    ]
}"></chart-js>

:::{.table .table-striped .text-base}
#### Inserting 1,000 Rows

| Database       | Relative |      Mean |     Error |    StdDev |    Median |
|----------------|---------:|----------:|----------:|----------:|----------:|
| SQLite Memory  |       1x |  3.025 ms | 0.0527 ms | 0.1089 ms |  3.053 ms |
| SQLite Disk    |    1.49x |  4.520 ms | 0.0898 ms | 0.1794 ms |  4.576 ms |
| PostgreSQL     |    1.87x |  5.646 ms | 0.2275 ms | 0.6415 ms |  5.630 ms |
| MySqlConnector |    3.50x | 10.597 ms | 0.2045 ms | 0.1813 ms | 10.608 ms |
| SqlServer      |    4.03x | 12.201 ms | 0.2420 ms | 0.5845 ms | 12.104 ms |
| MySql          |   17.75x | 53.698 ms | 1.0640 ms | 2.0753 ms | 53.425 ms |

As the poor MySql performance is more prevalent the smaller number of rows are Bulk Inserted suggests it's the result of a 
1-time cost like writing to the temporary file, which is less of a overhead when more rows are inserted.

#### Inserting 10,000 Rows

| Database       | Relative |      Mean |     Error |    StdDev |    Median |
|----------------|---------:|----------:|----------:|----------:|----------:|
| PostgreSQL     |       1x | 26.436 ms | 1.8383 ms | 5.1848 ms | 23.624 ms |
| SQLite Memory  |    1.05x | 27.653 ms | 0.5439 ms | 1.0478 ms | 27.100 ms |
| SQLite Disk    |    1.52x | 40.234 ms | 0.7801 ms | 1.2817 ms | 40.189 ms |
| MySqlConnector |    3.04x | 80.429 ms | 1.6022 ms | 2.0833 ms | 80.585 ms |
| MySql          |    3.05x | 80.535 ms | 1.5778 ms | 2.5478 ms | 80.400 ms |
| SqlServer      |    3.59x | 94.899 ms | 1.8399 ms | 2.6388 ms | 95.128 ms |

PostgreSQL continues to shine on its native Linux platform which somehow has a magically efficient implementation that 
bests bulk inserts to an In Memory SQLite database?

#### Inserting 100,000 Rows

| Database       | Relative |       Mean |      Error |     StdDev |     Median |
|----------------|---------:|-----------:|-----------:|-----------:|-----------:|
| PostgreSQL     |       1x | 211.951 ms |  4.2186 ms | 11.1134 ms | 210.844 ms |
| SQLite Memory  |    1.43x | 303.348 ms |  5.9261 ms |  8.6864 ms | 305.627 ms |
| SQLite Disk    |    1.97x | 417.378 ms |  8.0392 ms |  8.6019 ms | 418.351 ms |
| MySqlConnector |    3.17x | 670.859 ms | 11.1014 ms |  9.8411 ms | 668.926 ms |
| MySql          |    3.28x | 693.690 ms |  8.6160 ms |  8.0594 ms | 691.702 ms |
| SqlServer      |    4.66x | 986.676 ms | 19.0059 ms | 18.6663 ms | 983.779 ms |
:::

Here we see that SQL Server AMD64 image is not just slow under Rosetta/ARM, it's just consistently slow on Linux -
surprising how much slower a multi-billion dollar commercial database is vs the Free and Open Source PostgreSQL.

## Multiple Inserts Rows Performance

These benchmarks show the performance of executing **Multiple Row Inserts** in batches of **1000** rows:

<chart-js :data="{
    labels: [
        '1,000 Rows',
        '10,000 Rows',
        '100,000 Rows'
    ],
    datasets: [
        {
            label: 'SQLite Memory',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [3.117, 28.106, 302.656]
        },
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [4.543, 39.774, 424.378]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [7.481, 65.437, 649.366]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [12.025, 100.473, 917.979]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [15.204, 142.609, 1282.074]
        },
    ]
}"></chart-js>

:::{.text-xs .text-gray-500 .text-center}
_SQL Server results removed due to poor outlier performance_
:::

:::{.table .table-striped .text-base}
#### Inserting 1,000 Rows

| Database       | Relative |       Mean |     Error |    StdDev |     Median |
|----------------|---------:|-----------:|----------:|----------:|-----------:|
| SQLite Memory  |       1x |   3.117 ms | 0.0293 ms | 0.0274 ms |   3.116 ms |
| SQLite Disk    |    1.46x |   4.543 ms | 0.0898 ms | 0.2235 ms |   4.519 ms |
| PostgreSQL     |    2.40x |   7.481 ms | 0.1495 ms | 0.1325 ms |   7.469 ms |
| MySqlConnector |    3.86x |  12.025 ms | 0.2265 ms | 0.2946 ms |  11.966 ms |
| MySql          |    4.88x |  15.204 ms | 0.3003 ms | 0.7254 ms |  15.106 ms |
| SqlServer      |   39.61x | 123.473 ms | 2.2482 ms | 1.9930 ms | 123.270 ms |

#### Inserting 10,000 Rows

| Database       | Relative |         Mean |      Error |     StdDev |       Median |
|----------------|---------:|-------------:|-----------:|-----------:|-------------:|
| SQLite Memory  |       1x |    28.106 ms |  0.5567 ms |  1.1621 ms |    27.552 ms |
| SQLite Disk    |    1.42x |    39.774 ms |  0.5604 ms |  0.4968 ms |    39.701 ms |
| PostgreSQL     |    2.33x |    65.437 ms |  1.2455 ms |  1.4343 ms |    65.431 ms |
| MySqlConnector |    3.57x |   100.473 ms |  1.9342 ms |  1.7146 ms |   100.253 ms |
| MySql          |    5.07x |   142.609 ms |  9.0717 ms | 26.3187 ms |   130.328 ms |
| SqlServer      |   41.47x | 1,165.550 ms | 11.0161 ms |  9.7655 ms | 1,167.982 ms |

#### Inserting 100,000 Rows

| Database       | Relative |          Mean |       Error |      StdDev |        Median |
|----------------|---------:|--------------:|------------:|------------:|--------------:|
| SQLite Memory  |       1x |    302.656 ms |   5.9832 ms |   6.4019 ms |    301.417 ms |
| SQLite Disk    |    1.40x |    424.378 ms |   6.9570 ms |   6.5076 ms |    424.492 ms |
| PostgreSQL     |    2.15x |    649.366 ms |  10.3512 ms |   9.6826 ms |    651.269 ms |
| MySqlConnector |    3.03x |    917.979 ms |   7.5867 ms |   6.7254 ms |    917.177 ms |
| MySql          |    4.24x |  1,282.074 ms |  25.3866 ms |  69.0662 ms |  1,277.800 ms |
| SqlServer      |   39.24x | 11,875.196 ms | 190.5093 ms | 178.2025 ms | 11,881.457 ms |

SQL Server's performance goes from slow to abysmal when executing large SQL Insert statements, effectively
suggesting there's no good way to import large amounts of data in a SQL Server Linux instance from code, you'll likely 
get better performance from an external solution like [bcp utility or SSIS](https://learn.microsoft.com/en-us/sql/relational-databases/import-export/bulk-import-and-export-of-data-sql-server).

:::

## Single Insert Performance

This benchmark measures the performance of multiple single inserts:

<chart-js :data="{
    labels: [
        '1,000 Rows',
    ],
    datasets: [
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [781.708]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [315.935]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [747.250]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [833.046]
        },
        {
            label: 'SQL Server',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [690.398]
        }
    ]
}"></chart-js>

:::{.table .table-striped .text-base}
#### Inserting 1,000 Rows

| Database       | Relative |       Mean |      Error |     StdDev |     Median |
|----------------|---------:|-----------:|-----------:|-----------:|-----------:|
| SQLite Memory  |       1x |  15.970 ms |  0.3430 ms |  1.0004 ms |  15.334 ms |
| PostgreSQL     |   19.78x | 315.935 ms |  6.3063 ms | 16.6133 ms | 316.822 ms |
| SqlServer      |   43.23x | 690.398 ms | 13.6920 ms | 36.3094 ms | 685.644 ms |
| MySqlConnector |   46.79x | 747.250 ms | 14.5164 ms | 19.3789 ms | 748.131 ms |
| SQLite Disk    |   48.95x | 781.708 ms | 12.4966 ms | 10.4352 ms | 780.188 ms |
| MySql          |   52.16x | 833.046 ms | 16.5805 ms | 28.1550 ms | 837.304 ms |
:::

Here we see overhead cost of multiple I/O calls being significantly slower than an In Memory SQLite database whilst
PostgreSQL continues to be a standout performer vs other RDBMS's.

### Linux Benchmarks Takeaways

It's not clear if SQL Server's poor performance is due to having a suboptimal Linux port, running from Docker 
or running in a Linux VM with only 7GB RAM. 

Either way if you're running SQL Server on Linux you may want to consider running your own load tests to check you're 
not getting poor performance in your environment and whether or not you're better off running SQL Server on a Windows instance. 

## Intel iMac 5K Benchmarks

The Intel iMac 5K / 24GB RAM benchmarks were run on **Windows 10**, specifications reported by BenchmarkDotNet:

```txt
BenchmarkDotNet v0.13.6, Windows 10 (10.0.19045.3208/22H2/2022Update)
Intel Core i7-7700K CPU 4.20GHz (Kaby Lake), 1 CPU, 8 logical and 4 physical cores
.NET SDK 7.0.203
  [Host]     : .NET 6.0.20 (6.0.2023.32017), X64 RyuJIT AVX2
  Job-ILIRNE : .NET 6.0.20 (6.0.2023.32017), X64 RyuJIT AVX2
```

With all benchmarks running against local databases, installed using their native Windows Installers.

## Optimized Bulk Insert Performance

These benchmarks below uses the default optimal Bulk Insert implementation for each RDBMS:

<chart-js :data="{
    labels: [
        '1,000 Rows',
        '10,000 Rows',
        '100,000 Rows'
    ],
    datasets: [
        {
            label: 'SQLite Memory',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [2.638, 23.424, 240.111]
        },
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgb(255, 205, 86)',
            borderWidth: 1,
            data: [9.884, 102.848, 1049.120]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [4.507, 17.796, 265.161]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [23.952, 145.037, 714.550]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [21.791, 143.624, 580.433]
        },
        {
            label: 'SQL Server',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [6.432, 53.330, 580.433]
        }
    ]
}"></chart-js>

:::{.table .table-striped .text-base}
#### Inserting 1,000 Rows

| Database       | Relative |      Mean |     Error |    StdDev |    Median |
|----------------|---------:|----------:|----------:|----------:|----------:|
| SQLite Memory  |       1x |  2.638 ms | 0.0675 ms | 0.1981 ms |  2.660 ms |
| PostgreSQL     |    1.71x |  4.507 ms | 0.1548 ms | 0.4442 ms |  4.431 ms |
| SqlServer      |    2.44x |  6.432 ms | 0.1342 ms | 0.3763 ms |  6.319 ms |
| SQLite Disk    |    3.75x |  9.884 ms | 0.2986 ms | 0.8226 ms |  9.814 ms |
| MySqlConnector |    8.26x | 21.791 ms | 1.4271 ms | 4.0017 ms | 20.746 ms |
| MySql          |    9.08x | 23.952 ms | 1.3798 ms | 3.8234 ms | 22.884 ms |

#### Inserting 10,000 Rows

| Database       | Relative |       Mean |     Error |     StdDev |     Median |
|----------------|---------:|-----------:|----------:|-----------:|-----------:|
| PostgreSQL     |       1x |  17.796 ms | 0.3128 ms |  0.4486 ms |  17.743 ms |
| SQLite Memory  |    1.32x |  23.424 ms | 0.4573 ms |  0.5444 ms |  23.354 ms |
| SqlServer      |     3.0x |  53.330 ms | 0.7668 ms |  0.7173 ms |  53.499 ms |
| SQLite Disk    |    5.78x | 102.848 ms | 2.0194 ms |  5.2845 ms | 101.927 ms |
| MySqlConnector |    8.07x | 143.624 ms | 6.7792 ms | 19.3413 ms | 139.740 ms |
| MySql          |    8.15x | 145.037 ms | 6.1655 ms | 17.7889 ms | 141.211 ms |

#### Inserting 100,000 Rows

| Database       | Relative |         Mean |      Error |     StdDev |       Median |
|----------------|---------:|-------------:|-----------:|-----------:|-------------:|
| SQLite Memory  |       1x |   240.111 ms |  2.6344 ms |  2.3353 ms |   239.452 ms |
| PostgreSQL     |    1.10x |   265.161 ms | 12.6705 ms | 36.9604 ms |   261.027 ms |
| SqlServer      |    2.42x |   580.433 ms |  9.3144 ms |  7.7779 ms |   580.560 ms |
| MySql          |    2.98x |   714.550 ms | 13.6676 ms | 28.5294 ms |   707.452 ms |
| MySqlConnector |    3.04x |   729.408 ms | 14.6735 ms | 43.2651 ms |   722.036 ms |
| SQLite Disk    |    4.37x | 1,049.120 ms | 20.9215 ms | 29.3290 ms | 1,045.173 ms |

#### Inserting 1,000,000 Rows

| Database       | Relative |     Mean |    Error |   StdDev |
|----------------|---------:|---------:|---------:|---------:|
| SQLite Memory  |       1x |  2.573 s | 0.0508 s | 0.0624 s |
| PostgreSQL     |    1.51x |  3.895 s | 0.0769 s | 0.2067 s |
| SqlServer      |    2.31x |  5.934 s | 0.1002 s | 0.0888 s |
| MySqlConnector |    2.56x |  6.585 s | 0.1253 s | 0.1287 s |
| MySql          |    2.64x |  6.803 s | 0.1339 s | 0.1920 s |
| SQLite Disk    |    4.33x | 11.146 s | 0.1228 s | 0.1149 s |

:::

Here we see that PostgreSQL continue to take the Bulk Insert crown platform even on Windows
and SQL Server is also a good performer now that it's running on its native Windows/Intel platform.

It also highlights a significant performance of SQLite disk write performance on Windows/x64 which may be due to
how [macOS implements fsync](https://news.ycombinator.com/item?id=30370551).

### Relative performance of ARM vs Intel

Although they're not directly comparable with their different configurations, although the relative performance numbers
provides some indication on how much faster my new Macbook Air M2 is compared to my primary 
Intel iMac 5K Desktop, even with the overhead of running RDBMS's from within Docker containers:

<chart-js :data="{
    labels: [
        'M2 Macbook Air',
        'Intel iMac 5K'
    ],
    datasets: [
        {
            label: 'SQLite Memory',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [166.747, 240.111]
        },
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgb(255, 205, 86)',
            borderWidth: 1,
            data: [199.697, 265.161]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [115.645, 265.161]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [310.966, 714.550]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [308.574, 729.408]
        },
        {
            label: 'SQL Server',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [835.181, 580.433]
        }
    ]
}"></chart-js>

:::{.table .table-striped .text-base}
#### Relative performance for Bulk Insert of 100,000 records

| Database       | M2 ARM | Intel i7-7700K |
|----------------|-------:|---------------:|
| PostgreSQL     |     1x |          2.92x |
| SQLite Memory  |     1x |          1.44x |
| SQLite Disk    |     1x |          5.25x |
| MySqlConnector |     1x |          2.30x |
| MySql          |     1x |          2.30x |
| SqlServer      |  1.44x |             1x |
:::

Where other than SQL Server's poor performance on Linux/Rosetta, the benchmarks run much faster on Apple M2 Macbook Air.

## Multiple Inserts Rows Performance

These benchmarks show the performance of executing **Multiple Row Inserts** in batches of **1000** -
measuring the comparative performance of each RDBMS in executing large SQL Insert statements:

<chart-js :data="{
    labels: [
        '1,000 Rows',
        '10,000 Rows',
        '100,000 Rows'
    ],
    datasets: [
        {
            label: 'SQLite Memory',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [2.710, 25.784, 246.285]
        },
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgb(255, 205, 86)',
            borderWidth: 1,
            data: [9.944, 105.551, 1048.217]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [7.270, 64.107, 522.203]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [24.016, 217.394, 1656.828]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [20.869, 184.193, 1359.005]
        },
        {
            label: 'SQL Server',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [75.994, 819.829, 0]
        }
    ]
}"></chart-js>

:::{.text-xs .text-gray-500 .text-center}
_Last SQL Server result removed due to poor outlier performance_
:::

:::{.table .table-striped .text-base}
#### Inserting 1,000 Rows

| Database       | Relative |         Mean |      Error |     StdDev |       Median |
|----------------|---------:|-------------:|-----------:|-----------:|-------------:|
| SQLite Memory  |       1x |     2.710 ms |  0.0726 ms |  0.2084 ms |     2.745 ms |
| PostgreSQL     |    2.68x |     7.270 ms |  0.1439 ms |  0.2874 ms |     7.192 ms |
| SQLite Disk    |    3.67x |     9.944 ms |  0.3215 ms |  0.8692 ms |     9.754 ms |
| MySqlConnector |    7.70x |    20.869 ms |  1.2050 ms |  3.4380 ms |    19.956 ms |
| MySql          |    8.86x |    24.016 ms |  1.3810 ms |  3.9845 ms |    22.311 ms |
| SqlServer      |   28.04x |    75.994 ms |  1.3113 ms |  1.5610 ms |    76.456 ms |

#### Inserting 10,000 Rows

| Database       | Relative |         Mean |      Error |     StdDev |       Median |
|----------------|---------:|-------------:|-----------:|-----------:|-------------:|
| SQLite Memory  |       1x |    25.784 ms |  0.6895 ms |  2.0005 ms |    26.021 ms |
| PostgreSQL     |    2.49x |    64.107 ms |  1.2164 ms |  1.0783 ms |    64.225 ms |
| SQLite Disk    |    4.09x |   105.551 ms |  2.3293 ms |  6.7579 ms |   103.989 ms |
| MySqlConnector |    7.14x |   184.193 ms |  4.3627 ms | 12.4471 ms |   180.157 ms |
| MySql          |    8.43x |   217.394 ms |  5.6931 ms | 16.6968 ms |   214.477 ms |
| SqlServer      |   31.80x |   819.829 ms | 16.1172 ms | 38.3043 ms |   829.895 ms |

#### Inserting 100,000 Rows

| Database       | Relative |         Mean |      Error |     StdDev |       Median |
|----------------|---------:|-------------:|-----------:|-----------:|-------------:|
| SQLite Memory  |       1x |   246.285 ms |  3.9630 ms |  3.3093 ms |   246.185 ms |
| PostgreSQL     |    2.12x |   522.203 ms |  9.1596 ms |  8.1198 ms |   519.607 ms |
| SQLite Disk    |    4.26x | 1,048.217 ms | 17.4291 ms | 14.5541 ms | 1,044.868 ms |
| MySqlConnector |    5.52x | 1,359.005 ms | 26.2161 ms | 29.1391 ms | 1,360.109 ms |
| MySql          |    6.73x | 1,656.828 ms | 32.2114 ms | 49.1902 ms | 1,649.606 ms |
| SqlServer      |   34.75x | 8,558.850 ms | 89.6498 ms | 83.8585 ms | 8,582.563 ms |

#### Inserting 1,000,000 Rows

| Database       | Relative |     Mean |    Error |   StdDev |
|----------------|---------:|---------:|---------:|---------:|
| SQLite Memory  |       1x |  2.332 s | 0.0288 s | 0.0255 s |
| PostgreSQL     |    2.61x |  6.098 s | 0.1199 s | 0.1559 s |
| SQLite Disk    |    4.76x | 11.099 s | 0.1153 s | 0.1022 s |
| MySqlConnector |    5.92x | 13.800 s | 0.1668 s | 0.1393 s |
| MySql          |     6.7x | 15.546 s | 0.3095 s | 0.3801 s |
| SqlServer      |   33.11x | 77.221 s | 0.5015 s | 0.4445 s |
:::

PostgreSQL continues to shine here, significantly out performing other distributed RDBMS's for processing large, multi-row
INSERT statements whilst SQL Server has a surprisingly poor showing on its native Windows/Intel platform - likely the 
result of a naive unoptimized implementation for these types of large SQL INSERT statements.

## Single Insert Performance

This benchmark measures the performance of multiple single inserts (i.e. when Bulk Insert is not available):

<chart-js :data="{
    labels: [
        '1,000 Rows',
    ],
    datasets: [
        {
            label: 'SQLite Disk',
            backgroundColor: 'rgba(201, 203, 207, 0.2)',
            borderColor: 'rgb(201, 203, 207)',
            borderWidth: 1,
            data: [7620.93]
        },
        {
            label: 'PostgreSQL',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            data: [465.43]
        },
        {
            label: 'MySQL',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            data: [4282.89]
        },
        {
            label: 'MySqlConnector',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: [4261.57]
        },
        {
            label: 'SQL Server',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data: [582.33]
        }
    ]
}"></chart-js>

:::{.table .table-striped .text-base}

| Database       | Relative |        Mean |     Error |    StdDev |
|----------------|---------:|------------:|----------:|----------:|
| SQLite Memory  |       1x |    12.30 ms |  0.244 ms |  0.453 ms |
| PostgreSQL     |   37.84x |   465.43 ms |  9.082 ms | 10.812 ms |
| SqlServer      |   47.34x |   582.33 ms |  8.988 ms |  8.408 ms |
| MySqlConnector |  346.47x | 4,261.57 ms | 81.441 ms | 96.950 ms |
| MySql          |  348.20x | 4,282.89 ms | 83.393 ms | 99.273 ms |
| SQLite Disk    |  619.59x | 7,620.93 ms | 89.152 ms | 83.393 ms |

:::

We hope these results have been informative and have highlighted opportunities for improvements in your own systems
needing to perform large inserts or data imports. 

Feel free to leave any feedback or suggest improvements or other environments to run these benchmarks on in the comments. 