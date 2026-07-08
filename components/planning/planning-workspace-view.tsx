"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo } from "react"
import { Activity, BrainCircuit, SlidersHorizontal } from "lucide-react"
import { usePlanningEngine } from "@/hooks"
import { StrategicGoalsPanel } from "@/components/goals/strategic-goals-panel"
import { ActivePlansPanel } from "@/components/plans/active-plans-panel"
import { ExecutionRoadmap } from "@/components/roadmap/execution-roadmap"
import { DecisionTreePanel } from "@/components/decision-tree/decision-tree-panel"
import { DependenciesGraph } from "@/components/dependencies/dependencies-graph"
import { PriorityMatrixPanel } from "@/components/priority-matrix/priority-matrix-panel"
import { SuggestedActionsPanel } from "./suggested-actions-panel"
import { PlanningTimelinePanel } from "@/components/timeline/planning-timeline-panel"

const PlanningSimulationPanel = dynamic(
  () => import("@/components/simulation/planning-simulation-panel").then((mod) => mod.PlanningSimulationPanel),
  {
    ssr: false,
    loading: () => (
      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs text-text-muted">Loading simulation...</p>
      </section>
    ),
  }
)

export function PlanningWorkspaceView() {
  const {
    goals,
    plans,
    roadmap,
    decisionTree,
    dependencies,
    priorityMatrix,
    suggestedActions,
    timeline,
    simulation,
    selectedGoalId,
    selectedPlanId,
    selectedDecisionId,
    selectedSimulationId,
    selectedGoal,
    selectedPlan,
    selectedDecision,
    selectedSimulation,
    filteredGoals,
    filteredPlans,
    summary,
    setSelectedGoalId,
    setSelectedPlanId,
    setSelectedDecisionId,
    setSelectedSimulationId,
    updateQuery,
    query,
    recalculatePlans,
    runSimulation,
  } = usePlanningEngine()

  const headerMeta = useMemo(
    () => [
      `${goals.length} strategic goals`,
      `${plans.length} active plans`,
      `${decisionTree.length} decision branches`,
      `${simulation.length} simulations`,
    ],
    [decisionTree.length, goals.length, plans.length, simulation.length]
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault()
        recalculatePlans()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [recalculatePlans])

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Planning header">
        <div className="flex flex-wrap items-start gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Strategic Chief Operating Layer</p>
            <h1 className="text-xl font-semibold text-brand-navy">AIOS Autonomous Planning Engine</h1>
            <p className="mt-1 text-sm text-text-secondary">
              AIOS continuously evaluates goals, prioritizes work, and reshapes execution plans before the user asks.
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span className="rounded border border-border px-1.5 py-0.5"><Activity className="mr-1 inline h-3 w-3" />Planning active</span>
            <span className="rounded border border-border px-1.5 py-0.5"><BrainCircuit className="mr-1 inline h-3 w-3" />Strategic brain</span>
            <span className="rounded border border-border px-1.5 py-0.5"><SlidersHorizontal className="mr-1 inline h-3 w-3" />Priority matrix</span>
          </div>
        </div>

        <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_240px_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <input
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search goals, plans, dependencies, or scenarios"
              className="w-full bg-transparent text-sm text-text-primary outline-none"
              aria-label="Search planning workspace"
            />
          </label>
          <button
            type="button"
            onClick={recalculatePlans}
            className="rounded-xl border border-border bg-brand-subtle px-3 py-2 text-sm text-brand-navy"
          >
            Recalculate plans
          </button>
          <div className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-sm text-text-secondary">
            {selectedGoal?.title ?? "Select a goal"}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-text-muted">
          {headerMeta.map((item) => (
            <span key={item} className="rounded border border-border px-1.5 py-0.5">
              {item}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-text-muted">{summary}</p>
      </section>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside className="space-y-3" aria-label="Planning sidebar">
          <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-brand-navy">Planning Filters</p>
            <p className="mt-1 text-xs text-text-secondary">Architecture ready for department, priority, and planning history filters.</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-brand-navy">Selected Goal</p>
            <p className="mt-1 text-xs text-text-secondary">{selectedGoal?.title ?? "None"}</p>
            <p className="mt-1 text-[11px] text-text-muted">Confidence {selectedGoal?.confidence ?? 0}% · Priority {selectedGoal?.priority ?? "low"}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-brand-navy">Selected Plan</p>
            <p className="mt-1 text-xs text-text-secondary">{selectedPlan?.objective ?? "None"}</p>
            <p className="mt-1 text-[11px] text-text-muted">Impact: {selectedPlan?.expectedImpact ?? "n/a"}</p>
          </div>
        </aside>

        <main className="space-y-3" aria-label="Planning central workspace">
          <StrategicGoalsPanel goals={filteredGoals} selectedGoalId={selectedGoalId} onSelectGoal={setSelectedGoalId} />
          <ActivePlansPanel plans={filteredPlans} selectedPlanId={selectedPlanId} onSelectPlan={setSelectedPlanId} />
          <ExecutionRoadmap roadmap={roadmap} />
          <DecisionTreePanel decisionTree={decisionTree} selectedDecisionId={selectedDecisionId} onSelectDecision={setSelectedDecisionId} />
          <DependenciesGraph dependencies={dependencies} />
          <PriorityMatrixPanel cards={priorityMatrix} selectedTitle={selectedPlan?.objective} onSelectCard={(title) => {
            const match = plans.find((plan) => plan.objective === title)
            if (match) {
              setSelectedPlanId(match.id)
            }
          }} />
          <SuggestedActionsPanel actions={suggestedActions} />
          <PlanningSimulationPanel
            simulations={simulation}
            selectedSimulationId={selectedSimulationId}
            onSelectSimulation={setSelectedSimulationId}
            onRunSimulation={runSimulation}
          />
          <PlanningTimelinePanel timeline={timeline} />
        </main>

        <aside className="space-y-3" aria-label="Planning inspector">
          <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-brand-navy">Decision Insight</p>
            <p className="mt-1 text-xs text-text-secondary">{selectedDecision?.summary ?? "Select a decision node."}</p>
            <p className="mt-1 text-[11px] text-text-muted">Probability {selectedDecision?.probability ?? 0}%</p>
          </section>
          <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-brand-navy">Simulation Insight</p>
            <p className="mt-1 text-xs text-text-secondary">{selectedSimulation?.estimatedImpact ?? "Select a scenario."}</p>
            <p className="mt-1 text-[11px] text-text-muted">{selectedSimulation?.scenario ?? ""}</p>
          </section>
        </aside>
      </div>
    </div>
  )
}
