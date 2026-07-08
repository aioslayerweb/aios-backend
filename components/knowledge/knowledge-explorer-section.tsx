"use client"

import type { KnowledgeCollection } from "@/types"

type KnowledgeExplorerSectionProps = {
  collections: KnowledgeCollection[]
}

export function KnowledgeExplorerSection({ collections }: KnowledgeExplorerSectionProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Knowledge explorer">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Knowledge Explorer</p>
        <span className="text-xs text-text-muted">{collections.length} collections</span>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {collections.map((item) => (
          <article key={item.id} className="rounded-lg border border-border bg-surface-muted p-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{item.name}</p>
              {item.pinned ? <span className="rounded border border-brand-primary bg-brand-subtle px-1.5 py-0.5 text-[11px] text-brand-navy">Pinned</span> : null}
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{item.documents} documents</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {item.topics.map((topic) => (
                <span key={topic} className="rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted">{topic}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-text-muted">Knowledge graph visualization placeholder is architecture-ready for future graph APIs.</p>
    </section>
  )
}
