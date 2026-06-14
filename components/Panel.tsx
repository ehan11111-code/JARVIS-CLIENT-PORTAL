import { clsx } from 'clsx'

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName
}: {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={clsx('rounded-soft border border-border bg-surface shadow-soft overflow-hidden flex flex-col', className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 px-5 md:px-6 pt-5 pb-3">
          <div className="min-w-0">
            {title && <h3 className="text-sm font-semibold text-text leading-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={clsx('flex-1', bodyClassName ?? 'px-5 md:px-6 pb-5 md:pb-6')}>{children}</div>
    </section>
  )
}
