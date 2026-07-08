"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { PlanningDecisionNode } from "@/types"

type DecisionTreePanelProps = {
  decisionTree: PlanningDecisionNode[]
  selectedDecisionId: string
  onSelectDecision: (id: string) => void
}

export function DecisionTreePanel({ decisionTree, selectedDecisionId, onSelectDecision }: DecisionTreePanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Decision tree">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Decision Tree</p>
        <span className="text-[11px] text-text-muted">AI reasoning branches</span>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {decisionTree.map((node, index) => {
          const active = node.id === selectedDecisionId
          return (
            <motion.button
              key={node.id}
              type="button"
              onClick={() => onSelectDecision(node.id)}
              className={active ? "rounded-xl border border-brand-primary bg-brand-subtle p-3 text-left" : "rounded-xl border border-border bg-surface-muted p-3 text-left hover:border-brand-primary"}
              initial={reduceMotion ? false : { opacity: 0.85, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              aria-pressed={active}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary">{node.title}</p>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] capitalize text-text-muted">{node.branchType}</span>
              </div>
              <p className="mt-2 text-[11px] text-text-secondary">{node.summary}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted">
                <span>Success probability</span>
                <span>{node.probability}%</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
