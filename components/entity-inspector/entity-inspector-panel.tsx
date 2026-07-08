import type { EntityInspectorModel, KnowledgeGraphNode, KnowledgeTimelineEvent } from "@/types"

type EntityInspectorPanelProps = {
  entity: KnowledgeGraphNode | null
  inspector: EntityInspectorModel | null
  timeline: KnowledgeTimelineEvent[]
}

export function EntityInspectorPanel({ entity, inspector, timeline }: EntityInspectorPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Entity inspector">
      <p className="text-xs uppercase tracking-wide text-text-muted">Entity Inspector</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">{entity?.label ?? "Select an entity"}</h2>
      <p className="mt-2 text-xs leading-5 text-text-secondary">{entity?.summary ?? "Select a graph node to inspect metadata, relationships, timeline, memory, workflows, and actions."}</p>

      <div className="mt-4 space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          {(inspector?.metadata ?? []).map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-2">
              <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
              <p className="mt-1 text-xs text-brand-navy">{item.value}</p>
            </article>
          ))}
        </div>

        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Relationships</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {(inspector?.relationships ?? []).map((item) => <p key={item.id}>{item.label} → {item.targetLabel}</p>)}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Linked memory</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {(inspector?.linkedMemory ?? []).map((item) => <p key={item.id}>{item.summary}</p>)}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Connected workflows and agents</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            <p>Workflows: {(inspector?.connectedWorkflows ?? []).join(", ") || "None"}</p>
            <p>Agents: {(inspector?.responsibleAgents ?? []).join(", ") || "None"}</p>
            <p>Open actions: {(inspector?.openActions ?? []).join(", ") || "None"}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Timeline</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {timeline.map((item) => <p key={item.id}>{item.title} · {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>)}
          </div>
        </article>
      </div>
    </section>
  )
}