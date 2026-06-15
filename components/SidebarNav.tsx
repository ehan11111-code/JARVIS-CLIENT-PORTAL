'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { clsx } from 'clsx'
import { LayoutDashboard, Network, GraduationCap, Mail, ChevronDown, Bell, Beef, Coins } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { departmentSeeds } from '@/lib/mock/catalog'
import { getFirmState } from '@/lib/mock/data'
import { useState } from 'react'

type Child = { href: string; label: string }
type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  badge?: number
  children?: Child[]
}

export function SidebarNav() {
  const t = useTranslations('nav')
  const tMec = useTranslations('mec.subnav')
  const tCommon = useTranslations('common')
  const pathname = usePathname()
  const locale = useLocale() as 'en' | 'ar'
  const firm = getFirmState()
  const unread = firm.notifications.filter((n) => !n.read).length

  const inDepts = pathname.startsWith('/departments')
  const inMec = pathname.startsWith('/meat-intel')
  const [open, setOpen] = useState<Record<string, boolean>>({
    '/departments': inDepts,
    '/meat-intel': inMec
  })

  const items: NavItem[] = [
    { href: '/control-center', label: t('controlCenter'), icon: LayoutDashboard },
    {
      href: '/departments',
      label: t('departments'),
      icon: Network,
      children: departmentSeeds.map((d) => ({ href: `/departments/${d.slug}`, label: d.name[locale] }))
    },
    {
      href: '/meat-intel',
      label: t('meatIntel'),
      icon: Beef,
      children: [
        { href: '/meat-intel', label: tMec('dashboard') },
        { href: '/meat-intel/request-report', label: tMec('requestReport') },
        { href: '/meat-intel/price-explorer', label: tMec('priceExplorer') },
        { href: '/meat-intel/crisis-feed', label: tMec('crisisFeed') },
        { href: '/meat-intel/my-reports', label: tMec('myReports') },
        { href: '/meat-intel/admin-sources', label: tMec('adminSources') }
      ]
    },
    { href: '/total-savings', label: t('totalSavings'), icon: Coins },
    { href: '/notifications', label: t('notifications'), icon: Bell, badge: unread },
    { href: '/jarvis-academy', label: t('academy'), icon: GraduationCap },
    { href: '/contact', label: t('contact'), icon: Mail }
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-bg-soft border-e border-border min-h-screen sticky top-0">
      <div className="px-6 py-5">
        <Link href="/control-center" className="block">
          <BrandLogo size="sm" />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-soft">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon
            const hasChildren = !!item.children?.length
            const isOpen = open[item.href] ?? false
            const onBranch = pathname === item.href || pathname.startsWith(item.href + '/')
            const active = pathname === item.href || (hasChildren && onBranch)

            return (
              <li key={item.href}>
                <div className="flex items-stretch">
                  <Link
                    href={item.href}
                    onClick={() => hasChildren && setOpen((o) => ({ ...o, [item.href]: true }))}
                    className={clsx(
                      'relative flex items-center gap-3 px-3 py-2.5 w-full text-sm rounded-soft transition-colors',
                      active ? 'bg-surface text-text shadow-soft' : 'text-text-soft hover:text-text hover:bg-surface/60'
                    )}
                  >
                    <Icon className={clsx('h-4 w-4 shrink-0', active && 'text-accent')} strokeWidth={1.6} />
                    <span className="truncate font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="ms-auto min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-[10px] font-semibold inline-flex items-center justify-center">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    ) : null}
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setOpen((o) => ({ ...o, [item.href]: !isOpen }))
                        }}
                        className="ms-auto p-0.5"
                        aria-label="Toggle"
                      >
                        <ChevronDown className={clsx('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} strokeWidth={1.6} />
                      </button>
                    )}
                  </Link>
                </div>
                {hasChildren && isOpen && (
                  <ul className="ms-7 mt-1 mb-2 flex flex-col gap-0.5 border-s border-border ps-3">
                    {item.children!.map((c) => {
                      const isActive = pathname === c.href
                      return (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className={clsx(
                              'flex items-center justify-between gap-2 px-2 py-1.5 text-xs rounded transition-colors',
                              isActive ? 'text-accent font-medium' : 'text-text-soft hover:text-text'
                            )}
                          >
                            <span className="truncate">{c.label}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <span className="inline-flex items-center gap-2 text-[11px] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          {tCommon('demoBanner')}
        </span>
      </div>
    </aside>
  )
}
