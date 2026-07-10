"use client"

import type { ToolRecord } from "@/types"

type AgentToolsPanelProps = {
  tools: ToolRecord[]
}

function statusClass(status: ToolRecord["status"]): string {
  if (status === "connected") {
    return "bg-emerald-100 text-[var(--color-semantic-success-text)]"
  }

  if (status === "executing") {
    return "bg-amber-100 text-[var(--color-semantic-warning-text)]"
  }

  if (status === "error") {
    return "bg-rose-100 text-[var(--color-semantic-error-text)]"
  }

  return "bg-slate-100 text-slate-600"
}

export function AgentToolsPanel({ tools }: AgentToolsPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Tools panel">
      <p className="text-sm font-semibold text-brand-navy">Tools Panel</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {tools.map((tool) => (
          <article key={tool.id} className="rounded-lg border border-border bg-surface-muted p-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{tool.name}</p>
              <span className={`rounded px-1.5 py-0.5 text-[11px] ${statusClass(tool.status)}`}>{tool.status}</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{tool.lastAction}</p>
            <p className="mt-1 text-[11px] text-text-muted">Latency {tool.latencyMs}ms</p>
          </article>
        ))}
      </div>
    </section>
  )
}
