'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { FxRate } from '@/lib/mock/mec-types'

export function FxBadge({ fx }: { fx: FxRate }) {
  const t = useTranslations('mec.dashboard')
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface shadow-soft px-3 py-1.5"
    >
      <span className="text-xs text-muted">{t('fxBadge')}</span>
      <span className="text-sm font-semibold text-text tabular-nums">
        1 USD = {fx.rate.toFixed(3)} SAR
      </span>
    </motion.div>
  )
}
