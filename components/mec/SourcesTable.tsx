'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'
import { Panel } from '@/components/Panel'
import { COUNTRIES, CUTS, MEATS } from '@/lib/mock/mec-catalog'
import type { Source } from '@/lib/mock/mec-types'

const HEALTH_TONE: Record<Source['health'], string> = {
  ok: 'bg-success-soft text-success',
  stale: 'bg-warn-soft text-warn',
  failing: 'bg-accent-soft text-accent'
}

function relTime(ts: string, locale: 'en' | 'ar') {
  const diff = Date.now() - new Date(ts).getTime()
  const h = Math.floor(diff / 1000 / 60 / 60)
  if (h < 1) return locale === 'ar' ? 'منذ <1س' : '<1h'
  if (h < 24) return locale === 'ar' ? `قبل ${h}س` : `${h}h ago`
  const d = Math.floor(h / 24)
  return locale === 'ar' ? `قبل ${d}ي` : `${d}d ago`
}

export function SourcesTable({ sources, title, subtitle }: { sources: Source[]; title?: string; subtitle?: string }) {
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations('mec.admin')
  const [rows, setRows] = useState<Source[]>(sources)
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [meatFilter, setMeatFilter] = useState<string>('all')
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (countryFilter !== 'all' && r.country !== countryFilter) return false
      if (meatFilter !== 'all' && r.meat !== meatFilter) return false
      return true
    })
  }, [rows, countryFilter, meatFilter])

  const toggleActive = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))
  }
  const scrape = (id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, last_fetched: new Date().toISOString(), health: 'ok' }
          : r
      )
    )
    setToast(t('scrapeQueued'))
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <Panel
      title={title}
      subtitle={subtitle}
      action={
        <div className="flex items-center gap-2">
          <Select label={t('table.country')} value={countryFilter} onChange={setCountryFilter}>
            <option value="all">{t('all')}</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </Select>
          <Select label={t('table.meat')} value={meatFilter} onChange={setMeatFilter}>
            <option value="all">{t('all')}</option>
            {MEATS.map((m) => (
              <option key={m.slug} value={m.slug}>{m.name[locale]}</option>
            ))}
          </Select>
        </div>
      }
      bodyClassName="px-0 pb-0"
    >
      <div className="overflow-x-auto scrollbar-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted border-b border-border">
              <th className="text-start font-medium px-5 md:px-6 py-3">{t('table.source')}</th>
              <th className="text-start font-medium px-3 py-3 hidden md:table-cell">{t('table.country')}</th>
              <th className="text-start font-medium px-3 py-3 hidden lg:table-cell">{t('table.meat')} / {t('table.cut')}</th>
              <th className="text-start font-medium px-3 py-3 hidden lg:table-cell">{t('table.scraper')}</th>
              <th className="text-start font-medium px-3 py-3">{t('table.lastFetched')}</th>
              <th className="text-start font-medium px-3 py-3">{t('table.health')}</th>
              <th className="text-start font-medium px-3 py-3">{t('table.active')}</th>
              <th className="text-end font-medium px-5 md:px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((s) => {
              const country = COUNTRIES.find((c) => c.code === s.country)
              const meat = MEATS.find((m) => m.slug === s.meat)
              const cut = CUTS.find((c) => c.slug === s.cut)
              return (
                <tr key={s.id} className="hover:bg-bg-soft/60 transition-colors">
                  <td className="px-5 md:px-6 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-text truncate" dir="ltr">{s.source_name}</span>
                      <a href={s.url} target="_blank" rel="noreferrer" className="text-muted hover:text-accent">
                        <ExternalLink className="h-3 w-3" strokeWidth={1.6} />
                      </a>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-soft">
                      <span className="text-sm">{country?.flag}</span>
                      {s.country}
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell text-xs text-text-soft">
                    {meat?.name[locale]} · {cut?.name[locale]}
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell text-xs text-muted uppercase">{s.scraper}</td>
                  <td className="px-3 py-3 text-xs text-muted tabular-nums">{relTime(s.last_fetched, locale)}</td>
                  <td className="px-3 py-3">
                    <span className={clsx('inline-flex items-center text-[11px] font-medium rounded-full px-2 py-0.5', HEALTH_TONE[s.health])}>
                      {t(`health${s.health.charAt(0).toUpperCase()}${s.health.slice(1)}`)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(s.id)}
                      role="switch"
                      aria-checked={s.active}
                      className={
                        'inline-flex h-5 w-9 items-center rounded-full transition-colors ' +
                        (s.active ? 'bg-success' : 'bg-bg-soft border border-border')
                      }
                    >
                      <span
                        className={
                          'inline-block h-4 w-4 transform rounded-full bg-surface shadow-soft transition-transform ' +
                          (s.active ? 'translate-x-4' : 'translate-x-0.5')
                        }
                      />
                    </button>
                  </td>
                  <td className="px-5 md:px-6 py-3 text-end">
                    <button
                      type="button"
                      onClick={() => scrape(s.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface hover:bg-surface-elev text-text-soft hover:text-text px-2.5 py-1 text-xs font-medium transition-colors"
                    >
                      <Play className="h-3 w-3" strokeWidth={1.7} />
                      {t('scrapeNow')}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="px-5 md:px-6 py-3 border-t border-border text-xs text-success bg-success-soft"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  )
}

function Select({
  label,
  value,
  onChange,
  children
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-muted">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full bg-bg-soft border border-border text-xs text-text-soft hover:text-text focus:border-accent px-2.5 py-1 transition-colors"
      >
        {children}
      </select>
    </label>
  )
}
