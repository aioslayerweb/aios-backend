import { CheckCheck, Circle, X } from "lucide-react"
import type { NotificationItem } from "@/types"
import { formatNotificationTime, levelToTone } from "@/utils/notifications"
import { Badge } from "@/components/ui"
import { cn } from "@/utils"

type NotificationCardProps = {
  item: NotificationItem
  onToggleRead: (item: NotificationItem) => void
  onRemove: (item: NotificationItem) => void
}

export function NotificationCard({ item, onToggleRead, onRemove }: NotificationCardProps) {
  const tone = levelToTone(item.level)

  return (
    <article
      className={cn(
        "rounded-lg border bg-surface-canvas p-3 shadow-sm transition-colors",
        item.read ? "border-border" : "border-brand-primary/40"
      )}
      aria-label={`${item.title} notification`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-text-primary">{item.title}</p>
            {!item.read ? <Circle className="h-2.5 w-2.5 fill-brand-primary text-brand-primary" aria-hidden /> : null}
          </div>
          {item.description ? <p className="text-xs text-text-secondary">{item.description}</p> : null}
          <div className="flex flex-wrap items-center gap-1">
            <Badge tone={tone}>{item.level}</Badge>
            <Badge tone="default">{item.category}</Badge>
            <Badge tone="default">{item.priority}</Badge>
            <span className="text-[11px] text-text-muted">{formatNotificationTime(item.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleRead(item)}
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-border text-text-muted hover:bg-surface-muted"
            aria-label={item.read ? `Mark ${item.title} as unread` : `Mark ${item.title} as read`}
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-border text-text-muted hover:bg-surface-muted"
            aria-label={`Dismiss ${item.title}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}
