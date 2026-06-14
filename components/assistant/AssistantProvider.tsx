'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { AssistantReply } from '@/lib/assistant'

export type ChatMessage =
  | { id: string; role: 'user'; text: string; ts: number }
  | { id: string; role: 'assistant'; reply: AssistantReply; ts: number }

type Ctx = {
  open: boolean
  setOpen: (v: boolean) => void
  toggle: () => void
  messages: ChatMessage[]
  append: (m: ChatMessage) => void
  clear: () => void
}

const AssistantCtx = createContext<Ctx | null>(null)
const STORAGE_KEY = 'jarvis_chat_history'

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setMessages(JSON.parse(raw))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)))
    } catch {
      // ignore
    }
  }, [messages, hydrated])

  const append = useCallback((m: ChatMessage) => {
    setMessages((prev) => [...prev, m])
  }, [])

  const clear = useCallback(() => {
    setMessages([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  const toggle = useCallback(() => setOpen((v) => !v), [])

  return (
    <AssistantCtx.Provider value={{ open, setOpen, toggle, messages, append, clear }}>
      {children}
    </AssistantCtx.Provider>
  )
}

export function useAssistant() {
  const ctx = useContext(AssistantCtx)
  if (!ctx) throw new Error('useAssistant must be used within AssistantProvider')
  return ctx
}
