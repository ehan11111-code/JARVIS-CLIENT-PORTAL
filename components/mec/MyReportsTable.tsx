'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ExternalLink, MessageCircle, Globe } from 'lucide-react'
import { clsx } from 'clsx'
import { Panel } from '@/components/Panel'
import { VerdictChip } from './VerdictCard'
import type { Report } from '@/lib/mock/mec-types'
import { CUTS, MEATS } from '@/lib/mock/mec-catalog'

export function MyReportsTable({ reports, title, subtitle }: { reports: Report[]; title?: string; subtitle?: string }) {
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations('mec.myReports')
  const tChan = useTranslations('mec.channels')

  if (reports.length === 0) {
    return (
      <Panel title={title} subtitle={subtitle}>
        <p className="text-sm text-muted py-8 text-center">{t('empty')}</p>
      </Panel>
    )
  }

  return (
    <Panel title={title} subtitle={subtitle} bodyClassName="px-0 pb-0">
      <ul className="divide-y divide-border">
        {reports.map((r, i) => {
          const meatName = MEATS.find((m) => m.slug === r.meat)?.name[locale]
          const cutName = CUTS.find((c) => c.slug === r.cut)?.name[locale]
          const date = new Date(r.requested_at)
          return (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="px-5 md:px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <span className="text-xs text-muted tabular-nums">{date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { day: '2-digit', month: 'short' })}</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-soft bg-bg-soft rounded-full px-2 py-0.5">
                    {r.channel === 'web' ? <Globe className="h-3 w-3" strokeWidth={1.6} /> : <MessageCircle className="h-3 w-3" strokeWidth={1.6} />}
                    {tChan(r.channel)}
                  </span>
                </div>
                <p className="text-sm text-text leading-snug">
                  {meatName} · {cutName} · {r.countries.join(' / ')} → {r.dest_port}
                </p>
                {r.summary && <p className="text-xs text-muted mt-1 line-clamp-1">{r.summary[locale]}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {r.verdict && <VerdictChip verdict={r.verdict} />}
                <a
                  href={r.pdf_url || '#'}
                  className={clsx(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    r.pdf_url
                      ? 'border border-border bg-surface hover:bg-surface-elev text-text-soft hover:text-text'
                      : 'border border-border text-muted cursor-default'
                  )}
                >
                  <ExternalLink className="h-3 w-3 flip-rtl" strokeWidth={1.6} />
                  PDF
                </a>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </Panel>
  )
}
