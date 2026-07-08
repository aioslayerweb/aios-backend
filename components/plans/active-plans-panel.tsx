"use client"

import type { PlanningPlan } from "@/types"

type ActivePlansPanelProps = {
  plans: PlanningPlan[]
  selectedPlanId: string
  onSelectPlan: (id: string) => void
}

export function ActivePlansPanel({ plans, selectedPlanId, onSelectPlan }: ActivePlansPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Active plans">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Active Plans</p>
        <span className="text-[11px] text-text-muted">{plans.length} plans</span>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => {
          const active = plan.id === selectedPlanId
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              className={active ? "rounded-xl border border-brand-primary bg-brand-subtle p-3 text-left" : "rounded-xl border border-border bg-surface-muted p-3 text-left hover:border-brand-primary"}
              aria-pressed={active}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary">{plan.objective}</p>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] capitalize text-text-muted">{plan.status}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-brand-primary" style={{ width: `${plan.progress}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-text-muted">
                <span className="rounded border border-border px-1.5 py-0.5">Confidence {plan.confidence}%</span>
                <span className="rounded border border-border px-1.5 py-0.5">ETA {plan.estimatedCompletion}</span>
              </div>
              <p className="mt-2 text-[11px] text-text-secondary">Impact: {plan.expectedImpact}</p>
              <p className="mt-1 text-[11px] text-text-muted">Dependencies: {plan.dependencies.join(", ")}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
