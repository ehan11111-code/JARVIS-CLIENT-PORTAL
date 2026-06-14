'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Panel } from '@/components/Panel'
import { useTheme } from '@/components/ThemeProvider'
import type { PricePoint, PriceBand } from '@/lib/mock/mec-types'

function paletteFor(theme: 'light' | 'dark') {
  return {
    grid: theme === 'light' ? '#ECE9E1' : '#2A2722',
    axis: '#8A8780',
    line: '#F36C34',
    band: theme === 'light' ? '#D7D3C7' : '#3A362F',
    tooltipBg: theme === 'light' ? '#FFFFFF' : '#1A1A18',
    tooltipBorder: theme === 'light' ? '#E8E5DC' : '#2A2722',
    tooltipText: theme === 'light' ? '#1E1E1C' : '#F2F0EA'
  }
}

export function PriceExplorerChart({
  history,
  band,
  title,
  subtitle,
  height = 320
}: {
  history: PricePoint[]
  band?: PriceBand
  title?: string
  subtitle?: string
  height?: number
}) {
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations('mec.priceExplorer')
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const p = paletteFor(theme)

  return (
    <Panel title={title} subtitle={subtitle}>
      <div style={{ height }}>
        {mounted && history.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="usd-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={p.line} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={p.line} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 4" stroke={p.grid} vertical={false} />
              <XAxis dataKey="t" tick={{ fill: p.axis, fontSize: 11 }} axisLine={false} tickLine={false} reversed={locale === 'ar'} />
              <YAxis tick={{ fill: p.axis, fontSize: 11 }} axisLine={false} tickLine={false} orientation={locale === 'ar' ? 'right' : 'left'} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              <Tooltip
                cursor={{ stroke: p.line, strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ background: p.tooltipBg, border: `1px solid ${p.tooltipBorder}`, borderRadius: 10, fontSize: 12, color: p.tooltipText }}
                labelStyle={{ color: p.axis, fontWeight: 500 }}
                formatter={(v: number) => [`$${v.toFixed(2)}/kg`, 'USD']}
              />
              {band && (
                <>
                  <ReferenceLine y={band.p25} stroke={p.band} strokeDasharray="2 4" label={{ value: `p25 $${band.p25}`, position: 'right', fill: p.axis, fontSize: 10 }} />
                  <ReferenceLine y={band.p50} stroke={p.axis} strokeDasharray="2 4" label={{ value: `p50 $${band.p50}`, position: 'right', fill: p.axis, fontSize: 10 }} />
                  <ReferenceLine y={band.p75} stroke={p.band} strokeDasharray="2 4" label={{ value: `p75 $${band.p75}`, position: 'right', fill: p.axis, fontSize: 10 }} />
                </>
              )}
              <Area type="monotone" dataKey="usd" stroke={p.line} strokeWidth={2.2} fill="url(#usd-grad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {mounted && history.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-muted">{t('noData')}</div>
        )}
      </div>
      {band && (
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
          <span>{t('p25')}: <span className="text-text-soft font-medium">${band.p25}</span></span>
          <span>{t('p50')}: <span className="text-text-soft font-medium">${band.p50}</span></span>
          <span>{t('p75')}: <span className="text-text-soft font-medium">${band.p75}</span></span>
          <span className="text-muted">{band.samples} {t('samples')}</span>
        </div>
      )}
    </Panel>
  )
}
