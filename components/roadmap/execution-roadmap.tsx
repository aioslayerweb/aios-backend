"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { PlanningRoadmapStage } from "@/types"

type ExecutionRoadmapProps = {
  roadmap: PlanningRoadmapStage[]
}

export function ExecutionRoadmap({ roadmap }: ExecutionRoadmapProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Execution roadmap">
      <p className="text-sm font-semibold text-brand-navy">Execution Roadmap</p>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-6">
        {roadmap.map((stage, index) => (
          <motion.article
            key={stage.id}
            className={stage.status === "executing" ? "rounded-xl border border-blue-400 bg-blue-50 p-3" : stage.status === "completed" ? "rounded-xl border border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-soft)] p-3" : "rounded-xl border border-border bg-surface-muted p-3"}
            initial={reduceMotion ? false : { opacity: 0.8, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <p className="text-xs font-semibold text-text-primary">{stage.label}</p>
            <p className="mt-1 text-[11px] capitalize text-text-muted">{stage.status}</p>
            <p className="mt-2 text-[11px] text-text-secondary">{stage.relatedPlans.join(", ")}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
