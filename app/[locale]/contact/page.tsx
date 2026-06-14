'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'

export default function ContactPage() {
  const t = useTranslations('contact')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const [sent, setSent] = useState(false)

  return (
    <PageShell breadcrumbs={[{ label: tNav('operations') }, { label: tNav('contact') }]}>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 max-w-2xl"
      >
        <div className="text-xs font-medium text-accent">{t('eyebrow')}</div>
        <DisplayHeading size="lg" className="mt-2" locale={locale}>
          {t('headline')}
        </DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="max-w-xl rounded-soft border border-border bg-surface shadow-soft p-6 md:p-8"
      >
        {sent ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" strokeWidth={1.6} />
            <p className="text-sm text-text">{t('success')}</p>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            <Field label={t('name')} type="text" />
            <Field label={t('company')} type="text" />
            <Field label={t('message')} type="textarea" />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent text-white hover:bg-accent-strong px-5 py-3 text-sm font-semibold transition-colors shadow-soft"
            >
              {t('submit')}
              <ArrowRight className="h-4 w-4 flip-rtl" strokeWidth={1.8} />
            </button>
            <p className="text-xs text-muted text-center">{t('demoHelper')}</p>
          </form>
        )}
      </motion.div>
    </PageShell>
  )
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <label className="block">
      <span className="text-xs text-text-soft font-medium">{label}</span>
      {type === 'textarea' ? (
        <textarea
          rows={4}
          className="mt-1.5 w-full rounded-soft bg-bg-soft border border-border focus:border-accent focus:bg-surface text-text px-4 py-3 text-sm transition-colors"
        />
      ) : (
        <input
          type={type}
          className="mt-1.5 w-full rounded-soft bg-bg-soft border border-border focus:border-accent focus:bg-surface text-text px-4 py-3 text-sm transition-colors"
        />
      )}
    </label>
  )
}
