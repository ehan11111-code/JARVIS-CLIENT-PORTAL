'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useAssistant } from './AssistantProvider'

export function AssistantLauncher() {
  const t = useTranslations('assistant')
  const { open, toggle } = useAssistant()

  if (open) return null

  return (
    <motion.button
      type="button"
      onClick={toggle}
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-5 end-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-text text-bg hover:bg-accent transition-colors shadow-float px-4 py-3"
      aria-label={t('openLabel')}
    >
      <span className="relative inline-flex items-center justify-center h-6 w-6 rounded-full bg-accent text-white">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" aria-hidden />
      </span>
      <span className="text-sm font-semibold">{t('openLabel')}</span>
    </motion.button>
  )
}

export function AssistantTopBarButton() {
  const t = useTranslations('assistant')
  const { toggle } = useAssistant()
  return (
    <button
      type="button"
      onClick={toggle}
      className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border bg-surface hover:bg-surface-elev text-text-soft hover:text-text px-3 py-1.5 transition-colors"
      aria-label={t('openLabel')}
    >
      <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.8} />
      <span className="text-xs font-medium">{t('openLabel')}</span>
    </button>
  )
}
