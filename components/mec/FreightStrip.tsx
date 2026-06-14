'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Ship, ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { clsx } from 'clsx'
import { Panel } from '@/components/Panel'
import { COUNTRIES } from '@/lib/mock/mec-catalog'
import type { FreightLane } from '@/lib/mock/mec-types'

export function FreightStrip({ freight, title, subtitle }: { freight: FreightLane[]; title?: string; subtitle?: string }) {
  const locale = useLocale() as 'en' | 'ar'
  return (
    <Panel title={title} subtitle={subtitle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {freight.map((lane, i) => {
          const country = COUNTRIES.find((c) => c.code === lane.origin_country)!
          const arrow =
            lane.delta_7d_pct > 0.5 ? <ArrowUp className="h-3 w-3" /> : lane.delta_7d_pct < -0.5 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />
          const tone =
            lane.delta_7d_pct > 5 ? 'text-accent' : lane.delta_7d_pct > 0.5 ? 'text-warn' : lane.delta_7d_pct < -0.5 ? 'text-success' : 'text-muted'
          return (
            <motion.div
              key={`${lane.origin_port}-${lane.dest_port}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className="rounded-soft border border-border bg-bg-soft/60 p-3 md:p-4 flex items-center gap-3"
            >
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-surface border border-border">
                <Ship className="h-4 w-4 text-text-soft" strokeWidth={1.6} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-text leading-tight">
                  <span className="text-base">{country.flag}</span> {lane.origin_port}
                  <span className="text-muted mx-1.5">→</span>
                  {lane.dest_port}
                </div>
                <div className="text-xs text-muted mt-0.5 tabular-nums">
                  {lane.transit_days} {locale === 'ar' ? 'يوم' : 'days'} · ${lane.usd_per_container.toLocaleString()}/cnt
                </div>
              </div>
              <div className={clsx('shrink-0 inline-flex items-center gap-1 text-xs font-medium tabular-nums', tone)}>
                {arrow}
                {Math.abs(lane.delta_7d_pct).toFixed(1)}%
              </div>
            </motion.div>
          )
        })}
      </div>
    </Panel>
  )
}
