import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JARVIS AI · Operations Portal',
  description: 'Autonomous Operational Architecture · Engineered in Saudi. Used Globally.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
