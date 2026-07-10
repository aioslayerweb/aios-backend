"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { OrchestratorAgentNode } from "@/types"
import { edgePath } from "@/utils/workflow-builder"

type AgentNetworkGraphProps = {
  agents: OrchestratorAgentNode[]
  selectedAgentId: string
  onSelectAgent: (id: string) => void
}

function nodeTone(status: OrchestratorAgentNode["status"]): string {
  if (status === "running" || status === "coordinating") {
    return "border-blue-400 bg-blue-50"
  }

  if (status === "failed") {
    return "border-[var(--color-semantic-error)] bg-[var(--color-semantic-error-soft)]"
  }

  if (status === "waiting") {
    return "border-[var(--color-semantic-warning)] bg-[var(--color-semantic-warning-soft)]"
  }

  if (status === "completed") {
    return "border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-soft)]"
  }

  return "border-border bg-white"
}

function center(agent: OrchestratorAgentNode) {
  return { x: agent.x + 82, y: agent.y + 38 }
}

export function AgentNetworkGraph({ agents, selectedAgentId, onSelectAgent }: AgentNetworkGraphProps) {
  const reduceMotion = useReducedMotion()
  const connections = agents.flatMap((agent, index) => {
    const next = agents[(index + 1) % agents.length]
    const cross = agents[(index + 2) % agents.length]
    return [
      { id: `${agent.id}-${next.id}`, from: agent, to: next },
      { id: `${agent.id}-${cross.id}`, from: agent, to: cross },
    ]
  })

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Agent network graph">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Agent Network</p>
        <span className="text-[11px] text-text-muted">{agents.length} agents</span>
      </div>
      <div className="relative mt-2 h-[420px] overflow-hidden rounded-xl border border-border bg-surface-canvas">
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          {connections.map((edge) => {
            const selected = selectedAgentId === edge.from.id || selectedAgentId === edge.to.id
            return (
              <motion.path
                key={edge.id}
                d={edgePath(center(edge.from), center(edge.to))}
                fill="none"
                stroke={selected ? "#2563eb" : "#cbd5e1"}
                strokeWidth={selected ? 2.5 : 1.5}
                strokeDasharray="7 6"
                initial={reduceMotion ? false : { pathLength: 0.12, opacity: 0.35 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.55 }}
              />
            )
          })}
        </svg>

        {agents.map((agent, index) => {
          const active = selectedAgentId === agent.id
          return (
            <motion.button
              key={agent.id}
              type="button"
              className={`absolute flex h-20 w-40 flex-col rounded-xl border px-3 py-2 text-left shadow-sm ${nodeTone(agent.status)} ${active ? "ring-2 ring-brand-primary" : ""}`}
              style={{ left: agent.x, top: agent.y }}
              onClick={() => onSelectAgent(agent.id)}
              initial={reduceMotion ? false : { opacity: 0.85, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              aria-label={`Select ${agent.name}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary">{agent.name}</p>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] capitalize text-text-muted">{agent.status}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] text-text-secondary">{agent.currentTask}</p>
              <div className="mt-auto flex items-center justify-between text-[10px] text-text-muted">
                <span>{agent.department}</span>
                <span>{agent.confidence}%</span>
              </div>
            </motion.button>
          )
        })}
      </div>
      <p className="mt-2 text-[11px] text-text-muted">Hover and select agents to inspect current task, runtime state, confidence, memory usage, and recent activity.</p>
    </section>
  )
}
