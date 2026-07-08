import type { GraphSearchMatch } from "@/types"

type KnowledgeSearchSummaryProps = {
  search: GraphSearchMatch
}

export function KnowledgeSearchSummary({ search }: KnowledgeSearchSummaryProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Knowledge graph search summary">
      <p className="text-xs uppercase tracking-wide text-text-muted">Graph Search</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Matching entities</h2>
      <p className="mt-2 text-sm text-text-secondary">
        {search.query ? `${search.matchedNodeIds.length} nodes matched “${search.query}”.` : "Search any customer, workflow, knowledge object, memory node, or agent."}
      </p>
    </section>
  )
}