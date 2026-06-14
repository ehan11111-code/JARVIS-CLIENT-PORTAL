'use client'

import { use } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { ArrowLeft, Clock } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { MetricRow } from '@/components/MetricCard'
import { StatusPulse } from '@/components/StatusPulse'
import { ChartPanel } from '@/components/ChartPanel'
import { DecisionFeed } from '@/components/DecisionFeed'
import { InterventionQueue } from '@/components/InterventionQueue'
import { WorkflowDiagram } from '@/components/WorkflowDiagram'
import { ActivityTrail } from '@/components/ActivityTrail'
import { getSolution } from '@/lib/mock/data'

export default function SolutionPage({
  params
}: {
  params: Promise<{ dept: string; solution: string; locale: string }>
}) {
  const { dept: deptSlug, solution: solSlug } = use(params)
  const t = useTranslations('solution')
  const tCommon = useTranslations('common')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'

  const result = getSolution(deptSlug, solSlug)
  if (!result) notFound()
  const { dept, solution } = result

  return (
    <PageShell
      breadcrumbs={[
        { label: tNav('operations') },
        { label: tNav('departments') },
        { label: dept.name[locale] },
        { label: solution.name[locale] }
      ]}
    >
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 max-w-3xl"
      >
        <Link
          href={`/departments/${dept.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5 flip-rtl" strokeWidth={1.6} />
          {dept.name[locale]}
        </Link>
        <DisplayHeading size="lg" className="" locale={locale}>
          {solution.name[locale]}
        </DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{solution.context[locale]}</p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-8 rounded-soft border border-border bg-surface shadow-soft p-5 md:p-6 flex flex-wrap items-center gap-5"
      >
        <StatusPulse status={solution.status} />
        <div className="inline-flex items-center gap-2 text-sm text-text-soft">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span>{tCommon('lastRun')} · <span className="tabular-nums text-text">{solution.lastRun}</span></span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted">{tCommon('integratedSystems')}:</span>
          {solution.integratedSystems.map((s) => (
            <span key={s} className="text-xs font-medium text-text-soft bg-bg-soft rounded-full px-2.5 py-0.5">
              {s}
            </span>
          ))}
        </div>
      </motion.section>

      <section className="mb-8 md:mb-10">
        <h2 className="text-sm font-semibold text-text mb-4">{t('kpiRow')}</h2>
        <MetricRow kpis={solution.kpis} locale={locale} />
      </section>

      <section className="mb-8 md:mb-10">
        <ChartPanel chart={solution.chart} locale={locale} height={300} />
      </section>

      <section className="mb-8 md:mb-10 grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        <DecisionFeed decisions={solution.decisions} locale={locale} title={t('decisions')} subtitle={t('decisionsSub')} />
        <InterventionQueue interventions={solution.interventions} locale={locale} title={t('interventions')} subtitle={t('interventionsSub')} />
      </section>

      <section className="mb-8 md:mb-10">
        <WorkflowDiagram workflow={solution.workflow} title={t('workflow')} subtitle={t('workflowSub')} />
      </section>

      <section className="mb-8 md:mb-10">
        <ActivityTrail events={solution.activity} locale={locale} title={t('activity')} maxHeight={360} />
      </section>

      <footer className="border-t border-border pt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <Link
          href={`/departments/${dept.slug}`}
          className="inline-flex items-center gap-1.5 hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5 flip-rtl" strokeWidth={1.6} />
          {t('backTo', { dept: dept.name[locale] })}
        </Link>
        <span>{tCommon('moduleId')} · {solution.slug} · {tCommon('deployed')} {solution.deployedOn}</span>
      </footer>
    </PageShell>
  )
}
