import AudioPlayer from '../pages/podcasts/AudioPlayer.mjs'
import {
    ClusterSimulator, QueueLanes, DedupPlayground, RetryPlanner, WorkflowSimulator, BatchSimulator,
    TenantOrdering, ResultsDelivery, SchedulePillars, ObservabilityPillars, JobsGuides,
} from "./components/BackgroundJobs.mjs"

/** Top-of-post index of what's new, linking to each section */
const JobsHighlights = {
    template:`
      <section class="not-prose my-10">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a v-for="item in items" :key="item.title" :href="item.href"
             class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">{{item.icon}}</span>
              <div class="text-xs font-bold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">{{item.eyebrow}}</div>
            </div>
            <h3 class="mt-3 font-bold text-slate-900 dark:text-white">{{item.title}}</h3>
            <p class="mt-1 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{item.text}}</p>
          </a>
        </div>
      </section>`,
    setup() {
        const items = [
            { icon:'⇆', eyebrow:'Scale out', title:'Any number of servers', href:'#scale-out-without-a-broker',
              text:'Leased Jobs recovered automatically when a server dies, and graceful deploys.' },
            { icon:'☰', eyebrow:'Queues', title:'Control your workloads', href:'#give-each-workload-its-own-lane',
              text:'Named queues, priorities, concurrency and rate limits you can change at runtime.' },
            { icon:'①', eyebrow:'Exactly once', title:'Never do work twice', href:'#never-do-the-same-work-twice',
              text:'Idempotent enqueue, singleton Jobs and a transactional outbox.' },
            { icon:'↻', eyebrow:'Resilience', title:'Failures handled well', href:'#failures-that-heal-themselves',
              text:'Backoff with jitter, every failed attempt kept, expiring Jobs and enforced timeouts.' },
            { icon:'⤳', eyebrow:'Orchestration', title:'Workflows & batches', href:'#from-single-jobs-to-workflows',
              text:'Chain dependent steps, fan out with live progress and keep each tenant in order.' },
            { icon:'↩', eyebrow:'Results', title:'Get results back', href:'#get-results-back',
              text:'Await a Job in the same request, or deliver it to a webhook or MQ.' },
            { icon:'⏱', eyebrow:'Schedules', title:'Production schedules', href:'#schedules-you-can-trust',
              text:'Time zones, misfire and overlap policies, run limits and run-now controls.' },
            { icon:'◉', eyebrow:'Observability', title:'See everything', href:'#see-what-your-jobs-are-doing',
              text:'Admin UI, health checks, OpenTelemetry traces and metrics.' },
        ]
        return { items }
    }
}

export default {
    components: {
        AudioPlayer,
        JobsHighlights,
        ClusterSimulator,
        QueueLanes,
        DedupPlayground,
        RetryPlanner,
        WorkflowSimulator,
        BatchSimulator,
        TenantOrdering,
        ResultsDelivery,
        SchedulePillars,
        ObservabilityPillars,
        JobsGuides,
    }
}
