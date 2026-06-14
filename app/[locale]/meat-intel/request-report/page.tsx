'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { ReportRequestForm } from '@/components/mec/ReportRequestForm'
import { WhatsAppOptIn } from '@/components/mec/WhatsAppOptIn'

export default function MecRequestReport() {
  const t = useTranslations('mec.request')
  const tNav = useTranslations('nav')
  const tMec = useTranslations('mec')
  const locale = useLocale() as 'en' | 'ar'

  return (
    <PageShell
      breadcrumbs={[
        { label: tNav('operations') },
        { label: tNav('meatIntel') },
        { label: tMec('subnav.requestReport') }
      ]}
    >
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 max-w-3xl"
      >
        <div className="text-xs font-medium text-accent">{tMec('subnav.requestReport')}</div>
        <DisplayHeading size="lg" className="mt-2" locale={locale}>{t('headline')}</DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 md:gap-6 items-start">
        <ReportRequestForm />
        <div className="lg:sticky lg:top-24">
          <WhatsAppOptIn />
        </div>
      </div>
    </PageShell>
  )
}
