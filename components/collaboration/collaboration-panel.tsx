"use client"

import { motion, useReducedMotion } from "framer-motion"
import { GitBranch, Network } from "lucide-react"
import { useCollaborationGraph } from "@/hooks"

export function CollaborationPanel() {
  const reduceMotion = useReducedMotion()
  const { collaborationEdges, chartNodes } = useCollaborationGraph()

  return (
    <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-3xl border border-border bg-white p-5 shadow-sm" aria-label="Collaboration graph">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"><Network className="h-3.5 w-3.5" />Collaboration graph</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-950">Department interactions and dependencies</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {collaborationEdges.slice(0, 6).map((edge) => (
          <article key={edge.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-start gap-3">
              <GitBranch className="mt-0.5 h-4 w-4 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-slate-950">{edge.label}</p>
                <p className="mt-1 text-xs text-slate-500">{chartNodes.find((node) => node.id === edge.from)?.name ?? edge.from} → {chartNodes.find((node) => node.id === edge.to)?.name ?? edge.to}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Connection strength {edge.weight}%</p>
          </article>
        ))}
      </div>
    </motion.section>
  )
}