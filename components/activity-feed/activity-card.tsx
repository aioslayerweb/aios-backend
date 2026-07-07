import { motion } from "framer-motion"
import { Clock3, Pin, PinOff } from "lucide-react"
import type { ActivityItem } from "@/types"
import { formatActivityTime } from "@/utils/activity-feed"
import { cn } from "@/utils"
import { Button } from "@/components/ui"
import { ActivityBadge } from "./activity-badge"
import { ActivityIcon } from "./activity-icon"

type ActivityCardProps = {
  item: ActivityItem
  selected: boolean
  onSelect: (id: string) => void
  onTogglePinned: (id: string) => void
  onToggleRead: (id: string, unread: boolean) => void
}

export function ActivityCard({
  item,
  selected,
  onSelect,
  onTogglePinned,
  onToggleRead,
}: ActivityCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "group rounded-xl border bg-white p-4 shadow-sm transition-colors will-change-transform",
        selected ? "border-brand-primary ring-2 ring-brand-primary/20" : "border-border hover:border-brand-primary/40"
      )}
      aria-selected={selected}
      role="option"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect(item.id)
        }
      }}
    >
      <div className="flex items-start gap-3">
        <ActivityIcon category={item.category} metadata={item.metadata} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-brand-navy">{item.title}</p>
            <ActivityBadge kind="priority" value={item.priority} />
            <ActivityBadge kind="status" value={item.metadata.status} />
            <ActivityBadge kind="pinned" value={item.pinned} />
            <ActivityBadge kind="unread" value={item.unread} />
          </div>

          <p className="mt-1 text-sm text-text-secondary">{item.summary}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="rounded bg-surface-muted px-2 py-1">{item.source.label}</span>
            <span className="rounded bg-surface-muted px-2 py-1">{item.metadata.eventType}</span>
            <span className="rounded bg-surface-muted px-2 py-1">{item.actor.name}</span>
            <span className="inline-flex items-center gap-1 rounded bg-surface-muted px-2 py-1">
              <Clock3 className="h-3 w-3" />
              {formatActivityTime(item.timestamp)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={item.pinned ? "Unpin activity" : "Pin activity"}
            onClick={(event) => {
              event.stopPropagation()
              onTogglePinned(item.id)
            }}
            className="h-8 w-8"
          >
            {item.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </Button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggleRead(item.id, !item.unread)
            }}
            className="rounded border border-border px-2 py-1 text-xs text-text-muted hover:bg-surface-muted"
            aria-label={item.unread ? "Mark as read" : "Mark as unread"}
          >
            {item.unread ? "Mark read" : "Mark unread"}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
