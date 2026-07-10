"use client"

import { motion } from "framer-motion"
import type { OrchestratorMetric } from "@/types"

type RuntimeThroughputGraphProps = {
  metrics: OrchestratorMetric[]
}

export function RuntimeThroughputGraph({ metrics }: RuntimeThroughputGraphProps) {
  const throughput = metrics.find((item) => item.id === "metric-throughput")?.value ?? 0
  const tasks = metrics.find((item) => item.id === "metric-completed")?.value ?? 0
  const success = metrics.find((item) => item.id === "metric-success")?.value ?? 0

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Performance metrics">
      <p className="text-sm font-semibold text-brand-navy">Performance Metrics</p>
      <div className="mt-2 grid gap-2 md:grid-cols-3">
        {[
          { label: "Tasks completed", value: tasks, accent: "bg-blue-500" },
          { label: "Success rate", value: `${success}%`, accent: "bg-semantic-success" },
          { label: "Runtime throughput", value: `${throughput}/m`, accent: "bg-violet-500" },
        ].map((item) => (
          <article key={item.label} className="rounded-xl border border-border bg-surface-muted p-3">
            <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{item.value}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <motion.div className={`h-full rounded-full ${item.accent}`} initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: 0.9 }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
