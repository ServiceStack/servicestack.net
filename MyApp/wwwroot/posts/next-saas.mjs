import NextSaasGallery from "./components/NextSaasGallery.mjs"

const NextSaasTemplate = {
    components: { NextSaasGallery },
    template: `<div class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"><NextSaasGallery /></div>`,
}

/** Top-of-post index of what's included, linking to each section */
const SaasHighlights = {
    template:`
      <section class="not-prose my-10">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            { icon:'◫', eyebrow:'Tenancy', title:'Organizations & teams', href:'#organizations-and-teams',
              text:'Personal and Business accounts, multiple organizations per user and Owner, Admin, Billing and Member roles.' },
            { icon:'$', eyebrow:'Billing', title:'Stripe subscriptions', href:'#stripe-billing-off-the-hot-path',
              text:'Hosted Checkout, trials, coupons and the Customer Portal, kept in sync by signed webhooks.' },
            { icon:'◆', eyebrow:'Plans', title:'Versioned plans', href:'#plans-that-never-change-under-your-customers',
              text:'Immutable plan versions with prices, features and quotas that existing customers stay pinned to.' },
            { icon:'◔', eyebrow:'Metering', title:'Usage & quotas', href:'#usage-metering-and-quotas',
              text:'Idempotent counters, gauges and reservations enforced locally, with analytics built on the same ledger.' },
            { icon:'⚙', eyebrow:'Back office', title:'Operations Center', href:'#an-operations-center-for-running-the-business',
              text:'Customer 360, plan and coupon editors, platform analytics and recovery of failed work.' },
            { icon:'⇪', eyebrow:'Production', title:'Ready to ship', href:'#verify-and-ship',
              text:'One-command verification, production preflight checks and a Kamal deployment pipeline.' },
        ]
        return { items }
    }
}

export default {
    components: {
        NextSaasTemplate,
        SaasHighlights,
    }
}
