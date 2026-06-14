'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Plus } from 'lucide-react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useAssistant } from './AssistantProvider'
import { AssistantBubble, ThinkingBubble, UserBubble } from './MessageBubble'
import { AssistantMark } from './AssistantMark'
import { classifyAndAnswer, makeContext, suggestionStarters, type AssistantAction } from '@/lib/assistant'
import { getFirmState } from '@/lib/mock/data'
import { getMecState } from '@/lib/mock/mec-data'
import { useTheme } from '../ThemeProvider'
import { setProfile } from '@/lib/profile'

export function AssistantPanel() {
  const { open, setOpen, messages, append, clear } = useAssistant()
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations('assistant')
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, thinking])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, text: trimmed, ts: Date.now() }
    append(userMsg)
    setInput('')
    setThinking(true)

    const ctx = makeContext({ locale, firm: getFirmState(), mec: getMecState() })
    const delay = 320 + Math.random() * 380
    window.setTimeout(() => {
      const reply = classifyAndAnswer(trimmed, ctx)
      append({ id: `a-${Date.now()}`, role: 'assistant', reply, ts: Date.now() })
      setThinking(false)
    }, delay)
  }

  const onAction = (a: AssistantAction) => {
    switch (a.kind) {
      case 'set-theme':
        setTheme(a.value)
        break
      case 'set-locale':
        router.replace(pathname, { locale: a.value })
        break
      case 'set-admin':
        setProfile({ adminMode: a.value })
        break
      case 'set-whatsapp':
        setProfile({ whatsappOptIn: a.value })
        break
    }
    append({
      id: `a-${Date.now()}`,
      role: 'assistant',
      reply: { text: t('actionApplied') },
      ts: Date.now()
    })
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const starters = suggestionStarters(locale)
  const empty = messages.length === 0

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-bg/40 backdrop-blur-[2px] lg:bg-transparent lg:backdrop-blur-0 lg:pointer-events-none"
            aria-hidden
          />
          <motion.aside
            initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className={
              'fixed inset-y-0 z-50 w-full sm:w-[420px] flex flex-col bg-surface border-border shadow-float ' +
              (locale === 'ar' ? 'start-0 border-e' : 'end-0 border-s')
            }
            role="dialog"
            aria-label={t('name')}
          >
            <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3 min-w-0">
                <AssistantMark size={36} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text leading-none">{t('name')}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" aria-hidden />
                    <span className="text-[11px] text-muted">{t('online')} · {t('tagline')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface hover:bg-surface-elev text-text-soft hover:text-text px-2.5 py-1 text-xs font-medium transition-colors"
                  aria-label={t('clear')}
                >
                  <Plus className="h-3 w-3" strokeWidth={1.7} />
                  {t('clear')}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-bg-soft text-text-soft hover:text-text transition-colors"
                  aria-label={t('closeLabel')}
                >
                  <X className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-soft px-5 py-5 space-y-4">
              {empty ? (
                <div className="space-y-4">
                  <div className="rounded-soft border border-border bg-bg-soft/60 p-4">
                    <p className="text-sm text-text leading-relaxed">
                      {locale === 'ar'
                        ? `أهلًا — أنا ${t('name')}. اسألني عن عملياتك أو استخبارات اللحوم أو إعدادات البوابة.`
                        : `Hello — I'm ${t('name')}. Ask me about your operations, Meat Intel, or the portal settings.`}
                    </p>
                    <p className="text-xs text-muted mt-2">{t('scopeNote')}</p>
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-2">{t('starters')}</div>
                    <div className="flex flex-wrap gap-2">
                      {starters.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          className="inline-flex items-center rounded-full bg-bg-soft hover:bg-surface-elev text-text-soft hover:text-text px-3 py-1.5 text-xs transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m) =>
                    m.role === 'user' ? (
                      <UserBubble key={m.id} text={m.text} />
                    ) : (
                      <AssistantBubble key={m.id} reply={m.reply} onAction={onAction} onFollowup={send} />
                    )
                  )}
                  {thinking && <ThinkingBubble />}
                </>
              )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-border px-4 py-3 bg-bg-soft/40">
              <div className="flex items-end gap-2 rounded-soft border border-border bg-surface focus-within:border-accent transition-colors px-3 py-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder={t('placeholder')}
                  className="flex-1 resize-none bg-transparent text-sm text-text leading-snug max-h-32 outline-none placeholder:text-muted"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-full bg-accent text-white hover:bg-accent-strong disabled:opacity-40 disabled:hover:bg-accent transition-colors"
                  aria-label={t('send')}
                >
                  <Send className="h-4 w-4 flip-rtl" strokeWidth={1.8} />
                </button>
              </div>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
