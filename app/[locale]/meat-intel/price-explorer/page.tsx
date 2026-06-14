'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { PriceExplorerChart } from '@/components/mec/PriceExplorerChart'
import { Panel } from '@/components/Panel'
import { COUNTRIES, COVERAGE, CUTS, MEATS } from '@/lib/mock/mec-catalog'
import { getMecState } from '@/lib/mock/mec-data'
import type { CountryCode, MeatSlug } from '@/lib/mock/mec-types'
import { clsx } from 'clsx'

export default function MecPriceExplorer() {
  const t = useTranslations('mec.priceExplorer')
  const tMec = useTranslations('mec')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const mec = getMecState()

  const [meat, setMeat] = useState<MeatSlug>('beef')
  const [cut, setCut] = useState<string>('ribeye')
  const [country, setCountry] = useState<CountryCode>('BR')

  const cuts = useMemo(() => CUTS.filter((c) => c.meat === meat), [meat])
  useEffect(() => {
    if (!cuts.some((c) => c.slug === cut)) setCut(cuts[0]?.slug ?? '')
  }, [meat, cuts, cut])

  const countries = (COVERAGE[meat]?.[cut] ?? []) as CountryCode[]
  useEffect(() => {
    if (!countries.includes(country)) setCountry(countries[0])
  }, [countries, country])

  const history = mec.history({ meat, cut, country, days: 90 })
  const band = mec.bands({ meat, cut, country })

  return (
    <PageShell
      breadcrumbs={[
        { label: tNav('operations') },
        { label: tNav('meatIntel') },
        { label: tMec('subnav.priceExplorer') }
      ]}
    >
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 max-w-3xl"
      >
        <div className="text-xs font-medium text-accent">{tMec('subnav.priceExplorer')}</div>
        <DisplayHeading size="lg" className="mt-2" locale={locale}>{t('headline')}</DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 md:gap-6 items-start">
        <aside className="lg:sticky lg:top-24 space-y-3">
          <Panel title={tMec('request.meat')}>
            <div className="flex flex-wrap gap-2">
              {MEATS.map((m) => (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => setMeat(m.slug)}
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                    meat === m.slug ? 'bg-accent text-white shadow-soft' : 'bg-bg-soft text-text-soft hover:text-text'
                  )}
                >
                  {m.name[locale]}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title={tMec('request.cut')}>
            <div className="flex flex-wrap gap-2">
              {cuts.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCut(c.slug)}
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                    cut === c.slug ? 'bg-text text-bg shadow-soft' : 'bg-bg-soft text-text-soft hover:text-text'
                  )}
                >
                  {c.name[locale]}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title={tMec('request.countries')}>
            <div className="flex flex-wrap gap-2">
              {countries.map((cc) => {
                const c = COUNTRIES.find((x) => x.code === cc)!
                return (
                  <button
                    key={cc}
                    type="button"
                    onClick={() => setCountry(cc)}
                    className={clsx(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                      country === cc ? 'bg-accent text-white shadow-soft' : 'bg-bg-soft text-text-soft hover:text-text'
                    )}
                  >
                    <span className="text-sm leading-none">{c.flag}</span>
                    {c.name[locale]}
                  </button>
                )
              })}
            </div>
          </Panel>
        </aside>

        <div>
          <PriceExplorerChart history={history} band={band} title={t('trend')} subtitle={t('band')} height={360} />
        </div>
      </div>
    </PageShell>
  )
}
