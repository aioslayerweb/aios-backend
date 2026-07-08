"use client"

import { useMemo } from "react"
import { Activity, BrainCircuit, Database, GitBranch, Network, Search } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import {
  useBusinessEntities,
  useEntityInspector,
  useGraphFilters,
  useGraphSearch,
  useKnowledgeGraph,
  useKnowledgeTimeline,
  useRelationships,
} from "@/hooks"
import { EntityInspectorPanel } from "@/components/entity-inspector/entity-inspector-panel"
import { KnowledgeGraphFiltersPanel } from "@/components/graph-filters/knowledge-graph-filters-panel"
import { KnowledgeGraphToolbar } from "@/components/graph-toolbar/knowledge-graph-toolbar"
import { KnowledgeSearchSummary } from "@/components/knowledge-search/knowledge-search-summary"
import { RelationshipExplorerPanel } from "@/components/relationship-panel/relationship-explorer-panel"
import { KnowledgeTimelinePanel } from "@/components/entity-viewer/knowledge-timeline-panel"
import { BusinessKnowledgeGraphCanvas } from "./business-knowledge-graph-canvas"
import { StatusIndicator } from "@/components/ui"

export function BusinessKnowledgeGraphView() {
  const reduceMotion = useReducedMotion()
  const { search, liveMode, setLiveMode, visibleEdges } = useKnowledgeGraph()
  const { entities, selectedEntity, selectedEntityId, setSelectedEntityId } = useBusinessEntities()
  const { relationships } = useRelationships()
  const { filters, updateFilters, clearFilters } = useGraphFilters()
  const { updateSearch } = useGraphSearch()
  const { inspector } = useEntityInspector()
  const { timeline } = useKnowledgeTimeline()

  const headerMeta = useMemo(
    () => [`${entities.length} visible entities`, `${visibleEdges.length} visible relationships`, `${search.matchedNodeIds.length} matched nodes`],
    [entities.length, search.matchedNodeIds.length, visibleEdges.length]
  )

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_rgba(28,130,242,0.10)]"
        aria-label="Knowledge graph header"
      >
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(28,130,242,0.16),_transparent_38%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#eef6ff_100%)] p-6 md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-primary">Knowledge Graph</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy md:text-[2.2rem]">AIOS Business Knowledge Graph</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                Interactive semantic context across companies, people, workflows, memory, knowledge, decisions, policies, and operational events so AIOS understands how the business is connected.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">Runtime + Replay linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Memory + Supabase linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Planning + Decisions + Governance linked</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:max-w-[500px]">
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Visible entities</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{entities.length}</p>
                <p className="mt-1 text-xs text-text-secondary">Semantic graph nodes in the active view.</p>
              </article>
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Relationship paths</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{visibleEdges.length}</p>
                <p className="mt-1 text-xs text-text-secondary">Direct, indirect, workflow, decision, and knowledge dependencies.</p>
              </article>
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Graph mode</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <StatusIndicator tone={liveMode ? "success" : "neutral"} label={liveMode ? "Live topology" : "Paused"} />
                  <button type="button" onClick={() => setLiveMode(!liveMode)} className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-muted">{liveMode ? "Pause" : "Resume"}</button>
                </div>
              </article>
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Selected entity</p>
                <p className="mt-2 text-sm font-semibold text-brand-navy">{selectedEntity?.label ?? "No entity selected"}</p>
                <p className="mt-1 text-xs text-text-secondary">{selectedEntity?.summary ?? "Select a graph node to inspect context."}</p>
              </article>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Knowledge graph overview">
        <div className="flex flex-wrap items-start gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Semantic Brain Layer</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-navy">Connected business context, not isolated records</h2>
            <p className="mt-1 text-sm text-text-secondary">The graph supports path highlighting, dependency inspection, semantic retrieval, entity expansion, and future Neo4j-compatible enterprise ontologies.</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span className="rounded border border-border px-1.5 py-0.5"><Activity className="mr-1 inline h-3 w-3" />Context live</span>
            <span className="rounded border border-border px-1.5 py-0.5"><Search className="mr-1 inline h-3 w-3" />Searchable</span>
            <span className="rounded border border-border px-1.5 py-0.5"><GitBranch className="mr-1 inline h-3 w-3" />Dependency aware</span>
            <span className="rounded border border-border px-1.5 py-0.5"><Database className="mr-1 inline h-3 w-3" />Memory linked</span>
            <span className="rounded border border-border px-1.5 py-0.5"><Network className="mr-1 inline h-3 w-3" />Graph native</span>
            <span className="rounded border border-border px-1.5 py-0.5"><BrainCircuit className="mr-1 inline h-3 w-3" />Semantic reasoning ready</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-text-muted">
          {headerMeta.map((item) => <span key={item} className="rounded border border-border px-1.5 py-0.5">{item}</span>)}
        </div>
      </section>

      <KnowledgeGraphToolbar
        query={search.query}
        onQueryChange={updateSearch}
        liveMode={liveMode}
        onToggleLiveMode={() => setLiveMode(!liveMode)}
        selectedLabel={selectedEntity?.label ?? "Select an entity"}
      />

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside className="space-y-4" aria-label="Knowledge graph filters and summaries">
          <KnowledgeGraphFiltersPanel filters={filters} onUpdateFilters={updateFilters} onClearFilters={clearFilters} />
          <KnowledgeSearchSummary search={search} />
          <RelationshipExplorerPanel relationships={relationships} />
        </aside>

        <main className="space-y-4" aria-label="Knowledge graph main canvas">
          <BusinessKnowledgeGraphCanvas
            nodes={entities}
            edges={visibleEdges}
            selectedNodeId={selectedEntityId}
            matchedNodeIds={search.matchedNodeIds}
            onSelectNode={setSelectedEntityId}
          />
          <KnowledgeTimelinePanel timeline={timeline} />
        </main>

        <aside className="space-y-4" aria-label="Knowledge graph inspector">
          <EntityInspectorPanel entity={selectedEntity} inspector={inspector} timeline={timeline} />
        </aside>
      </div>
    </div>
  )
}