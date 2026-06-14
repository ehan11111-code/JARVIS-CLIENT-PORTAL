'use client'

const KEY = 'jarvis_profile'

export type Profile = {
  whatsappOptIn: boolean
  whatsappNumber?: string
  adminMode: boolean
}

const DEFAULT: Profile = { whatsappOptIn: false, adminMode: false }

export function getProfile(): Profile {
  if (typeof window === 'undefined') return DEFAULT
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT
  } catch {
    return DEFAULT
  }
}

export function setProfile(patch: Partial<Profile>) {
  if (typeof window === 'undefined') return
  const next = { ...getProfile(), ...patch }
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('jarvis_profile_change'))
}
