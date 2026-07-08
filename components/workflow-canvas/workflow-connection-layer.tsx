"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { WorkflowEdge, WorkflowNode } from "@/types"
import { edgePath } from "@/utils/workflow-builder"

type WorkflowConnectionLayerProps = {
  edges: WorkflowEdge[]
  nodes: WorkflowNode[]
  selectedEdgeId: string | null
  onSelectEdge: (id: string) => void
}

function center(node: WorkflowNode) {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  }
}

export function WorkflowConnectionLayer({ edges, nodes, selectedEdgeId, onSelectEdge }: WorkflowConnectionLayerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <marker id="workflow-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <path d="M0,0 L12,6 L0,12 z" fill="#94a3b8" />
        </marker>
      </defs>

      {edges.map((edge) => {
        const source = nodes.find((node) => node.id === edge.source)
        const target = nodes.find((node) => node.id === edge.target)
        if (!source || !target) {
          return null
        }

        const from = center(source)
        const to = center(target)
        const path = edgePath(from, to)
        const active = selectedEdgeId === edge.id

        return (
          <g key={edge.id} className="pointer-events-auto" onClick={() => onSelectEdge(edge.id)}>
            <motion.path
              d={path}
              fill="none"
              stroke={active ? "#2563eb" : "#94a3b8"}
              strokeWidth={active ? 2.5 : 1.8}
              strokeDasharray={edge.animated ? "7 6" : "0"}
              markerEnd="url(#workflow-arrow)"
              initial={reduceMotion ? false : { pathLength: 0.15, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.42 }}
            />
            {edge.label ? (
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 5}
                textAnchor="middle"
                className="fill-slate-600 text-[11px]"
              >
                {edge.label}
              </text>
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}
