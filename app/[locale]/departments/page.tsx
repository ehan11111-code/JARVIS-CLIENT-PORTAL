'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { DepartmentCard } from '@/components/DepartmentCard'
import { getFirmState } from '@/lib/mock/data'

export default function DepartmentsIndex() {
  const t = useTranslations('depts')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const firm = getFirmState()

  return (
    <PageShell breadcrumbs={[{ label: tNav('operations') }, { label: tNav('departments') }]}>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-10 max-w-3xl"
      >
        <div className="text-xs font-medium text-accent">{t('indexEyebrow')}</div>
        <DisplayHeading size="lg" className="mt-2" locale={locale}>
          {t('indexHeadline')}
        </DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('indexSubline')}</p>
      </motion.header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {firm.departments.map((d, i) => (
          <DepartmentCard key={d.slug} dept={d} index={i} />
        ))}
      </section>
    </PageShell>
  )
}
