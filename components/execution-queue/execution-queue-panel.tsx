"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { OrchestratorExecutionItem } from "@/types"

type ExecutionQueuePanelProps = {
  executions: OrchestratorExecutionItem[]
  selectedExecutionId: string
  onSelectExecution: (id: string) => void
}

function tone(status: OrchestratorExecutionItem["status"]): string {
  if (status === "running") {
    return "border-blue-400 bg-blue-50"
  }
  if (status === "failed") {
    return "border-rose-300 bg-rose-50"
  }
  if (status === "completed") {
    return "border-emerald-300 bg-emerald-50"
  }
  if (status === "review") {
    return "border-violet-300 bg-violet-50"
  }
  if (status === "waiting") {
    return "border-amber-300 bg-amber-50"
  }
  return "border-border bg-white"
}

export function ExecutionQueuePanel({ executions, selectedExecutionId, onSelectExecution }: ExecutionQueuePanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Execution queue">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Live Executions</p>
        <span className="text-[11px] text-text-muted">{executions.length} active</span>
      </div>
      <div className="mt-2 grid gap-2">
        {executions.map((execution, index) => (
          <motion.button
            key={execution.id}
            type="button"
            onClick={() => onSelectExecution(execution.id)}
            className={`rounded-xl border p-3 text-left shadow-sm ${tone(execution.status)} ${selectedExecutionId === execution.id ? "ring-2 ring-brand-primary" : ""}`}
            initial={reduceMotion ? false : { opacity: 0.85, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.015 }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{execution.title}</p>
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase text-text-muted">{execution.status}</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">Workflow: {execution.workflow}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-brand-primary" style={{ width: `${execution.runtimeProgress}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] text-text-muted">
              <span className="rounded border border-border px-1.5 py-0.5">Owner {execution.ownerAgentId}</span>
              <span className="rounded border border-border px-1.5 py-0.5">Priority {execution.priority}</span>
              <span className="rounded border border-border px-1.5 py-0.5">ETA {execution.estimatedMinutes}m</span>
              <span className="rounded border border-border px-1.5 py-0.5">Retries {execution.retryCount}</span>
            </div>
            <p className="mt-1 text-[11px] text-text-muted">Dependencies: {execution.dependencies.join(", ")}</p>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
