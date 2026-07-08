"use client"

import type { PromptAssignedAgent } from "@/types"

type AssignedAgentsPanelProps = {
  agents: PromptAssignedAgent[]
}

export function AssignedAgentsPanel({ agents }: AssignedAgentsPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Assigned agents">
      <p className="text-sm font-semibold text-brand-navy">Assigned Agents</p>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {agents.map((agent) => (
          <article key={agent.id} className="rounded-lg border border-border bg-surface-muted p-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{agent.name}</p>
              <p className="text-[11px] capitalize text-text-muted">{agent.status}</p>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{agent.task}</p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-brand-primary" style={{ width: `${agent.progress}%` }} />
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-text-muted">
              <span>{agent.progress}%</span>
              <span>{agent.confidence}% confidence</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
