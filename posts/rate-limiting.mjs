import { computed, ref, reactive, onMounted, onUnmounted } from "vue"
import AudioPlayer from '../pages/podcasts/AudioPlayer.mjs'
import FeaturePillars from "./components/FeaturePillars.mjs"
import { Eyebrow } from "./components/BackgroundJobs.mjs"

const statusTone = {
    200: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    429: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
}

/** Send requests to tagged APIs and watch them draw from one shared fixed-window budget */
const RateLimitSimulator = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <div>
          <Eyebrow text="Try it: spend the orders budget" />
          <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">One policy, one budget, every orders API</h3>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Send requests to APIs that share the <code class="font-mono text-indigo-600 dark:text-indigo-400">orders</code> policy.
            Once the window's permits are used, every API in it returns <b>429</b> and its service never runs.
          </p>
        </div>
        <dl class="flex gap-6 text-center">
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Service ran</dt><dd class="text-2xl font-black text-emerald-600">{{stats.ran}}</dd></div>
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Rejected</dt><dd class="text-2xl font-black text-rose-600">{{stats.rejected}}</dd></div>
        </dl>
      </div>

      <div class="px-6 py-5 sm:px-8">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Policies</span>
          <button v-for="m in modes" :key="m.id" type="button" @click="setMode(m.id)"
            :class="['rounded-lg px-3 py-1.5 text-xs font-bold transition', mode === m.id
              ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700']">
            {{m.label}}
          </button>
        </div>

        <div class="mt-4 grid gap-3" :class="buckets.length > 1 ? 'md:grid-cols-3' : ''">
          <div v-for="bucket in buckets" :key="bucket.name" class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div class="flex items-center justify-between font-mono text-xs">
              <span class="font-bold text-slate-900 dark:text-white">{{bucket.name}}</span>
              <span class="text-slate-500 dark:text-slate-400">{{bucket.left}} / {{permitLimit}} permits · resets in {{resetIn}}s</span>
            </div>
            <div class="mt-2 flex gap-1">
              <span v-for="i in permitLimit" :key="i"
                :class="['h-3 flex-1 rounded-sm transition-colors duration-300', i <= bucket.left ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700']"></span>
            </div>
          </div>
        </div>

        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button v-for="api in apis" :key="api.name" type="button" @click="send(api)"
            class="group rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="font-mono text-sm font-bold text-slate-900 dark:text-white">{{api.name}}</div>
            <div class="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">{{api.verb}} {{api.url}}</div>
            <div :class="['mt-3 inline-block rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold', api.binding
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400']">{{api.binding || 'no policy'}}</div>
            <div class="mt-3 text-xs font-bold text-indigo-600 group-hover:underline dark:text-indigo-400">Send request →</div>
          </button>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <button type="button" @click="burst" class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-500">Burst 12 orders requests</button>
          <button type="button" @click="reset" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Reset</button>
        </div>

        <div class="mt-5 rounded-xl bg-slate-950 p-4 font-mono text-xs leading-6">
          <div v-if="!log.length" class="text-slate-500">Send a request to see the response...</div>
          <div v-for="entry in log" :key="entry.id" class="flex flex-wrap items-center gap-x-3">
            <span :class="['rounded px-1.5 font-bold', statusTone[entry.status]]">{{entry.status}}</span>
            <span class="text-slate-300">{{entry.verb}} {{entry.url}}</span>
            <span :class="entry.status === 200 ? 'text-emerald-400' : 'text-rose-400'">{{entry.note}}</span>
          </div>
        </div>
        <p class="mt-3 text-xs text-slate-400">Simulated: a fixed-window limiter with {{permitLimit}} permits every {{windowSecs}}s and no queue.</p>
      </div>
    </section>`,
    setup() {
        const permitLimit = 6
        const windowSecs = 10
        const modes = [
            { id:'shared', label:'One shared orders policy' },
            { id:'separate', label:'A separate policy per API' },
        ]
        const apis = [
            { name:'ListOrders',  verb:'GET',  url:'/api/ListOrders',       binding:'[Tag("orders")]', orders:true },
            { name:'PlaceOrder',  verb:'POST', url:'/api/PlaceOrder',       binding:'[RateLimiting("orders")]', orders:true },
            { name:'CancelOrder', verb:'POST', url:'/api/CancelOrder.json', binding:'[Tag("orders")]', orders:true },
            { name:'GetProfile',  verb:'GET',  url:'/api/GetProfile',       binding:null },
        ]
        const mode = ref('shared')
        const budgets = reactive({})
        const stats = reactive({ ran:0, rejected:0 })
        const log = ref([])
        const windowStart = ref(Date.now())
        const now = ref(Date.now())
        let nextId = 1
        let timer = null
        let burstTimer = null

        const bucketNames = computed(() => mode.value === 'shared'
            ? ['orders']
            : apis.filter(x => x.orders).map(x => x.name.toLowerCase()))
        const buckets = computed(() => bucketNames.value.map(name => ({ name, left: budgets[name] ?? permitLimit })))
        const resetIn = computed(() => Math.max(0, Math.ceil((windowStart.value + windowSecs * 1000 - now.value) / 1000)))

        function bucketFor(api) {
            if (!api.orders) return null
            return mode.value === 'shared' ? 'orders' : api.name.toLowerCase()
        }
        function refill() {
            for (const key of Object.keys(budgets)) delete budgets[key]
            windowStart.value = Date.now()
        }
        function send(api) {
            const bucket = bucketFor(api)
            let status = 200, note = 'service ran'
            if (bucket) {
                const left = budgets[bucket] ?? permitLimit
                if (left > 0) {
                    budgets[bucket] = left - 1
                    note = 'service ran · ' + (left - 1) + ' permits left in ' + bucket
                } else {
                    status = 429
                    note = 'rejected before the service ran'
                }
            } else {
                note = 'service ran · not rate limited'
            }
            status === 200 ? stats.ran++ : stats.rejected++
            log.value.unshift({ id: nextId++, status, note, verb: api.verb, url: api.url })
            log.value = log.value.slice(0, 7)
        }
        function burst() {
            clearInterval(burstTimer)
            let sent = 0
            const orderApis = apis.filter(x => x.orders)
            burstTimer = setInterval(() => {
                send(orderApis[sent % orderApis.length])
                if (++sent >= 12) clearInterval(burstTimer)
            }, 120)
        }
        function reset() {
            clearInterval(burstTimer)
            refill()
            stats.ran = stats.rejected = 0
            log.value = []
        }
        function setMode(id) {
            mode.value = id
            reset()
        }

        onMounted(() => {
            timer = setInterval(() => {
                now.value = Date.now()
                if (now.value - windowStart.value >= windowSecs * 1000) refill()
            }, 200)
        })
        onUnmounted(() => { clearInterval(timer); clearInterval(burstTimer) })

        return { permitLimit, windowSecs, modes, mode, apis, buckets, stats, log, resetIn, statusTone, send, burst, reset, setMode }
    }
}

/** Configure a Request DTO and see which policy ServiceStack resolves, or the startup error it throws */
const PolicyResolver = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <Eyebrow text="Try it: bind a policy" />
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Which policy does an operation get?</h3>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Mix and match the ways to bind a policy to <code class="font-mono text-indigo-600 dark:text-indigo-400">PlaceOrder</code>.
          Ambiguous bindings don't silently pick a winner, they fail when your App starts.
        </p>
      </div>

      <div class="grid gap-6 px-6 py-5 sm:px-8 lg:grid-cols-2">
        <div class="space-y-4 text-sm">
          <div v-for="field in fields" :key="field.key">
            <div class="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">{{field.label}}</div>
            <div class="mt-1.5 flex flex-wrap gap-1.5">
              <button v-for="opt in policyOptions" :key="opt" type="button" @click="state[field.key] = opt"
                :class="['rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition', state[field.key] === opt
                  ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
                {{opt || 'none'}}
              </button>
            </div>
          </div>
          <div>
            <div class="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">[Tag] on the DTO</div>
            <div class="mt-1.5 flex flex-wrap gap-1.5">
              <button v-for="tag in Object.keys(tagBindings)" :key="tag" type="button" @click="toggleTag(tag)"
                :class="['rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition', state.tags.includes(tag)
                  ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
                {{tag}} → {{tagBindings[tag]}}
              </button>
            </div>
          </div>
          <label class="flex items-center gap-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
            <input type="checkbox" v-model="state.disabled" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
            [DisableRateLimiting]
          </label>
        </div>

        <div class="flex flex-col gap-4">
          <pre class="!m-0 flex-1 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200"><span class="text-slate-500">// Program.cs</span>
<span v-for="(tag) in Object.keys(tagBindings)" :key="tag">options.RateLimitTag(<span class="text-amber-300">"{{tag}}"</span>, <span class="text-amber-300">"{{tagBindings[tag]}}"</span>);
</span><span v-if="state.explicit">options.RateLimitOperation&lt;PlaceOrder&gt;(<span class="text-amber-300">"{{state.explicit}}"</span>);
</span>
<span v-for="line in dtoAttrs" :key="line" class="text-sky-300">{{line}}
</span><span class="text-indigo-300">public class</span> PlaceOrder : IPost, IReturn&lt;PlaceOrderResponse&gt; { }</pre>

          <div v-if="result.error" class="rounded-xl border border-rose-300 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/40">
            <div class="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Fails on startup</div>
            <p class="mt-1 font-mono text-xs leading-5 text-rose-800 dark:text-rose-200">InvalidOperationException: {{result.error}}</p>
          </div>
          <div v-else class="rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
            <div class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Resolved</div>
            <p class="mt-1 text-sm text-emerald-900 dark:text-emerald-100">
              <template v-if="result.disabled">Rate limiting is <b>disabled</b> for PlaceOrder, even for a global limiter.</template>
              <template v-else-if="result.policy">PlaceOrder uses the <b class="font-mono">{{result.policy}}</b> policy <span class="text-emerald-700 dark:text-emerald-300">({{result.source}})</span>.</template>
              <template v-else>No policy is bound, so PlaceOrder isn't rate limited.</template>
            </p>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const policyOptions = [null, 'orders', 'checkout']
        const tagBindings = { orders:'orders', billing:'checkout' }
        const fields = [
            { key:'explicit',  label:'options.RateLimitOperation<PlaceOrder>()' },
            { key:'serviceStack', label:'[RateLimiting] on the DTO' },
            { key:'microsoft', label:'[EnableRateLimiting] on the DTO' },
        ]
        const state = reactive({ explicit:null, serviceStack:'orders', microsoft:null, tags:['orders'], disabled:false })

        function toggleTag(tag) {
            const i = state.tags.indexOf(tag)
            i >= 0 ? state.tags.splice(i, 1) : state.tags.push(tag)
        }

        const dtoAttrs = computed(() => [
            ...state.tags.map(tag => '[Tag("' + tag + '")]'),
            state.serviceStack ? '[RateLimiting("' + state.serviceStack + '")]' : null,
            state.microsoft ? '[EnableRateLimiting("' + state.microsoft + '")]' : null,
            state.disabled ? '[DisableRateLimiting]' : null,
        ].filter(Boolean))

        // Mirrors ServiceStackOptions.ResolveRateLimiting()
        const result = computed(() => {
            const { explicit, serviceStack, microsoft, disabled } = state
            if (serviceStack && microsoft && serviceStack !== microsoft)
                return { error:"Operation 'PlaceOrder' has conflicting rate-limiting attributes: '" + serviceStack + "' and '" + microsoft + "'." }
            const attribute = serviceStack || microsoft
            if (explicit && attribute && explicit !== attribute)
                return { error:"Operation 'PlaceOrder' has conflicting rate-limiting bindings: '" + explicit + "' and '" + attribute + "'." }
            if (disabled && (explicit || attribute))
                return { error:"Operation 'PlaceOrder' disables rate limiting but also selects a policy." }
            if (disabled) return { disabled:true }
            if (explicit) return { policy:explicit, source:'RateLimitOperation' }
            if (attribute) return { policy:attribute, source: serviceStack ? '[RateLimiting] attribute' : '[EnableRateLimiting] attribute' }
            const matches = state.tags.map(tag => ({ tag, policy: tagBindings[tag] }))
            const distinct = [...new Set(matches.map(x => x.policy))]
            if (distinct.length > 1)
                return { error:"Operation 'PlaceOrder' has conflicting rate-limiting tags: " + matches.map(x => x.tag + '=' + x.policy).join(', ') }
            return distinct.length
                ? { policy:distinct[0], source:'[Tag("' + matches[0].tag + '")]' }
                : {}
        })

        return { policyOptions, tagBindings, fields, state, toggleTag, dtoAttrs, result }
    }
}

/** The ASP.NET Core limiters a named policy can use */
const LimiterPillars = {
    components: { FeaturePillars },
    template: `<FeaturePillars eyebrow="Choose a limiter" title="The right algorithm for each workload" :pillars="pillars" />`,
    setup() {
        const pillars = [
            { icon:'▦', name:'Fixed window', tagline:'N requests per window',
              summary:'The simplest limiter: a fixed number of permits that all reset at the end of each window. Easy to reason about and to explain to your API consumers.',
              points:['options.AddFixedWindowLimiter()','PermitLimit + Window','Can allow a burst at window edges','Good default for per-user quotas'] },
            { icon:'▤', name:'Sliding window', tagline:'Smoother limits, no edge bursts',
              summary:'Splits the window into segments and recycles permits as each segment slides out, so a client can\'t spend two windows of permits back to back at a window boundary.',
              points:['options.AddSlidingWindowLimiter()','SegmentsPerWindow','Smoother than a fixed window','Good for public APIs'] },
            { icon:'◍', name:'Token bucket', tagline:'Allow bursts, cap the average',
              summary:'Tokens refill at a steady rate up to a maximum, so idle clients can save up for a short burst while their average rate stays capped.',
              points:['options.AddTokenBucketLimiter()','TokenLimit + TokensPerPeriod','Bursty clients, steady average','Good for batch and sync clients'] },
            { icon:'⧗', name:'Concurrency', tagline:'Cap work in flight',
              summary:'Limits how many requests can run at the same time rather than how many arrive, which protects expensive operations like reports, exports and AI calls.',
              points:['options.AddConcurrencyLimiter()','PermitLimit + QueueLimit','Limits parallel work, not rate','Good for expensive operations'] },
        ]
        return { pillars }
    }
}

export default {
    components: {
        AudioPlayer,
        RateLimitSimulator,
        PolicyResolver,
        LimiterPillars,
    }
}
