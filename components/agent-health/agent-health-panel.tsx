"use client"

import type { OrchestratorMetric } from "@/types"

type AgentHealthPanelProps = {
  health: OrchestratorMetric[]
}

export function AgentHealthPanel({ health }: AgentHealthPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Agent health">
      <p className="text-sm font-semibold text-brand-navy">Agent Health</p>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {health.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-surface-muted p-3">
            <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-xl font-semibold text-text-primary">{item.value}</span>
              {item.suffix ? <span className="pb-0.5 text-xs text-text-muted">{item.suffix}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
