"use client"

import type { PlanningSimulation } from "@/types"

type PlanningSimulationPanelProps = {
  simulations: PlanningSimulation[]
  selectedSimulationId: string
  onSelectSimulation: (id: string) => void
  onRunSimulation: (id: string) => void
}

export function PlanningSimulationPanel({ simulations, selectedSimulationId, onSelectSimulation, onRunSimulation }: PlanningSimulationPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Simulation mode">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Simulation Mode</p>
        <span className="text-[11px] text-text-muted">What if planner</span>
      </div>
      <div className="mt-2 space-y-2">
        {simulations.map((simulation) => {
          const active = simulation.id === selectedSimulationId
          return (
            <button
              key={simulation.id}
              type="button"
              onClick={() => onSelectSimulation(simulation.id)}
              className={active ? "w-full rounded-xl border border-brand-primary bg-brand-subtle p-3 text-left" : "w-full rounded-xl border border-border bg-surface-muted p-3 text-left hover:border-brand-primary"}
              aria-pressed={active}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary">{simulation.title}</p>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">{simulation.confidence}%</span>
              </div>
              <p className="mt-1 text-[11px] text-text-secondary">{simulation.scenario}</p>
              <p className="mt-1 text-[11px] text-text-muted">Impact: {simulation.estimatedImpact}</p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onRunSimulation(simulation.id)
                }}
                className="mt-2 rounded border border-border px-2 py-1 text-[11px] text-text-secondary"
              >
                Run simulation
              </button>
            </button>
          )
        })}
      </div>
    </section>
  )
}
