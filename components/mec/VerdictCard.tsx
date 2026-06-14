'use client'

import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, Minus, Clock, AlertOctagon } from 'lucide-react'
import type { Verdict } from '@/lib/mock/mec-types'

const TONE: Record<Verdict, { bg: string; text: string; ring: string; icon: typeof TrendingUp }> = {
  BUY_NOW: { bg: 'bg-success-soft', text: 'text-success', ring: 'ring-success/30', icon: Sparkles },
  BUY_THIS_WEEK: { bg: 'bg-success-soft', text: 'text-success', ring: 'ring-success/20', icon: TrendingUp },
  NEUTRAL: { bg: 'bg-bg-soft', text: 'text-text-soft', ring: 'ring-border', icon: Minus },
  WAIT_4_8: { bg: 'bg-warn-soft', text: 'text-warn', ring: 'ring-warn/30', icon: Clock },
  WAIT_CRISIS: { bg: 'bg-accent-soft', text: 'text-accent', ring: 'ring-accent/30', icon: AlertOctagon }
}

export function VerdictCard({
  verdict,
  title,
  subtitle,
  compact
}: {
  verdict: Verdict
  title?: string
  subtitle?: string
  compact?: boolean
}) {
  const t = useTranslations('mec.verdicts')
  const tone = TONE[verdict]
  const Icon = tone.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={clsx('rounded-soft border border-border bg-surface shadow-soft p-5 md:p-6', compact ? '' : 'md:p-7')}
    >
      {title && <div className="text-xs text-muted mb-3">{title}</div>}
      <div className="flex items-start gap-4">
        <span className={clsx('shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-full ring-4', tone.bg, tone.ring)}>
          <Icon className={clsx('h-5 w-5', tone.text)} strokeWidth={1.7} />
        </span>
        <div className="min-w-0 flex-1">
          <div className={clsx('font-display font-semibold tracking-tight leading-tight', compact ? 'text-xl' : 'text-2xl md:text-3xl')}>
            {t(verdict)}
          </div>
          <p className="text-sm text-text-soft mt-2 leading-relaxed">{t(`${verdict}_desc`)}</p>
          {subtitle && <p className="text-xs text-muted mt-3">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  )
}

export function VerdictChip({ verdict }: { verdict: Verdict }) {
  const t = useTranslations('mec.verdicts')
  const tone = TONE[verdict]
  const Icon = tone.icon
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', tone.bg, tone.text)}>
      <Icon className="h-3 w-3" strokeWidth={1.7} />
      {t(verdict)}
    </span>
  )
}
