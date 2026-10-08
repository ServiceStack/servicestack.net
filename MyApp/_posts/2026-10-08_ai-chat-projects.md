---
title: Prompt it, Publish it - AI-built works from your .NET APIs
summary: AI Chat puts a ChatGPT-like assistant inside your .NET App, where it calls the APIs the signed-in user is allowed to call and turns the results into interactive views and reports your team can explore, review and publish
tags: [ai, llms, servicestack]
author: Demis
image: ./img/posts/ai-chat-projects/bg.webp
---

Your customer, revenue and usage data already lives inside your .NET App, yet answering a simple business question still means opening several screens, exporting CSVs and assembling the story somewhere else. The common shortcut is pasting that data into an external ChatGPT window, which knows nothing about your App, can't fetch anything
new and now has a copy of data that was never meant to leave it.

:::youtube YOUTUBE_ID
Prompt It, Publish It: AI-Built Pages From Your .NET APIs
:::

[AI Chat](https://docs.servicestack.net/chat/) takes the opposite approach. It's a ChatGPT-like assistant that runs **inside** your App at `/chat`, with your App's users, identity and permissions. With [API Tools](/posts/api-tools) it can call the APIs you've opted in, as the signed-in user, and with **Projects** it has a workspace to turn the results into something more useful than a paragraph of chat.

| | What you get |
|-|-|
| **Same security boundary** | The assistant runs in your App, as the signed-in user, so it can only see what they could |
| **No parallel backend** | Your existing Request DTOs are the AI contract, with no AI-specific gateway or schema to keep in sync |
| **Always current data** | It discovers and calls your live APIs instead of working from a stale export |
| **Humans approve changes** | Reads run immediately, writes pause for an editable approval form |
| **Artifacts, not answers** | Generated pages are saved to a project workspace where they can be previewed and refined |
| **Explicit publishing** | Nothing leaves the workspace until a user chooses to publish it |

To show what that looks like in practice, the video follows two prompts in the [Next SaaS](/react/#next-saas) template, using its seeded example data.

## Your APIs are the assistant's tools

There's no new AI-specific layer to build. The APIs the assistant uses are the same Request DTOs your App's UI already calls, annotated with a `[Tool]` attribute that tells it **when** to use them:

```csharp
[Tool("the user asks which customers are at risk, healthy, churning, inactive, likely to upgrade or need attention, or how a customer is doing",
    Safety = ToolSafety.ReadOnly,
    Keywords = ["health", "at risk", "churn risk", "attention", "inactive", "upsell", "upgrade", "expansion", "engagement"],
    FollowUps = ["GetSaasCustomer"],
    Examples = ["""{"grade":"AtRisk","take":10}"""])]
[ValidateIsAuthenticated]
[Route("/saas/admin/customer-health", "GET")]
public class GetCustomerHealth : IGet, IReturn<GetCustomerHealthResponse>
{
    [Description("Only this customer")]
    public string? WorkspaceId { get; set; }
    [Description("Only customers with this grade")]
    public CustomerHealthGrade? Grade { get; set; }
    [Description("Include customers whose subscription was canceled")]
    public bool IncludeChurned { get; set; }
    [Description("The most customers to return, from 1 to 200")]
    public int Take { get; set; } = 25;
}
```

Or you can opt in whole groups of APIs by tag when registering `ChatFeature`:

```csharp
services.AddPlugin(new ChatFeature {
    // Require authentication to access /chat
    RequireAuth = true,
    ApiTools = {
        IncludeTags = [
            ApiTags.Organizations, ApiTags.Team, ApiTags.Billing, ApiTags.Usage, ApiTags.Documents,
            ApiTags.ApiKeys, ApiTags.Notifications, ApiTags.Audit, ApiTags.Platform,
        ],
        // Metering is for the product's own API clients, not for an assistant to consume quota
        ExcludeTypes = [nameof(RecordUsage)],
    },
});
```

Opting an API in doesn't bypass anything. Every call goes through the normal ServiceStack request pipeline, so the same validation, `[ValidateIsAuthenticated]` and `[ValidateHasRole]` attributes, and the capability checks inside your Services, decide what the assistant gets back:

```csharp
public async Task<object> Any(GetRevenueMetrics request)
{
    await RequirePlatformAsync(PlatformCapability.ManageBilling);
    return SaasInsights.GetRevenueMetrics(PlatformDb, config.DefaultCurrency, Math.Clamp(request.Months, 1, 12), DateTime.UtcNow);
}
```

If the signed-in user can't manage billing, neither can their assistant.

## Customer Galaxy: make the portfolio explorable

The first prompt asks, in business terms, for an interactive 3D view of the SaaS business built from two APIs, saved as a single self-contained `index.html` in the project:

<screenshot src="/img/posts/ai-chat-projects/galaxy-01-prompt.webp" title="Customer Galaxy prompt"></screenshot>

The assistant hasn't memorized your database. It uses `api_search` to find the relevant APIs, `api_describe` to learn their schemas, then `api_call` to fetch the data, and in this case reports back that it fetched 51 customers,
including 5 churned accounts, and 12 months of revenue history:

<screenshot src="/img/posts/ai-chat-projects/galaxy-02-completed.webp" title="API Tools discovering and calling the App's APIs"></screenshot>

The result is **Customer Galaxy**: each customer is a planet, its orbit set by subscription plan and its color by the health grade `GetCustomerHealth` returned. The center shows total monthly recurring revenue (MRR), the side panels break down the health spectrum and rank the revenue at risk, and a timeline replays revenue over the last 12 months:

<screenshot src="/img/posts/ai-chat-projects/galaxy-05-result-03.webp" title="Customer Galaxy"></screenshot>

A list of metrics has become a view an operator can scan in seconds to see where to look next. Selecting an at-risk planet brings up the API's own signals for that account, e.g. **Ironbark Builders** has a past-due payment and two failed payments in the last 90 days:

<screenshot src="/img/posts/ai-chat-projects/galaxy-05-result-05.webp" title="Drilling into an at-risk account"></screenshot>

### Writes need a human

Spotting that signal naturally leads to a follow-up, like asking the assistant why the account is at risk, or to draft a support note. This is where the approval boundary matters. Read-only APIs run immediately, but any API classified as a write or destructive operation pauses for an editable approval form, so the assistant **proposes** the change and a person decides whether it happens. No change reaches your system of record without that approval.

## Monthly Business Review: same context, different artifact

The same App context can answer a completely different question for a different audience. The second prompt asks for this month's leadership review, researched from four APIs and saved as a 16:9, ten-slide HTML deck with its data embedded and the date it was prepared:

<screenshot src="/img/posts/ai-chat-projects/business-review-01-prompt.webp" title="Monthly Business Review prompt"></screenshot>

The assistant calls `GetRevenueMetrics`, `GetCustomerHealth` and `GetSaasAnalytics`, then `GetSaasCustomer` for every account graded **AtRisk** or **Watch** to pull in their support notes and recent activity. The result is a
deck covering the executive summary, MRR trend and movement, revenue mix, customer health, accounts needing attention, growth opportunities, operations and recommendations:

<screenshots-gallery class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" 
    :images="{
      'Title': '/img/posts/ai-chat-projects/business-review-05-result-01.webp',
      'Executive Summary': '/img/posts/ai-chat-projects/business-review-05-result-02.webp',
      'MRR Trend': '/img/posts/ai-chat-projects/business-review-05-result-03.webp',
      'MRR Movement': '/img/posts/ai-chat-projects/business-review-05-result-04.webp',
      'Revenue Mix': '/img/posts/ai-chat-projects/business-review-05-result-05.webp',
      'Customer Health': '/img/posts/ai-chat-projects/business-review-05-result-06.webp',
      'Growth Opportunities': '/img/posts/ai-chat-projects/business-review-05-result-08.webp',
      'Operations': '/img/posts/ai-chat-projects/business-review-05-result-09.webp',
}"></screenshots-gallery>

The most useful slide is the retention worklist, where health signals from one API sit next to support notes and activity from another, with a recommended action for each account. That's the kind of cross-referencing that normally takes someone an afternoon of switching between screens:

<screenshot src="/img/posts/ai-chat-projects/business-review-05-result-07.webp" title="Retention worklist"></screenshot>

The final slide turns those observations into prioritized next steps, each with an owner to assign:

<screenshot src="/img/posts/ai-chat-projects/business-review-05-result-10.webp" title="Prioritized recommendations"></screenshot>

### A draft to check, not an oracle

Notice what the report says about itself: its MRR figures are estimates that exclude discounts, taxes and negotiated Enterprise pricing, a P0  recommendation is to reconcile a data quality mismatch it found, and it states that no actions have been executed. That's the right role for an in-app assistant. It collapses the time spent gathering and assembling evidence, then leaves people to check the conclusions and make the decisions.

## Preview, then explicitly publish

Both artifacts are written to their project's folder, which only the signed-in user's chats can access, and can be previewed in chat while you iterate on them. When it's ready to share, a user chooses **Share → Folder** to publish the project as a static site served by the App:

<screenshot src="/img/posts/ai-chat-projects/galaxy-04-publish.webp" title="Folder publishing"></screenshot>

Publishing is always a deliberate step. Working drafts never leak to a public path on their own, and later edits are only published when someone clicks **Update folder**.

Once published, the two pages handle their data differently, because they were asked to:

- **Customer Galaxy** embeds a snapshot of its data, and on load tries to refresh it from the same-origin APIs using the viewer's cookies. A signed-in viewer with access sees a **Live** badge, anyone else sees the snapshot 
- **Monthly Business Review** stays a dated snapshot on purpose, so it remains a record of the month it describes. Next month's review is a new prompt and a new publish

### Keep the boundary clear

The default publish folder is publicly served, and both pages embed their data in the HTML. That's fine for seeded example data, but real customer data should stay inside authenticated chat or be published through a delivery path with access control. The pages also load Three.js and Chart.js from a CDN, which your Content Security Policy needs to allow in production.

## Start with one read-only API

Adding AI to an App doesn't have to mean building parallel infrastructure. AI Chat reuses the APIs, permissions and validation you've already deployed, so the quickest way to evaluate it is to opt in a single read-only API your team asks questions about, and see what they do with it.

- [AI Chat overview](https://docs.servicestack.net/chat/overview)
- [Install AI Chat](https://docs.servicestack.net/chat/install)
- [API Tools](https://docs.servicestack.net/chat/api-tools)
- [Integrated Auth](https://docs.servicestack.net/chat/auth)
- [Projects](https://docs.servicestack.net/chat/projects)
- [Publishing](https://docs.servicestack.net/chat/publishing)

To try the same demo yourself, create a new [Next SaaS](https://react-templates.net/#next-saas) App:

```bash
npx create-net next-saas ProjectName
```
