# MEC → Client Portal Tab — Handoff & Build Plan

> **This file is a self-contained handoff.** It is meant to be copied into the **other** Claude
> Code project — the one that already holds the client-portal website — so that session can add
> **MEC (Meat Export/Import Intelligence)** as a **new tab** inside the existing portal.
> It assumes the reader has access to the portal codebase but **not** to the MEC repo, so every
> backend fact, table name, and API contract MEC needs is written out in full below.
>
> **How to use:** copy this single file into the portal project (e.g. paste it into a new Claude
> Code session there) and say *"implement the Meat Intel tab per this handoff."*

---

## Context — why this exists

MEC is a bilingual (Arabic + English) meat-import price-intelligence agent for a Saudi client.
Today it is **backend-only and WhatsApp-only**: a client sends a WhatsApp message, an n8n workflow
parses intent, queries a Supabase price history, computes a "sweet-timing" buy/wait verdict, renders
a bilingual PDF, and replies on WhatsApp + email.

The goal now is to give it a **stable, user-friendly web interface**: a **new self-service tab inside
the existing client portal** where the client can log in, request reports on demand, browse live price
dashboards, watch crisis alerts, and download PDFs — **web-first, with WhatsApp kept as an optional
notification channel.** Auth and hosting reuse the portal's stack (target: **Supabase Auth + Vercel**).

### Current state of the MEC repo (what's already built vs. missing)

| Built today | Missing / to build |
|---|---|
| `supabase/schema.sql` — full DB schema (7 tables + 2 views), production-ready | All 4 n8n workflows (design-only, not yet created) |
| `.env.example` — all 15 integration keys | `seed-sources.sql` (the country×meat×cut source matrix) |
| `.mcp.json` — n8n-MCP server hookup | Cached Claude prompts (`prompts/`) |
| `CLAUDE.md`, `README.md`, `docs/wasender-setup.md` | `pdf/template.html` (bilingual PDF) |
| | `docs/data-sources.md`, `docs/runbook.md` |
| | **Everything web/portal — none exists yet** |

So this plan covers two intertwined tracks: **(A) finish the MEC backend** enough to serve a web UI,
and **(B) build the portal tab + the API contract between them.**

---

## Target architecture (with the portal added)

```
                          ┌─────────────────────────────────────────┐
   Client browser ───────▶│  EXISTING CLIENT PORTAL (Next.js/Vercel) │
   (logged in via         │   + NEW "Meat Intel" tab  (this build)   │
    Supabase Auth)        └───────────────┬───────────────┬─────────┘
                                          │ reads          │ POST "generate report"
                                          ▼ (RLS)          ▼
                              ┌───────────────────┐   ┌──────────────────────────┐
                              │  Supabase Postgres │   │ Portal API route /api/mec │
                              │  prices, news, fx, │   │  → calls n8n webhook      │
                              │  freight, reports, │   └────────────┬─────────────┘
                              │  sources (+ views) │                │
                              └─────────▲─────────┘                 ▼
                                        │              ┌────────────────────────────┐
            ┌───────────────────────────┴──────────────│  n8n (4 workflows)         │
            │ daily scrape / hourly news / fx / report  │  W1 scrape, W2 report,     │
            │ writes                                    │  W3 crisis, W4 fx          │
            │                                           └──────────┬─────────────────┘
   external sources (Apify/ScrapingBee/SerpAPI/FX)                 │ optional notify
                                                                   ▼ Wasender (WhatsApp)
```

**Key principle — split the two access patterns:**

1. **Reads (dashboards, charts, archives, crisis feed):** the portal queries **Supabase directly**
   using the Supabase JS client + **RLS** (anon/auth key). No new backend needed — the data is already
   there. This is fast, cacheable, and keeps the UI snappy.
2. **Writes (request a report on demand):** the portal calls a **server-side API route** in the portal
   app, which triggers the **n8n `02-on-demand-report` workflow via webhook** (server-to-server, secret
   held server-side). n8n does the heavy work (intent → query → verdict → PDF) and writes a `reports`
   row. The UI then **polls / subscribes** to that row for completion.

This keeps secrets (`ANTHROPIC_API_KEY`, n8n webhook secret, service-role key) out of the browser.

---

## The MEC backend data the portal consumes (real schema)

These tables/views already exist in `supabase/schema.sql`. The portal tab is built against them.

- **`latest_prices`** (view) — one current row per `country, meat, cut`: `price_usd_per_kg`,
  `price_local`, `currency`, `fetched_at`. → **Dashboard "current prices" grid.**
- **`prices`** (table) — full history; `country, meat, cut, grade, price_usd_per_kg, fetched_at`.
  → **Price-trend line charts** (filter by country/meat/cut, range by `fetched_at`).
- **`price_bands_90d`** (view) — `p25, p50, p75, samples` per `country, meat, cut`.
  → **"Is today cheap?" band gauge** behind the sweet-timing verdict.
- **`news`** (table) — `headline, summary, url, country, category` (crisis|policy|disease|freight|market),
  `severity` (1–5), `published_at`. → **Crisis/alerts feed**, filter `severity >= 4`.
- **`freight`** (table) — `origin_port, dest_port` (JED/DMM), `usd_per_container`, `transit_days`.
  → **Freight widget** on the landed-cost breakdown.
- **`fx`** (table) — `base, quote, rate`, latest row → **USD↔SAR display** (bilingual rule: show both).
- **`reports`** (table) — `requested_at, request_text, parsed_intent (jsonb), verdict,
  pdf_url, sent_whatsapp/email, duration_ms`. → **"My Reports" archive + report status.**
- **`sources`** (table) — `country, meat, cut, source_name, url, scraper, active`.
  → **Admin "Sources" sub-tab** (manage/toggle).

**Coverage to render in filters** (from `CLAUDE.md`):
- Meats/cuts: beef (tenderloin, ribeye, striploin, brisket, trimmings), lamb/mutton, chicken (whole,
  breast, leg quarters, MDM), camel, goat.
- Countries: BR, IN, US, AU, AR, NZ, PK, PT, UY. Ports: JED, DMM.
- Use the **EN↔AR cuts glossary** in `CLAUDE.md §10` for bilingual labels.

**Verdict values** (enum stored as text in `reports.verdict`): `BUY_NOW`, `BUY_THIS_WEEK`,
`NEUTRAL`, `WAIT_4_8`, `WAIT_CRISIS`. Render each with a distinct color/icon.

---

## Required DB additions (multi-tenant + web requests)

Today `reports` is keyed by `client_handle` (a WhatsApp number) and there is no user/org table — the
schema was built for a single WhatsApp client. To serve authenticated web users, add:

1. **Link reports to portal users.** Add nullable columns to `reports`:
   `user_id uuid references auth.users(id)`, `org_id uuid`, `channel text default 'whatsapp'`
   (`'web' | 'whatsapp'`). Web requests set `channel='web'` and `user_id`.
2. **(Optional) `mec_clients` table** if the portal has no org concept yet: `user_id`, `org_id`,
   `display_name`, `default_dest_port`, `whatsapp_opt_in`, `created_at`.
3. **RLS policies** so a logged-in user reads only their own `reports`
   (`auth.uid() = user_id`). Reference/market data (`prices`, `latest_prices`, `news`, `fx`,
   `freight`, `sources`) is **shared/read-only** to all authenticated users — enable RLS with a
   `select` policy `auth.role() = 'authenticated'`. The n8n workflows write with the **service-role
   key** and bypass RLS.

> ⚠️ Do **not** expose the service-role key to the browser. Reads use the **anon key + RLS**; writes
> go through the portal's server-side API route or n8n.

---

## The new "Meat Intel" tab — UI spec (full self-service MVP)

Add one top-level tab to the existing portal nav. Inside it, these sub-views (match the portal's
existing component library, routing, and styling — do not introduce a new design system):

1. **Overview / Dashboard** (default)
   - Current-price grid from `latest_prices` (country×meat×cut), each cell showing USD/kg + SAR.
   - Headline "sweet-timing" verdict card for the client's watched items.
   - Top crisis alerts strip (latest `news` where `severity >= 4`).
   - Latest FX (USD→SAR) badge.

2. **Request a Report** (the core web-first action)
   - Form: meat → cut → country (multi) → dest port (JED/DMM) → optional note.
   - Submit → calls `/api/mec/report` (see contract below) → shows a live status card
     (queued → generating → done) by polling/subscribing to the new `reports` row.
   - On completion: render the verdict, the bilingual summary, landed-cost breakdown, and a
     **Download PDF** button (`reports.pdf_url`).

3. **Price Explorer**
   - Filters (meat/cut/country/date-range) → line chart from `prices`.
   - Overlay the `price_bands_90d` p25/p50/p75 to show where today sits.

4. **Crisis Feed**
   - Reverse-chron `news` list with category + severity chips, country filter, source link.

5. **My Reports** (archive)
   - Table of the user's past `reports` (date, request, verdict, PDF link), newest first.

6. **Admin / Sources** (role-gated — only show to ops/admin users)
   - CRUD-lite over `sources`: list, toggle `active`, edit `url`/`selector`.
   - "Run scrape now" button → triggers W1 manually via an admin API route.
   - Basic workflow health: last successful `fetched_at` per source.

**Bilingual rule (from `CLAUDE.md §7`):** Arabic executive summary first (RTL), English details
follow; **numbers always LTR** inside Arabic blocks; currency in **both USD and SAR**. Reuse the
glossary for cut labels. Honor the portal's existing i18n/locale switch if it has one.

---

## API contract (portal ⇄ MEC backend)

### Reads — direct Supabase (in the portal, client or server component)
```ts
// current prices
supabase.from('latest_prices').select('*')
// trend
supabase.from('prices').select('country,meat,cut,price_usd_per_kg,fetched_at')
        .eq('meat', m).eq('cut', c).eq('country', co)
        .gte('fetched_at', since).order('fetched_at')
// bands
supabase.from('price_bands_90d').select('*').eq('meat', m).eq('cut', c).eq('country', co)
// crisis feed
supabase.from('news').select('*').gte('severity', 4).order('published_at', { ascending: false })
// latest fx
supabase.from('fx').select('rate').eq('base','USD').eq('quote','SAR')
        .order('fetched_at', { ascending: false }).limit(1)
// my reports
supabase.from('reports').select('*').eq('user_id', uid).order('requested_at', { ascending: false })
```

### Write — generate a report (server-side API route in the portal)
```
POST /api/mec/report           (portal server route; user must be authenticated)
  body: { meat, cut, countries[], dest_port, note? }
  server steps:
    1. validate + get auth user (supabase server client)
    2. insert a `reports` row { user_id, channel:'web', request_text, parsed_intent, requested_at }
       → returns report_id
    3. POST to n8n webhook  $N8N_WEBHOOK_URL/webhook/mec-on-demand
       headers: { 'x-mec-secret': $MEC_WEBHOOK_SECRET }
       body: { report_id, meat, cut, countries, dest_port, channel:'web', user_id }
    4. return { report_id }   (202 Accepted)
  → UI then subscribes to reports row (supabase realtime) or polls until verdict/pdf_url set.
```

n8n's `02-on-demand-report` workflow gets a **second trigger (web webhook)** alongside its existing
Wasender trigger; both feed the same intent→query→verdict→PDF→persist core. For `channel='web'` it
**updates the existing `reports` row** (by `report_id`) instead of inserting, and **skips WhatsApp
send** unless the user opted in.

### Admin — trigger scrape (role-gated server route)
```
POST /api/mec/admin/scrape   → POST n8n webhook for W1 manual run (admin auth required)
```

---

## Environment variables the portal needs

Add to the portal's env (Vercel project settings). Most already exist on the MEC side
(`.env.example`); the portal only needs the subset for reads + triggering n8n:

```
NEXT_PUBLIC_SUPABASE_URL          # = SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # = SUPABASE_ANON_KEY  (browser reads, RLS-guarded)
SUPABASE_SERVICE_KEY              # server routes only (insert report row server-side)
N8N_WEBHOOK_URL                   # base URL of the n8n instance
MEC_WEBHOOK_SECRET                # shared secret sent as x-mec-secret header
```
Anthropic/Wasender/scraper/Carbone keys stay on the **n8n side only** — the portal never sees them.

---

## Build sequence

### Track A — finish the MEC backend (in the MEC repo, via n8n-MCP per `CLAUDE.md §1`)
1. Apply `supabase/schema.sql` to Supabase (if not already), then apply the **DB additions** above
   (reports columns + RLS + optional `mec_clients`).
2. Create `seed-sources.sql` (country×meat×cut source matrix) and load it.
3. Build the 4 workflows with n8n-MCP (validate **strict** + `n8n_autofix_workflow` before deploy),
   export each to `n8n/workflows/<NN>-<name>.json`:
   - `04-fx-snapshot` (simplest, do first — unblocks USD↔SAR in UI),
   - `01-daily-scrape` (populates `prices` → the dashboards),
   - `03-crisis-monitor` (populates `news` → crisis feed),
   - `02-on-demand-report` — **add the web webhook trigger + `report_id` update path + skip-WhatsApp
     branch for `channel='web'`.** This is the one the portal calls.
4. Backfill some price history so charts aren't empty (run W1 in manual mode a few times, or import CSV).

### Track B — build the portal tab (in the portal repo)
5. Add the Supabase client (reuse the portal's existing one if present) + the new tab route/nav entry.
6. Build read-only sub-views first (Overview, Price Explorer, Crisis Feed, My Reports) against live
   Supabase data — these work as soon as Track A step 3 lands.
7. Build the `/api/mec/report` server route + the Request-a-Report form + status polling/realtime.
8. Add the role-gated Admin/Sources sub-view + `/api/mec/admin/scrape`.
9. Wire bilingual labels (glossary + i18n), verdict styling, USD/SAR formatting.

Tracks A and B can proceed in parallel once the schema + RLS are in place; B's read views only need
the tables to exist (they'll just be empty until A's scrapers run).

---

## Verification (end-to-end)

1. **Data reads:** with seed/backfilled data, open the tab → Overview grid, Price Explorer chart,
   Crisis Feed, and FX badge all render real Supabase rows. Confirm RLS: a second user cannot see the
   first user's `reports`.
2. **On-demand report (web):** submit `beef / ribeye / Brazil / JED` in Request-a-Report →
   `/api/mec/report` returns a `report_id` → the n8n web webhook fires (check `n8n_executions`) →
   the `reports` row gets `verdict` + `pdf_url` → UI flips to "done" → PDF downloads and the Arabic
   summary renders without mojibake (preview the PDF).
3. **WhatsApp parity unaffected:** send the same request from an opted-in WhatsApp number → existing
   flow still replies (proves the dual-trigger didn't break the original path).
4. **Secrets:** confirm no service-role key, Anthropic key, or webhook secret is present in any
   browser bundle/network call (inspect Vercel client build + devtools).
5. **Crons:** confirm W4 (fx) and W1 (scrape) write fresh rows on schedule; W3 raises a `news`
   row with `severity >= 4` that surfaces in the Crisis Feed.

---

## Open decisions for the receiving session (resolve against the portal's reality)

- **Portal stack confirmation.** Plan assumes **Next.js/React + Supabase + Vercel** (the chosen
  auth/hosting). If the existing portal is a different framework, the read-queries and tab structure
  port directly; only the API-route mechanism and i18n hookup change.
- **Org/tenant model.** If the portal already has an organizations/teams concept, link `reports` to it
  instead of adding `mec_clients`.
- **Sync vs. async report UX.** Plan uses async (insert row → trigger n8n → poll/realtime). If reports
  are fast enough, a synchronous request/response is simpler but riskier on timeouts — async is
  recommended.
- **Admin gating.** How admin/ops role is detected (portal's existing role system vs. a flag on
  `mec_clients`).

---

## Pointers (MEC repo, for the receiving session)

- Rules & conventions: `CLAUDE.md` (esp. §1 n8n-MCP build loop, §7 bilingual, §9 verdict logic, §10 glossary).
- DB schema: `supabase/schema.sql`. Env keys: `.env.example`. Operator runbook: `README.md`.
- WhatsApp ops & ban-risk: `docs/wasender-setup.md`.
- Landed-cost formula & verdict ordering: `CLAUDE.md §9`.
