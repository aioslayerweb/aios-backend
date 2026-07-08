"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { DecisionRecord } from "@/types"
import { formatRuntimeElapsed } from "@/utils/runtime-status"

type DecisionLogPanelProps = {
  decisions: DecisionRecord[]
}

export function DecisionLogPanel({ decisions }: DecisionLogPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Decision log">
      <p className="text-sm font-semibold text-brand-navy">Decision Log</p>
      <div className="mt-2 space-y-2">
        {decisions.slice(0, 8).map((item) => {
          const expanded = expandedId === item.id
          return (
            <motion.button
              key={item.id}
              type="button"
              layout
              onClick={() => setExpandedId(expanded ? null : item.id)}
              className="w-full rounded-lg border border-border bg-surface-muted p-2 text-left"
              aria-expanded={expanded}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary">{item.title}</p>
                <span className="text-[11px] text-text-muted">{item.confidence}%</span>
              </div>
              <p className="mt-1 text-[11px] text-text-secondary">{item.reason}</p>
              <p className="mt-1 text-[11px] text-text-muted">{formatRuntimeElapsed(item.timestamp)}</p>
              {expanded ? <p className="mt-2 text-[11px] text-text-secondary">{item.explanation}</p> : null}
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
