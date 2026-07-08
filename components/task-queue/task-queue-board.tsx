"use client"

import { LayoutGroup, motion } from "framer-motion"
import type { AgentQueueTask, QueueTaskStatus } from "@/types"

const columns: QueueTaskStatus[] = ["queued", "running", "waiting", "retrying", "failed", "completed"]

type TaskQueueBoardProps = {
  tasks: AgentQueueTask[]
}

export function TaskQueueBoard({ tasks }: TaskQueueBoardProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Task queue">
      <p className="text-sm font-semibold text-brand-navy">Task Queue</p>
      <LayoutGroup>
        <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {columns.map((status) => {
            const items = tasks.filter((item) => item.status === status)
            return (
              <article key={status} className="rounded-lg border border-border bg-surface-muted p-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{status}</p>
                  <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted">{items.length}</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {items.slice(0, 5).map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                      className="rounded border border-border bg-white p-2"
                    >
                      <p className="text-xs font-medium text-text-primary">{task.title}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-text-muted">{task.priority}</p>
                    </motion.div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </LayoutGroup>
    </section>
  )
}
