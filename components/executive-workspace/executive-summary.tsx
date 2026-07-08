"use client"

import { motion } from "framer-motion"
import { useExecutiveWorkspace } from "@/hooks"

export function ExecutiveSummary() {
  const { summary } = useExecutiveWorkspace()

  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Executive summary">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-navy">Executive Summary</p>
        <span className="rounded-full bg-brand-subtle px-2 py-1 text-xs font-medium text-brand-navy">
          {summary.todayPriorities} priorities
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.metrics.map((metric) => (
          <motion.article
            key={metric.id}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18 }}
            className="rounded-lg border border-border p-3"
          >
            <p className="text-xs text-text-muted">{metric.label}</p>
            <p className="mt-1 text-xl font-semibold text-brand-navy">{metric.value}</p>
            <p className="mt-1 text-xs text-text-secondary">{metric.delta}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
