'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { clsx } from 'clsx'

export function LocaleToggle({ className }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const swap = (next: 'en' | 'ar') => {
    if (next === locale) return
    router.replace(pathname, { locale: next })
  }

  return (
    <div className={clsx('inline-flex items-center rounded-full border border-border bg-surface p-0.5', className)}>
      {(['en', 'ar'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => swap(l)}
          aria-pressed={locale === l}
          className={clsx(
            'rounded-full px-2.5 py-1 text-xs font-medium transition-all',
            locale === l ? 'bg-text text-bg shadow-soft' : 'text-text-soft hover:text-text'
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
