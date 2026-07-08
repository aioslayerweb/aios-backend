"use client"

import { motion } from "framer-motion"
import type { OrchestratorExecutionItem } from "@/types"

type TaskCardsPanelProps = {
  executions: OrchestratorExecutionItem[]
}

export function TaskCardsPanel({ executions }: TaskCardsPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Task queue">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Task Queue</p>
        <span className="text-[11px] text-text-muted">Prioritized execution queue</span>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {executions.slice(0, 8).map((task, index) => (
          <motion.article
            key={task.id}
            layout
            className="rounded-xl border border-border bg-surface-muted p-3"
            initial={{ opacity: 0.9, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{task.title}</p>
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">{task.priority}</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">Owner: {task.ownerAgentId}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-brand-primary" style={{ width: `${task.runtimeProgress}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-text-muted">
              <span className="rounded border border-border px-1.5 py-0.5">{task.status}</span>
              <span className="rounded border border-border px-1.5 py-0.5">ETA {task.estimatedMinutes}m</span>
              <span className="rounded border border-border px-1.5 py-0.5">Retries {task.retryCount}</span>
            </div>
            <p className="mt-1 text-[11px] text-text-muted">Dependencies: {task.dependencies.join(", ")}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
