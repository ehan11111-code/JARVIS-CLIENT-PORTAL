import { clsx } from 'clsx'

const SIZES = {
  sm: { mark: 28, wordmark: 'text-base', gap: 'gap-2.5' },
  md: { mark: 38, wordmark: 'text-xl', gap: 'gap-3' },
  lg: { mark: 56, wordmark: 'text-3xl', gap: 'gap-4' }
}

export function BrandLogo({
  size = 'md',
  variant = 'horizontal',
  className,
  markOnly = false
}: {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'horizontal' | 'stacked'
  className?: string
  markOnly?: boolean
}) {
  const cfg = SIZES[size]
  return (
    <div
      className={clsx(
        'inline-flex items-center text-text select-none',
        variant === 'stacked' ? 'flex-col gap-2' : cfg.gap,
        className
      )}
      aria-label="JARVIS AI"
    >
      <BrandMark px={cfg.mark} />
      {!markOnly && (
        <span className={clsx('font-display font-semibold tracking-tight leading-none', cfg.wordmark)}>
          JARVIS<span className="text-accent ms-1">AI</span>
        </span>
      )}
    </div>
  )
}

function BrandMark({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id="hex-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7F4A" />
          <stop offset="100%" stopColor="#E0571E" />
        </linearGradient>
      </defs>
      {/* outer circuit traces */}
      <g stroke="url(#hex-grad)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85">
        <path d="M32 4 L32 14" />
        <path d="M58 18 L48 22" />
        <path d="M58 46 L48 42" />
        <path d="M32 60 L32 50" />
        <path d="M6 46 L16 42" />
        <path d="M6 18 L16 22" />
      </g>
      {/* endpoint dots */}
      <g fill="url(#hex-grad)">
        <circle cx="32" cy="4" r="1.8" />
        <circle cx="58" cy="18" r="1.8" />
        <circle cx="58" cy="46" r="1.8" />
        <circle cx="32" cy="60" r="1.8" />
        <circle cx="6" cy="46" r="1.8" />
        <circle cx="6" cy="18" r="1.8" />
      </g>
      {/* main hex */}
      <path
        d="M32 12 L48 22 L48 42 L32 52 L16 42 L16 22 Z"
        stroke="url(#hex-grad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* inner spark — small triangle accent */}
      <path
        d="M32 24 L40 36 L24 36 Z"
        fill="url(#hex-grad)"
        opacity="0.95"
      />
      <circle cx="32" cy="32" r="1.6" fill="var(--bg)" />
    </svg>
  )
}
