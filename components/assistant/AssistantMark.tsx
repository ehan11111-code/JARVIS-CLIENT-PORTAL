export function AssistantMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id="ja-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7F4A" />
          <stop offset="100%" stopColor="#E0571E" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" stroke="url(#ja-grad)" strokeWidth="1.4" fill="var(--surface)" />
      <path d="M20 10 L29 16 L29 24 L20 30 L11 24 L11 16 Z" stroke="url(#ja-grad)" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <path d="M20 16 L25 23 L15 23 Z" fill="url(#ja-grad)" />
      <circle cx="20" cy="20" r="1.1" fill="var(--surface)" />
    </svg>
  )
}
