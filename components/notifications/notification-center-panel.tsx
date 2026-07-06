"use client"

import { NotificationFilter } from "./notification-filter"
import { NotificationList } from "./notification-list"
import { useNotificationCenter } from "@/hooks"

export function NotificationCenterPanel() {
  const {
    unreadCount,
    filters,
    groupedHistory,
    setFilters,
    resetFilters,
    markRead,
    remove,
    markAllRead,
    clearAll,
  } = useNotificationCenter()

  const hasFilters =
    filters.query.trim().length > 0 ||
    filters.unreadOnly ||
    filters.categories.length > 0 ||
    filters.priorities.length > 0

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-border px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-brand-navy">Notification Center</h2>
            <p className="text-xs text-text-muted">{unreadCount} unread notifications</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              className="rounded border border-border px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
            >
              Mark All Read
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded border border-border px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
            >
              Clear All
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-3 p-4">
        <NotificationFilter filters={filters} onChange={setFilters} onReset={resetFilters} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <NotificationList
          grouped={groupedHistory}
          hasFilters={hasFilters}
          onToggleRead={(item) => markRead(item.id, !item.read)}
          onRemove={(item) => remove(item.id)}
        />
      </div>
    </div>
  )
}
