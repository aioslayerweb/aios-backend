"use client"

import type { PromptMemoryUpdate } from "@/types"

type MemoryStoragePanelProps = {
  memoryUpdates: PromptMemoryUpdate[]
}

export function MemoryStoragePanel({ memoryUpdates }: MemoryStoragePanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Memory storage">
      <p className="text-sm font-semibold text-brand-navy">Stored Memory</p>
      <div className="mt-2 space-y-1.5">
        {memoryUpdates.length === 0 ? (
          <p className="text-xs text-text-secondary">No memory updates yet. Executions will store updated context and references.</p>
        ) : (
          memoryUpdates.map((item) => (
            <article key={item.id} className="rounded-lg border border-border bg-surface-muted p-2">
              <p className="text-xs font-semibold text-text-primary">{item.title}</p>
              <p className="mt-1 text-[11px] text-text-secondary">{item.summary}</p>
              <p className="mt-1 text-[11px] text-text-muted">{new Date(item.timestamp).toLocaleString()}</p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
