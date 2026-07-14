import { memo } from "react"
import { CheckCheck, ChevronDown, ChevronUp, Circle, X } from "lucide-react"
import type { NotificationItem } from "@/types"
import { formatNotificationTime, levelToTone, priorityColorClass } from "@/utils/notifications"
import { Badge } from "@/components/ui"
import { cn } from "@/utils"

type NotificationCardProps = {
  item: NotificationItem
  onToggleRead: (item: NotificationItem) => void
  onOpen: (item: NotificationItem) => void
  onApprove: (item: NotificationItem) => void
  onAssign: (item: NotificationItem) => void
  onArchive: (item: NotificationItem) => void
  onToggleExpanded: (item: NotificationItem) => void
  onRemove: (item: NotificationItem) => void
}

function NotificationCardView({
  item,
  onToggleRead,
  onOpen,
  onApprove,
  onAssign,
  onArchive,
  onToggleExpanded,
  onRemove,
}: NotificationCardProps) {
  const tone = levelToTone(item.level)
  const hasGroupedEvents = (item.groupedCount ?? 1) > 1 && (item.events?.length ?? 0) > 0

  return (
    <article
      className={cn(
        "rounded-lg border bg-surface-canvas p-3 shadow-sm transition-colors",
        item.read ? "border-border" : "border-brand-primary/40",
        item.priority === "CRITICAL" && !item.acknowledged && "border-red-500/50"
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
            <Badge tone="default" className={priorityColorClass[item.priority]}>{item.priority}</Badge>
            <span className="text-[11px] text-text-muted">{formatNotificationTime(item.createdAt)}</span>
          </div>
          <p className="text-[11px] text-text-muted">
            Impact {item.impact}% · Urgency {item.urgency} · Confidence {item.confidence}%
          </p>
          {hasGroupedEvents ? (
            <button
              type="button"
              onClick={() => onToggleExpanded(item)}
              className="inline-flex items-center gap-1 text-[11px] text-text-secondary hover:text-text-primary"
              aria-label={`${item.expanded ? "Collapse" : "Expand"} grouped notification events`}
            >
              {item.expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {item.expanded ? "Hide updates" : "Show updates"}
            </button>
          ) : null}
          {item.expanded && hasGroupedEvents ? (
            <ul className="space-y-1 rounded border border-border bg-surface-muted p-2 text-[11px] text-text-secondary">
              {(item.events ?? []).slice(0, 4).map((event) => (
                <li key={event.id}>
                  {event.title} · {formatNotificationTime(event.createdAt)}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => onApprove(item)}
              className="rounded border border-border px-2 py-1 text-[11px] text-text-secondary hover:bg-surface-muted"
              aria-label={`Approve ${item.title}`}
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="rounded border border-border px-2 py-1 text-[11px] text-text-secondary hover:bg-surface-muted"
              aria-label={`Open ${item.title}`}
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => onAssign(item)}
              className="rounded border border-border px-2 py-1 text-[11px] text-text-secondary hover:bg-surface-muted"
              aria-label={`Assign ${item.title} to me`}
            >
              Assign
            </button>
            <button
              type="button"
              onClick={() => onArchive(item)}
              className="rounded border border-border px-2 py-1 text-[11px] text-text-secondary hover:bg-surface-muted"
              aria-label={`Archive ${item.title}`}
            >
              Dismiss
            </button>
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

export const NotificationCard = memo(NotificationCardView)
