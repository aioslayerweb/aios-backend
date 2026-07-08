"use client"

import { Button, StatusIndicator } from "@/components/ui"

type KnowledgeGraphToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  liveMode: boolean
  onToggleLiveMode: () => void
  selectedLabel: string
}

export function KnowledgeGraphToolbar({ query, onQueryChange, liveMode, onToggleLiveMode, selectedLabel }: KnowledgeGraphToolbarProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Knowledge graph toolbar">
      <div className="flex flex-wrap items-start gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Graph Search</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Search and inspect business context</h2>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <StatusIndicator tone={liveMode ? "success" : "neutral"} label={liveMode ? "Graph live" : "Graph paused"} />
          <Button variant="secondary" size="sm" onClick={onToggleLiveMode} aria-pressed={liveMode}>{liveMode ? "Pause" : "Resume"}</Button>
        </div>
      </div>
      <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_220px]">
        <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search customer, agent, workflow, knowledge, meeting, project"
            className="w-full bg-transparent text-sm text-text-primary outline-none"
            aria-label="Search the business knowledge graph"
          />
        </label>
        <div className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-sm text-text-secondary">
          {selectedLabel}
        </div>
      </div>
    </section>
  )
}