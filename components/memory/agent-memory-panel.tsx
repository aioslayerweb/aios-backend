"use client"

import { useState } from "react"
import type { MemoryRecord } from "@/types"
import { formatRuntimeElapsed } from "@/utils/runtime-status"

type AgentMemoryPanelProps = {
  memories: MemoryRecord[]
}

export function AgentMemoryPanel({ memories }: AgentMemoryPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Memory panel">
      <p className="text-sm font-semibold text-brand-navy">Memory Panel</p>
      <div className="mt-2 space-y-2">
        {memories.map((item) => {
          const isOpen = expanded === item.id
          return (
            <button
              key={item.id}
              type="button"
              className="w-full rounded-lg border border-border bg-surface-muted p-2 text-left"
              onClick={() => setExpanded(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary">{item.title}</p>
                <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.lane}</p>
              </div>
              <p className="mt-1 text-[11px] text-text-secondary">{item.summary}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-text-muted">
                <span>Confidence {item.confidence}%</span>
                <span>Source {item.source}</span>
                <span>{formatRuntimeElapsed(item.updatedAt)}</span>
              </div>
              {isOpen ? (
                <p className="mt-2 text-[11px] text-text-secondary">
                  Expanded memory context is available for review and replay in future event-store integrations.
                </p>
              ) : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
