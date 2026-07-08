"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { PlanningDependency } from "@/types"

type DependenciesGraphProps = {
  dependencies: PlanningDependency[]
}

export function DependenciesGraph({ dependencies }: DependenciesGraphProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Dependencies graph">
      <p className="text-sm font-semibold text-brand-navy">Dependencies</p>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {dependencies.map((dependency, index) => (
          <motion.article
            key={dependency.id}
            className="rounded-xl border border-border bg-surface-muted p-3"
            initial={reduceMotion ? false : { opacity: 0.85, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary">{dependency.label}</p>
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] capitalize text-text-muted">{dependency.status}</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{dependency.type}</p>
            <p className="mt-1 text-[11px] text-text-muted">{dependency.source} → {dependency.target}</p>
          </motion.article>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-text-muted">Animated dependency lines are architecture-ready for future graph rendering and runtime flow playback.</p>
    </section>
  )
}
