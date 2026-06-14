'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { BrandLogo } from '@/components/BrandLogo'
import { DisplayHeading } from '@/components/DisplayHeading'
import { LocaleToggle } from '@/components/LocaleToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getSession, setSession } from '@/lib/auth'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const t = useTranslations('login')
  const tBrand = useTranslations('brand')
  const router = useRouter()
  const locale = useLocale() as 'en' | 'ar'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (getSession()) router.replace('/control-center')
  }, [router])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError(t('errorRequired'))
      return
    }
    setError(null)
    setSubmitting(true)
    setSession(email.trim())
    setTimeout(() => router.replace('/control-center'), 280)
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-bg overflow-hidden">
      <div className="absolute inset-0 soft-grid soft-grid-fade" aria-hidden />

      <header className="relative z-10 flex items-center justify-between gap-4 px-6 md:px-10 py-5">
        <BrandLogo size="md" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleToggle />
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-xl2 border border-border bg-surface shadow-card p-8 md:p-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft text-accent px-3 py-1 text-xs font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {t('eyebrow')}
          </div>
          <DisplayHeading size="md" className="mt-4" locale={locale}>
            {t('headline')}
          </DisplayHeading>
          <p className="text-sm text-text-soft mt-3 leading-relaxed">{t('subline')}</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <Field
              label={t('email')}
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              autoFocus
            />
            <Field
              label={t('password')}
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
            {error && <p className="text-xs text-accent">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent text-white hover:bg-accent-strong disabled:opacity-60 px-5 py-3 text-sm font-semibold transition-all shadow-soft"
            >
              {t('submit')}
              <ArrowRight className="h-4 w-4 flip-rtl" strokeWidth={1.8} />
            </button>
            <p className="text-xs text-muted text-center pt-1">{t('demoHelper')}</p>
          </form>
        </motion.div>
      </main>

      <footer className="relative z-10 px-6 md:px-10 py-5 flex items-center justify-between gap-3">
        <span className="text-xs text-muted">{tBrand('positioning')}</span>
        <span className="text-xs text-muted">JARVIS Â· v0.demo</span>
      </footer>
    </div>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  autoFocus
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  autoFocus?: boolean
}) {
  return (
    <label className="block">
      <span className="text-xs text-text-soft font-medium">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-soft bg-bg-soft border border-border focus:border-accent focus:bg-surface text-text px-4 py-3 text-sm transition-colors"
      />
    </label>
  )
}
