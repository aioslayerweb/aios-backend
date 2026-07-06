type NotificationEmptyStateProps = {
  hasFilters: boolean
}

export function NotificationEmptyState({ hasFilters }: NotificationEmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-muted px-4 py-8 text-center">
      <p className="text-sm font-semibold text-text-primary">
        {hasFilters ? "No notifications match your filters" : "No notifications yet"}
      </p>
      <p className="mt-1 text-xs text-text-muted">
        {hasFilters
          ? "Try clearing filters or search terms."
          : "Runtime, memory, agent, CRM, and integration events will appear here."}
      </p>
    </div>
  )
}
