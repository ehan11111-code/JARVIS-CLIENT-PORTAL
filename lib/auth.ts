'use client'

const KEY = 'jarvis_session'

export type Session = { email: string; ts: number }

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function setSession(email: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify({ email, ts: Date.now() }))
}

export function clearSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}
