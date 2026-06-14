import type {
  CountryCode,
  FreightLane,
  FxRate,
  LatestPrice,
  MecState,
  MeatSlug,
  NewsItem,
  PricePoint,
  PriceBand,
  Report,
  Source,
  Verdict
} from './mec-types'
import { COUNTRIES, COVERAGE, CUTS, MEATS, NEWS_TEMPLATES } from './mec-catalog'

const BASE_TIME = new Date('2026-05-23T09:42:00Z').getTime()

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

const hashKey = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h
}

const rng = (k: string) => mulberry32(hashKey(k))

const BASE_USD: Record<MeatSlug, Record<string, number>> = {
  beef: { tenderloin: 18.4, ribeye: 14.8, striploin: 12.6, brisket: 7.4, trimmings: 4.9 },
  lamb: { 'lamb-carcass': 9.2, 'lamb-leg': 11.6, 'lamb-shoulder': 8.4, 'lamb-rack': 16.3 },
  chicken: { 'chicken-whole': 2.6, 'chicken-breast': 4.4, 'chicken-leg': 2.2, 'chicken-mdm': 1.6 },
  camel: { 'camel-carcass': 7.8, 'camel-leg': 9.4 },
  goat: { 'goat-carcass': 8.6, 'goat-leg': 10.2 }
}

const COUNTRY_BIAS: Record<CountryCode, number> = {
  BR: -0.10, IN: -0.18, US: 0.05, AU: 0.12, AR: -0.06, NZ: 0.16, PK: -0.22, PT: 0.18, UY: -0.04
}

const CURRENCIES: Record<CountryCode, { code: string; rate: number }> = {
  BR: { code: 'BRL', rate: 5.05 },
  IN: { code: 'INR', rate: 83.4 },
  US: { code: 'USD', rate: 1 },
  AU: { code: 'AUD', rate: 1.52 },
  AR: { code: 'ARS', rate: 920 },
  NZ: { code: 'NZD', rate: 1.66 },
  PK: { code: 'PKR', rate: 278 },
  PT: { code: 'EUR', rate: 0.92 },
  UY: { code: 'UYU', rate: 39.5 }
}

function priceAt(meat: MeatSlug, cut: string, country: CountryCode, dayOffset: number, jitter: () => number): number {
  const base = BASE_USD[meat]?.[cut] ?? 5
  const bias = 1 + (COUNTRY_BIAS[country] ?? 0)
  const seasonal = Math.sin((dayOffset + hashKey(country + cut)) / 8) * 0.08
  const noise = (jitter() - 0.5) * 0.08
  return Math.max(0.5, base * bias * (1 + seasonal + noise))
}

function fmtTs(t: number) {
  return new Date(t).toISOString()
}

let cached: MecState | null = null

export function getMecState(): MecState {
  if (cached) return cached

  // ---- latest prices (one per covered country × meat × cut) ----
  const latestPrices: LatestPrice[] = []
  for (const meat of MEATS) {
    for (const cut of CUTS.filter((c) => c.meat === meat.slug)) {
      const countries = COVERAGE[meat.slug]?.[cut.slug] ?? []
      for (const country of countries) {
        const r = rng(`latest:${country}:${meat.slug}:${cut.slug}`)
        const usd = priceAt(meat.slug, cut.slug, country, 0, r)
        const last7 = priceAt(meat.slug, cut.slug, country, -7, rng(`prev7:${country}:${meat.slug}:${cut.slug}`))
        const cur = CURRENCIES[country]
        latestPrices.push({
          country,
          meat: meat.slug,
          cut: cut.slug,
          price_usd_per_kg: round2(usd),
          price_local: round2(usd * cur.rate),
          currency: cur.code,
          fetched_at: fmtTs(BASE_TIME - 1000 * 60 * 30),
          delta_7d_pct: round2(((usd - last7) / last7) * 100)
        })
      }
    }
  }

  // ---- FX ----
  const fx: FxRate = {
    base: 'USD',
    quote: 'SAR',
    rate: 3.751,
    fetched_at: fmtTs(BASE_TIME - 1000 * 60 * 12)
  }

  // ---- freight ----
  const freight: FreightLane[] = [
    { origin_port: 'Santos', origin_country: 'BR', dest_port: 'JED', usd_per_container: 4280, transit_days: 38, delta_7d_pct: 14.2 },
    { origin_port: 'Santos', origin_country: 'BR', dest_port: 'DMM', usd_per_container: 4380, transit_days: 40, delta_7d_pct: 14.0 },
    { origin_port: 'Sydney', origin_country: 'AU', dest_port: 'JED', usd_per_container: 3680, transit_days: 28, delta_7d_pct: 2.1 },
    { origin_port: 'Auckland', origin_country: 'NZ', dest_port: 'JED', usd_per_container: 3920, transit_days: 30, delta_7d_pct: 3.0 },
    { origin_port: 'Buenos Aires', origin_country: 'AR', dest_port: 'JED', usd_per_container: 4120, transit_days: 36, delta_7d_pct: 8.4 },
    { origin_port: 'Montevideo', origin_country: 'UY', dest_port: 'JED', usd_per_container: 4180, transit_days: 36, delta_7d_pct: 7.9 },
    { origin_port: 'Karachi', origin_country: 'PK', dest_port: 'JED', usd_per_container: 1860, transit_days: 9, delta_7d_pct: -1.2 },
    { origin_port: 'Nhava Sheva', origin_country: 'IN', dest_port: 'JED', usd_per_container: 1980, transit_days: 12, delta_7d_pct: -0.4 },
    { origin_port: 'Long Beach', origin_country: 'US', dest_port: 'JED', usd_per_container: 4640, transit_days: 32, delta_7d_pct: 1.6 },
    { origin_port: 'Lisbon', origin_country: 'PT', dest_port: 'JED', usd_per_container: 2640, transit_days: 14, delta_7d_pct: 0.8 }
  ]

  // ---- news ----
  const news: NewsItem[] = NEWS_TEMPLATES.map((tpl, i) => ({
    id: `NWS-${1000 + i}`,
    headline: tpl.headline,
    summary: tpl.summary,
    url: '#',
    country: tpl.country,
    category: tpl.category,
    severity: tpl.severity,
    published_at: fmtTs(BASE_TIME - tpl.hoursAgo * 60 * 60 * 1000)
  }))

  // ---- seed reports ----
  const reports: Report[] = buildSampleReports()

  // ---- sources ----
  const sources: Source[] = buildSources()

  cached = {
    countries: COUNTRIES,
    meats: MEATS,
    cuts: CUTS,
    latestPrices,
    fx,
    freight,
    news,
    reports,
    sources,
    history: ({ meat, cut, country, days = 90 }) => buildHistory(meat, cut, country, days),
    bands: ({ meat, cut, country }) => buildBand(meat, cut, country)
  }
  return cached
}

function buildHistory(meat: MeatSlug, cut: string, country: CountryCode, days: number): PricePoint[] {
  const out: PricePoint[] = []
  const r = rng(`hist:${country}:${meat}:${cut}`)
  for (let d = days - 1; d >= 0; d--) {
    out.push({ t: `D-${d}`, usd: round2(priceAt(meat, cut, country, -d, r)) })
  }
  return out
}

function buildBand(meat: MeatSlug, cut: string, country: CountryCode): PriceBand | undefined {
  const points = buildHistory(meat, cut, country, 90).map((p) => p.usd).sort((a, b) => a - b)
  if (!points.length) return undefined
  const q = (p: number) => points[Math.min(points.length - 1, Math.floor(points.length * p))]
  return {
    country,
    meat,
    cut,
    p25: round2(q(0.25)),
    p50: round2(q(0.5)),
    p75: round2(q(0.75)),
    samples: points.length
  }
}

const round2 = (n: number) => Math.round(n * 100) / 100

function buildSampleReports(): Report[] {
  const list: Report[] = [
    {
      id: 'RPT-2041',
      requested_at: fmtTs(BASE_TIME - 1000 * 60 * 60 * 2),
      completed_at: fmtTs(BASE_TIME - 1000 * 60 * 60 * 2 + 22 * 1000),
      meat: 'beef',
      cut: 'ribeye',
      countries: ['BR', 'AU', 'AR'],
      dest_port: 'JED',
      channel: 'web',
      status: 'done',
      verdict: 'WAIT_CRISIS',
      request_text: 'Ribeye comparison · Brazil, Australia, Argentina → Jeddah',
      summary: {
        en: 'Brazil tightened on the avian-flu suspension. Australia is the safer landed-cost play this week. Wait on Argentina until tax impact clears.',
        ar: 'البرازيل شحّت بسبب تعليق إنفلونزا الطيور. أستراليا الخيار الأكثر أمانًا من حيث التكلفة الواصلة هذا الأسبوع. الأنسب الانتظار على الأرجنتين حتى يتّضح أثر الضريبة.'
      },
      landed_cost: { fob_usd_per_kg: 16.4, freight_usd_per_kg: 1.1, duty_usd_per_kg: 0.8, landed_usd_per_kg: 18.3, landed_sar_per_kg: 68.7 },
      pdf_url: '#'
    },
    {
      id: 'RPT-2040',
      requested_at: fmtTs(BASE_TIME - 1000 * 60 * 60 * 26),
      completed_at: fmtTs(BASE_TIME - 1000 * 60 * 60 * 26 + 18 * 1000),
      meat: 'lamb',
      cut: 'lamb-leg',
      countries: ['AU', 'NZ'],
      dest_port: 'JED',
      channel: 'whatsapp',
      status: 'done',
      verdict: 'BUY_THIS_WEEK',
      request_text: 'Lamb leg · Australia vs New Zealand',
      summary: {
        en: 'AU lamb leg sits below the 90-day p25. NZ is tightening from Canterbury floods. Buy AU this week, hold NZ.',
        ar: 'فخذ الضأن الأسترالي أقل من شريحة الـ p25 لتسعين يومًا. نيوزيلندا في شحّ بسبب فيضانات كانتربري. اشترِ الأسترالي هذا الأسبوع وأرجئ النيوزيلندي.'
      },
      landed_cost: { fob_usd_per_kg: 11.2, freight_usd_per_kg: 0.9, duty_usd_per_kg: 0.6, landed_usd_per_kg: 12.7, landed_sar_per_kg: 47.6 },
      pdf_url: '#'
    },
    {
      id: 'RPT-2039',
      requested_at: fmtTs(BASE_TIME - 1000 * 60 * 60 * 52),
      completed_at: fmtTs(BASE_TIME - 1000 * 60 * 60 * 52 + 24 * 1000),
      meat: 'chicken',
      cut: 'chicken-breast',
      countries: ['BR', 'US'],
      dest_port: 'DMM',
      channel: 'web',
      status: 'done',
      verdict: 'BUY_NOW',
      request_text: 'Chicken breast · Brazil + US to Dammam',
      summary: {
        en: 'US breast averages dropped 6% W/W. Strong buy window across both origins.',
        ar: 'صدور الدجاج الأمريكي انخفضت 6% أسبوعيًا. نافذة شراء قوية من المصدرين.'
      },
      landed_cost: { fob_usd_per_kg: 4.1, freight_usd_per_kg: 0.6, duty_usd_per_kg: 0.3, landed_usd_per_kg: 5.0, landed_sar_per_kg: 18.8 },
      pdf_url: '#'
    },
    {
      id: 'RPT-2038',
      requested_at: fmtTs(BASE_TIME - 1000 * 60 * 60 * 96),
      completed_at: fmtTs(BASE_TIME - 1000 * 60 * 60 * 96 + 19 * 1000),
      meat: 'beef',
      cut: 'trimmings',
      countries: ['IN', 'UY'],
      dest_port: 'JED',
      channel: 'web',
      status: 'done',
      verdict: 'NEUTRAL',
      request_text: 'Beef trimmings · India vs Uruguay',
      summary: {
        en: 'India re-opened export quotas — competitive on USD/kg. Uruguay holds quality edge. Even-weight allocation suggested.',
        ar: 'الهند فتحت حصص التصدير مجددًا — تنافسية على سعر الدولار/كغ. الأوروغواي تتفوّق في الجودة. يُقترح توزيع متوازن.'
      },
      landed_cost: { fob_usd_per_kg: 4.5, freight_usd_per_kg: 0.7, duty_usd_per_kg: 0.4, landed_usd_per_kg: 5.6, landed_sar_per_kg: 21.0 },
      pdf_url: '#'
    }
  ]
  return list
}

function buildSources(): Source[] {
  const out: Source[] = []
  let i = 1
  for (const meat of MEATS) {
    for (const cut of CUTS.filter((c) => c.meat === meat.slug)) {
      const countries = COVERAGE[meat.slug]?.[cut.slug] ?? []
      for (const country of countries) {
        const r = rng(`src:${country}:${meat.slug}:${cut.slug}`)
        const scrapers: Source['scraper'][] = ['apify', 'scrapingbee', 'serpapi', 'manual']
        const health: Source['health'][] = ['ok', 'ok', 'ok', 'ok', 'stale', 'failing']
        const lastHours = 1 + Math.floor(r() * 60)
        out.push({
          id: `SRC-${2000 + i++}`,
          country,
          meat: meat.slug,
          cut: cut.slug,
          source_name: `${country}-${meat.slug}-${cut.slug}-trader`,
          url: `https://example.com/${country.toLowerCase()}/${meat.slug}/${cut.slug}`,
          scraper: scrapers[Math.floor(r() * scrapers.length)],
          active: r() > 0.12,
          last_fetched: fmtTs(BASE_TIME - lastHours * 60 * 60 * 1000),
          health: health[Math.floor(r() * health.length)]
        })
      }
    }
  }
  return out
}

export const VERDICTS: Verdict[] = ['BUY_NOW', 'BUY_THIS_WEEK', 'NEUTRAL', 'WAIT_4_8', 'WAIT_CRISIS']

export function deriveVerdict(seedKey: string): Verdict {
  const r = rng(seedKey)()
  if (r < 0.18) return 'BUY_NOW'
  if (r < 0.42) return 'BUY_THIS_WEEK'
  if (r < 0.70) return 'NEUTRAL'
  if (r < 0.88) return 'WAIT_4_8'
  return 'WAIT_CRISIS'
}
