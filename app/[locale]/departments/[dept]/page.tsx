'use client'

import { use } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { MetricRow } from '@/components/MetricCard'
import { SolutionStatusCard } from '@/components/SolutionStatusCard'
import { ActivityTrail } from '@/components/ActivityTrail'
import { StatusPulse } from '@/components/StatusPulse'
import { getDepartment } from '@/lib/mock/data'

export default function DepartmentPage({ params }: { params: Promise<{ dept: string; locale: string }> }) {
  const { dept: deptSlug } = use(params)
  const t = useTranslations('dept')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const dept = getDepartment(deptSlug)
  if (!dept) notFound()

  return (
    <PageShell
      breadcrumbs={[
        { label: tNav('operations') },
        { label: tNav('departments') },
        { label: dept.name[locale] }
      ]}
    >
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-10 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 text-xs font-medium text-accent">
          {t('eyebrow')}
          <span className="text-muted">·</span>
          <StatusPulse status={dept.status} />
        </div>
        <DisplayHeading size="lg" className="mt-3" locale={locale}>
          {dept.name[locale]}
        </DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{dept.contextLine[locale]}</p>
      </motion.header>

      <section className="mb-8 md:mb-10">
        <h2 className="text-sm font-semibold text-text mb-4">{t('kpiRow')}</h2>
        <MetricRow kpis={dept.kpis} locale={locale} />
      </section>

      <section className="mb-8 md:mb-10">
        <h2 className="text-sm font-semibold text-text mb-4">{t('modules')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {dept.solutions.map((s, i) => (
            <SolutionStatusCard key={s.slug} deptSlug={dept.slug} solution={s} index={i} />
          ))}
        </div>
      </section>

      <section>
        <ActivityTrail events={dept.activity} locale={locale} title={t('activity')} subtitle={t('activitySub')} maxHeight={420} />
      </section>
    </PageShell>
  )
}
