"use client"

import type { OrchestratorMemorySync } from "@/types"

type MemorySyncPanelProps = {
  memorySync: OrchestratorMemorySync[]
}

export function MemorySyncPanel({ memorySync }: MemorySyncPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Memory synchronization">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Memory Synchronization</p>
        <span className="text-[11px] text-text-muted">Shared memory updates</span>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {memorySync.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-surface-muted p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{item.label}</p>
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] capitalize text-text-muted">{item.status}</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{item.detail}</p>
            <p className="mt-1 text-[11px] text-text-muted">{new Date(item.timestamp).toLocaleTimeString()}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
