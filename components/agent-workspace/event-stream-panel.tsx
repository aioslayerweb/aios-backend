"use client"

import { motion } from "framer-motion"
import type { AgentEventRecord } from "@/types"
import { formatRuntimeElapsed } from "@/utils/runtime-status"

type EventStreamPanelProps = {
  events: AgentEventRecord[]
}

export function EventStreamPanel({ events }: EventStreamPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Event stream">
      <p className="text-sm font-semibold text-brand-navy">Event Stream</p>
      <div className="mt-2 space-y-1.5">
        {events.slice(0, 10).map((event) => (
          <motion.article
            key={event.id}
            layout
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-border bg-surface-muted p-2"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{event.title}</p>
              <p className="text-[11px] text-text-muted">{formatRuntimeElapsed(event.timestamp)}</p>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{event.summary}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
