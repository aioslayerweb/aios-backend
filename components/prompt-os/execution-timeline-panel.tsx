"use client"

import { motion } from "framer-motion"
import type { PromptTimelineItem } from "@/types"

type ExecutionTimelinePanelProps = {
  timeline: PromptTimelineItem[]
}

export function ExecutionTimelinePanel({ timeline }: ExecutionTimelinePanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Execution timeline">
      <p className="text-sm font-semibold text-brand-navy">Execution Timeline</p>
      <ol className="mt-2 space-y-1.5">
        {timeline.map((item) => (
          <motion.li
            key={item.id}
            layout
            className={item.status === "current" ? "rounded-lg border border-brand-primary bg-brand-subtle px-2 py-1.5" : item.status === "completed" ? "rounded-lg border border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-soft)] px-2 py-1.5" : "rounded-lg border border-border bg-surface-muted px-2 py-1.5"}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-text-primary">{item.stage}</p>
              <p className="text-[11px] capitalize text-text-muted">{item.status}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
