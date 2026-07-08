"use client"

import type { GovernanceApprovalAction, GovernanceApprovalItem } from "@/types"
import { Button } from "@/components/ui"

type ApprovalCenterPanelProps = {
  approvals: GovernanceApprovalItem[]
  onAction: (approvalId: string, action: GovernanceApprovalAction) => void
}

const actions: GovernanceApprovalAction[] = ["approve", "reject", "request-review", "delegate", "escalate"]

export function ApprovalCenterPanel({ approvals, onAction }: ApprovalCenterPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Approval center">
      <p className="text-xs uppercase tracking-wide text-text-muted">Approval Center</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Mock approval workflows</h2>
      <div className="mt-4 space-y-3">
        {approvals.map((approval) => (
          <article key={approval.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{approval.title}</p>
                <p className="mt-1 text-xs text-text-muted">Owner {approval.owner} · Required {approval.requiredBy}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{approval.status}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{approval.rationale}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {actions.map((action) => (
                <Button key={action} variant={action === "approve" ? "primary" : action === "reject" ? "danger" : "secondary"} size="sm" onClick={() => onAction(approval.id, action)}>
                  {action.replace("-", " ")}
                </Button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}