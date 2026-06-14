'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { MyReportsTable } from '@/components/mec/MyReportsTable'
import { getMecState } from '@/lib/mock/mec-data'

export default function MecMyReports() {
  const t = useTranslations('mec.myReports')
  const tMec = useTranslations('mec')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const mec = getMecState()

  return (
    <PageShell
      breadcrumbs={[
        { label: tNav('operations') },
        { label: tNav('meatIntel') },
        { label: tMec('subnav.myReports') }
      ]}
    >
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 max-w-3xl"
      >
        <div className="text-xs font-medium text-accent">{tMec('subnav.myReports')}</div>
        <DisplayHeading size="lg" className="mt-2" locale={locale}>{t('headline')}</DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <MyReportsTable reports={mec.reports} title={t('headline')} subtitle={`${mec.reports.length} ${locale === 'ar' ? 'تقرير' : 'reports'}`} />
    </PageShell>
  )
}
