'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Info } from 'lucide-react'
import { clsx } from 'clsx'
import type { AssistantAction, AssistantCard, AssistantReply } from '@/lib/assistant'
import { AssistantMark } from './AssistantMark'

export function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-end"
    >
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-text text-bg px-4 py-2.5 text-sm shadow-soft">
        {text}
      </div>
    </motion.div>
  )
}

export function AssistantBubble({
  reply,
  onAction,
  onFollowup
}: {
  reply: AssistantReply
  onAction: (a: AssistantAction) => void
  onFollowup: (s: string) => void
}) {
  const t = useTranslations('assistant')
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2.5"
    >
      <div className="shrink-0 pt-1">
        <AssistantMark size={28} />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div
          className={clsx(
            'rounded-2xl rounded-tl-sm border px-4 py-3 text-sm shadow-soft',
            reply.scope === 'out' ? 'bg-bg-soft border-border' : 'bg-surface border-border'
          )}
        >
          {reply.scope === 'out' && (
            <div className="inline-flex items-center gap-1.5 text-xs text-muted mb-1.5">
              <Info className="h-3 w-3" strokeWidth={1.7} />
              {t('scopeNote')}
            </div>
          )}
          <p className="text-text leading-relaxed">{reply.text}</p>
        </div>

        {reply.cards && reply.cards.length > 0 && (
          <div className="space-y-2">
            {reply.cards.map((card, i) => (
              <CardView key={i} card={card} />
            ))}
          </div>
        )}

        {reply.links && reply.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {reply.links.map((l, i) => (
              <Link
                key={i}
                href={l.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-text text-bg hover:bg-accent transition-colors px-3 py-1.5 text-xs font-semibold"
              >
                {l.label}
                <ArrowUpRight className="h-3 w-3 flip-rtl" strokeWidth={1.8} />
              </Link>
            ))}
          </div>
        )}

        {reply.actions && reply.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {reply.actions.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onAction(a)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface hover:bg-surface-elev text-text-soft hover:text-text px-3 py-1.5 text-xs font-medium transition-colors"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        {reply.followups && reply.followups.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {reply.followups.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onFollowup(f)}
                className="inline-flex items-center rounded-full bg-bg-soft hover:bg-surface-elev text-text-soft hover:text-text px-2.5 py-1 text-xs transition-colors"
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CardView({ card }: { card: AssistantCard }) {
  if (card.kind === 'metric') {
    const toneCls =
      card.tone === 'accent' ? 'text-accent'
      : card.tone === 'success' ? 'text-success'
      : card.tone === 'warn' ? 'text-warn'
      : 'text-text'
    return (
      <div className="rounded-soft border border-border bg-bg-soft/60 px-3.5 py-2.5">
        <div className="text-[11px] text-muted">{card.label}</div>
        <div className={clsx('font-display font-semibold text-lg tabular-nums leading-none mt-1', toneCls)}>
          {card.value}
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-soft border border-border bg-bg-soft/60">
      <div className="text-[11px] text-muted px-3.5 pt-2.5">{card.title}</div>
      <ul className="divide-y divide-border mt-1">
        {card.items.map((item, i) => (
          <li key={i} className="px-3.5 py-2 flex items-center justify-between gap-3">
            <span className="text-sm text-text truncate">{item.label}</span>
            {item.meta && <span className="text-[11px] text-muted shrink-0">{item.meta}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ThinkingBubble() {
  const t = useTranslations('assistant')
  return (
    <div className="flex items-start gap-2.5">
      <div className="shrink-0 pt-1">
        <AssistantMark size={28} />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3 shadow-soft inline-flex items-center gap-2">
        <span className="inline-flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full bg-text-soft"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
            />
          ))}
        </span>
        <span className="text-xs text-muted">{t('thinking')}</span>
      </div>
    </div>
  )
}
