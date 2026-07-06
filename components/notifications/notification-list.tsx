import type { NotificationHistoryGroups, NotificationItem } from "@/types"
import { NotificationCard } from "./notification-card"
import { NotificationEmptyState } from "./notification-empty-state"

type NotificationListProps = {
  grouped: NotificationHistoryGroups
  hasFilters: boolean
  onToggleRead: (item: NotificationItem) => void
  onRemove: (item: NotificationItem) => void
}

function GroupSection({
  title,
  items,
  onToggleRead,
  onRemove,
}: {
  title: string
  items: NotificationItem[]
  onToggleRead: (item: NotificationItem) => void
  onRemove: (item: NotificationItem) => void
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="space-y-2" aria-label={`${title} notifications`}>
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onToggleRead={onToggleRead}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
}

export function NotificationList({
  grouped,
  hasFilters,
  onToggleRead,
  onRemove,
}: NotificationListProps) {
  const total = grouped.today.length + grouped.yesterday.length + grouped.earlier.length

  if (total === 0) {
    return <NotificationEmptyState hasFilters={hasFilters} />
  }

  return (
    <div className="space-y-4">
      <GroupSection title="Today" items={grouped.today} onToggleRead={onToggleRead} onRemove={onRemove} />
      <GroupSection title="Yesterday" items={grouped.yesterday} onToggleRead={onToggleRead} onRemove={onRemove} />
      <GroupSection title="Earlier" items={grouped.earlier} onToggleRead={onToggleRead} onRemove={onRemove} />
    </div>
  )
}
