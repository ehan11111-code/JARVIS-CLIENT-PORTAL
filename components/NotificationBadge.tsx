'use client'

import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { getFirmState } from '@/lib/mock/data'

export function NotificationBadge() {
  const firm = getFirmState()
  const unread = firm.notifications.filter((n) => !n.read).length

  return (
    <Link
      href="/notifications"
      aria-label="Notifications"
      className="relative inline-flex items-center justify-center h-9 w-9 rounded-full border border-border bg-surface hover:bg-surface-elev transition-colors"
    >
      <Bell className="h-4 w-4 text-text-soft" strokeWidth={1.6} />
      <AnimatePresence>
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-semibold inline-flex items-center justify-center shadow-soft"
          >
            {unread > 99 ? '99+' : unread}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}
