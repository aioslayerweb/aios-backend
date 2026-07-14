import { memo, useMemo, useState, type UIEvent } from "react"
import type { NotificationItem, NotificationPriorityGroups } from "@/types"
import { NotificationCard } from "./notification-card"
import { NotificationEmptyState } from "./notification-empty-state"

type NotificationListProps = {
  grouped: NotificationPriorityGroups
  hasFilters: boolean
  onToggleRead: (item: NotificationItem) => void
  onOpen: (item: NotificationItem) => void
  onApprove: (item: NotificationItem) => void
  onAssign: (item: NotificationItem) => void
  onArchive: (item: NotificationItem) => void
  onToggleExpanded: (item: NotificationItem) => void
  onRemove: (item: NotificationItem) => void
}

type GroupSectionProps = {
  title: string
  items: NotificationItem[]
  onToggleRead: (item: NotificationItem) => void
  onOpen: (item: NotificationItem) => void
  onApprove: (item: NotificationItem) => void
  onAssign: (item: NotificationItem) => void
  onArchive: (item: NotificationItem) => void
  onToggleExpanded: (item: NotificationItem) => void
  onRemove: (item: NotificationItem) => void
}

const VIRTUAL_ROW_HEIGHT = 184
const VIRTUAL_VIEWPORT_HEIGHT = 560
const VIRTUAL_OVERSCAN = 4

const GroupSection = memo(function GroupSection({
  title,
  items,
  onToggleRead,
  onOpen,
  onApprove,
  onAssign,
  onArchive,
  onToggleExpanded,
  onRemove,
}: GroupSectionProps) {
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
            onOpen={onOpen}
            onApprove={onApprove}
            onAssign={onAssign}
            onArchive={onArchive}
            onToggleExpanded={onToggleExpanded}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
})

function VirtualizedSection({
  title,
  items,
  onToggleRead,
  onOpen,
  onApprove,
  onAssign,
  onArchive,
  onToggleExpanded,
  onRemove,
}: GroupSectionProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = items.length * VIRTUAL_ROW_HEIGHT
  const visibleCount = Math.ceil(VIRTUAL_VIEWPORT_HEIGHT / VIRTUAL_ROW_HEIGHT)
  const startIndex = Math.max(0, Math.floor(scrollTop / VIRTUAL_ROW_HEIGHT) - VIRTUAL_OVERSCAN)
  const endIndex = Math.min(items.length, startIndex + visibleCount + VIRTUAL_OVERSCAN * 2)

  const visibleItems = useMemo(() => items.slice(startIndex, endIndex), [endIndex, items, startIndex])

  if (items.length === 0) {
    return null
  }

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }

  return (
    <section className="space-y-2" aria-label={`${title} notifications`}>
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
      <div className="overflow-y-auto" style={{ maxHeight: `${VIRTUAL_VIEWPORT_HEIGHT}px` }} onScroll={handleScroll}>
        <div style={{ height: `${totalHeight}px`, position: "relative" }}>
          {visibleItems.map((item, index) => {
            const actualIndex = startIndex + index

            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  top: `${actualIndex * VIRTUAL_ROW_HEIGHT}px`,
                  left: 0,
                  right: 0,
                }}
              >
                <NotificationCard
                  item={item}
                  onToggleRead={onToggleRead}
                  onOpen={onOpen}
                  onApprove={onApprove}
                  onAssign={onAssign}
                  onArchive={onArchive}
                  onToggleExpanded={onToggleExpanded}
                  onRemove={onRemove}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function NotificationList({
  grouped,
  hasFilters,
  onToggleRead,
  onOpen,
  onApprove,
  onAssign,
  onArchive,
  onToggleExpanded,
  onRemove,
}: NotificationListProps) {
  const total = grouped.CRITICAL.length + grouped.HIGH.length + grouped.MEDIUM.length + grouped.LOW.length

  if (total === 0) {
    return <NotificationEmptyState hasFilters={hasFilters} />
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 space-y-2 bg-surface-canvas pb-1">
        <GroupSection
          title="Critical (Pinned)"
          items={grouped.CRITICAL}
          onToggleRead={onToggleRead}
          onOpen={onOpen}
          onApprove={onApprove}
          onAssign={onAssign}
          onArchive={onArchive}
          onToggleExpanded={onToggleExpanded}
          onRemove={onRemove}
        />
      </div>

      <VirtualizedSection
        title="High"
        items={grouped.HIGH}
        onToggleRead={onToggleRead}
        onOpen={onOpen}
        onApprove={onApprove}
        onAssign={onAssign}
        onArchive={onArchive}
        onToggleExpanded={onToggleExpanded}
        onRemove={onRemove}
      />

      <VirtualizedSection
        title="Medium"
        items={grouped.MEDIUM}
        onToggleRead={onToggleRead}
        onOpen={onOpen}
        onApprove={onApprove}
        onAssign={onAssign}
        onArchive={onArchive}
        onToggleExpanded={onToggleExpanded}
        onRemove={onRemove}
      />

      <VirtualizedSection
        title="Low"
        items={grouped.LOW}
        onToggleRead={onToggleRead}
        onOpen={onOpen}
        onApprove={onApprove}
        onAssign={onAssign}
        onArchive={onArchive}
        onToggleExpanded={onToggleExpanded}
        onRemove={onRemove}
      />
    </div>
  )
}
