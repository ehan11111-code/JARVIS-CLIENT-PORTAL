'use client'

import { clsx } from 'clsx'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { AlertOctagon, FileWarning, Truck, TrendingUp, Stethoscope, ExternalLink } from 'lucide-react'
import type { NewsItem } from '@/lib/mock/mec-types'
import { COUNTRIES } from '@/lib/mock/mec-catalog'

const CAT_ICON = {
  crisis: AlertOctagon,
  policy: FileWarning,
  disease: Stethoscope,
  freight: Truck,
  market: TrendingUp
}

const SEV_TONE: Record<number, { bg: string; text: string; dot: string }> = {
  5: { bg: 'bg-accent-soft', text: 'text-accent', dot: 'bg-accent' },
  4: { bg: 'bg-warn-soft', text: 'text-warn', dot: 'bg-warn' },
  3: { bg: 'bg-bg-soft', text: 'text-text-soft', dot: 'bg-text-soft' },
  2: { bg: 'bg-bg-soft', text: 'text-muted', dot: 'bg-muted' },
  1: { bg: 'bg-bg-soft', text: 'text-muted', dot: 'bg-muted' }
}

function relTime(ts: string, locale: 'en' | 'ar') {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return locale === 'ar' ? 'الآن' : 'just now'
  if (m < 60) return locale === 'ar' ? `قبل ${m} د` : `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return locale === 'ar' ? `قبل ${h} س` : `${h}h ago`
  const d = Math.floor(h / 24)
  return locale === 'ar' ? `قبل ${d} يوم` : `${d}d ago`
}

export function CrisisRow({ item, index = 0, compact }: { item: NewsItem; index?: number; compact?: boolean }) {
  const locale = useLocale() as 'en' | 'ar'
  const tCat = useTranslations('mec.crisis.categories')
  const tCrisis = useTranslations('mec.crisis')
  const Icon = CAT_ICON[item.category]
  const tone = SEV_TONE[item.severity]
  const country = COUNTRIES.find((c) => c.code === item.country)

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.025 }}
      className={clsx('flex items-start gap-4 px-5 md:px-6 py-4', !compact && 'hover:bg-bg-soft/60 transition-colors')}
    >
      <span className={clsx('shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full', tone.bg)}>
        <Icon className={clsx('h-4 w-4', tone.text)} strokeWidth={1.7} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <span className={clsx('inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2 py-0.5', tone.bg, tone.text)}>
            <span className={clsx('inline-block h-1.5 w-1.5 rounded-full', tone.dot)} />
            {tCrisis('severity')} {item.severity}
          </span>
          <span className="text-[11px] font-medium text-text-soft bg-bg-soft rounded-full px-2 py-0.5">
            {tCat(item.category)}
          </span>
          {country ? (
            <span className="text-[11px] font-medium text-text-soft bg-bg-soft rounded-full px-2 py-0.5">
              {country.flag} {country.name[locale]}
            </span>
          ) : (
            <span className="text-[11px] font-medium text-text-soft bg-bg-soft rounded-full px-2 py-0.5">
              🌐 {locale === 'ar' ? 'عالمي' : 'Global'}
            </span>
          )}
          <span className="text-xs text-muted">{relTime(item.published_at, locale)}</span>
        </div>
        <h3 className="text-sm font-semibold text-text leading-snug">{item.headline[locale]}</h3>
        {!compact && <p className="text-sm text-text-soft leading-relaxed mt-1.5">{item.summary[locale]}</p>}
      </div>
      {item.url && item.url !== '#' && (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-bg-soft transition-colors"
          aria-label="Source"
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted" strokeWidth={1.6} />
        </a>
      )}
    </motion.article>
  )
}
