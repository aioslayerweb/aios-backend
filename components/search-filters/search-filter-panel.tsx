"use client"

import type { SearchDepartment, SearchPriority, SearchSourceKey } from "@/types"
import { useBookmarks, useGlobalSearch } from "@/hooks"

const sourceOptions: SearchSourceKey[] = [
  "memory",
  "knowledge",
  "agents",
  "customers",
  "tasks",
  "executions",
  "reports",
  "runtime-events",
  "documents",
  "commands",
  "notifications",
  "activity",
]

const priorityOptions: SearchPriority[] = ["low", "medium", "high", "critical"]
const departmentOptions: SearchDepartment[] = [
  "executive",
  "sales",
  "operations",
  "support",
  "knowledge",
  "finance",
  "marketing",
  "hr",
  "platform",
]

function toggleArrayValue<T extends string>(values: T[], value: T): T[] {
  if (values.includes(value)) {
    return values.filter((item) => item !== value)
  }

  return [...values, value]
}

export function SearchFilterPanel() {
  const { filters, setFilters, toggleSource } = useGlobalSearch()
  const { pinnedBookmarks, recentBookmarks } = useBookmarks()

  return (
    <aside className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Search filters">
      <p className="text-sm font-semibold text-brand-navy">Search Filters</p>

      <section className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-text-muted">Sources</p>
        <div className="flex flex-wrap gap-1">
          {sourceOptions.map((source) => {
            const active = filters.sources.includes(source)
            return (
              <button
                key={source}
                type="button"
                className={active ? "rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-[11px] capitalize text-brand-navy" : "rounded border border-border px-2 py-1 text-[11px] capitalize text-text-secondary"}
                onClick={() => toggleSource(source)}
                aria-pressed={active}
              >
                {source.replace("-", " ")}
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-text-muted">Date</p>
        <div className="flex flex-wrap gap-1">
          {(["all", "24h", "7d", "30d"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={filters.date === value ? "rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-[11px] text-brand-navy" : "rounded border border-border px-2 py-1 text-[11px] text-text-secondary"}
              onClick={() => setFilters({ date: value })}
              aria-pressed={filters.date === value}
            >
              {value}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-text-muted">Priority</p>
        <div className="flex flex-wrap gap-1">
          {priorityOptions.map((value) => {
            const active = filters.priorities.includes(value)
            return (
              <button
                key={value}
                type="button"
                className={active ? "rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-[11px] capitalize text-brand-navy" : "rounded border border-border px-2 py-1 text-[11px] capitalize text-text-secondary"}
                onClick={() => setFilters({ priorities: toggleArrayValue(filters.priorities, value) })}
                aria-pressed={active}
              >
                {value}
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-text-muted">Confidence</p>
        <input
          type="range"
          min={0}
          max={100}
          value={filters.confidenceMin}
          onChange={(event) => setFilters({ confidenceMin: Number(event.target.value) })}
          className="w-full"
          aria-label="Minimum confidence"
        />
        <p className="text-[11px] text-text-muted">{filters.confidenceMin}% minimum</p>
      </section>

      <section className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-text-muted">Department</p>
        <div className="flex flex-wrap gap-1">
          {departmentOptions.map((value) => {
            const active = filters.departments.includes(value)
            return (
              <button
                key={value}
                type="button"
                className={active ? "rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-[11px] capitalize text-brand-navy" : "rounded border border-border px-2 py-1 text-[11px] capitalize text-text-secondary"}
                onClick={() => setFilters({ departments: toggleArrayValue(filters.departments, value) })}
                aria-pressed={active}
              >
                {value}
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-text-muted">Pinned Bookmarks</p>
        <div className="space-y-1">
          {pinnedBookmarks.length === 0 ? (
            <p className="text-[11px] text-text-muted">No pinned bookmarks yet.</p>
          ) : (
            pinnedBookmarks.slice(0, 4).map((item) => (
              <article key={item.bookmark.resultId} className="rounded border border-border bg-surface-muted px-2 py-1">
                <p className="text-[11px] font-medium text-text-primary">{item.result?.title}</p>
                <p className="text-[11px] text-text-muted capitalize">{item.result?.source}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-text-muted">Recent Bookmarks</p>
        <div className="space-y-1">
          {recentBookmarks.length === 0 ? (
            <p className="text-[11px] text-text-muted">No recent bookmarks.</p>
          ) : (
            recentBookmarks.slice(0, 4).map((item) => (
              <article key={item.bookmark.resultId} className="rounded border border-border bg-surface-muted px-2 py-1">
                <p className="text-[11px] font-medium text-text-primary">{item.result?.title}</p>
                <p className="text-[11px] text-text-muted">{new Date(item.bookmark.createdAt).toLocaleTimeString()}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </aside>
  )
}
