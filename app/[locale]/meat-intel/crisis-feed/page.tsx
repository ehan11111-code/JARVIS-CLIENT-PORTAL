'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { Panel } from '@/components/Panel'
import { CrisisRow } from '@/components/mec/CrisisRow'
import { COUNTRIES } from '@/lib/mock/mec-catalog'
import { getMecState } from '@/lib/mock/mec-data'
import type { NewsCategory } from '@/lib/mock/mec-types'

const CATEGORIES: NewsCategory[] = ['crisis', 'policy', 'disease', 'freight', 'market']

export default function MecCrisisFeed() {
  const t = useTranslations('mec.crisis')
  const tMec = useTranslations('mec')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const mec = getMecState()

  const [minSeverity, setMinSeverity] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [country, setCountry] = useState<string>('all')
  const [category, setCategory] = useState<string>('all')

  const filtered = useMemo(() => {
    return mec.news.filter((n) => {
      if (n.severity < minSeverity) return false
      if (country !== 'all' && n.country !== country) return false
      if (category !== 'all' && n.category !== category) return false
      return true
    })
  }, [mec.news, minSeverity, country, category])

  return (
    <PageShell
      breadcrumbs={[
        { label: tNav('operations') },
        { label: tNav('meatIntel') },
        { label: tMec('subnav.crisisFeed') }
      ]}
    >
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 max-w-3xl"
      >
        <div className="text-xs font-medium text-accent">{tMec('subnav.crisisFeed')}</div>
        <DisplayHeading size="lg" className="mt-2" locale={locale}>{t('headline')}</DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <Panel
        bodyClassName="px-0 pb-0"
        title={t('headline')}
        subtitle={`${filtered.length} ${locale === 'ar' ? 'بند' : 'items'}`}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Filter label={t('filterSeverity')}>
              <select value={minSeverity} onChange={(e) => setMinSeverity(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)} className="rounded-full bg-bg-soft border border-border text-xs text-text-soft hover:text-text focus:border-accent px-2.5 py-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <option key={s} value={s}>≥ {s}</option>
                ))}
              </select>
            </Filter>
            <Filter label={t('filterCountry')}>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-full bg-bg-soft border border-border text-xs text-text-soft hover:text-text focus:border-accent px-2.5 py-1">
                <option value="all">{locale === 'ar' ? 'الكل' : 'All'}</option>
                <option value="GLOBAL">🌐</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
            </Filter>
            <Filter label={t('filterCategory')}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full bg-bg-soft border border-border text-xs text-text-soft hover:text-text focus:border-accent px-2.5 py-1">
                <option value="all">{locale === 'ar' ? 'الكل' : 'All'}</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{t(`categories.${c}`)}</option>
                ))}
              </select>
            </Filter>
          </div>
        }
      >
        <ul className={clsx('divide-y divide-border', filtered.length === 0 && 'py-12 text-center text-sm text-muted')}>
          {filtered.length === 0 ? (
            <li className="px-6">{locale === 'ar' ? 'لا توجد عناصر مطابقة.' : 'No items match these filters.'}</li>
          ) : (
            filtered.map((n, i) => (
              <li key={n.id}>
                <CrisisRow item={n} index={i} />
              </li>
            ))
          )}
        </ul>
      </Panel>
    </PageShell>
  )
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-muted">
      {label}
      {children}
    </label>
  )
}
