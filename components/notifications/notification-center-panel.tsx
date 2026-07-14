"use client"

import { NotificationFilter } from "./notification-filter"
import { NotificationList } from "./notification-list"
import { useNotificationCenter } from "@/hooks"

export function NotificationCenterPanel() {
  const {
    unreadCount,
    filters,
    groupedByPriority,
    summary,
    setFilters,
    resetFilters,
    markRead,
    remove,
    markAllRead,
    acknowledge,
    archive,
    assignToMe,
    openNotification,
    approveNotification,
    toggleExpanded,
    clearAll,
  } = useNotificationCenter()

  const hasFilters =
    filters.query.trim().length > 0 ||
    filters.unreadOnly ||
    filters.categories.length > 0 ||
    filters.priorities.length > 0 ||
    filters.preset !== "all"

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

      <section className="border-b border-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Today&apos;s AI Summary</p>
        <p className="mt-1 text-xs text-text-secondary">
          {summary.criticalDecisions} critical decisions · {summary.workflowsCompleted} workflows completed · {summary.integrationFailures} integration failures · {summary.newOpportunities} new opportunities detected
        </p>
      </section>

      <div className="space-y-3 p-4">
        <NotificationFilter filters={filters} onChange={setFilters} onReset={resetFilters} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <NotificationList
          grouped={groupedByPriority}
          hasFilters={hasFilters}
          onToggleRead={(item) => markRead(item.id, !item.read)}
          onOpen={(item) => openNotification(item.id)}
          onApprove={(item) => (item.priority === "CRITICAL" ? acknowledge(item.id) : approveNotification(item.id))}
          onAssign={(item) => assignToMe(item.id)}
          onArchive={(item) => archive(item.id)}
          onToggleExpanded={(item) => toggleExpanded(item.id)}
          onRemove={(item) => remove(item.id)}
        />
      </div>
    </div>
  )
}
