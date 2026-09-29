import AudioPlayer from '../pages/podcasts/AudioPlayer.mjs'
import NextLicenseShowcase from "./components/NextLicenseShowcase.mjs"

const NextLicenseTemplate = {
    components: { NextLicenseShowcase },
    template: `<div class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"><NextLicenseShowcase /></div>`,
}

/** Top-of-post index of what's included, linking to each section */
const LicenseHighlights = {
    template:`
      <section class="not-prose my-10">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a v-for="item in items" :key="item.title" :href="item.href"
             class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600">
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg font-black text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">{{item.icon}}</span>
              <div class="text-xs font-bold uppercase tracking-[.16em] text-emerald-600 dark:text-emerald-400">{{item.eyebrow}}</div>
            </div>
            <h3 class="mt-3 font-bold text-slate-900 dark:text-white">{{item.title}}</h3>
            <p class="mt-1 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{item.text}}</p>
          </a>
        </div>
      </section>`,
    setup() {
        const items = [
            { icon:'⚿', eyebrow:'Keys', title:'Signed JWT licenses', href:'#a-license-is-a-signed-jwt',
              text:'Standard ES256 JWTs your app verifies with an embedded public key. Readable, but impossible to forge.' },
            { icon:'◷', eyebrow:'Coverage', title:'Perpetual, dated updates', href:'#licenses-that-never-expire',
              text:'Each license covers every build released up to its cutoff, forever. Lifetime licenses cover every future build.' },
            { icon:'⌘', eyebrow:'Your app', title:'.NET & Electron verifiers', href:'#unlock-pro-in-your-app',
              text:'One function call in .NET or Node, with no network, activation server, helper process or npm dependencies.' },
            { icon:'$', eyebrow:'Checkout', title:'Stripe fulfillment', href:'#payments-you-can-trust',
              text:'One-time Stripe Checkout, promotion codes and tax, verified against Stripe before any license is signed.' },
            { icon:'⇩', eyebrow:'Releases', title:'GitHub downloads', href:'#downloads-from-your-github-releases',
              text:'Published GitHub releases become platform download buttons and a changelog, with a cached fallback.' },
            { icon:'⚙', eyebrow:'Back office', title:'Operations Center', href:'#an-operations-center-for-your-store',
              text:'Manage pricing, issue and extend licenses, review orders, refunds and disputes and publish license terms.' },
        ]
        return { items }
    }
}

export default {
    components: {
        AudioPlayer,
        NextLicenseTemplate,
        LicenseHighlights,
    }
}
