'use client'

import { Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Department } from '@/lib/mock/types'
import { StatusPulse } from './StatusPulse'
import { Panel } from './Panel'

export function DeptHeatStrip({ departments, title, subtitle }: { departments: Department[]; title?: string; subtitle?: string }) {
  const locale = useLocale() as 'en' | 'ar'
  return (
    <Panel title={title} subtitle={subtitle} bodyClassName="p-2 md:p-3" showRefresh>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
        {departments.map((d, i) => (
          <motion.div
            key={d.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.025 }}
          >
            <Link
              href={`/departments/${d.slug}`}
              className="group block rounded-soft bg-bg-soft hover:bg-surface-elev hover:shadow-card transition-all p-3.5"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <StatusPulse status={d.status} showLabel={false} />
                <ArrowUpRight className="h-3.5 w-3.5 text-muted group-hover:text-accent transition-colors flip-rtl" strokeWidth={1.6} />
              </div>
              <div className="text-sm font-medium text-text leading-snug" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {d.name[locale]}
              </div>
              <div className="text-xs text-muted mt-1.5">
                {d.solutions.length} · <span className={d.openExceptions > 0 ? 'text-accent font-medium' : ''}>{d.openExceptions}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Panel>
  )
}
