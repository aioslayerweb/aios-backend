"use client"

import { useGlobalSearch } from "@/hooks"

export function SearchInspectorPanel() {
  const { inspector } = useGlobalSearch()

  if (!inspector.result) {
    return (
      <aside className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Search inspector panel">
        <p className="text-sm text-text-secondary">Select a result to inspect metadata, timeline, relationships, and linked intelligence.</p>
      </aside>
    )
  }

  return (
    <aside className="space-y-3" aria-label="Search inspector panel">
      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-sm font-semibold text-brand-navy">Inspector</p>
        <p className="mt-1 text-xs text-text-secondary">{inspector.result.summary}</p>
        <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-text-muted">
          <span className="rounded border border-border px-1.5 py-1">Confidence {inspector.result.confidence}%</span>
          <span className="rounded border border-border px-1.5 py-1">Source {inspector.result.source}</span>
          <span className="rounded border border-border px-1.5 py-1">Priority {inspector.result.priority}</span>
          <span className="rounded border border-border px-1.5 py-1">Department {inspector.result.department}</span>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Timeline</p>
        <ol className="mt-2 space-y-1">
          {inspector.timeline.map((item) => (
            <li key={item.id} className="rounded border border-border bg-surface-muted px-2 py-1 text-[11px] text-text-secondary">
              {item.label}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Relationships</p>
        <div className="mt-2 space-y-1">
          {inspector.related.map((entity) => (
            <article key={entity.id} className="rounded border border-border bg-surface-muted px-2 py-1">
              <p className="text-[11px] font-medium capitalize text-text-primary">{entity.type}</p>
              <p className="text-[11px] text-text-secondary">{entity.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Linked Memories</p>
        <div className="mt-2 space-y-1">
          {inspector.linkedMemories.map((item) => (
            <article key={item.id} className="rounded border border-border bg-surface-muted px-2 py-1 text-[11px] text-text-secondary">
              {item.summary}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Associated Agents</p>
        <div className="mt-2 space-y-1">
          {inspector.associatedAgents.map((agent) => (
            <article key={agent.id} className="rounded border border-border bg-surface-muted px-2 py-1">
              <p className="text-[11px] font-medium text-text-primary">{agent.name}</p>
              <p className="text-[11px] capitalize text-text-secondary">{agent.status}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Vector Similarity (future)</p>
        <p className="mt-1 text-[11px] text-text-muted">Placeholder for semantic matches from vector embeddings and Prompt OS retrieval.</p>
      </section>
    </aside>
  )
}
