'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import {
  ArrowUpRight,
  Coins,
  TrendingUp,
  Clock4,
  Sparkles,
  Wallet,
  AlertOctagon,
  Truck,
  ShieldCheck,
  Heart,
  Building2
} from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { Panel } from '@/components/Panel'
import { ChartPanel } from '@/components/ChartPanel'
import {
  getSavingsState,
  formatSar,
  formatHours,
  type DeptSavings,
  type SavingsCategoryKey
} from '@/lib/mock/savings'

const CATEGORY_ICON: Record<SavingsCategoryKey, typeof Coins> = {
  labor: Clock4,
  errors: AlertOctagon,
  capital: Wallet,
  vendor: Truck,
  compliance: ShieldCheck,
  churn: Heart
}

export default function TotalSavingsPage() {
  const t = useTranslations('savings')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const s = useMemo(() => getSavingsState(), [])

  const savedThisYear = formatSar(s.ytdSar, locale)
  const savedThisMonth = formatSar(s.monthSar, locale)
  const runRate = formatSar(s.runRateAnnualSar, locale)

  return (
    <PageShell breadcrumbs={[{ label: tNav('operations') }, { label: tNav('totalSavings') }]}>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 md:mb-10 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft text-accent px-3 py-1 text-xs font-medium">
          <Coins className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden />
          {t('eyebrow')}
        </div>
        <DisplayHeading size="lg" className="mt-4" locale={locale}>
          {t('headline')}
        </DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.04 }}
        className="mb-8 md:mb-10 rounded-soft border border-border bg-surface shadow-soft p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8"
      >
        <HeroMetric
          eyebrow={t('ytdEyebrow')}
          label={t('ytdLabel')}
          value={savedThisYear}
          highlight
        />
        <HeroMetric eyebrow={t('monthEyebrow')} label={t('monthLabel')} value={savedThisMonth} />
        <HeroMetric eyebrow={t('annualEyebrow')} label={t('runRateLabel')} value={runRate} />
      </motion.section>

      <section className="mb-8 md:mb-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <SecondaryMetric
          icon={TrendingUp}
          label={t('roiLabel')}
          value={`${s.roiMultiplier.toFixed(2)}×`}
          accent
        />
        <SecondaryMetric icon={Clock4} label={t('fteHoursLabel')} value={formatHours(s.fteHoursReclaimed, locale)} />
        <SecondaryMetric icon={Sparkles} label={t('modulesLabel')} value={String(s.modulesContributing)} />
        <SecondaryMetric
          icon={Building2}
          label={t('byDept.modules')}
          value={`${s.byDept.length} ${locale === 'ar' ? 'قسم' : 'depts'}`}
        />
      </section>

      <section className="mb-8 md:mb-10">
        <Panel
          title={t('comparison')}
          subtitle={t('comparisonSub')}
          showRefresh
          bodyClassName="px-5 md:px-6 pb-5 md:pb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-5">
            <CompareCard
              label={t('withoutJarvis')}
              value={formatSar(s.baselineCostSar, locale)}
              tone="muted"
            />
            <CompareCard
              label={t('withJarvis')}
              value={formatSar(s.withJarvisCostSar, locale)}
              tone="success"
            />
            <CompareCard
              label={t('savingsBlock')}
              value={formatSar(s.baselineCostSar - s.withJarvisCostSar, locale)}
              tone="accent"
            />
          </div>
          <CompareBar baseline={s.baselineCostSar} withJ={s.withJarvisCostSar} locale={locale} t={t} />
        </Panel>
      </section>

      <section className="mb-8 md:mb-10 grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        <ChartPanel chart={s.monthlyTrend} locale={locale} height={260} title={t('trend')} />
        <ChartPanel chart={s.comparisonTrend} locale={locale} height={260} />
      </section>

      <section className="mb-8 md:mb-10">
        <Panel title={t('categories')} subtitle={t('categoriesSub')} showRefresh>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {s.categories.map((c, i) => {
              const Icon = CATEGORY_ICON[c.key]
              return (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.035 }}
                  className="rounded-soft border border-border bg-bg-soft/60 p-4 md:p-5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-accent-soft text-accent">
                      <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                    </span>
                    <span className="text-xs text-muted">{t(`categoryKeys.${c.key}`)}</span>
                  </div>
                  <div>
                    <div className="font-display font-semibold text-2xl text-text tabular-nums leading-none">
                      {formatSar(c.amountSar, locale)}
                    </div>
                    <div className="text-sm font-medium text-text-soft mt-2">{c.label[locale]}</div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{c.description[locale]}</p>
                  <div className="text-[11px] font-medium text-text-soft bg-surface border border-border rounded-full px-2.5 py-1 self-start">
                    {c.detail[locale]}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Panel>
      </section>

      <section className="mb-8 md:mb-10">
        <Panel
          title={t('deptBreakdown')}
          subtitle={t('deptBreakdownSub')}
          showRefresh
          bodyClassName="px-0 pb-0"
        >
          <div className="overflow-x-auto scrollbar-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted border-b border-border">
                  <th className="text-start font-medium px-5 md:px-6 py-3">{t('byDept.ytd')}</th>
                  <th className="text-start font-medium px-3 py-3 hidden md:table-cell">
                    {t('byDept.monthly')}
                  </th>
                  <th className="text-start font-medium px-3 py-3 hidden lg:table-cell">
                    {t('byDept.fteHours')}
                  </th>
                  <th className="text-start font-medium px-3 py-3 hidden lg:table-cell">
                    {t('byDept.modules')}
                  </th>
                  <th className="text-start font-medium px-3 py-3 hidden md:table-cell">
                    {t('byDept.topCategory')}
                  </th>
                  <th className="text-end font-medium px-5 md:px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {s.byDept.map((d) => (
                  <DeptRow key={d.slug} dept={d} locale={locale} t={t} />
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>

      <section className="mb-8 md:mb-10 grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        {s.byDept.slice(0, 2).map((d) => (
          <Panel
            key={`drivers-${d.slug}`}
            title={`${d.name[locale]} · ${t('drivers')}`}
            subtitle={t('driversSub')}
            showRefresh
          >
            <ul className="space-y-3">
              {d.drivers.map((dr) => {
                const max = Math.max(...d.drivers.map((x) => x.valueSar))
                const pct = (dr.valueSar / max) * 100
                return (
                  <li key={dr.label.en} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-text-soft truncate">{dr.label[locale]}</span>
                      <span className="text-text font-semibold tabular-nums">{formatSar(dr.valueSar, locale)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-bg-soft overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${pct}%` }}
                        aria-hidden
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </Panel>
        ))}
      </section>

      <section>
        <Panel title={t('methodology')}>
          <p className="text-sm text-text-soft leading-relaxed">{t('methodologyBody')}</p>
        </Panel>
      </section>
    </PageShell>
  )
}

function HeroMetric({
  eyebrow,
  label,
  value,
  highlight
}: {
  eyebrow: string
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] uppercase tracking-[0.12em] text-muted">{eyebrow}</span>
      <span
        className={
          'font-display font-semibold tabular-nums leading-none tracking-tight text-3xl md:text-4xl lg:text-5xl ' +
          (highlight ? 'text-accent' : 'text-text')
        }
      >
        {value}
      </span>
      <span className="text-sm text-text-soft mt-1">{label}</span>
    </div>
  )
}

function SecondaryMetric({
  icon: Icon,
  label,
  value,
  accent
}: {
  icon: typeof Coins
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="rounded-soft border border-border bg-surface shadow-soft p-4 flex items-start gap-3">
      <span
        className={
          'inline-flex items-center justify-center h-9 w-9 rounded-full ' +
          (accent ? 'bg-accent-soft text-accent' : 'bg-bg-soft text-text-soft')
        }
      >
        <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="text-xs text-muted leading-tight">{label}</div>
        <div className={'font-display font-semibold text-xl md:text-2xl tabular-nums leading-none mt-1.5 ' + (accent ? 'text-accent' : 'text-text')}>
          {value}
        </div>
      </div>
    </div>
  )
}

function CompareCard({
  label,
  value,
  tone
}: {
  label: string
  value: string
  tone: 'muted' | 'success' | 'accent'
}) {
  const toneClass =
    tone === 'accent' ? 'text-accent' : tone === 'success' ? 'text-success' : 'text-text-soft'
  return (
    <div className="rounded-soft border border-border bg-bg-soft/60 p-4 md:p-5">
      <div className="text-xs text-muted">{label}</div>
      <div className={'font-display font-semibold text-2xl md:text-3xl tabular-nums leading-none tracking-tight mt-2 ' + toneClass}>
        {value}
      </div>
    </div>
  )
}

function CompareBar({
  baseline,
  withJ,
  locale,
  t
}: {
  baseline: number
  withJ: number
  locale: 'en' | 'ar'
  t: (key: string) => string
}) {
  const savedPct = ((baseline - withJ) / baseline) * 100
  const withPct = (withJ / baseline) * 100
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted mb-1.5">
        <span>{t('withoutJarvis')} · {formatSar(baseline, locale)}</span>
        <span>−{savedPct.toFixed(0)}%</span>
      </div>
      <div className="relative h-3 rounded-full bg-bg-soft overflow-hidden">
        <div
          className="absolute inset-y-0 start-0 bg-text-soft/40"
          style={{ width: '100%' }}
          aria-hidden
        />
        <div
          className="absolute inset-y-0 start-0 bg-accent"
          style={{ width: `${withPct}%` }}
          aria-hidden
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted mt-1.5">
        <span>{t('withJarvis')} · {formatSar(withJ, locale)}</span>
        <span className="text-success font-medium">{formatSar(baseline - withJ, locale)} {locale === 'ar' ? 'وفر' : 'saved'}</span>
      </div>
    </div>
  )
}

function DeptRow({
  dept,
  locale,
  t
}: {
  dept: DeptSavings
  locale: 'en' | 'ar'
  t: (key: string) => string
}) {
  return (
    <tr className="hover:bg-bg-soft/60 transition-colors">
      <td className="px-5 md:px-6 py-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-text">{dept.name[locale]}</span>
          <span className="text-xs text-accent font-semibold tabular-nums">{formatSar(dept.ytdSar, locale)}</span>
        </div>
      </td>
      <td className="px-3 py-3.5 hidden md:table-cell text-sm text-text-soft tabular-nums">
        {formatSar(dept.monthlySar, locale)}
      </td>
      <td className="px-3 py-3.5 hidden lg:table-cell text-sm text-text-soft tabular-nums">
        {dept.fteHoursReclaimed.toLocaleString('en-US')}
      </td>
      <td className="px-3 py-3.5 hidden lg:table-cell text-sm text-text-soft tabular-nums">
        {dept.modules}
      </td>
      <td className="px-3 py-3.5 hidden md:table-cell">
        <span className="inline-flex items-center text-[11px] font-medium text-text-soft bg-bg-soft rounded-full px-2.5 py-0.5">
          {t(`categoryKeys.${dept.topCategory}`)}
        </span>
      </td>
      <td className="px-5 md:px-6 py-3.5 text-end">
        <Link
          href={`/departments/${dept.slug}`}
          className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-strong"
        >
          {t('viewDept')}
          <ArrowUpRight className="h-3 w-3 flip-rtl" strokeWidth={1.7} />
        </Link>
      </td>
    </tr>
  )
}
