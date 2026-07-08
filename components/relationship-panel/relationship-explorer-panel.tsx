import type { KnowledgeGraphEdge } from "@/types"

type RelationshipExplorerPanelProps = {
  relationships: KnowledgeGraphEdge[]
}

export function RelationshipExplorerPanel({ relationships }: RelationshipExplorerPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Relationship explorer">
      <p className="text-xs uppercase tracking-wide text-text-muted">Relationship Explorer</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Direct and indirect dependency chains</h2>
      <div className="mt-4 space-y-3">
        {relationships.map((relationship) => (
          <article key={relationship.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-navy">{relationship.label}</p>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{relationship.category.replace(/-/g, " ")}</span>
            </div>
            <p className="mt-2 text-xs text-text-secondary">Strength {relationship.strength}% · {relationship.source} → {relationship.target}</p>
          </article>
        ))}
      </div>
    </section>
  )
}