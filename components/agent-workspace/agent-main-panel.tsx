"use client"

import type { AgentCardItem } from "@/types"

type AgentMainPanelProps = {
  agent: AgentCardItem | null
}

export function AgentMainPanel({ agent }: AgentMainPanelProps) {
  if (!agent) {
    return (
      <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Agent workspace">
        <p className="text-sm text-text-secondary">Select an agent to inspect objective and execution state.</p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Selected agent workspace">
      <p className="text-xs uppercase tracking-wide text-text-muted">Selected Agent</p>
      <h2 className="mt-1 text-xl font-semibold text-brand-navy">{agent.name}</h2>
      <p className="mt-2 text-sm text-text-secondary">{agent.objective}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-border bg-surface-muted p-2">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Current execution</p>
          <p className="mt-1 text-xs font-semibold text-text-primary">{agent.currentTask}</p>
        </article>
        <article className="rounded-lg border border-border bg-surface-muted p-2">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Current context</p>
          <p className="mt-1 text-xs font-semibold text-text-primary">{agent.contextSummary}</p>
        </article>
        <article className="rounded-lg border border-border bg-surface-muted p-2">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Memory usage</p>
          <p className="mt-1 text-xs font-semibold text-text-primary">{agent.memoryUsage}%</p>
        </article>
        <article className="rounded-lg border border-border bg-surface-muted p-2">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Estimated completion</p>
          <p className="mt-1 text-xs font-semibold text-text-primary">{agent.etaMinutes} min</p>
        </article>
      </div>

      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-wide text-text-muted">Active tools</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {agent.activeTools.map((tool) => (
            <span key={tool} className="rounded border border-border bg-white px-2 py-1 text-[11px] text-text-secondary">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-text-muted">
        <span className="rounded border border-border px-2 py-1">Status {agent.status}</span>
        <span className="rounded border border-border px-2 py-1">Confidence {agent.confidence}%</span>
        <span className="rounded border border-border px-2 py-1">Health {agent.health}%</span>
      </div>
    </section>
  )
}
