import WorkflowShowcase from "./components/WorkflowShowcase.mjs"
import SearchEngineMatrix from "./components/SearchEngineMatrix.mjs"

/** Many sources -> one curated File Store (local catalogue + Gemini index) -> two published experiences */
const GeminiPipeline = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/30 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-emerald-600 dark:text-emerald-400">One content pipeline</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Import once, publish two customer experiences</h3>

      <div class="mt-7 text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Content you already maintain</div>
      <div class="mt-3 grid gap-3 sm:grid-cols-3">
        <div v-for="src in sources" :key="src.name"
             class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="mt-0.5 text-lg">{{src.icon}}</span>
          <div>
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{src.name}}</div>
            <div class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{src.text}}</div>
          </div>
        </div>
      </div>

      <div class="flex justify-center py-3 text-2xl text-emerald-400" aria-hidden="true">↓</div>

      <div class="rounded-2xl border-2 border-emerald-500/40 bg-white p-5 shadow-lg shadow-emerald-500/10 dark:bg-slate-900 sm:p-6">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div class="text-base font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">File Store</div>
          <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Previewable sync</span>
          <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Metadata scoped</span>
          <p class="w-full text-sm leading-6 text-slate-500 dark:text-slate-400 lg:w-auto lg:flex-1">
            One curated catalogue. Re-run an import and only what actually changed is indexed again.
          </p>
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
            <div class="text-sm font-bold text-slate-900 dark:text-white">Your App's database</div>
            <ul class="mt-2 flex flex-wrap gap-1.5">
              <li v-for="x in local" :key="x" class="rounded-lg bg-white px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">{{x}}</li>
            </ul>
          </div>
          <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
            <div class="text-sm font-bold text-slate-900 dark:text-white">Gemini File Search index</div>
            <ul class="mt-2 flex flex-wrap gap-1.5">
              <li v-for="x in remote" :key="x" class="rounded-lg bg-white px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">{{x}}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex justify-center py-3 text-2xl text-emerald-400" aria-hidden="true">↓</div>

      <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Published to any website</div>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <div v-for="out in outputs" :key="out.name" :class="['rounded-xl border p-5 shadow-sm', out.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{out.icon}}</span>
            <div class="text-base font-bold text-slate-900 dark:text-white">{{out.name}}</div>
          </div>
          <div class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{out.text}}</div>
          <code class="mt-4 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-200 dark:bg-black/50">&lt;script src="…/{{out.widget}}"&gt;</code>
        </div>
      </div>
    </section>`,
    setup() {
        const sources = [
            { icon:'📄', name:'Files & ZIPs', text:'PDF, Markdown, HTML, CSV, JSON, YAML - ZIP folders become categories' },
            { icon:'📁', name:'Folders & repos', text:'Maintained docs folders, saved and re-runnable' },
            { icon:'🌐', name:'Website crawl', text:'Extracted to Markdown you can clean before anything is sent' },
        ]
        const local  = ['Document catalogue','Metadata & categories','Search sections','Imports & conversations']
        const remote = ['Embedded copies','Semantic retrieval','Metadata filters','Grounded citations']
        const outputs = [
            { icon:'💬', name:'Website Assistant', widget:'assistants/widget.js', accent:'border-indigo-200 bg-indigo-50/60 dark:border-indigo-800 dark:bg-indigo-950/40',
              text:'Grounded, citation-backed answers from your approved content.' },
            { icon:'⌘K', name:'Website Search', widget:'searches/widget.js', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30',
              text:'Instant results from your own RDBMS - no model, no per-query cost.' },
        ]
        return { sources, local, remote, outputs }
    }
}

/** The repeatable knowledge lifecycle */
const GeminiWorkflow = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="A repeatable content supply chain" title="From existing content to answers customers can verify" :steps="steps" />`,
    setup() {
        const steps = [
            { name:'Import', caption:'Files, folders, websites', title:'Bring content in the way that suits each source', tags:['ZIP & folders','Web crawl','Resumable'],
              description:'Upload files and ZIPs, synchronize a maintained documentation folder, or crawl a site into a private Markdown workspace you can inspect and clean before anything is sent to Gemini. Pending uploads survive App restarts and continue from the local catalogue.' },
            { name:'Preview', caption:'Before anything changes', title:'See exactly what an import will do', tags:['New / changed','Metadata-only','Removed'],
              description:'Folder and website imports are previewed first, identifying new, changed, metadata-only, unchanged and removed documents. Embedding work and destructive changes are visible before they are applied - and unchanged documents are never re-embedded.' },
            { name:'Curate', caption:'Metadata & Explorer', title:'Make retrieval precise instead of merely large', tags:['Category & status','Locale & version','Coverage reports'],
              description:'Every document carries category, type, status, locale, product, versions, tags and a canonical Source URL. The Explorer turns that metadata into navigable categories, filters and coverage reports - and the same server-generated filter is what Gemini File Search receives.' },
            { name:'Publish', caption:'Assistant + Search', title:'Two public experiences, one script tag each', tags:['Shadow DOM','Server-enforced','Branded'],
              description:'Publish a citation-backed Website Assistant and a model-free Website Search from the same curated documents. Retrieval rules, private prompts, model choice, allowed origins and rate limits stay on the server where the host page cannot weaken them.' },
            { name:'Learn', caption:'Searches & conversations', title:'Close the loop with what customers actually ask', tags:['No-result searches','Conversation review','Gaps'],
              description:'No-result searches point straight at the documentation you have not written yet, and retained Assistant conversations show how well the answers held up. Improve the source material and the next synchronized import improves every experience grounded in it.' },
        ]
        return { steps }
    }
}

/** Assistant vs Search - two experiences from the same documents */
const TwoExperiences = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-emerald-600 dark:text-emerald-400">Same documents, two jobs</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Choose the experience each visitor needs - or ship both</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          They can share a page: Search keeps <kbd class="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">⌘K</kbd>
          and the Assistant automatically moves to <kbd class="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">⌘⇧K</kbd>.
        </p>
      </div>
      <div class="grid gap-px bg-slate-200 dark:bg-slate-700 sm:grid-cols-2">
        <div v-for="col in columns" :key="col.name" class="bg-white p-6 dark:bg-slate-900 sm:p-8">
          <div class="flex items-center gap-3">
            <span :class="['flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black', col.tint]">{{col.icon}}</span>
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">{{col.name}}</div>
              <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{col.tagline}}</div>
            </div>
          </div>
          <dl class="mt-6 space-y-3">
            <div v-for="row in col.rows" :key="row.label" class="flex items-baseline justify-between gap-4 border-b border-dashed border-slate-200 pb-3 dark:border-slate-700">
              <dt class="shrink-0 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{row.label}}</dt>
              <dd class="text-right text-sm font-semibold text-slate-800 dark:text-slate-200">{{row.value}}</dd>
            </div>
          </dl>
          <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{col.summary}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const columns = [
            { icon:'💬', name:'Website Assistant', tagline:'Grounded answers', tint:'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300',
              rows:[
                { label:'Answered by', value:'Gemini, grounded in your index' },
                { label:'Returns', value:'Written answer + citations' },
                { label:'Per-query cost', value:'Gemini usage' },
                { label:'Best for', value:'“Why doesn’t this work?”' },
                { label:'Scope', value:'Server-enforced metadata filter' },
              ],
              summary:'For questions whose answer is spread across several documents, or isn’t written down as a single page. Every claim keeps the sources behind it, so readers can check the evidence instead of trusting the model.' },
            { icon:'⌘K', name:'Website Search', tagline:'Instant navigation', tint:'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300',
              rows:[
                { label:'Answered by', value:'Your own RDBMS' },
                { label:'Returns', value:'Ranked document sections' },
                { label:'Per-query cost', value:'None - no model involved' },
                { label:'Best for', value:'“Take me to that page”' },
                { label:'Scope', value:'Same imported documents' },
              ],
              summary:'For visitors who already know what they’re looking for. Queries never reach a model, never incur usage costs and never leave your App - so it stays fast and free no matter how much traffic it gets.' },
        ]
        return { columns }
    }
}

/** What stays in your App vs what lives in Gemini */
const DataOwnership = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="side in sides" :key="side.title" :class="['rounded-2xl border p-6 shadow-sm sm:p-7', side.accent]">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-lg font-black shadow-sm dark:bg-slate-900/70">{{side.icon}}</span>
          <div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{{side.title}}</div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{side.tagline}}</div>
          </div>
        </div>
        <ul class="mt-5 grid gap-2 sm:grid-cols-2">
          <li v-for="item in side.items" :key="item"
              class="flex items-start gap-2 rounded-xl bg-white/80 px-3.5 py-2.5 text-sm leading-6 text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">
            <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{item}}</span>
          </li>
        </ul>
        <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{side.text}}</p>
      </div>
    </section>`,
    setup() {
        const sides = [
            { icon:'🗄', title:'Stays in your App', tagline:'OrmLite database + file storage',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30',
              items:['Authoritative document catalogue','Original source files','Saved imports & sync history','Document metadata & categories','Search index sections','Assistants & customer conversations'],
              text:'This is the copy you back up, query, export and keep - in the same database and security boundary as the rest of your App.' },
            { icon:'☁', title:'Lives in the Gemini File Store', tagline:'Semantic retrieval only',
              accent:'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40',
              items:['Indexed document copies','Embeddings for semantic search','Metadata used for filtering','Retrieved excerpts for citations'],
              text:'Synchronization reports reconcile the two - detecting local/remote drift, missing documents and duplicate indexed copies - so administrators can push intentional changes and prune duplicates.' },
        ]
        return { sides }
    }
}

/** What Google charges for with Gemini File Search */
const StorageEconomics = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-3">
      <div v-for="card in cards" :key="card.title" :class="['rounded-2xl border p-5 shadow-sm', card.accent]">
        <div class="flex items-center gap-2.5">
          <span class="text-lg">{{card.icon}}</span>
          <div class="font-bold text-slate-900 dark:text-white">{{card.title}}</div>
        </div>
        <div :class="['mt-3 text-2xl font-black', card.priceTint]">{{card.price}}</div>
        <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{card.text}}</p>
      </div>
    </section>`,
    setup() {
        const cards = [
            { icon:'🧮', title:'Indexing documents', price:'Charged', priceTint:'text-amber-600 dark:text-amber-400',
              accent:'border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20',
              text:'Embeddings are billed when a document is indexed. Content-addressed deduplication means the same document uploaded twice is indexed once.' },
            { icon:'🗄', title:'Storage & embedding', price:'Free', priceTint:'text-emerald-600 dark:text-emerald-400',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20',
              text:'No recurring vector-database bill. Stores persist until you delete them, with project capacity scaling by usage tier.' },
            { icon:'💬', title:'Retrieved tokens', price:'Model context', priceTint:'text-indigo-600 dark:text-indigo-400',
              accent:'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/20',
              text:'Billed as normal model context when a question actually retrieves them - so you pay when content is indexed and when users ask.' },
        ]
        return { cards }
    }
}

export default {
    components: {
        GeminiPipeline,
        GeminiWorkflow,
        TwoExperiences,
        DataOwnership,
        StorageEconomics,
        SearchEngineMatrix,
    }
}
