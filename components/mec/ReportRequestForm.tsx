'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Loader2, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { Panel } from '@/components/Panel'
import { VerdictCard } from './VerdictCard'
import { COUNTRIES, COVERAGE, CUTS, MEATS } from '@/lib/mock/mec-catalog'
import type { CountryCode, MeatSlug, PortCode, Report } from '@/lib/mock/mec-types'
import { deriveVerdict, getMecState } from '@/lib/mock/mec-data'

export function ReportRequestForm() {
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations('mec.request')
  const tCommon = useTranslations('common')
  const mec = getMecState()

  const [meat, setMeat] = useState<MeatSlug>('beef')
  const [cut, setCut] = useState<string>('ribeye')
  const [countries, setCountries] = useState<Set<CountryCode>>(new Set(['BR', 'AU']))
  const [destPort, setDestPort] = useState<PortCode>('JED')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'queued' | 'generating' | 'done'>('idle')
  const [report, setReport] = useState<Report | null>(null)

  const availableCuts = CUTS.filter((c) => c.meat === meat)
  useEffect(() => {
    if (!availableCuts.some((c) => c.slug === cut)) setCut(availableCuts[0]?.slug ?? '')
  }, [meat, availableCuts, cut])

  const availableCountries = (COVERAGE[meat]?.[cut] ?? []) as CountryCode[]
  useEffect(() => {
    setCountries((prev) => {
      const next = new Set(Array.from(prev).filter((c) => availableCountries.includes(c)))
      if (next.size === 0 && availableCountries[0]) next.add(availableCountries[0])
      return next
    })
  }, [availableCountries])

  const toggleCountry = (c: CountryCode) => {
    setCountries((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (countries.size === 0 || !meat || !cut) {
      setError(t('errorPick'))
      return
    }
    setError(null)
    const r: Report = {
      id: `RPT-${2042 + Math.floor(Math.random() * 100)}`,
      requested_at: new Date().toISOString(),
      meat,
      cut,
      countries: Array.from(countries),
      dest_port: destPort,
      channel: 'web',
      status: 'queued',
      request_text: `${MEATS.find((m) => m.slug === meat)?.name.en} · ${CUTS.find((c) => c.slug === cut)?.name.en} · ${Array.from(countries).join('/')} → ${destPort}`
    }
    setReport(r)
    setStatus('queued')
    setTimeout(() => setStatus('generating'), 800)
    setTimeout(() => {
      const verdict = deriveVerdict(`${meat}:${cut}:${Array.from(countries).join(',')}`)
      const completed: Report = {
        ...r,
        status: 'done',
        verdict,
        completed_at: new Date().toISOString(),
        summary: buildSummary(meat, cut, Array.from(countries), verdict),
        landed_cost: {
          fob_usd_per_kg: 11.8,
          freight_usd_per_kg: 1.1,
          duty_usd_per_kg: 0.6,
          landed_usd_per_kg: 13.5,
          landed_sar_per_kg: 50.6
        },
        pdf_url: '#'
      }
      setReport(completed)
      setStatus('done')
    }, 2800)
  }

  const reset = () => {
    setStatus('idle')
    setReport(null)
  }

  if (status !== 'idle' && report) {
    return (
      <Panel>
        <AnimatePresence mode="wait">
          {status !== 'done' ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex flex-col items-center text-center py-10 px-4 gap-4"
            >
              <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent-soft text-accent">
                <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-base font-semibold text-text">
                  {status === 'queued' ? t('waiting') : t('generating')}
                </p>
                <p className="text-sm text-muted mt-1.5">{report.request_text}</p>
              </div>
              <div className="w-full max-w-xs h-1 bg-bg-soft rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                  className="h-full w-1/3 bg-accent rounded-full"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-success-soft text-success">
                  <Check className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text">{t('done')}</div>
                  <div className="text-xs text-muted">{report.request_text}</div>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface hover:bg-surface-elev px-3 py-1.5 text-xs font-medium text-text-soft hover:text-text transition-colors"
                >
                  {t('newRequest')}
                </button>
              </div>
              {report.verdict && <VerdictCard verdict={report.verdict} compact />}
              {report.summary && (
                <div className="rounded-soft border border-border bg-bg-soft/60 p-4 md:p-5">
                  <div className="text-xs text-muted mb-2">{locale === 'ar' ? 'الملخّص' : 'Summary'}</div>
                  <p className="text-sm text-text leading-relaxed">{report.summary[locale]}</p>
                </div>
              )}
              {report.landed_cost && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {(
                    [
                      ['FOB', `$${report.landed_cost.fob_usd_per_kg.toFixed(2)}`],
                      [locale === 'ar' ? 'الشحن' : 'Freight', `$${report.landed_cost.freight_usd_per_kg.toFixed(2)}`],
                      [locale === 'ar' ? 'رسوم' : 'Duty', `$${report.landed_cost.duty_usd_per_kg.toFixed(2)}`],
                      [locale === 'ar' ? 'واصل USD' : 'Landed USD', `$${report.landed_cost.landed_usd_per_kg.toFixed(2)}`, true],
                      [locale === 'ar' ? 'واصل SAR' : 'Landed SAR', `${report.landed_cost.landed_sar_per_kg.toFixed(2)}`, true]
                    ] as Array<[string, string, boolean?]>
                  ).map(([label, value, highlight]) => (
                    <div key={label} className={clsx('rounded-soft border p-3', highlight ? 'border-accent/40 bg-accent-soft/40' : 'border-border bg-bg-soft/40')}>
                      <div className="text-xs text-muted">{label}</div>
                      <div className={clsx('font-display font-semibold text-lg tabular-nums mt-0.5', highlight ? 'text-accent' : 'text-text')}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <a
                href={report.pdf_url || '#'}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent text-white hover:bg-accent-strong shadow-soft px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.8} />
                {t('openPdf')}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </Panel>
    )
  }

  return (
    <Panel>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('meat')}>
            <select
              value={meat}
              onChange={(e) => setMeat(e.target.value as MeatSlug)}
              className="w-full rounded-soft bg-bg-soft border border-border focus:border-accent focus:bg-surface text-text px-3 py-2.5 text-sm transition-colors"
            >
              {MEATS.map((m) => (
                <option key={m.slug} value={m.slug}>{m.name[locale]}</option>
              ))}
            </select>
          </Field>
          <Field label={t('cut')}>
            <select
              value={cut}
              onChange={(e) => setCut(e.target.value)}
              className="w-full rounded-soft bg-bg-soft border border-border focus:border-accent focus:bg-surface text-text px-3 py-2.5 text-sm transition-colors"
            >
              {availableCuts.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name[locale]}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={t('countries')}>
          <div className="flex flex-wrap gap-2">
            {availableCountries.map((cc) => {
              const country = COUNTRIES.find((c) => c.code === cc)!
              const active = countries.has(cc)
              return (
                <button
                  key={cc}
                  type="button"
                  onClick={() => toggleCountry(cc)}
                  className={clsx(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all',
                    active
                      ? 'bg-accent text-white border-accent shadow-soft'
                      : 'bg-bg-soft border-border text-text-soft hover:text-text hover:border-border-strong'
                  )}
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  {country.name[locale]}
                </button>
              )
            })}
          </div>
        </Field>

        <Field label={t('destPort')}>
          <div className="inline-flex rounded-full border border-border bg-bg-soft p-0.5">
            {(['JED', 'DMM'] as PortCode[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setDestPort(p)}
                className={clsx(
                  'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
                  destPort === p ? 'bg-surface text-text shadow-soft' : 'text-text-soft hover:text-text'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </Field>

        <Field label={t('note')}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-soft bg-bg-soft border border-border focus:border-accent focus:bg-surface text-text px-3 py-2.5 text-sm transition-colors"
            placeholder={locale === 'ar' ? 'ملاحظة اختيارية…' : 'Optional context…'}
          />
        </Field>

        {error && <p className="text-xs text-accent">{error}</p>}

        <button
          type="submit"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent text-white hover:bg-accent-strong shadow-soft px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          {t('submit')}
          <ArrowRight className="h-4 w-4 flip-rtl" strokeWidth={1.8} />
        </button>
      </form>
    </Panel>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-text-soft font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function buildSummary(meat: MeatSlug, cut: string, countries: CountryCode[], verdict: string) {
  const cutName = CUTS.find((c) => c.slug === cut)
  const meatName = MEATS.find((m) => m.slug === meat)
  const en = `Comparison across ${countries.length} origin${countries.length > 1 ? 's' : ''} for ${meatName?.name.en} · ${cutName?.name.en}. Agent verdict: ${verdict.replace('_', ' ').toLowerCase()}.`
  const ar = `مقارنة عبر ${countries.length} مصدر${countries.length > 1 ? '' : ''} لـ ${meatName?.name.ar} · ${cutName?.name.ar}. قرار الوكيل: ${verdict}.`
  return { en, ar }
}
