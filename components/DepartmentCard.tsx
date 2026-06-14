'use client'

import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Department } from '@/lib/mock/types'
import { StatusPulse } from './StatusPulse'

export function DepartmentCard({ dept, index = 0 }: { dept: Department; index?: number }) {
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations('depts')

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/departments/${dept.slug}`}
        className="group block rounded-soft border border-border bg-surface shadow-soft hover:shadow-card hover:border-border-strong transition-all p-6"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <StatusPulse status={dept.status} />
          <ArrowUpRight className="h-4 w-4 text-muted group-hover:text-accent transition-colors flip-rtl" strokeWidth={1.6} />
        </div>
        <h3 className={(locale === 'ar' ? 'font-ar' : 'font-display') + ' text-xl font-semibold text-text tracking-tight leading-snug'}>
          {dept.name[locale]}
        </h3>
        <p className="text-sm text-text-soft mt-2 leading-relaxed">{dept.contextLine[locale]}</p>
        <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted">{t('solutions')}</div>
            <div className="font-display font-semibold text-2xl text-text tabular-nums leading-none mt-1.5">{dept.solutions.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted">{t('openExceptions')}</div>
            <div className={`font-display font-semibold text-2xl tabular-nums leading-none mt-1.5 ${dept.openExceptions > 0 ? 'text-accent' : 'text-text'}`}>
              {dept.openExceptions}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
