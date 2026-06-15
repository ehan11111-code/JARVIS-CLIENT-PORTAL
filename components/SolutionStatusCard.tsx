'use client'

import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Solution } from '@/lib/mock/types'
import { StatusPulse } from './StatusPulse'

export function SolutionStatusCard({
  deptSlug,
  solution,
  index = 0
}: {
  deptSlug: string
  solution: Solution
  index?: number
}) {
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations('common')
  const primary = solution.kpis[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <Link
        href={`/departments/${deptSlug}/${solution.slug}`}
        className="group block rounded-soft border border-border bg-surface shadow-soft hover:shadow-card hover:border-border-strong transition-all p-5 md:p-6"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <StatusPulse status={solution.status} />
          <ArrowUpRight className="h-4 w-4 text-muted group-hover:text-accent transition-colors flip-rtl" strokeWidth={1.6} />
        </div>
        <h3 className="text-base font-semibold text-text leading-snug">{solution.name[locale]}</h3>
        <p className="text-xs text-muted mt-2">
          {t('lastRun')} · <span className="tabular-nums">{solution.lastRun}</span>
        </p>
        {primary && (
          <div className="mt-5 pt-4 border-t border-border flex items-end justify-between gap-3">
            <div>
              <div className="text-xs text-muted">{primary.label[locale]}</div>
              <div className="font-display font-semibold text-2xl text-text tabular-nums leading-none tracking-tight mt-1.5">
                {primary.value}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {solution.integratedSystems.slice(0, 3).map((s) => (
                <span key={s} className="text-[10px] font-medium text-text-soft bg-bg-soft rounded-full px-2 py-0.5">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  )
}
