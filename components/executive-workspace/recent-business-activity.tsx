"use client"

import { useRecentActivity } from "@/hooks"
import { formatActivityTime } from "@/utils/activity-feed"

export function RecentBusinessActivity() {
  const { items } = useRecentActivity(8)

  return (
    <section className="space-y-3" aria-label="Recent business activity">
      <p className="text-lg font-semibold text-brand-navy">Recent Business Activity</p>
      <div className="space-y-2 rounded-xl border border-border bg-white p-4 shadow-sm">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-border px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-brand-navy">{item.title}</p>
              <p className="text-xs text-text-muted">{formatActivityTime(item.timestamp)}</p>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{item.summary}</p>
            <p className="mt-1 text-[11px] text-text-muted">
              {item.category} • {item.source.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
