import { cn } from "@/utils"

type NotificationBadgeProps = {
  count: number
  className?: string
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count <= 0) {
    return null
  }

  const label = count > 99 ? "99+" : String(count)

  return (
    <span
      className={cn(
        "inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-semibold text-text-inverse",
        className
      )}
      aria-label={`${label} unread notifications`}
    >
      {label}
    </span>
  )
}
