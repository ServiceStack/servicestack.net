---
title: The ARM Advantage? A Cost & Performance Guide
summary: Unpacking the cost and performance of ARM vs x86 in cloud computing.
tags: cloud-computing, arm, x86, cost-efficiency, performance
image: https://images.unsplash.com/photo-1587845323226-bad89242c735?crop=entropy&fit=crop&h=1000&w=2000
author: Darren Reid
draft: true
---

In the ever-competitive landscape of cloud computing, choices abound for software developers seeking to harness the power of various providers and architectures. This blog post presents an insightful analysis comparing three major providers: Hetzner, AWS, and Azure. Focusing on cost efficiency and performance, I've explored different instance types utilizing both ARM and x86 architectures. The benchmarks used for this comparison include the Postgres benchmark (`pgbench`), a .NET HTTP load test, and Geekbench scores.

### Benchmarks and Tools
- **Postgres Benchmark:** Utilizing `pgbench`, I ran the same Docker setup on each provider's instances to ensure consistency.
- **HTTP RPS Benchmark:** A simple .NET load test was executed, performing approximately 100,000 requests as quickly as possible to measure the Requests Per Second (RPS).
- **Geekbench Scores:** Geekbench 6.0 for x86 and 6.1-Preview for ARM were used to generate scores. Some scores were gathered from public community results, while others were manually retested.
- **Common Platform:** All tests were conducted on Ubuntu 22.04, providing a uniform testing environment.

### Upselling and Value

In a world where numerous large cloud providers are competing, the focus on value often takes a backseat. While giants like AWS and Azure offer an extensive array of managed services, there are scenarios where developers simply need raw compute power at a reasonable price. This is where providers like Hetzner, focusing more on value, come into play.

The emergence of ARM as a cost-effective option for production systems is also noteworthy, especially for those who are 'locked in' to one of the large vendors. With improving support and compatibility, ARM presents a viable way to save money without switching providers, especially if you're already on AWS or Azure.

## Methodology

The methodology for this analysis was designed to capture differences in performance and value between architectures (ARM and x86) and providers (Hetzner, AWS, Azure). Here's a brief overview of the approach:

### Testing Environment
- **Docker Containers:** Both the .NET HTTP load test and `pgbench` were run inside Docker containers to ensure consistency across all instances.
- **Test Repetition:** Each test was conducted three times to mitigate the impact of outliers, providing a more accurate representation of performance.

### Benchmarks Used
- **.NET HTTP Load Test:** Focusing on web service performance, this test runs a ServiceStack service with SQLite. The code will be shared and linked in the blog post ([link placeholder](#)).
- **Postgres Benchmark (`pgbench`):** Specifically targeting database performance, the Postgres benchmark was conducted using `pgbench`. The code will also be linked ([link placeholder](#)).
- **Geekbench:** As a rounded synthetic benchmark, Geekbench was run using the standard binary distributed by the creators.

### Objective
While you should always do your own performance testing for your use case, the combination of these three distinct benchmarks offers a multifaceted view of the computing capabilities of different instance types across providers and architectures. By analyzing web service performance, database performance, and synthetic benchmarks, this approach aims to hopefully provide insights for developers and businesses seeking cost-efficient compute power.

## Results

Lets now have a look at the results for cost efficiency across providers (Hetzner, AWS, Azure) and architectures (ARM and x86) for three distinct benchmarks: TPS (Transactions Per Second), HTTP RPS (Requests Per Second), and Geekbench.

### pgbench TPS (Transactions Per Second) Analysis
- **Lowest Value (Base Line):** Azure x86 D4sv3 - 100%
- **Highest Value (Most Value):** Hetzner x86 CPX11 - ~9700%
- **Insights:**
    - Hetzner's x86 provided better value in the pgbench test, but ARM closed the gap as cores were added.
    - AWS and Azure's ARM offerings presented slightly better value compared to x86.

![](./img/posts/arm-vs-x86/composit-tps-results.png)

### .NET HTTP Requests Per Second Analysis
- **Lowest Value (Base Line):** Azure x86 D4sv3 - 100%
- **Highest Value (Most Value):** Hetzner x86 CPX11 - ~1450%
- **Insights:**
    - ARM's value improved as cores increased, even surpassing x86 within Hetzner's offerings.
    - For web services, ARM outperformed databases, making it a more cost-effective choice on AWS or Azure.

![](./img/posts/arm-vs-x86/composit-rps-results.png)

### Geekbench Score Analysis
- **Lowest Value (Base Line):** Azure x86 D4sv3 - 100%
- **Highest Value:** Hetzner ARM CAX11 - ~2450%
- **Insights:**
    - ARM's value augmented as cores were added, making it a viable option for workloads that can scale across cores.
    - Within AWS and Azure, ARM offered significantly better value compared to its x86 counterparts.

![](./img/posts/arm-vs-x86/composit-geekbench-results.png)

### Summary
- **Hetzner's Focus on Value:** Hetzner consistently offers strong performance at a reasonable price, particularly with x86 architectures in database performance.
- **ARM's Rising Potential:** ARM emerges as a cost-effective option, especially for web services and scalable workloads. On AWS and Azure, the savings could be substantial.
- **Workload Consideration:** The choice between ARM and x86 may depend on the specific workload, with ARM showing particular strength in web services and scalability.

### ARM vs x86: pgbench TPS (Transactions Per Second) Analysis

![](./img/posts/arm-vs-x86/pgbench-provider-comparison.png)

### ARM vs x86: .NET HTTP Requests Per Second Analysis

![](./img/posts/arm-vs-x86/http-provider-comparison.png)

### ARM vs x86: Geekbench Score Analysis

![](./img/posts/arm-vs-x86/geekbench-provider-comparison.png)

### Stuck in AWS or Azure? ARM Could Deliver Savings

Another interesting insight from this analysis is the potential for cost savings within AWS and Azure, where Azure showed the largest potential for savings. While Hetzner offers the best value, it's not always feasible to switch providers. In this case, ARM could still be a viable option for those seeking to save money.

#### Azure ARM vs x86

![](./img/posts/arm-vs-x86/azure-x86-vs-arm-http.png)

#### AWS ARM vs x86

![](./img/posts/arm-vs-x86/aws-x86-vs-arm-http.png)

## Conclusion

The analysis of cost efficiency across Hetzner, AWS, and Azure, considering both ARM and x86 architectures, unveils significant insights that can guide software developers and businesses in their decision-making process. Here are the key implications and takeaways:

### Choosing the Right Provider and Architecture
- **Value vs. Complexity:** Hetzner stands out as a provider focusing on value, offering great performance at a reasonable price. AWS and Azure, with their multitude of managed services, come with complex billing structures that might lead to unexpected expenses.
- **ARM's Emergence:** ARM emerges as an attractive, cost-effective option, especially for scalable workloads and web services. Its value is notable within AWS and Azure, potentially leading to substantial savings.

### Hetzner's Unique Advantages
- **Last-Mover Advantage:** Hetzner's fast console interface and live monitoring cater to common use cases. Metrics like CPU utilization are available within minutes of launch, offering agility without added costs.
- **Simpler, Yet Effective:** While providing a smaller feature set, Hetzner's simplicity in billing and offerings minimizes the risk of "bill shock." Its focus on essential metrics and streamlined service adds to its appeal.

### Considerations for ARM on Hetzner
- **Regional Availability:** ARM on Hetzner is currently limited to one region and offered as a shared resource. This limitation could lead to occasional performance inconsistencies.

### Egress Cost Considerations
- **Bandwidth/Traffic Costs:** AWS and Azure's high egress costs contrast sharply with Hetzner's generous free bandwidth. For large compute tasks involving extensive data transfer, Hetzner could present significant cost savings.

### Final Thoughts
- **Balancing Features and Costs:** Developers must weigh the trade-offs between feature-rich offerings and straightforward value. Hetzner's focus on value may appeal to those seeking robust performance without complexity, while AWS and Azure may be suitable for those requiring a wide array of managed services.
- **The Role of Workload:** The choice between ARM and x86, or between providers, may hinge on specific workload requirements, scalability needs, and budget constraints.

## Performance Testing Code

The code for each performance test is linked below, along with a gist with scripts for running each test.
These were only used on Ubuntu 22.04, so they may not work on other distributions, and may require some tweaking depending on your environment.

- [pgbench](https://github.com/Layoric/pgbench-docker)
- [.NET HTTP Load Test](https://github.com/Layoric/ArmBenchmarks)
- [Scripts for Run](https://gist.github.com/Layoric/ee75e380210f29355aeebb746b641bcb)

## Feedback

If you have any feedback or questions, please feel free to reach out. I'd love to hear your thoughts on this analysis and any suggestions for future posts.