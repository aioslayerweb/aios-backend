"use client"

import { useMemo, useState } from "react"
import { NodeIcon } from "./node-icon"
import type { WorkflowNodeType } from "@/types"

const NODE_CATALOG: WorkflowNodeType[] = [
  "start",
  "end",
  "ai-prompt",
  "decision",
  "condition",
  "memory-read",
  "memory-write",
  "knowledge-search",
  "customer-lookup",
  "crm-update",
  "email",
  "slack",
  "calendar",
  "approval",
  "delay",
  "loop",
  "parallel-branch",
  "merge",
  "webhook",
  "api-call",
  "custom-action",
]

type WorkflowNodeLibraryProps = {
  onAddNode: (type: WorkflowNodeType) => void
}

const ROW_HEIGHT = 44
const VIEWPORT_HEIGHT = 220

export function WorkflowNodeLibrary({ onAddNode }: WorkflowNodeLibraryProps) {
  const [query, setQuery] = useState("")
  const [scrollTop, setScrollTop] = useState(0)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return NODE_CATALOG
    }

    return NODE_CATALOG.filter((item) => item.includes(normalized))
  }, [query])

  const totalHeight = filtered.length * ROW_HEIGHT
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2)
  const end = Math.min(filtered.length, Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + 2)
  const visible = filtered.slice(start, end)

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Workflow node library">
      <p className="text-sm font-semibold text-brand-navy">Node Library</p>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mt-2 w-full rounded border border-border bg-surface-canvas px-2 py-1 text-xs"
        placeholder="Search node types"
        aria-label="Search workflow nodes"
      />

      <div
        className="mt-2 overflow-y-auto rounded border border-border bg-surface-canvas"
        style={{ height: VIEWPORT_HEIGHT }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {visible.map((type, idx) => {
            const index = start + idx
            return (
              <button
                key={type}
                type="button"
                onClick={() => onAddNode(type)}
                className="absolute left-0 right-0 flex h-11 items-center gap-2 border-b border-border px-2 text-left text-xs text-text-primary hover:bg-surface-muted"
                style={{ top: index * ROW_HEIGHT }}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-white text-brand-navy">
                  <NodeIcon type={type} />
                </span>
                <span className="capitalize">{type.replace(/-/g, " ")}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
