"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReasoningStage } from "@/types"
import { formatRuntimeElapsed } from "@/utils/runtime-status"

type ReasoningTimelineProps = {
  timeline: ReasoningStage[]
}

function stageClass(status: ReasoningStage["status"]): string {
  if (status === "current") {
    return "border-brand-primary bg-brand-subtle"
  }

  if (status === "completed") {
    return "border-emerald-300 bg-emerald-50"
  }

  return "border-border bg-white"
}

export function ReasoningTimeline({ timeline }: ReasoningTimelineProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Reasoning timeline">
      <p className="text-sm font-semibold text-brand-navy">Reasoning Timeline</p>
      <ol className="mt-3 space-y-2">
        {timeline.map((stage) => (
          <motion.li
            key={stage.id}
            layout
            initial={reducedMotion ? false : { opacity: 0.8, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border p-2 ${stageClass(stage.status)}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{stage.label}</p>
              <span className="text-[11px] capitalize text-text-muted">{stage.status}</span>
            </div>
            {stage.status !== "pending" ? (
              <p className="mt-1 text-[11px] text-text-muted">{formatRuntimeElapsed(stage.timestamp)}</p>
            ) : null}
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
