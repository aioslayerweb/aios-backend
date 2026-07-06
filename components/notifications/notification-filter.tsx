import type { NotificationCategory, NotificationFilters, NotificationPriority } from "@/types"
import { notificationCategories, notificationPriorities } from "@/utils/notifications"
import { cn } from "@/utils"

type NotificationFilterProps = {
  filters: NotificationFilters
  onChange: (next: Partial<NotificationFilters>) => void
  onReset: () => void
}

function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
        active
          ? "border-brand-primary bg-brand-subtle text-brand-navy"
          : "border-border text-text-muted hover:bg-surface-muted"
      )}
    >
      {label}
    </button>
  )
}

export function NotificationFilter({ filters, onChange, onReset }: NotificationFilterProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface-canvas p-3">
      <div className="flex items-center gap-2">
        <input
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          placeholder="Search notifications"
          className="aios-input h-9 w-full"
          aria-label="Search notifications"
        />
        <button
          type="button"
          onClick={onReset}
          className="h-9 rounded-md border border-border px-3 text-xs text-text-secondary hover:bg-surface-muted"
        >
          Reset
        </button>
      </div>

      <label className="inline-flex items-center gap-2 text-xs text-text-secondary">
        <input
          type="checkbox"
          checked={filters.unreadOnly}
          onChange={(event) => onChange({ unreadOnly: event.target.checked })}
          aria-label="Show unread notifications only"
        />
        Unread only
      </label>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Category</p>
        <div className="flex flex-wrap gap-1">
          {notificationCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              active={filters.categories.includes(category)}
              onClick={() =>
                onChange({
                  categories: toggleValue<NotificationCategory>(
                    filters.categories,
                    category
                  ),
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Priority</p>
        <div className="flex flex-wrap gap-1">
          {notificationPriorities.map((priority) => (
            <Chip
              key={priority}
              label={priority}
              active={filters.priorities.includes(priority)}
              onClick={() =>
                onChange({
                  priorities: toggleValue<NotificationPriority>(
                    filters.priorities,
                    priority
                  ),
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
