'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { clsx } from 'clsx'
import { Panel } from '@/components/Panel'
import { COUNTRIES, CUTS, MEATS } from '@/lib/mock/mec-catalog'
import type { LatestPrice, FxRate, MeatSlug } from '@/lib/mock/mec-types'

export function PriceGrid({
  latest,
  fx,
  title,
  subtitle,
  defaultMeat = 'beef'
}: {
  latest: LatestPrice[]
  fx: FxRate
  title?: string
  subtitle?: string
  defaultMeat?: MeatSlug
}) {
  const locale = useLocale() as 'en' | 'ar'
  const [meat, setMeat] = useState<MeatSlug>(defaultMeat)

  const cuts = useMemo(() => CUTS.filter((c) => c.meat === meat), [meat])
  const byCut = useMemo(() => {
    const map = new Map<string, LatestPrice[]>()
    for (const p of latest.filter((p) => p.meat === meat)) {
      const arr = map.get(p.cut) ?? []
      arr.push(p)
      map.set(p.cut, arr)
    }
    return map
  }, [latest, meat])

  return (
    <Panel
      title={title}
      subtitle={subtitle}
      action={
        <div className="flex items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5">
          {MEATS.map((m) => (
            <button
              key={m.slug}
              type="button"
              onClick={() => setMeat(m.slug)}
              className={clsx(
                'px-2.5 py-1 text-xs font-medium rounded-full transition-colors',
                meat === m.slug ? 'bg-surface text-text shadow-soft' : 'text-text-soft hover:text-text'
              )}
            >
              {m.name[locale]}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-4">
        {cuts.map((cut, ci) => {
          const rows = (byCut.get(cut.slug) ?? []).sort((a, b) => a.price_usd_per_kg - b.price_usd_per_kg)
          if (rows.length === 0) return null
          return (
            <motion.div
              key={cut.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: ci * 0.04 }}
              className="rounded-soft border border-border bg-bg-soft/60 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-bg-soft">
                <div className="text-sm font-semibold text-text">{cut.name[locale]}</div>
                <div className="text-xs text-muted">{rows.length} {locale === 'ar' ? 'مصدر' : 'origins'}</div>
              </div>
              <div className="divide-y divide-border">
                {rows.map((r, i) => {
                  const country = COUNTRIES.find((c) => c.code === r.country)!
                  const sar = r.price_usd_per_kg * fx.rate
                  const dArrow =
                    r.delta_7d_pct > 0.5 ? <ArrowUp className="h-3 w-3" /> : r.delta_7d_pct < -0.5 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />
                  const dTone =
                    r.delta_7d_pct > 0.5 ? 'text-accent' : r.delta_7d_pct < -0.5 ? 'text-success' : 'text-muted'
                  const cheapest = i === 0
                  return (
                    <div key={r.country} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-4 py-2.5 bg-surface">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg leading-none">{country.flag}</span>
                        <span className="text-sm text-text truncate">{country.name[locale]}</span>
                        {cheapest && (
                          <span className="text-[10px] font-semibold text-success bg-success-soft rounded-full px-2 py-0.5">
                            {locale === 'ar' ? 'الأرخص' : 'cheapest'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-text font-semibold tabular-nums">
                        ${r.price_usd_per_kg.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted tabular-nums hidden md:block">
                        {sar.toFixed(2)} SAR
                      </div>
                      <div className={clsx('inline-flex items-center gap-1 text-xs font-medium tabular-nums', dTone)}>
                        {dArrow}
                        {Math.abs(r.delta_7d_pct).toFixed(1)}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Panel>
  )
}
