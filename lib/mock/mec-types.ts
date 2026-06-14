import type { Bi } from './types'

export type CountryCode = 'BR' | 'IN' | 'US' | 'AU' | 'AR' | 'NZ' | 'PK' | 'PT' | 'UY'
export type PortCode = 'JED' | 'DMM'
export type MeatSlug = 'beef' | 'lamb' | 'chicken' | 'camel' | 'goat'
export type Verdict = 'BUY_NOW' | 'BUY_THIS_WEEK' | 'NEUTRAL' | 'WAIT_4_8' | 'WAIT_CRISIS'
export type NewsCategory = 'crisis' | 'policy' | 'disease' | 'freight' | 'market'

export type Country = {
  code: CountryCode
  name: Bi
  flag: string
}

export type Meat = {
  slug: MeatSlug
  name: Bi
}

export type Cut = {
  slug: string
  meat: MeatSlug
  name: Bi
}

export type LatestPrice = {
  country: CountryCode
  meat: MeatSlug
  cut: string
  price_usd_per_kg: number
  price_local: number
  currency: string
  fetched_at: string
  delta_7d_pct: number
}

export type PricePoint = { t: string; usd: number }

export type PriceBand = {
  country: CountryCode
  meat: MeatSlug
  cut: string
  p25: number
  p50: number
  p75: number
  samples: number
}

export type NewsItem = {
  id: string
  headline: Bi
  summary: Bi
  url: string
  country: CountryCode | 'GLOBAL'
  category: NewsCategory
  severity: 1 | 2 | 3 | 4 | 5
  published_at: string
}

export type FreightLane = {
  origin_port: string
  origin_country: CountryCode
  dest_port: PortCode
  usd_per_container: number
  transit_days: number
  delta_7d_pct: number
}

export type FxRate = {
  base: 'USD'
  quote: 'SAR'
  rate: number
  fetched_at: string
}

export type ReportStatus = 'queued' | 'generating' | 'done'

export type Report = {
  id: string
  requested_at: string
  completed_at?: string
  meat: MeatSlug
  cut: string
  countries: CountryCode[]
  dest_port: PortCode
  channel: 'web' | 'whatsapp'
  status: ReportStatus
  verdict?: Verdict
  request_text: string
  summary?: Bi
  landed_cost?: {
    fob_usd_per_kg: number
    freight_usd_per_kg: number
    duty_usd_per_kg: number
    landed_usd_per_kg: number
    landed_sar_per_kg: number
  }
  pdf_url?: string
}

export type Source = {
  id: string
  country: CountryCode
  meat: MeatSlug
  cut: string
  source_name: string
  url: string
  scraper: 'apify' | 'scrapingbee' | 'serpapi' | 'manual'
  active: boolean
  last_fetched: string
  health: 'ok' | 'stale' | 'failing'
}

export type MecState = {
  countries: Country[]
  meats: Meat[]
  cuts: Cut[]
  latestPrices: LatestPrice[]
  fx: FxRate
  freight: FreightLane[]
  news: NewsItem[]
  reports: Report[]
  sources: Source[]
  history: (params: { meat: MeatSlug; cut: string; country: CountryCode; days?: number }) => PricePoint[]
  bands: (params: { meat: MeatSlug; cut: string; country: CountryCode }) => PriceBand | undefined
}
