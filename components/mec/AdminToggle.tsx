'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Shield } from 'lucide-react'
import { Panel } from '@/components/Panel'
import { getProfile, setProfile } from '@/lib/profile'

export function AdminToggle() {
  const t = useTranslations('mec.admin')
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(getProfile().adminMode)
  }, [])

  const toggle = () => {
    const next = !on
    setOn(next)
    setProfile({ adminMode: next })
  }

  return (
    <Panel title={t('adminToggle')} subtitle={t('adminToggleHelp')}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={toggle}
        className="inline-flex items-center gap-3 group"
      >
        <span
          className={
            'inline-flex h-6 w-11 items-center rounded-full transition-colors ' +
            (on ? 'bg-accent' : 'bg-bg-soft border border-border')
          }
        >
          <span
            className={
              'inline-block h-5 w-5 transform rounded-full bg-surface shadow-soft transition-transform ' +
              (on ? 'translate-x-5' : 'translate-x-0.5')
            }
          />
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text">
          <Shield className="h-4 w-4 text-accent" strokeWidth={1.7} />
          {on ? 'ON' : 'OFF'}
        </span>
      </button>
    </Panel>
  )
}

export function useAdminMode() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    setOn(getProfile().adminMode)
    const onChange = () => setOn(getProfile().adminMode)
    window.addEventListener('jarvis_profile_change', onChange)
    return () => window.removeEventListener('jarvis_profile_change', onChange)
  }, [])
  return on
}
