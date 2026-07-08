"use client"

import { useMemo } from "react"
import { useBookmarks } from "@/hooks"
import type { SearchResult } from "@/types"
import { SearchResultCard } from "./search-result-card"

type SearchResultsListProps = {
  results: SearchResult[]
  selectedResultId: string | null
  onSelect: (id: string) => void
  query: string
}

export function SearchResultsList({ results, selectedResultId, onSelect, query }: SearchResultsListProps) {
  const { bookmarks, toggleBookmark } = useBookmarks()

  const windowed = useMemo(() => {
    if (results.length <= 140) {
      return results
    }

    return results.slice(0, 140)
  }, [results])

  if (results.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-border bg-white p-6 text-center" aria-label="Empty search results">
        <p className="text-sm font-semibold text-text-primary">No matching intelligence found</p>
        <p className="mt-1 text-xs text-text-muted">Try changing filters, reducing confidence threshold, or using suggested AI search prompts.</p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Search results">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Results</p>
        <span className="text-xs text-text-muted">{results.length} items</span>
      </div>

      <div className="mt-2 space-y-2" role="listbox" aria-label="Search result list">
        {windowed.map((result) => {
          const bookmarked = bookmarks.some((entry) => entry.resultId === result.id)
          return (
            <SearchResultCard
              key={result.id}
              result={result}
              query={query}
              selected={selectedResultId === result.id}
              bookmarked={bookmarked}
              onSelect={() => onSelect(result.id)}
              onToggleBookmark={() => toggleBookmark(result.id, true)}
            />
          )
        })}
      </div>
    </section>
  )
}
