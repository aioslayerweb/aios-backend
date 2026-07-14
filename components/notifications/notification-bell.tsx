import { Bell } from "lucide-react"
import { cn } from "@/utils"
import { NotificationBadge } from "./notification-badge"

type NotificationBellProps = {
  unreadCount: number
  onClick: () => void
  open?: boolean
  className?: string
}

export function NotificationBell({ unreadCount, onClick, open = false, className }: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        className
      )}
      aria-label="Open notification center"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls="aios-notification-drawer"
    >
      <Bell className="h-4 w-4" />
      <NotificationBadge count={unreadCount} className="absolute -right-1 -top-1" />
    </button>
  )
}
