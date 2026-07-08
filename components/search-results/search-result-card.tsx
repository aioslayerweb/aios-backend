"use client"

import { Copy, Link2, Pin, Share2, Telescope } from "lucide-react"
import { useNotifications } from "@/hooks"
import { searchHighlightParts } from "@/utils/global-search"
import type { SearchResult } from "@/types"

type SearchResultCardProps = {
  result: SearchResult
  query: string
  selected: boolean
  bookmarked: boolean
  onSelect: () => void
  onToggleBookmark: () => void
}

export function SearchResultCard({
  result,
  query,
  selected,
  bookmarked,
  onSelect,
  onToggleBookmark,
}: SearchResultCardProps) {
  const { push } = useNotifications()
  const titleParts = searchHighlightParts(result.title, query)
  const summaryParts = searchHighlightParts(result.summary, query)

  return (
    <article
      className={selected ? "rounded-xl border border-brand-primary bg-brand-subtle/40 p-3 shadow-sm" : "rounded-xl border border-border bg-white p-3 shadow-sm"}
      aria-selected={selected}
      role="option"
    >
      <button type="button" className="w-full text-left" onClick={onSelect}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-brand-navy">
            {titleParts.map((part, index) =>
              part.match ? (
                <mark key={`${result.id}-title-${index}`} className="rounded bg-brand-subtle px-0.5 text-brand-navy">
                  {part.text}
                </mark>
              ) : (
                <span key={`${result.id}-title-${index}`}>{part.text}</span>
              )
            )}
          </p>
          <span className="rounded border border-border px-1.5 py-0.5 text-[11px] capitalize text-text-secondary">{result.source.replace("-", " ")}</span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          {summaryParts.map((part, index) =>
            part.match ? (
              <mark key={`${result.id}-summary-${index}`} className="rounded bg-brand-subtle px-0.5 text-brand-navy">
                {part.text}
              </mark>
            ) : (
              <span key={`${result.id}-summary-${index}`}>{part.text}</span>
            )
          )}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-text-muted">
          <span className="rounded border border-border px-1.5 py-0.5">Conf {result.confidence}%</span>
          <span className="rounded border border-border px-1.5 py-0.5 capitalize">{result.priority}</span>
          <span className="rounded border border-border px-1.5 py-0.5">{new Date(result.timestamp).toLocaleString()}</span>
          <span className="rounded border border-border px-1.5 py-0.5 capitalize">{result.department}</span>
        </div>
      </button>

      <div className="mt-2 flex flex-wrap items-center gap-1">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-text-secondary"
          onClick={onSelect}
        >
          <Telescope className="h-3 w-3" /> Inspect
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-text-secondary"
          onClick={() => {
            navigator.clipboard.writeText(result.referenceId)
            push({ tone: "info", title: "Copied ID", description: result.referenceId })
          }}
        >
          <Copy className="h-3 w-3" /> Copy ID
        </button>
        <button
          type="button"
          className={bookmarked ? "inline-flex items-center gap-1 rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-[11px] text-brand-navy" : "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-text-secondary"}
          onClick={onToggleBookmark}
        >
          <Pin className="h-3 w-3" /> {bookmarked ? "Pinned" : "Pin"}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-text-secondary"
          onClick={() => push({ tone: "info", title: "Shared", description: result.title })}
        >
          <Share2 className="h-3 w-3" /> Share
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-text-secondary"
          onClick={() => push({ tone: "info", title: "Timeline opened", description: result.title })}
        >
          <Link2 className="h-3 w-3" /> View timeline
        </button>
      </div>
    </article>
  )
}
