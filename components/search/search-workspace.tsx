"use client"

import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { Search, Sparkles } from "lucide-react"
import { useGlobalSearch, useKnowledge, useMemorySearch } from "@/hooks"
import { SearchFilterPanel } from "@/components/search-filters/search-filter-panel"
import { SearchResultsList } from "@/components/search-results/search-results-list"
import { KnowledgeExplorerSection } from "@/components/knowledge/knowledge-explorer-section"
import { MemoryExplorerSection } from "@/components/memory-explorer/memory-explorer-section"
import { RecentSearches } from "./recent-searches"

const SearchInspectorPanel = dynamic(
  () => import("@/components/search-inspector/search-inspector-panel").then((mod) => mod.SearchInspectorPanel),
  {
    ssr: false,
    loading: () => (
      <aside className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs text-text-muted">Loading inspector...</p>
      </aside>
    ),
  }
)

export function SearchWorkspace() {
  const {
    query,
    setQuery,
    aiMode,
    setAiMode,
    loading,
    filteredResults,
    selectedResultId,
    setSelectedResultId,
    suggestedSearches,
    recentSearches,
    commitSearch,
  } = useGlobalSearch()

  const { collections } = useKnowledge()
  const { memories } = useMemorySearch()

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Global search header">
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Unified Intelligence Layer</p>
            <h1 className="text-xl font-semibold text-brand-navy">Global Search & Knowledge Explorer</h1>
            <p className="text-sm text-text-secondary">Discover memory, knowledge, customers, agents, tasks, events, reports, commands, and more from one interface.</p>
          </div>
          <button
            type="button"
            className={aiMode ? "ml-auto inline-flex items-center gap-1 rounded-md border border-brand-primary bg-brand-subtle px-3 py-1.5 text-xs text-brand-navy" : "ml-auto inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary"}
            onClick={() => setAiMode(!aiMode)}
            aria-pressed={aiMode}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Search {aiMode ? "On" : "Off"}
          </button>
        </div>

        <label className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.blur()
              }
              if (event.key === "Enter") {
                commitSearch(query)
              }
            }}
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            placeholder="Search memory, customers, agents, tasks or ask AIOS..."
            aria-label="Global search input"
          />
        </label>

        <RecentSearches searches={recentSearches.map((item) => item.query)} onSelect={setQuery} />

        <div className="mt-2 flex flex-wrap gap-1">
          {suggestedSearches.map((value) => (
            <button
              key={value}
              type="button"
              className="rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[11px] text-text-secondary"
              onClick={() => {
                setQuery(value)
                commitSearch(value)
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <SearchFilterPanel />

        <main className="space-y-3" aria-label="Search results and explorers">
          <AnimatePresence>
            {loading ? (
              <motion.div
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-border bg-white p-4 text-sm text-text-secondary"
              >
                Searching unified intelligence index...
              </motion.div>
            ) : null}
          </AnimatePresence>

          <SearchResultsList
            results={filteredResults}
            selectedResultId={selectedResultId}
            onSelect={(id) => setSelectedResultId(id)}
            query={query}
          />

          <KnowledgeExplorerSection collections={collections} />
          <MemoryExplorerSection memories={memories} />
        </main>

        <SearchInspectorPanel />
      </div>
    </div>
  )
}
