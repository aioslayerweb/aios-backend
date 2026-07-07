import { Filter, RotateCcw } from "lucide-react"
import type { ActivityFilter, ActivityPriority } from "@/types"
import { activityDateOptions, activityPriorityOptions } from "@/utils/activity-feed"
import { Button, Input, Select } from "@/components/ui"

type ActivityFilterBarProps = {
  filters: ActivityFilter
  onChange: (next: Partial<ActivityFilter>) => void
  onReset: () => void
}

function optionLabel(value: string): string {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function ActivityFilterBar({ filters, onChange, onReset }: ActivityFilterBarProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-4" aria-label="Activity filters">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Input
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          placeholder="Search activity..."
          aria-label="Search activity"
        />

        <Select
          value={filters.date}
          onChange={(event) =>
            onChange({
              date: event.target.value as ActivityFilter["date"],
            })
          }
          aria-label="Filter by date"
        >
          {activityDateOptions.map((value) => (
            <option key={value} value={value}>
              {optionLabel(value)}
            </option>
          ))}
        </Select>

        <Select
          value={filters.priority[0] ?? "all"}
          onChange={(event) => {
            const value = event.target.value
            onChange({
              priority: value === "all" ? [] : [value as ActivityPriority],
            })
          }}
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          {activityPriorityOptions.map((value) => (
            <option key={value} value={value}>
              {optionLabel(value)}
            </option>
          ))}
        </Select>

        <Select
          value={filters.status[0] ?? "all"}
          onChange={(event) => {
            const value = event.target.value
            onChange({
              status: value === "all" ? [] : [value as ActivityFilter["status"][number]],
            })
          }}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="info">Info</option>
          <option value="running">Running</option>
          <option value="success">Success</option>
          <option value="completed">Completed</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </Select>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={filters.pinned}
            onChange={(event) => onChange({ pinned: event.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          Pinned only
        </label>

        <label className="inline-flex items-center gap-2 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={filters.unread}
            onChange={(event) => onChange({ unread: event.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          Unread only
        </label>
      </div>
    </section>
  )
}
