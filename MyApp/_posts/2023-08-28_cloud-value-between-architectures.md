---
title: Should .NET Apps switch to ARM?
summary: Evaluating the cost and performance of ARM vs x86 in AWS, Azure, and Hetzner
tags: dotnet, hosting, arm, performance
image: https://images.unsplash.com/photo-1587845323226-bad89242c735?crop=entropy&fit=crop&h=1000&w=2000
author: Darren Reid
---

In the ever-competitive landscape of cloud computing, choices abound for software developers seeking to harness the power of various providers and architectures. This blog post presents an insightful analysis comparing three major providers: Hetzner, AWS, and Azure. Focusing on cost efficiency and performance, I've explored different instance types utilizing both ARM and x86 architectures. The benchmarks used for this comparison include the Postgres benchmark (`pgbench`), a .NET HTTP load test, and Geekbench scores.

<div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="PryW8bFKWJ0" style="background-image: url('https://img.youtube.com/vi/PryW8bFKWJ0/maxresdefault.jpg')"></lite-youtube>
</div>

## Benchmarks and Tools
- **Postgres Benchmark:** Utilizing `pgbench`, I ran the same Docker setup on each provider's instances to ensure consistency.
- **HTTP RPS Benchmark:** A simple .NET load test was executed, performing approximately 100,000 requests as quickly as possible to measure the Requests Per Second (RPS).
- **Geekbench Scores:** Geekbench 6.0 for x86 and 6.1-Preview for ARM were used to generate scores. Some scores were gathered from public community results, while others were manually retested.

::: info
All tests were conducted on Ubuntu 22.04, providing a uniform testing environment.
:::

## Upselling and Value

In a world where numerous large cloud providers are competing, the focus on value often takes a backseat. While giants like AWS and Azure offer an extensive array of managed services, there are scenarios where developers simply need raw compute power at a reasonable price. This is where providers like Hetzner, focusing more on value, come into play.

The emergence of ARM as a cost-effective option for production systems is also noteworthy, especially for those who are 'locked in' to one of the large vendors. With improving support and compatibility, ARM presents a viable way to save money without switching providers, especially if you're already on AWS or Azure.

## Methodology

The methodology for this analysis was designed to capture differences in performance and value between architectures (ARM and x86) and providers (Hetzner, AWS, Azure). Here's a brief overview of the approach:

### Testing Environment
- **Docker Containers:** Both the .NET HTTP load test and `pgbench` were run inside Docker containers to ensure consistency across all instances.
- **Test Repetition:** Each test was conducted three times to mitigate the impact of outliers, providing a more accurate representation of performance.

### Benchmarks Used
- **.NET HTTP**: Load test Focusing on web service performance, this test runs a ServiceStack service with SQLite. This tests concurrent workload of a HTTP server to show the change in performance between architectures.
- **pgbench**: Specifically targeting database performance, the Postgres benchmark was conducted using `pgbench`. This tests SQL transaction throughput across cores, calculating average transactions per second.
- **Geekbench**: As a rounded synthetic benchmark, Geekbench was run using the standard binary distributed by the creators. A well rounded benchmark that tests CPU performance across different tasks.

### Objective
While you should always do your own performance testing for your use case, the combination of these three distinct benchmarks offers a multifaceted view of the computing capabilities of different instance types across providers and architectures. By analyzing web service performance, database performance, and synthetic benchmarks, this approach aims to hopefully provide insights for developers and businesses seeking cost-efficient compute power.

## Results Overview

Lets now have a look at the results for cost efficiency across providers (Hetzner, AWS, Azure) and architectures (ARM and x86) for three distinct benchmarks: TPS (Transactions Per Second), HTTP RPS (Requests Per Second), and Geekbench.

### Provider Comparison

Hetzer, AWS, and Azure were chosen for this analysis due to their popularity and the availability of ARM instances. While AWS and Azure are well-known, Hetzner is a lesser-known provider that offers great value for money. Here we can see an overview of the cost efficiency of x86 and ARM across the three providers.

### pgbench Database Workload

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/pgbench-provider-cost-efficiency.png)](./img/posts/arm-vs-x86/pgbench-provider-cost-efficiency.png)


| Provider | Architecture | Cost Efficiency |
|----------|--------------|-----------------|
| Azure    | x86          | 1.00x           |
| Azure    | ARM          | 2.29x           |
| AWS      | x86          | 6.13x           |
| AWS      | ARM          | 7.45x           |
| Hetzner  | x86          | 39.57x          |
| Hetzner  | ARM          | 35.70x          |


### .NET HTTP Web Service Workload

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/http-provider-cost-efficiency.png)](./img/posts/arm-vs-x86/http-provider-cost-efficiency.png)

| Provider | Architecture | Cost Efficiency |
|----------|--------------|-----------------|
| Azure    | x86          | 1.00x           |
| Azure    | ARM          | 1.49x           |
| AWS      | x86          | 1.87x           |
| AWS      | ARM          | 2.04x           |
| Hetzner  | x86          | 10.26x          |
| Hetzner  | ARM          | 10.23x          |

### Geekbench Scores

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/geekbench-provider-cost-efficiency.png)](./img/posts/arm-vs-x86/geekbench-provider-cost-efficiency.png)

| Provider | Architecture | Cost Efficiency |
|----------|--------------|-----------------|
| Azure    | x86          | 1.00x           |
| Azure    | ARM          | 2.45x           |
| AWS      | x86          | 1.97x           |
| AWS      | ARM          | 3.48x           |
| Hetzner  | x86          | 15.41x          |
| Hetzner  | ARM          | 19.06x          |

Hetzer offers the best value by a large margin across these 3 providers, but AWS and Azure offer a much wider range of managed services and features.

So while the savings for switching to ARM for Hetzner servers are relatively small, for Azure and AWS, ARM offers a significant cost saving, lets have a look at the specific benchmarks to see where ARM shines.

## pgbench TPS Across Instance Types

### AWS pgbench Performance

Here we have a performance comparison of the TPS (Transactions Per Second) for AWS x86 vs ARM, comparing matching instance types within AWS T series.

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/aws-pgbench-x86-arm-performance-comparison.png)](./img/posts/arm-vs-x86/aws-pgbench-x86-arm-performance-comparison.png)

| Provider | Instance Type | Architecture | CPUs | Memory | Monthly Cost | Relative Performance |
|----------|---------------|--------------|------|--------|--------------|----------------------|
| AWS      | t3.medium     | x86          | 2    | 4      | $17.23       | 1.01x                |
| AWS      | t4g.medium    | ARM          | 2    | 4      | $15.40       | 1.0x                 |
| AWS      | t3.large      | x86          | 2    | 8      | $38.11       | 1.03x                |
| AWS      | t4g.large     | ARM          | 2    | 8      | $30.73       | 1.02x                |
| AWS      | t3.xlarge     | x86          | 4    | 16     | $76.14       | 1.21x                |
| AWS      | t4g.xlarge    | ARM          | 4    | 16     | $61.54       | 1.55x                |

### AWS pgbench Cost Efficiency

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/aws-x86-vs-arm-pgbench.png)](./img/posts/arm-vs-x86/aws-x86-vs-arm-pgbench.png)

We can see as the ARM cores scale up, the cost savings can increase and so can performance. This is a great example of how ARM can be a cost-effective option for workloads that can scale across cores.
For example if you had an existing workload running on **3x t3.xlarge** instances you could drop your monthly costs from **$228.42 to $184.62** by switching to 3x t4g.xlarge instances, a saving of **$43.8 per month** or **$525.6 per year**.

### Azure pgbench Performance

For Azure, we tested the D series, comparing the D4sv3 x86 instance type with the D4psv5 ARM instance type, and same with the D2.
The D2 instances have two cores, while the D4 instances have four cores, so again we can see how well ARM scales up.

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/azure-pgbench-x86-arm-performance-comparison.png)](./img/posts/arm-vs-x86/azure-pgbench-x86-arm-performance-comparison.png)

| Provider | Instance Type | Architecture | CPUs | Memory | Monthly Cost | Relative Performance |
|----------|---------------|--------------|------|--------|--------------|----------------------|
| Azure    | D4sv3         | x86          | 4    | 16     | $121.40      | 1.11x                |
| Azure    | D2psv5        | ARM          | 2    | 8      | $38.62       | 1.32x                |
| Azure    | D2sv3         | x86          | 2    | 8      | $60.74       | 1.0x                 |
| Azure    | D4psv5        | ARM          | 4    | 16     | $77.23       | 1.9x                 |

### Azure pgbench Cost Efficiency

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/azure-x86-vs-arm-pgbench.png)](./img/posts/arm-vs-x86/azure-x86-vs-arm-pgbench.png)

Azure costs are significantly higher than AWS, and the cost savings opportunity by switching to ARM is even larger. For example, if you had an existing workload running on **3x D4sv3** instances you could drop your monthly costs from **$364.20 to $231.70** by switching to **3x D4psv5** instances, a saving of **$132.50** per month or a whopping **$1,589.94** per year, and you would get a performance **boost of around 30%** for these kinds of workloads.

If you are running on Azure, ARM could be a great way to save money.

### Hetzner pgbench Performance

For Hetzner we tested the AMD CPX series against the ARM CAX series, comparing matching instance types.

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/hetzner-pgbench-x86-arm-performance-comparison.png)](./img/posts/arm-vs-x86/hetzner-pgbench-x86-arm-performance-comparison.png)

| Provider | Instance Type | Architecture | CPUs | Memory | Monthly Cost | Relative Performance |
|----------|---------------|--------------|------|--------|--------------|----------------------|
| Hetzner  | CPX11         | x86          | 2    | 2      | $4.74        | 1.47x                |
| Hetzner  | CAX11         | ARM          | 2    | 4      | $4.02        | 1.0x                 |
| Hetzner  | CPX21         | x86          | 3    | 4      | $8.76        | 1.69x                |
| Hetzner  | CAX21         | ARM          | 4    | 8      | $8.03        | 1.53x                |
| Hetzner  | CPX31         | x86          | 4    | 8      | $16.79       | 2.5x                 |
| Hetzner  | CAX31         | ARM          | 8    | 16     | $15.33       | 2.12x                |
| Hetzner  | CPX41         | x86          | 8    | 16     | $32.85       | 3.36x                |
| Hetzner  | CAX41         | ARM          | 16   | 32     | $29.93       | 3.06x                |


Core counts don't match up exactly between instances, but we can see how well ARM scales up as the core count increases, but it doesn't quite close the gap in this benchmark.

### Hetzner pgbench Cost Efficiency

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/hetzner-x86-vs-arm-pgbench.png)](./img/posts/arm-vs-x86/hetzner-x86-vs-arm-pgbench.png)

Hetzner offers the best value across all providers, but for cost vs performance, x86 still comes out on top for this benchmark. So for Hetzner, there isn't a large saving by switching to ARM in this workload.

## .NET HTTP Across Instance Types

Switching gears to web service workloads, we can see how ARM performs in this scenario where we have a .NET web service running on ServiceStack with SQLite, and .NET client that scales with available cores to perform 100,000 requests as quickly as possible.

### AWS .NET HTTP Performance

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/aws-http-x86-arm-performance-comparison.png)](./img/posts/arm-vs-x86/aws-http-x86-arm-performance-comparison.png)

| Provider | Instance Type | Architecture | CPUs | Memory | Monthly Cost | Relative Performance |
|----------|---------------|--------------|------|--------|--------------|----------------------|
| AWS      | t3.medium     | x86          | 2    | 4      | $17.23       | 1.1x                 |
| AWS      | t4g.medium    | ARM          | 2    | 4      | $15.40       | 1.04x                |
| AWS      | t3.large      | x86          | 2    | 8      | $38.11       | 1.08x                |
| AWS      | t4g.large     | ARM          | 2    | 8      | $30.73       | 1.0x                 |
| AWS      | t3.xlarge     | x86          | 4    | 16     | $76.14       | 2.24x                |
| AWS      | t4g.xlarge    | ARM          | 4    | 16     | $61.54       | 2.01x                |


While x86 still comes out on top for this benchmark in regards to performance, the cost savings are even better than the previous test with the same instances.

### AWS .NET HTTP Cost Efficiency

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/aws-x86-vs-arm-http.png)](./img/posts/arm-vs-x86/aws-x86-vs-arm-http.png)

A lot smaller than we saw with the pgbench test, but still a saving which can add up over time.

### Azure .NET HTTP Performance

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/azure-http-x86-arm-performance-comparison.png)](./img/posts/arm-vs-x86/azure-http-x86-arm-performance-comparison.png)

| Provider | Instance Type | Architecture | CPUs | Memory | Monthly Cost | Relative Performance |
|----------|---------------|--------------|------|--------|--------------|----------------------|
| Azure    | D2psv5        | ARM          | 2    | 8      | $38.62       | 1.0x                 |
| Azure    | D2sv3         | x86          | 2    | 8      | $60.74       | 1.01x                |
| Azure    | D4psv5        | ARM          | 4    | 16     | $77.23       | 1.65x                |
| Azure    | D4sv3         | x86          | 4    | 16     | $121.40      | 1.85x                |

Again, we see x86 win in raw performance, but for Azure the cost savings are a lot better than AWS.

### Azure .NET HTTP Cost Efficiency

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/azure-x86-vs-arm-http.png)](./img/posts/arm-vs-x86/azure-x86-vs-arm-http.png)

We see nearly a **50% saving for the same performance**, which is a great result for ARM.

### Hetzner .NET HTTP Performance

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/hetzner-http-x86-arm-performance-comparison.png)](./img/posts/arm-vs-x86/hetzner-http-x86-arm-performance-comparison.png)

The performance is a lot closer for this benchmark, but x86 still comes out on top on a per core basis since the instances like the CAX41 have 16 cores, but the CPX41 only has 8 cores.

| Provider | Instance Type | Architecture | CPUs | Memory | Monthly Cost | Relative Performance |
|----------|---------------|--------------|------|--------|--------------|----------------------|
| Hetzner  | CPX11         | x86          | 2    | 2      | $4.74        | 1.53x                |
| Hetzner  | CAX11         | ARM          | 2    | 4      | $4.02        | 1.0x                 |
| Hetzner  | CPX21         | x86          | 3    | 4      | $8.76        | 1.39x                |
| Hetzner  | CAX21         | ARM          | 4    | 8      | $8.03        | 2.04x                |
| Hetzner  | CPX31         | x86          | 4    | 8      | $16.79       | 3.75x                |
| Hetzner  | CAX31         | ARM          | 8    | 16     | $15.33       | 2.41x                |
| Hetzner  | CPX41         | x86          | 8    | 16     | $32.85       | 7.82x                |
| Hetzner  | CAX41         | ARM          | 16   | 32     | $29.93       | 8.33x                |

### Hetzner .NET HTTP Cost Efficiency

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/hetzner-x86-vs-arm-http.png)](./img/posts/arm-vs-x86/hetzner-x86-vs-arm-http.png)

Hetzner offers the best value over all compared to the other providers, but for this benchmark we get a mixed result when it comes to performance.
This is partly due again to the difference in core count for the instance types, as they are a lot more matched in value proposition.
So we essentially get the same performance for the same cost.

## Geekbench Scores Across Instance Types

Geekbench is a synthetic benchmark, but it can be useful for comparing the relative performance of different architectures and instance types.

### AWS Geekbench Performance

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/aws-geekbench-x86-arm-performance-comparison.png)](./img/posts/arm-vs-x86/aws-geekbench-x86-arm-performance-comparison.png)

| Provider | Instance Type | Architecture | CPUs | Memory | Monthly Cost | Relative Performance |
|----------|---------------|--------------|------|--------|--------------|----------------------|
| AWS      | t3.medium     | x86          | 2    | 4      | $17.23       | 1.0x                 |
| AWS      | t4g.medium    | ARM          | 2    | 4      | $15.40       | 1.55x                |
| AWS      | t3.large      | x86          | 2    | 8      | $38.11       | 1.12x                |
| AWS      | t4g.large     | ARM          | 2    | 8      | $30.73       | 1.55x                |
| AWS      | t3.xlarge     | x86          | 4    | 16     | $76.14       | 1.91x                |
| AWS      | t4g.xlarge    | ARM          | 4    | 16     | $61.54       | 2.94x                |

Here we can see even though the ARM instances are cheaper, they still offer better performance for this benchmark once we scale up to 4 cores.

### AWS Geekbench Cost Efficiency

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/aws-x86-vs-arm-geekbench.png)](./img/posts/arm-vs-x86/aws-x86-vs-arm-geekbench.png)

If we use Geekbench as an overall we can see ARM offers about a ~70% saving for the same performance.
These are synthetic benchmarks, so your mileage may vary, but it's a good indicator of the possible savings.

### Azure Geekbench Performance

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/azure-geekbench-x86-arm-performance-comparison.png)](./img/posts/arm-vs-x86/azure-geekbench-x86-arm-performance-comparison.png)

| Provider | Instance Type | Architecture | CPUs | Memory | Monthly Cost | Relative Performance |
|----------|---------------|--------------|------|--------|--------------|----------------------|
| Azure    | D2psv5        | ARM          | 2    | 8      | $38.62       | 1.56x                |
| Azure    | D2sv3         | x86          | 2    | 8      | $60.74       | 1.0x                 |
| Azure    | D4psv5        | ARM          | 4    | 16     | $77.23       | 2.89x                |
| Azure    | D4sv3         | x86          | 4    | 16     | $121.4       | 1.86x                |

### Azure Geekbench Cost Efficiency

<div style="color: dimgrey; text-align: center; width: 100%;margin-bottom: -2em">
    Higher is Better
</div>

[![](./img/posts/arm-vs-x86/azure-x86-vs-arm-geekbench.png)](./img/posts/arm-vs-x86/azure-x86-vs-arm-geekbench.png)

Due to the higher costs of Azure, we see a much better saving for ARM at ~2.5-3x the performance for the same cost.
This is higher than the other benchmarks, so it is likely you can consider something like Geekbench as a theoretical maximum saving.

**For Azure, the message is clear, if you are running on x86, you should consider switching to ARM where possible as it will likely result in significant savings.**

## Summary
- **Hetzner's Focus on Value:** Hetzner consistently offers strong performance at a reasonable price, particularly with x86 architectures in database performance.
- **ARM's Rising Potential:** ARM emerges as a cost-effective option, especially for web services and scalable workloads. On AWS and Azure, the savings could be substantial.
- **Workload Consideration:** The choice between ARM and x86 may depend on the specific workload, with ARM showing particular strength in web services and scalability.

The analysis of cost efficiency across Hetzner, AWS, and Azure, considering both ARM and x86 architectures, unveils significant insights that can guide software developers and businesses in their decision-making process. Here are the key implications and takeaways:

### Choosing the Right Provider and Architecture
- **Value vs. Features:** Hetzner stands out as a provider focusing on value, offering great performance at a reasonable price. AWS and Azure, with their multitude of managed services, come with complex billing structures that might lead to unexpected expenses.
- **ARM's Emergence:** ARM emerges as an attractive, cost-effective option, especially for scalable workloads and web services. Its value is notable within AWS and Azure, potentially leading to substantial savings.

### Considerations for ARM on Hetzner
- **Regional Availability:** ARM on Hetzner is currently limited to one region and offered as a shared resource. This limitation could lead to occasional performance inconsistencies.

### Egress Cost Considerations
- **Bandwidth/Traffic Costs:** AWS and Azure's high egress costs contrast sharply with Hetzner's generous free bandwidth. For large compute tasks involving extensive data transfer, Hetzner could present significant cost savings.

## Final Thoughts
- **Balancing Features and Costs:** Developers must weigh the trade-offs between feature-rich offerings and straightforward value. Hetzner's focus on value may appeal to those seeking robust performance without complexity, while AWS and Azure may be suitable for those requiring a wide array of managed services.
- **The Role of Workload:** The choice between ARM and x86, or between providers, may hinge on specific workload requirements, scalability needs, and budget constraints.

### Performance Testing Code

The code for each performance test is linked below, along with a gist with scripts for running each test.
These were only used on Ubuntu 22.04, so they may not work on other distributions, and may require some tweaking depending on your environment.

- [pgbench](https://github.com/Layoric/pgbench-docker)
- [.NET HTTP Load Test](https://github.com/Layoric/ArmBenchmarks)
- [Scripts for Run](https://gist.github.com/Layoric/ee75e380210f29355aeebb746b641bcb)

## Feedback

If you have any feedback or questions, please feel free to reach out. I'd love to hear your thoughts on this analysis and any suggestions for future posts.