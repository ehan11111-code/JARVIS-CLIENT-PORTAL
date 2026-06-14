'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { ArrowUpRight } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { PriceGrid } from '@/components/mec/PriceGrid'
import { VerdictCard } from '@/components/mec/VerdictCard'
import { FxBadge } from '@/components/mec/FxBadge'
import { FreightStrip } from '@/components/mec/FreightStrip'
import { CrisisRow } from '@/components/mec/CrisisRow'
import { Panel } from '@/components/Panel'
import { getMecState, deriveVerdict } from '@/lib/mock/mec-data'

export default function MecDashboard() {
  const t = useTranslations('mec')
  const tDash = useTranslations('mec.dashboard')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const mec = getMecState()
  const topCrisis = mec.news.filter((n) => n.severity >= 4).slice(0, 4)
  const verdict = deriveVerdict('beef:ribeye:dashboard')

  return (
    <PageShell breadcrumbs={[{ label: tNav('operations') }, { label: tNav('meatIntel') }]}>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 max-w-3xl"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft text-accent px-3 py-1 text-xs font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {t('eyebrow')}
          </div>
          <FxBadge fx={mec.fx} />
        </div>
        <DisplayHeading size="lg" locale={locale}>{tDash('headline')}</DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{tDash('subline')}</p>
      </motion.header>

      <section className="mb-7 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <PriceGrid latest={mec.latestPrices} fx={mec.fx} title={tDash('currentPrices')} subtitle={tDash('currentPricesSub')} />
        </div>
        <div className="space-y-5">
          <VerdictCard verdict={verdict} title={tDash('verdict')} subtitle={tDash('verdictSub')} />
          <Panel
            title={tDash('topCrisis')}
            action={
              <Link
                href="/meat-intel/crisis-feed"
                className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-strong"
              >
                {t('actions.viewAll')}
                <ArrowUpRight className="h-3 w-3 flip-rtl" strokeWidth={1.7} />
              </Link>
            }
            bodyClassName="px-0 pb-0"
          >
            <ul className="divide-y divide-border">
              {topCrisis.map((n, i) => (
                <li key={n.id}>
                  <CrisisRow item={n} index={i} compact />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>

      <section>
        <FreightStrip freight={mec.freight.slice(0, 6)} title={tDash('freight')} subtitle={tDash('freightSub')} />
      </section>
    </PageShell>
  )
}
