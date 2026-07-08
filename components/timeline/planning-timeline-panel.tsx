"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { PlanningTimelineEvent } from "@/types"

type PlanningTimelinePanelProps = {
  timeline: PlanningTimelineEvent[]
}

export function PlanningTimelinePanel({ timeline }: PlanningTimelinePanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Planning timeline">
      <p className="text-sm font-semibold text-brand-navy">Planning Timeline</p>
      <div className="mt-2 space-y-2">
        {timeline.map((event, index) => (
          <motion.article
            key={event.id}
            className="rounded-xl border border-border bg-surface-muted p-3"
            initial={reduceMotion ? false : { opacity: 0.8, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{event.label}</p>
              <span className="text-[11px] capitalize text-text-muted">{event.type.replace(/-/g, " ")}</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{event.description}</p>
            <p className="mt-1 text-[11px] text-text-muted">{new Date(event.timestamp).toLocaleTimeString()}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
