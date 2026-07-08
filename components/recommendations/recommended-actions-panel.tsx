"use client"

import type { RecommendedAction } from "@/types"
import { Button } from "@/components/ui"

type RecommendedActionsPanelProps = {
  actions: RecommendedAction[]
  onApprove: (actionId: string) => void
  onReject: (actionId: string) => void
  onExecute: (actionId: string) => void
}

export function RecommendedActionsPanel({ actions, onApprove, onReject, onExecute }: RecommendedActionsPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Recommended actions">
      <p className="text-xs uppercase tracking-wide text-text-muted">Recommended Actions</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Next best actions with approvals</h2>

      <div className="mt-4 space-y-3">
        {actions.map((action) => (
          <article key={action.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{action.title}</p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">{action.expectedImpact}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] text-text-muted">{action.confidence}%</span>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl bg-white px-2.5 py-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Effort</p><p className="mt-1 text-xs text-brand-navy">{action.estimatedEffort}</p></div>
              <div className="rounded-xl bg-white px-2.5 py-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Owner</p><p className="mt-1 text-xs text-brand-navy">{action.owner}</p></div>
              <div className="rounded-xl bg-white px-2.5 py-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Approvals</p><p className="mt-1 text-xs text-brand-navy">{action.requiredApprovals.join(", ")}</p></div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary" size="sm" onClick={() => onApprove(action.id)}>Approve</Button>
              <Button variant="secondary" size="sm" onClick={() => onExecute(action.id)}>Launch</Button>
              <Button variant="ghost" size="sm" onClick={() => onReject(action.id)}>Reject</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}