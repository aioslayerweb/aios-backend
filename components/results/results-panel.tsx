"use client"

import type { PromptResult } from "@/types"

type ResultsPanelProps = {
  result: PromptResult | null
}

function list(items: string[]) {
  return (
    <ul className="mt-1 space-y-1">
      {items.map((item) => (
        <li key={item} className="rounded border border-border bg-surface-muted px-2 py-1 text-[11px] text-text-secondary">
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  if (!result) {
    return (
      <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Results panel">
        <p className="text-sm font-semibold text-brand-navy">Results</p>
        <p className="mt-2 text-xs text-text-secondary">Results will appear after execution completes.</p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Results panel">
      <p className="text-sm font-semibold text-brand-navy">Results</p>
      <article className="mt-2 rounded-lg border border-border bg-surface-muted p-2">
        <p className="text-xs font-semibold text-text-primary">Executive Summary</p>
        <p className="mt-1 text-[11px] text-text-secondary">{result.executiveSummary}</p>
      </article>

      <div className="mt-2 grid gap-2 md:grid-cols-2">
        <article>
          <p className="text-xs font-semibold text-text-primary">Actions Taken</p>
          {list(result.actionsTaken)}
        </article>
        <article>
          <p className="text-xs font-semibold text-text-primary">Recommendations</p>
          {list(result.recommendations)}
        </article>
        <article>
          <p className="text-xs font-semibold text-text-primary">Risks</p>
          {list(result.risks)}
        </article>
        <article>
          <p className="text-xs font-semibold text-text-primary">Opportunities</p>
          {list(result.opportunities)}
        </article>
        <article>
          <p className="text-xs font-semibold text-text-primary">Linked Memory</p>
          {list(result.linkedMemory)}
        </article>
        <article>
          <p className="text-xs font-semibold text-text-primary">Related Knowledge</p>
          {list(result.relatedKnowledge)}
        </article>
      </div>

      <article className="mt-2">
        <p className="text-xs font-semibold text-text-primary">Future Actions</p>
        {list(result.futureActions)}
      </article>

      <div className="mt-2 flex flex-wrap gap-1">
        {["Export", "Share", "Copy", "Pin", "Bookmark", "Schedule", "Assign"].map((action) => (
          <button
            key={action}
            type="button"
            className="rounded border border-border px-2 py-1 text-[11px] text-text-secondary"
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  )
}
