import { computed, ref } from "vue"
import CodeCompare from "./components/CodeCompare.mjs"

/** One typed C# expression -> each database's native JSON functions */
const JsonPortability = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Write once, run on four databases</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">The same typed query, every provider’s native JSON</h3>
      </div>

      <div class="px-6 pt-6 sm:px-8">
        <pre class="overflow-x-auto rounded-xl bg-slate-900 p-4 text-[13px] leading-6 text-slate-200 dark:bg-black/50"><code class="nohighlight">db.From&lt;OrderEvent&gt;().Where(x =&gt;
    <span class="text-sky-300">Sql.Json</span>&lt;OrderDocument&gt;(x.Data).Customer.Address.State == <span class="text-emerald-300">"WA"</span>)</code></pre>
      </div>

      <div class="px-6 pb-6 pt-5 sm:px-8">
        <div class="flex flex-wrap gap-2">
          <button v-for="(db,index) in databases" :key="db.name" type="button" @click="selected=index"
            :class="['rounded-full px-4 py-2 text-sm font-semibold transition', selected === index
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
            {{db.name}}
          </button>
        </div>

        <div class="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              <tr><th class="px-4 py-2.5 font-bold">Operation</th><th class="px-4 py-2.5 font-bold">{{active.name}} translates to</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-for="(op,i) in operations" :key="op" class="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/30">
                <td class="px-4 py-2.5 text-slate-600 dark:text-slate-300">{{op}}</td>
                <td class="px-4 py-2.5">
                  <code v-if="active.fns[i] !== '-'" class="rounded bg-slate-900 px-2 py-1 text-xs text-sky-300 dark:bg-black/50">{{active.fns[i]}}</code>
                  <span v-else class="text-xs italic text-slate-400 dark:text-slate-500">not supported</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Your C# never names any of these. Change database and the query compiles and runs unchanged -
          and refactoring <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">OrderDocument</code>
          updates the query with it.
        </p>
      </div>
    </section>`,
    setup() {
        const operations = ['Validate JSON','Read a scalar','Read an object or array','Path exists','Read a value’s type','Array length','Array membership','Document containment']
        const databases = [
            { name:'SQLite',      fns:['json_valid','json_extract','json_extract','json_type','json_type','json_array_length','json_each','-'] },
            { name:'PostgreSQL',  fns:['IS JSON','jsonb_path_query_first','jsonb_path_query_first','jsonb_path_exists','jsonb_typeof','jsonb_array_length','jsonb containment','@>'] },
            { name:'SQL Server',  fns:['ISJSON','JSON_VALUE','JSON_QUERY','JSON_PATH_EXISTS','OPENJSON','OPENJSON','OPENJSON','-'] },
            { name:'MySQL',       fns:['JSON_VALID','JSON_EXTRACT','JSON_EXTRACT','JSON_CONTAINS_PATH','JSON_TYPE','JSON_LENGTH','JSON_CONTAINS','JSON_CONTAINS'] },
        ]
        const selected = ref(0)
        const active = computed(() => databases[selected.value])
        return { operations, databases, selected, active }
    }
}

/** Typed expression vs explicit path - when to use which */
const JsonApiChoice = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="a in apis" :key="a.name" :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', a.accent]">
        <div class="flex items-start justify-between gap-3">
          <code class="min-w-0 break-words text-base font-bold text-slate-900 dark:text-white">{{a.name}}</code>
          <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', a.tint]">{{a.badge}}</span>
        </div>
        <pre class="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-5 text-slate-200 dark:bg-black/50"><code class="nohighlight">{{a.code}}</code></pre>
        <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{a.text}}</p>
        <p class="mt-3 border-t border-black/5 pt-2.5 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
          <b class="text-slate-700 dark:text-slate-200">Use when:</b> {{a.when}}
        </p>
      </div>
    </section>`,
    setup() {
        const apis = [
            { name:'Sql.Json<T>()', badge:'preferred',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              code:'Sql.Json<OrderDocument>(x.Data)\n   .Customer.Address.State == "WA"',
              text:'Ordinary C# member access, collection membership and array indexes, translated into each database’s native JSON functions.',
              when:'The document has a C# Data Model - so a rename refactors the query with it.' },
            { name:'Sql.JsonValue / JsonQuery', badge:'dynamic',
              tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              code:'Sql.JsonValue<string>(x.Data,\n  "$.Customer.Address.shipping_state") == "WA"',
              text:'An explicit SQL/JSON path, evaluated at runtime.',
              when:'There is no Data Model, the path is chosen at runtime, or you need path existence and type inspection.' },
        ]
        return { apis }
    }
}

/** Version requirements and the one operation that isn't universal */
const JsonSupport = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Portable, with one exception</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What each database needs</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="db in databases" :key="db.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="'background:' + db.color"></span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{db.name}}</div>
          </div>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Recommended</div>
          <div class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{{db.version}}</div>
          <p class="mt-2 flex-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{db.note}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Every operation works on all four except <code>Sql.JsonContains()</code></b>,
        which needs PostgreSQL or MySQL. Calling an unsupported one throws
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">NotSupportedException</code> while the
        expression is being built - rather than emitting SQL that quietly means something else.
      </p>
    </section>`,
    setup() {
        const databases = [
            { name:'SQLite', color:'#0f80cc', version:'Current, with JSON', note:'Uses SQLite’s built-in json_* functions.' },
            { name:'PostgreSQL', color:'#336791', version:'16+', note:'IS JSON for validation; jsonb and SQL/JSON paths elsewhere.' },
            { name:'SQL Server', color:'#cc2927', version:'2022+', note:'JsonExists() and full value validation need 2022; 2016-2019 support the rest.' },
            { name:'MySQL', color:'#00758f', version:'8.0+', note:'Uses MySQL’s native JSON_* functions.' },
        ]
        return { databases }
    }
}

/** Save() vs Upsert() */
const UpsertCompare = {
    components: { CodeCompare },
    template: `<CodeCompare eyebrow="One row, one statement" title="Insert-or-update without the round trip"
        description="Save() asks the database whether the row exists, then inserts or updates it. Upsert() expresses the intent directly and lets the database resolve the conflict in a single native statement."
        :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name:'Insert or update',
              left: { label:'Before - Save()', badge:'2 statements', lang:'csharp', code:`
                    // SELECT to discover whether Id=1 exists,
                    // then INSERT or UPDATE accordingly
                    db.Save(customer);

                    // Another writer can insert Id=1 between
                    // the two statements
              ` },
              right:{ label:'v10.2 - Upsert()', badge:'1 statement', lang:'csharp', code:`
                    // ON CONFLICT / MERGE / ON DUPLICATE KEY
                    // resolved natively by the database
                    db.Upsert(customer);

                    // No existence query, no race window
              ` },
              footnote:'Native single-statement conflict handling on SQLite, PostgreSQL, SQL Server and MySQL/MariaDB.' },
            { name:'Update selected fields',
              left: { label:'The problem', lang:'csharp', code:`
                    // A full upsert would overwrite fields owned
                    // by another part of the application
                    customer.InternalNotes = null; // clobbered
              ` },
              right:{ label:'updateOnly', lang:'csharp', code:`
                    // New rows still insert every insertable field,
                    // existing rows only update these
                    db.Upsert(customer,
                        updateOnly: x => new { x.Name, x.Email });
              ` },
              footnote:'Primary Key and RowVersion fields can’t be updated and [IgnoreOnUpdate] properties stay excluded. A string field-name overload covers field sets chosen at runtime.' },
            { name:'Batches & async',
              left: { label:'Many rows', lang:'csharp', code:`
                    db.UpsertAll(customers);

                    db.UpsertAll(customers,
                        updateOnly: x => new { x.Name, x.Email });
              ` },
              right:{ label:'Async equivalents', lang:'csharp', code:`
                    await db.UpsertAsync(customer,
                        token: cancellationToken);

                    await db.UpsertAllAsync(customers,
                        token: cancellationToken);
              ` },
              footnote:'UpsertAll inserts and updates together in a transaction. Every single-row, batch, typed-field and runtime-field API has an async equivalent with optional CancellationToken support.' },
        ]
        return { tabs }
    }
}

/** Upsert vs Save vs Insert vs Update, as a decision */
const WriteChooser = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Four ways to write a row</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Which one do you actually want?</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The difference is what you know about the row before you write it - and what should happen when you’re wrong.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="a in apis" :key="a.name" :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', a.accent]">
          <div class="flex items-start justify-between gap-3">
            <code class="min-w-0 break-words text-base font-bold text-slate-900 dark:text-white">{{a.name}}</code>
            <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', a.tint]">{{a.statements}}</span>
          </div>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">You know</div>
          <p class="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{{a.knows}}</p>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Reach for it when</div>
          <p class="mt-1 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{a.when}}</p>
        </div>
      </div>

      <p class="mt-4 flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50/60 px-4 py-3.5 text-sm leading-6 text-slate-700 dark:border-amber-800 dark:bg-amber-950/25 dark:text-slate-200">
        <span class="mt-0.5 shrink-0 text-lg" aria-hidden="true">⚠</span>
        <span><b class="text-slate-900 dark:text-white">Upsert is not optimistic concurrency.</b> It converges on your
        value regardless of what changed underneath it. If a write must <i>fail</i> when someone else has touched the
        row, use a <a href="https://docs.servicestack.net/ormlite/optimistic-concurrency" class="font-semibold underline decoration-dotted">RowVersion</a>
        field instead.</span>
      </p>
    </section>`,
    setup() {
        const apis = [
            { name:'Upsert', statements:'1 statement',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              knows:'The primary key - but not whether the row exists yet.',
              when:'Imports, synchronization, event handlers and retryable jobs that should converge on the same row. The database resolves the conflict atomically.' },
            { name:'Save', statements:'2 statements',
              tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              knows:'The same as Upsert, but checks first.',
              when:'You need its higher-level behavior - particularly saving [Reference] data with references:true, which Upsert doesn’t do.' },
            { name:'Insert', statements:'1 statement',
              tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              knows:'The row is new.',
              when:'A duplicate key should stay an error rather than silently becoming an update.' },
            { name:'Update / UpdateOnly', statements:'1 statement',
              tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              knows:'The row already exists.',
              when:'The condition is something other than the primary key, or you’re updating many rows by a WHERE expression - which Upsert can’t do.' },
        ]
        return { apis }
    }
}

export default {
    components: {
        JsonPortability,
        JsonApiChoice,
        JsonSupport,
        UpsertCompare,
        WriteChooser,
    }
}
