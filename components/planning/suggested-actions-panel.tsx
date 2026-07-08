"use client"

import type { PlanningAction } from "@/types"

type SuggestedActionsPanelProps = {
  actions: PlanningAction[]
}

export function SuggestedActionsPanel({ actions }: SuggestedActionsPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Suggested actions">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Suggested Actions</p>
        <span className="text-[11px] text-text-muted">AI-generated recommendations</span>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <article key={action.id} className="rounded-xl border border-border bg-surface-muted p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{action.label}</p>
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">{action.confidence}%</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{action.impact}</p>
            <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-text-muted">
              {action.departments.map((department) => (
                <span key={department} className="rounded border border-border px-1.5 py-0.5 capitalize">
                  {department}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-text-muted">Required agents: {action.requiredAgents.join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
