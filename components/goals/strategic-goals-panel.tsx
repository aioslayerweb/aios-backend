"use client"

import type { PlanningGoal } from "@/types"

type StrategicGoalsPanelProps = {
  goals: PlanningGoal[]
  selectedGoalId: string
  onSelectGoal: (id: string) => void
}

export function StrategicGoalsPanel({ goals, selectedGoalId, onSelectGoal }: StrategicGoalsPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Strategic goals">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Strategic Goals</p>
        <span className="text-[11px] text-text-muted">{goals.length} objectives</span>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => {
          const active = goal.id === selectedGoalId
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelectGoal(goal.id)}
              className={active ? "rounded-xl border border-brand-primary bg-brand-subtle p-3 text-left" : "rounded-xl border border-border bg-surface-muted p-3 text-left hover:border-brand-primary"}
              aria-pressed={active}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary">{goal.title}</p>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] capitalize text-text-muted">{goal.priority}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-brand-primary" style={{ width: `${goal.progress}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-text-muted">
                <span className="rounded border border-border px-1.5 py-0.5">Progress {goal.progress}%</span>
                <span className="rounded border border-border px-1.5 py-0.5">Confidence {goal.confidence}%</span>
              </div>
              <p className="mt-2 text-[11px] text-text-secondary">Agents: {goal.assignedAgents.join(", ")}</p>
              <p className="mt-1 text-[11px] text-text-muted">Workflows: {goal.relatedWorkflows.join(", ")}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
