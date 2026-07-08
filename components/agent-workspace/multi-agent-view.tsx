"use client"

import { motion } from "framer-motion"
import type { AgentCardItem } from "@/types"

type MultiAgentViewProps = {
  agents: AgentCardItem[]
}

export function MultiAgentView({ agents }: MultiAgentViewProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Multi agent split view">
      <p className="text-sm font-semibold text-brand-navy">Multi Agent View</p>
      <div className="mt-2 grid gap-2 md:grid-cols-3">
        {agents.map((agent) => (
          <motion.article key={agent.id} layout className="rounded-lg border border-border bg-surface-muted p-2">
            <p className="text-xs font-semibold text-text-primary">{agent.name}</p>
            <p className="mt-1 text-[11px] text-text-secondary">{agent.currentTask}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-brand-primary" style={{ width: `${agent.confidence}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-text-muted">Confidence {agent.confidence}%</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
