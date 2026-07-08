"use client"

import type { MemoryExplorerEntry } from "@/types"

type MemoryExplorerSectionProps = {
  memories: MemoryExplorerEntry[]
}

export function MemoryExplorerSection({ memories }: MemoryExplorerSectionProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Memory explorer">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Memory Explorer</p>
        <span className="text-xs text-text-muted">{memories.length} entries</span>
      </div>
      <div className="mt-2 space-y-2">
        {memories.map((memory) => (
          <article key={memory.id} className="rounded-lg border border-border bg-surface-muted p-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{memory.title}</p>
              <span className="rounded border border-border px-1.5 py-0.5 text-[11px] capitalize text-text-muted">{memory.lane}</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{memory.summary}</p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-text-muted">
              {memory.pinned ? <span className="rounded border border-brand-primary bg-brand-subtle px-1.5 py-0.5 text-brand-navy">Pinned</span> : null}
              <span>{new Date(memory.updatedAt).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-text-muted">Timeline view is represented here and ready for future replay and memory lineage engines.</p>
    </section>
  )
}
