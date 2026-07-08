"use client"

import { motion } from "framer-motion"
import { useExecutiveBriefing } from "@/hooks"

export function ExecutiveBriefing() {
  const { briefing } = useExecutiveBriefing()

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="rounded-2xl border border-border bg-white p-5 shadow-sm"
      aria-label="AI daily briefing"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">AI Daily Briefing</p>
      <h3 className="mt-2 text-2xl font-semibold text-brand-navy">{briefing.headline}</h3>
      <p className="mt-2 text-sm text-text-secondary">{briefing.overview}</p>

      <ul className="mt-4 space-y-2">
        {briefing.highlights.map((highlight) => (
          <li key={highlight} className="rounded-lg bg-surface-muted px-3 py-2 text-sm text-text-secondary">
            {highlight}
          </li>
        ))}
      </ul>
    </motion.section>
  )
}
