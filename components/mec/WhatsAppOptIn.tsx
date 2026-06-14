'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { MessageCircle, Check } from 'lucide-react'
import { Panel } from '@/components/Panel'
import { getProfile, setProfile } from '@/lib/profile'

export function WhatsAppOptIn() {
  const t = useTranslations('mec.whatsapp')
  const [enabled, setEnabled] = useState(false)
  const [number, setNumber] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const p = getProfile()
    setEnabled(p.whatsappOptIn)
    setNumber(p.whatsappNumber ?? '')
  }, [])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    setProfile({ whatsappOptIn: enabled, whatsappNumber: number })
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  return (
    <Panel title={t('title')} subtitle={t('body')}>
      <form onSubmit={save} className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 mt-0.5 accent-accent rounded"
          />
          <span className="inline-flex items-center gap-2 text-sm text-text">
            <MessageCircle className="h-4 w-4 text-success" strokeWidth={1.7} />
            {enabled ? t('title') : t('off')}
          </span>
        </label>
        {enabled && (
          <label className="block">
            <span className="text-xs text-text-soft font-medium">{t('label')}</span>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="+966…"
              className="mt-1.5 w-full rounded-soft bg-bg-soft border border-border focus:border-accent focus:bg-surface text-text px-3 py-2.5 text-sm transition-colors"
              dir="ltr"
            />
          </label>
        )}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-text text-bg hover:bg-accent transition-colors px-4 py-2 text-xs font-semibold"
          >
            {t('save')}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs text-success">
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              {t('saved')}
            </span>
          )}
        </div>
      </form>
    </Panel>
  )
}
