"use client"

import { useDecisionCenter } from "@/hooks"
import { DecisionCard } from "./decision-card"

export function DecisionCenter() {
  const { pending, approveDecision } = useDecisionCenter()

  return (
    <section className="space-y-3" aria-label="Decision center">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-brand-navy">Decision Center</p>
        <span className="rounded-md border border-border px-2 py-1 text-xs text-text-secondary">{pending.length} pending</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {pending.map((item) => (
          <DecisionCard key={item.id} item={item} onApprove={approveDecision} />
        ))}
      </div>
    </section>
  )
}
