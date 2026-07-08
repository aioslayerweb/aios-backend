"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useExecutiveWorkspace } from "@/hooks"

export function WorkspaceHero() {
  const { summary, loading } = useExecutiveWorkspace()

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="rounded-2xl border border-border bg-white p-6 shadow-sm"
      aria-label="Executive workspace hero"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Executive Workspace</p>
          <h2 className="mt-2 text-3xl font-semibold text-brand-navy">{summary.greeting}, leadership team.</h2>
          <p className="mt-2 text-sm text-text-secondary">
            {summary.organizationName} • {summary.workspaceName}
          </p>
          <p className="mt-1 text-xs text-text-muted">{summary.dateLabel}</p>
        </div>

        <div className="rounded-xl border border-brand-primary/20 bg-brand-subtle px-4 py-3 text-brand-navy">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            AI Runtime
          </p>
          <p className="mt-1 text-sm font-semibold">{summary.aiStatus}</p>
          <p className="mt-1 text-xs text-text-secondary">
            {loading ? "Refreshing executive state..." : `${summary.todayPriorities} priorities require attention today.`}
          </p>
        </div>
      </div>
    </motion.section>
  )
}
