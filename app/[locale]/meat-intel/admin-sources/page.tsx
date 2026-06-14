'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { Panel } from '@/components/Panel'
import { AdminToggle, useAdminMode } from '@/components/mec/AdminToggle'
import { SourcesTable } from '@/components/mec/SourcesTable'
import { getMecState } from '@/lib/mock/mec-data'

export default function MecAdminSources() {
  const t = useTranslations('mec.admin')
  const tMec = useTranslations('mec')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const mec = getMecState()
  const admin = useAdminMode()

  return (
    <PageShell
      breadcrumbs={[
        { label: tNav('operations') },
        { label: tNav('meatIntel') },
        { label: tMec('subnav.adminSources') }
      ]}
    >
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 max-w-3xl"
      >
        <div className="text-xs font-medium text-accent">{tMec('subnav.adminSources')}</div>
        <DisplayHeading size="lg" className="mt-2" locale={locale}>{t('headline')}</DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 md:gap-6 items-start">
        <aside className="lg:sticky lg:top-24">
          <AdminToggle />
        </aside>
        <div>
          {admin ? (
            <SourcesTable sources={mec.sources} title={t('headline')} subtitle={`${mec.sources.length} ${locale === 'ar' ? 'مصدر' : 'sources'}`} />
          ) : (
            <Panel>
              <div className="flex flex-col items-center text-center gap-3 py-10">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-bg-soft text-muted">
                  <Lock className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <p className="text-sm font-semibold text-text">{locale === 'ar' ? 'وضع الإدارة غير مفعّل' : 'Admin mode is off'}</p>
                <p className="text-sm text-muted max-w-sm">{t('adminToggleHelp')}</p>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </PageShell>
  )
}
