"use client"

import { useExecutiveWorkspace } from "@/hooks"

export function ExecutiveHeader() {
  const { summary, lastUpdated, refresh } = useExecutiveWorkspace()

  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Executive header">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Current Date</p>
          <p className="text-sm font-semibold text-brand-navy">{summary.dateLabel}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Organization</p>
          <p className="text-sm font-semibold text-brand-navy">{summary.organizationName}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Workspace</p>
          <p className="text-sm font-semibold text-brand-navy">{summary.workspaceName}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md border border-border px-2 py-1 text-xs text-text-secondary">
            Updated {new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date(lastUpdated))}
          </span>
          <button
            type="button"
            onClick={refresh}
            className="rounded-md border border-border px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
          >
            Refresh
          </button>
        </div>
      </div>
    </section>
  )
}
