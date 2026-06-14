'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { AlertOctagon, CheckCircle2, Eye, Info, RefreshCw, ArrowUpRight, Search, CheckCheck } from 'lucide-react'
import { clsx } from 'clsx'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { getFirmState } from '@/lib/mock/data'
import type { NotificationType, Notification } from '@/lib/mock/types'

const TYPE_TONE: Record<NotificationType, { bg: string; text: string; icon: typeof AlertOctagon }> = {
  urgent: { bg: 'bg-accent-soft', text: 'text-accent', icon: AlertOctagon },
  approval: { bg: 'bg-warn-soft', text: 'text-warn', icon: CheckCircle2 },
  attention: { bg: 'bg-warn-soft', text: 'text-warn', icon: Eye },
  update: { bg: 'bg-success-soft', text: 'text-success', icon: RefreshCw },
  info: { bg: 'bg-bg-soft', text: 'text-muted', icon: Info }
}

const TYPES: NotificationType[] = ['urgent', 'approval', 'attention', 'update', 'info']

function relTime(ts: string, locale: 'en' | 'ar') {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return locale === 'ar' ? 'الآن' : 'just now'
  if (m < 60) return locale === 'ar' ? `قبل ${m} د` : `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return locale === 'ar' ? `قبل ${h} س` : `${h}h ago`
  const d = Math.floor(h / 24)
  return locale === 'ar' ? `قبل ${d} يوم` : `${d}d ago`
}

export default function NotificationsPage() {
  const t = useTranslations('notifications')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const firm = getFirmState()
  const [items, setItems] = useState<Notification[]>(firm.notifications)
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all')
  const [deptFilter, setDeptFilter] = useState<string>('all')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [query, setQuery] = useState('')

  const deptsWithCounts = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>()
    for (const n of items) {
      const key = n.deptSlug
      const cur = map.get(key) ?? { slug: key, name: n.deptName[locale], count: 0 }
      cur.count++
      map.set(key, cur)
    }
    return Array.from(map.values())
  }, [items, locale])

  const typeCounts = useMemo(() => {
    const c: Record<string, number> = { all: items.length }
    for (const ty of TYPES) c[ty] = 0
    for (const n of items) c[n.type]++
    return c
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((n) => {
      if (typeFilter !== 'all' && n.type !== typeFilter) return false
      if (deptFilter !== 'all' && n.deptSlug !== deptFilter) return false
      if (unreadOnly && n.read) return false
      if (q) {
        const txt = `${n.title[locale]} ${n.deptName[locale]}`.toLowerCase()
        if (!txt.includes(q)) return false
      }
      return true
    })
  }, [items, typeFilter, deptFilter, unreadOnly, query, locale])

  const unread = items.filter((n) => !n.read).length

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  const markOne = (id: string) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

  return (
    <PageShell breadcrumbs={[{ label: tNav('operations') }, { label: tNav('notifications') }]}>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft text-accent px-3 py-1 text-xs font-medium">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          {t('eyebrow')} · {unread} {locale === 'ar' ? 'غير مقروء' : 'unread'}
        </div>
        <DisplayHeading size="lg" className="mt-3" locale={locale}>
          {t('headline')}
        </DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 md:gap-6 items-start">
        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-soft border border-border bg-surface shadow-soft p-2">
            <div className="px-3 py-2 text-xs font-semibold text-text">{t('typeAll')}</div>
            <FilterPill
              active={typeFilter === 'all'}
              onClick={() => setTypeFilter('all')}
              label={t('filterAll')}
              count={typeCounts.all}
            />
            {TYPES.map((ty) => {
              const tone = TYPE_TONE[ty]
              return (
                <FilterPill
                  key={ty}
                  active={typeFilter === ty}
                  onClick={() => setTypeFilter(ty)}
                  label={t(`types.${ty}`)}
                  count={typeCounts[ty]}
                  dotClass={tone.bg.replace('bg-', 'bg-')}
                  dotColor={tone.text.replace('text-', 'bg-')}
                />
              )
            })}
          </div>

          <div className="rounded-soft border border-border bg-surface shadow-soft p-2">
            <div className="px-3 py-2 text-xs font-semibold text-text">{t('deptAll')}</div>
            <FilterPill
              active={deptFilter === 'all'}
              onClick={() => setDeptFilter('all')}
              label={t('filterAll')}
              count={items.length}
            />
            {deptsWithCounts.map((d) => (
              <FilterPill
                key={d.slug}
                active={deptFilter === d.slug}
                onClick={() => setDeptFilter(d.slug)}
                label={d.name}
                count={d.count}
              />
            ))}
          </div>
        </aside>

        <section className="rounded-soft border border-border bg-surface shadow-soft">
          <header className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 md:px-6 py-4 border-b border-border">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" strokeWidth={1.6} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search')}
                className="w-full rounded-full bg-bg-soft border border-transparent focus:border-accent focus:bg-surface ps-9 pe-4 py-2 text-sm transition-colors"
              />
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-text-soft">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="h-4 w-4 accent-accent rounded"
              />
              {t('filterUnread')}
            </label>
            <button
              type="button"
              onClick={markAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface hover:bg-surface-elev text-text-soft hover:text-text px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.6} />
              {t('markAll')}
            </button>
          </header>

          <ul className="divide-y divide-border">
            {filtered.length === 0 && (
              <li className="px-6 py-16 text-center text-sm text-muted">{t('empty')}</li>
            )}
            <AnimatePresence initial={false}>
              {filtered.map((n, i) => {
                const tone = TYPE_TONE[n.type]
                const Icon = tone.icon
                return (
                  <motion.li
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    className={clsx(
                      'group px-5 md:px-6 py-4 flex items-start gap-4 transition-colors',
                      !n.read && 'bg-accent-soft/30'
                    )}
                  >
                    <span className={clsx('shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-full', tone.bg)}>
                      <Icon className={clsx('h-4 w-4', tone.text)} strokeWidth={1.6} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1.5">
                        <span className={clsx('inline-flex items-center text-[11px] font-semibold rounded-full px-2 py-0.5', tone.bg, tone.text)}>
                          {t(`types.${n.type}`)}
                        </span>
                        {n.deptSlug !== 'all' ? (
                          <Link
                            href={`/departments/${n.deptSlug}`}
                            className="inline-flex items-center text-[11px] font-medium rounded-full bg-bg-soft text-text-soft hover:text-accent px-2 py-0.5"
                          >
                            {n.deptName[locale]}
                          </Link>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-medium rounded-full bg-bg-soft text-text-soft px-2 py-0.5">
                            {n.deptName[locale]}
                          </span>
                        )}
                        <span className="text-xs text-muted">{relTime(n.ts, locale)}</span>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-label="unread" />}
                      </div>
                      <p className="text-sm text-text leading-snug">{n.title[locale]}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markOne(n.id)}
                          className="hidden md:inline-flex items-center gap-1 rounded-full border border-border bg-surface hover:bg-surface-elev text-xs text-text-soft hover:text-text px-2.5 py-1 transition-colors"
                          aria-label="Mark read"
                        >
                          <CheckCheck className="h-3 w-3" strokeWidth={1.6} />
                        </button>
                      )}
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => markOne(n.id)}
                          className="inline-flex items-center gap-1 rounded-full bg-text text-bg hover:bg-accent transition-colors px-3 py-1 text-xs font-semibold"
                        >
                          {t('open')}
                          <ArrowUpRight className="h-3 w-3 flip-rtl" strokeWidth={1.8} />
                        </Link>
                      )}
                    </div>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        </section>
      </div>
    </PageShell>
  )
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  dotColor
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
  dotClass?: string
  dotColor?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full flex items-center justify-between gap-2 rounded-soft px-3 py-2 text-sm transition-colors',
        active ? 'bg-bg-soft text-text font-medium' : 'text-text-soft hover:bg-bg-soft hover:text-text'
      )}
    >
      <span className="inline-flex items-center gap-2 truncate">
        {dotColor && <span className={clsx('inline-block h-1.5 w-1.5 rounded-full', dotColor)} aria-hidden />}
        <span className="truncate">{label}</span>
      </span>
      <span className={clsx('text-xs tabular-nums', active ? 'text-text-soft' : 'text-muted')}>{count}</span>
    </button>
  )
}
