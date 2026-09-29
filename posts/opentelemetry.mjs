import { computed, ref, reactive } from "vue"
import AudioPlayer from '../pages/podcasts/AudioPlayer.mjs'
import FeaturePillars from "./components/FeaturePillars.mjs"
import { Eyebrow } from "./components/BackgroundJobs.mjs"

const traceId = '4bf92f3577b34da6a3ce929d0e0e4736'

const serverTone = {
    'web-1': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    'worker-2': 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    'worker-3': 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
}

const sourceTone = {
    'Microsoft.AspNetCore': 'bg-slate-400',
    'ServiceStack': 'bg-indigo-500',
    'System.Net.Http': 'bg-amber-500',
    'ServiceStack.Messaging': 'bg-sky-500',
    'ServiceStack.Jobs': 'bg-violet-500',
}

/** One order placed on web-1, finished by a message on worker-2 and a Job retried on worker-3 */
const spans = [
    { id:'00f067aa0ba902b7', parent:null, name:'POST /orders', source:'Microsoft.AspNetCore', kind:'server', server:'web-1', start:0, duration:182,
      attrs:{ 'http.request.method':'POST', 'http.route':'/orders', 'http.response.status_code':201 } },
    { id:'53995c3f42cd8ad8', parent:'00f067aa0ba902b7', name:'ServiceStack PlaceOrder', source:'ServiceStack', kind:'internal', server:'web-1', start:3, duration:176,
      attrs:{ 'servicestack.operation':'PlaceOrder', 'http.request.method':'POST', 'http.route':'/orders', 'http.response.status_code':201, 'servicestack.outcome':'success' } },
    { id:'a3ce929d0e0e4736', parent:'53995c3f42cd8ad8', name:'POST', source:'System.Net.Http', kind:'client', server:'web-1', start:18, duration:124,
      attrs:{ 'http.request.method':'POST', 'server.address':'payments.example.org', 'http.response.status_code':200 } },
    { id:'b7ad6b7169203331', parent:'53995c3f42cd8ad8', name:'send mq:SendOrderEmail.inq', source:'ServiceStack.Messaging', kind:'producer', server:'web-1', start:148, duration:9,
      attrs:{ 'messaging.system':'rabbitmq', 'messaging.operation.type':'send', 'messaging.destination.name':'mq:SendOrderEmail.inq', 'messaging.message.id':'7d3f…e21a' } },
    { id:'e457b5a2e4d86bd1', parent:'b7ad6b7169203331', name:'process mq:SendOrderEmail.inq', source:'ServiceStack.Messaging', kind:'consumer', server:'worker-2', start:171, duration:96,
      attrs:{ 'messaging.system':'rabbitmq', 'messaging.operation.type':'process', 'messaging.destination.name':'mq:SendOrderEmail.inq', 'messaging.message.id':'7d3f…e21a' } },
    { id:'c1f0b3a9d6e28f14', parent:'e457b5a2e4d86bd1', name:'POST', source:'System.Net.Http', kind:'client', server:'worker-2', start:184, duration:71,
      attrs:{ 'http.request.method':'POST', 'server.address':'mail.example.org', 'http.response.status_code':202 } },
    { id:'9a4c21e7b05d3f86', parent:'53995c3f42cd8ad8', name:'FulfilOrderCommand', source:'ServiceStack.Jobs', kind:'consumer', server:'worker-3', start:212, duration:64, error:true,
      attrs:{}, note:'Attempt 1 timed out. The Job continues the trace stored in BackgroundJob.TraceId when PlaceOrder queued it.' },
    { id:'2d8e7f10c4b9a653', parent:'53995c3f42cd8ad8', name:'FulfilOrderCommand', source:'ServiceStack.Jobs', kind:'consumer', server:'worker-3', start:318, duration:88,
      attrs:{}, note:'The retry continues the same trace, long after the API returned, and would do the same if another server recovered it.' },
]

/** What the same order looks like without a trace: one log file per server, nothing to join them */
const logs = {
    'web-1': [
        '12:04:31.118 INF POST /orders 201 182ms',
        '12:04:31.260 INF Charge accepted',
        '12:04:31.268 INF Published SendOrderEmail',
    ],
    'worker-2': [
        '12:04:31.289 INF Processing SendOrderEmail',
        '12:04:31.377 INF Email accepted (202)',
    ],
    'worker-3': [
        '12:04:31.394 ERR FulfilOrderCommand failed: TimeoutException',
        '12:04:31.498 INF FulfilOrderCommand completed',
    ],
}

/** Explore a distributed trace that follows one API request across three servers */
const TraceExplorer = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <div>
          <Eyebrow text="Try it: follow one order" />
          <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">One request, three servers, one trace</h3>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            <code class="font-mono text-indigo-600 dark:text-indigo-400">PlaceOrder</code> charges a card, publishes a message
            and queues a Job. Compare what you have to work with before and after OpenTelemetry, then click any span to see what it carries.
          </p>
        </div>
        <div class="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button v-for="m in modes" :key="m.id" type="button" @click="mode = m.id"
            :class="['rounded-md px-3 py-1.5 text-xs font-bold transition', mode === m.id
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200']">{{m.label}}</button>
        </div>
      </div>

      <div v-if="mode === 'logs'" class="px-6 py-5 sm:px-8">
        <div class="grid gap-3 md:grid-cols-3">
          <div v-for="(lines, server) in logs" :key="server" class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60">
              <span :class="['rounded px-1.5 py-0.5 font-mono text-[11px] font-bold', serverTone[server]]">{{server}}</span>
              <span class="font-mono text-[11px] text-slate-400">/var/log/app.log</span>
            </div>
            <div class="bg-slate-950 p-3 font-mono text-[11px] leading-5">
              <div v-for="line in lines" :key="line" :class="line.includes(' ERR ') ? 'text-rose-400' : 'text-slate-300'">{{line}}</div>
            </div>
          </div>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Which charge sent which email? Did the failed <code class="font-mono">FulfilOrderCommand</code> belong to this order?
          With a few requests a second, you're matching timestamps across servers and hoping.
        </p>
        <button type="button" @click="mode = 'trace'" class="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-500">See it as one trace →</button>
      </div>

      <div v-else class="px-6 py-5 sm:px-8">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-slate-500 dark:text-slate-400">
          <span>Trace Id <b class="text-slate-900 dark:text-white">{{traceId}}</b></span>
          <span>{{spans.length}} spans · 3 servers · {{total}}ms</span>
        </div>

        <div class="mt-4 space-y-1">
          <button v-for="span in rows" :key="span.id" type="button" @click="selectedId = span.id"
            :class="['grid w-full grid-cols-[minmax(0,1fr)] items-center gap-2 rounded-lg px-2 py-1.5 text-left transition sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]', selectedId === span.id
              ? 'bg-indigo-50 ring-1 ring-indigo-200 dark:bg-indigo-950/50 dark:ring-indigo-800'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60']">
            <div class="flex min-w-0 items-center gap-2" :style="{ paddingLeft: (span.depth * 14) + 'px' }">
              <span :class="['h-2 w-2 shrink-0 rounded-full', sourceTone[span.source]]"></span>
              <span :class="['truncate font-mono text-xs font-semibold', span.error ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200']">{{span.name}}</span>
              <span :class="['shrink-0 rounded px-1 font-mono text-[10px] font-bold', serverTone[span.server]]">{{span.server}}</span>
            </div>
            <div class="relative h-5 rounded bg-slate-100 dark:bg-slate-800">
              <div :class="['absolute inset-y-0.5 rounded', span.error ? 'bg-rose-500' : sourceTone[span.source]]"
                   :style="{ left: pct(span.start), width: 'max(3px,' + pct(span.duration) + ')' }"></div>
              <span class="absolute inset-y-0 flex items-center font-mono text-[10px] text-slate-500 dark:text-slate-400"
                    :style="{ left: 'calc(' + pct(span.start + span.duration) + ' + 6px)' }">{{span.duration}}ms</span>
            </div>
          </button>
        </div>

        <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span v-for="(tone, source) in sourceTone" :key="source" class="flex items-center gap-1.5">
            <span :class="['h-2 w-2 rounded-full', tone]"></span><span class="font-mono">{{source}}</span>
          </span>
        </div>

        <div v-if="selected" class="mt-5 grid gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div class="flex items-center gap-2">
              <span :class="['h-2.5 w-2.5 rounded-full', sourceTone[selected.source]]"></span>
              <h4 class="font-mono text-sm font-bold text-slate-900 dark:text-white">{{selected.name}}</h4>
            </div>
            <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
              <dt class="text-slate-400">Source</dt><dd class="font-mono text-slate-700 dark:text-slate-300">{{selected.source}}</dd>
              <dt class="text-slate-400">Kind</dt><dd class="font-mono text-slate-700 dark:text-slate-300">{{selected.kind}}</dd>
              <dt class="text-slate-400">Server</dt><dd class="font-mono text-slate-700 dark:text-slate-300">{{selected.server}}</dd>
              <dt class="text-slate-400">Span Id</dt><dd class="font-mono text-slate-700 dark:text-slate-300">{{selected.id}}</dd>
              <dt class="text-slate-400">Parent</dt><dd class="font-mono text-slate-700 dark:text-slate-300">{{selected.parent ?? '(root)'}}</dd>
              <dt class="text-slate-400">Status</dt>
              <dd :class="['font-mono font-bold', selected.error ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400']">{{selected.error ? 'Error' : 'Ok'}}</dd>
            </dl>
            <p v-if="selected.note" class="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">{{selected.note}}</p>
            <p v-if="selected.kind === 'producer'" class="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
              The message's <code class="font-mono">Meta</code> carries
              <code class="break-all font-mono text-indigo-600 dark:text-indigo-400">traceparent: 00-{{traceId}}-{{selected.id}}-01</code>,
              so worker-2 continues this trace.
            </p>
          </div>
          <table class="w-full self-start text-left text-xs">
            <thead><tr class="text-slate-400"><th class="pb-1 font-semibold">Attribute</th><th class="pb-1 font-semibold">Value</th></tr></thead>
            <tbody>
              <tr v-if="!Object.keys(selected.attrs).length"><td colspan="2" class="py-1 text-slate-400">See the Background Jobs metrics for Job durations, retries and failures</td></tr>
              <tr v-for="(value, key) in selected.attrs" :key="key" class="border-t border-slate-100 dark:border-slate-800">
                <td class="py-1 pr-3 font-mono text-slate-500 dark:text-slate-400">{{key}}</td>
                <td class="py-1 font-mono font-semibold text-slate-800 dark:text-slate-200">{{value}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-3 text-xs text-slate-400">Illustrative trace, as it would appear in a backend like Jaeger or the Aspire Dashboard.</p>
      </div>
    </section>`,
    setup() {
        const modes = [
            { id:'logs', label:'Without tracing' },
            { id:'trace', label:'With OpenTelemetry' },
        ]
        const mode = ref('logs')
        const selectedId = ref(spans[1].id)
        const total = Math.max(...spans.map(x => x.start + x.duration))
        const depthOf = span => span.parent ? depthOf(spans.find(x => x.id === span.parent)) + 1 : 0
        const rows = spans.map(x => ({ ...x, depth: depthOf(x) }))
        const selected = computed(() => rows.find(x => x.id === selectedId.value))
        const pct = ms => (ms / total * 88).toFixed(2) + '%'
        return { modes, mode, logs, rows, spans, selectedId, selected, total, pct, traceId, serverTone, sourceTone }
    }
}

const outcomeTone = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    client_error: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    error: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

/** Send responses through ServiceStack's outcome rules and watch which ones reach the error metric */
const OutcomeClassifier = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <div>
          <Eyebrow text="Try it: what counts as an error?" />
          <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Alerts for your failures, not your users' typos</h3>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Send <code class="font-mono text-indigo-600 dark:text-indigo-400">GetOrder</code> requests that end in different ways.
            Only server failures set the span status to Error and add to <code class="font-mono text-indigo-600 dark:text-indigo-400">servicestack.operation.errors</code>.
          </p>
        </div>
        <dl class="flex gap-6 text-center">
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Requests</dt><dd class="text-2xl font-black text-slate-900 dark:text-white">{{count}}</dd></div>
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Errors</dt><dd :class="['text-2xl font-black', errors ? 'text-rose-600' : 'text-slate-300 dark:text-slate-600']">{{errors}}</dd></div>
        </dl>
      </div>

      <div class="px-6 py-5 sm:px-8">
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button v-for="r in responses" :key="r.label" type="button" @click="send(r)"
            class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="font-mono text-sm font-bold text-slate-900 dark:text-white">{{r.status ?? '—'}}</div>
            <div class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{r.label}}</div>
          </button>
        </div>

        <div class="mt-5 grid gap-2 sm:grid-cols-4">
          <div v-for="(tone, outcome) in outcomeTone" :key="outcome" class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <span :class="['rounded px-1.5 py-0.5 font-mono text-[11px] font-bold', tone]">{{outcome}}</span>
              <span class="font-mono text-sm font-bold text-slate-900 dark:text-white">{{tally[outcome]}}</span>
            </div>
            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div :class="['h-full rounded-full transition-all duration-300', barTone[outcome]]" :style="{ width: count ? (tally[outcome] / count * 100) + '%' : '0%' }"></div>
            </div>
          </div>
        </div>

        <div class="mt-5 rounded-xl bg-slate-950 p-4 font-mono text-xs leading-6">
          <div v-if="!log.length" class="text-slate-500">Send a request to see the span it records...</div>
          <div v-for="entry in log" :key="entry.id" class="flex flex-wrap items-center gap-x-3">
            <span class="text-slate-300">GET {{entry.url}}</span>
            <span class="text-slate-500">http.route=/orders/{Id}</span>
            <span :class="['rounded px-1.5 font-bold', outcomeTone[entry.outcome]]">{{entry.outcome}}</span>
            <span :class="entry.outcome === 'error' ? 'text-rose-400' : entry.outcome === 'cancelled' ? 'text-slate-400' : 'text-emerald-400'">status={{entry.spanStatus}}</span>
            <span v-if="entry.exception" class="text-rose-400">exception.type={{entry.exception}}</span>
          </div>
        </div>
        <p class="mt-3 text-xs text-slate-400">
          Every request is tagged with the route template, not the raw URL, so <code class="font-mono">/orders/1042</code> and
          <code class="font-mono">/orders/7</code> share one metric series.
        </p>
      </div>
    </section>`,
    setup() {
        const responses = [
            { status:200, label:'Order found', outcome:'success', spanStatus:'Ok' },
            { status:400, label:'Validation failed', outcome:'client_error', spanStatus:'Ok' },
            { status:401, label:'Not signed in', outcome:'client_error', spanStatus:'Ok' },
            { status:404, label:'No such order', outcome:'client_error', spanStatus:'Ok' },
            { status:500, label:'Database unavailable', outcome:'error', spanStatus:'Error', exception:'SqlException' },
            { status:500, label:'Unhandled exception', outcome:'error', spanStatus:'Error', exception:'NullReferenceException' },
            { status:503, label:'Downstream service down', outcome:'error', spanStatus:'Error', exception:'HttpRequestException' },
            { status:null, label:'Client disconnected', outcome:'cancelled', spanStatus:'Unset' },
        ]
        const barTone = { success:'bg-emerald-500', client_error:'bg-amber-500', error:'bg-rose-500', cancelled:'bg-slate-400' }
        const tally = reactive({ success:0, client_error:0, error:0, cancelled:0 })
        const log = ref([])
        let nextId = 0
        const count = computed(() => Object.values(tally).reduce((a, b) => a + b, 0))
        const errors = computed(() => tally.error)
        function send(r) {
            tally[r.outcome]++
            const id = ++nextId
            log.value = [{ id, url:`/orders/${1000 + Math.floor(Math.random() * 9000)}`, ...r }, ...log.value].slice(0, 6)
        }
        return { responses, outcomeTone, barTone, tally, log, count, errors, send }
    }
}

/** Where ServiceStack carries the trace */
const TracePillars = {
    components: { FeaturePillars },
    template: `<FeaturePillars eyebrow="End to end" title="Every hop joins the same trace" :pillars="pillars" />`,
    setup() {
        const pillars = [
            { icon:'⚡', name:'API operations', tagline:'One span per API, inside the HTTP span',
              summary:'Each request to a known API gets a ServiceStack {Operation} span nested under ASP.NET Core\'s HTTP server span. ServiceStack adds its detail to the request instead of creating a second, duplicate HTTP span.',
              points:['Tagged with Request DTO and route template','Status code and outcome on every span','No request bodies, user ids or exception messages','Opt-in detailed spans for filters and AutoQuery'] },
            { icon:'✉', name:'Messages', tagline:'Background MQ, Redis MQ and RabbitMQ',
              summary:'Publishing a message records a send span and writes the W3C traceparent and tracestate into the message\'s Meta. Whichever server processes it continues the same trace with a process span.',
              points:['send {queue} producer spans','process {queue} consumer spans','Sent as headers by RabbitMQ','Your own Meta entries are preserved'] },
            { icon:'⚙', name:'Background Jobs', tagline:'Continue the trace, hours later',
              summary:'A Job stores the trace of the request that queued it in the BackgroundJob.TraceId column, and each execution continues it, including retries and Jobs recovered by another server after a crash or deploy.',
              points:['A consumer span per execution','Survives retries and recovery','Jobs queued before upgrading start a new trace','Joined by the Background Jobs metrics'] },
            { icon:'↗', name:'Outbound HTTP', tagline:'Traced by .NET itself',
              summary:'Calls to other services are traced by .NET\'s own HttpClient instrumentation, which also passes the trace on, so services you call that use OpenTelemetry join the same trace too.',
              points:['AddHttpClientInstrumentation()','Includes ServiceStack\'s JsonApiClient','Propagates traceparent downstream','Shows exactly where time went'] },
        ]
        return { pillars }
    }
}

export default {
    components: {
        AudioPlayer,
        TraceExplorer,
        OutcomeClassifier,
        TracePillars,
    }
}
