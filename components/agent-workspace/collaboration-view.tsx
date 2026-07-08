"use client"

import { motion } from "framer-motion"
import type { AgentCollaborationHop } from "@/types"

type CollaborationViewProps = {
  collaboration: AgentCollaborationHop[]
}

export function CollaborationView({ collaboration }: CollaborationViewProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Collaboration view">
      <p className="text-sm font-semibold text-brand-navy">Collaboration View</p>
      <div className="mt-2 space-y-2">
        {collaboration.map((item) => (
          <motion.div key={item.id} layout className="rounded-lg border border-border bg-surface-muted p-2">
            <p className="text-xs font-semibold text-text-primary">
              {item.from} {"->"} {item.to}
            </p>
            <p className="mt-1 text-[11px] text-text-secondary">{item.action}</p>
            <p className="mt-1 text-[11px] capitalize text-text-muted">{item.status}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
