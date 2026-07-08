"use client"

import { memo, useMemo, type MouseEvent } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { WorkflowNode } from "@/types"
import { NodeIcon } from "./node-icon"

type WorkflowNodeCardProps = {
  node: WorkflowNode
  active: boolean
  selectedForExecution: boolean
  onMouseDown: (nodeId: string, event: MouseEvent<HTMLElement>) => void
  onSelect: (nodeId: string) => void
}

function tone(status: WorkflowNode["status"]): string {
  if (status === "running") {
    return "border-blue-400 bg-blue-50"
  }
  if (status === "success") {
    return "border-emerald-300 bg-emerald-50"
  }
  if (status === "error") {
    return "border-rose-300 bg-rose-50"
  }
  if (status === "queued") {
    return "border-amber-300 bg-amber-50"
  }
  return "border-border bg-white"
}

function WorkflowNodeCardComponent({
  node,
  active,
  selectedForExecution,
  onMouseDown,
  onSelect,
}: WorkflowNodeCardProps) {
  const reduceMotion = useReducedMotion()

  const statusText = useMemo(() => node.status.toUpperCase(), [node.status])

  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0.8, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18 }}
      onMouseDown={(event) => onMouseDown(node.id, event)}
      onClick={() => onSelect(node.id)}
      className={`absolute cursor-grab rounded-xl border px-3 py-2 shadow-sm ${tone(node.status)} ${active ? "ring-2 ring-brand-primary" : ""} ${selectedForExecution ? "shadow-[0_0_0_2px_rgba(59,130,246,0.25)]" : ""}`}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: node.width,
        height: node.height,
      }}
      aria-label={`${node.data.title} node`}
      tabIndex={0}
    >
      <div className="flex items-center gap-2">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-surface-muted text-brand-navy">
          <NodeIcon type={node.type} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-text-primary">{node.data.title}</p>
          <p className="truncate text-[11px] text-text-muted">{node.type}</p>
        </div>
        <span className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">{statusText}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-[11px] text-text-secondary">{node.data.description}</p>
      <div className="mt-1 flex items-center gap-1 text-[10px] text-text-muted">
        <span className="rounded border border-border px-1 py-0.5">{node.data.assignedAgents.length} agents</span>
        <span className="rounded border border-border px-1 py-0.5">{node.data.errorStrategy}</span>
      </div>

      <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-border bg-white" />
      <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-border bg-white" />
    </motion.article>
  )
}

export const WorkflowNodeCard = memo(WorkflowNodeCardComponent)
