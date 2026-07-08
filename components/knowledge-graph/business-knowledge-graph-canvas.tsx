"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { KnowledgeGraphEdge, KnowledgeGraphNode } from "@/types"
import { entityTypeColor, graphPathForNodes } from "@/utils/knowledge-graph"

type BusinessKnowledgeGraphCanvasProps = {
  nodes: KnowledgeGraphNode[]
  edges: KnowledgeGraphEdge[]
  selectedNodeId: string
  matchedNodeIds: string[]
  onSelectNode: (id: string) => void
}

function center(node: KnowledgeGraphNode) {
  return { x: node.x, y: node.y }
}

export function BusinessKnowledgeGraphCanvas({ nodes, edges, selectedNodeId, matchedNodeIds, onSelectNode }: BusinessKnowledgeGraphCanvasProps) {
  const reduceMotion = useReducedMotion()
  const matched = new Set(matchedNodeIds)

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Business knowledge graph">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Graph Visualization</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Interactive business knowledge graph</h2>
        </div>
        <span className="text-xs text-text-muted">{nodes.length} entities · {edges.length} relationships</span>
      </div>

      <div className="relative mt-4 h-[560px] overflow-hidden rounded-[24px] border border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(28,130,242,0.10),_transparent_40%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]">
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          {edges.map((edge, index) => {
            const source = nodes.find((node) => node.id === edge.source)
            const target = nodes.find((node) => node.id === edge.target)
            if (!source || !target) {
              return null
            }

            const highlighted = selectedNodeId === edge.source || selectedNodeId === edge.target || (matched.size > 0 && (matched.has(edge.source) || matched.has(edge.target)))

            return (
              <motion.path
                key={edge.id}
                d={graphPathForNodes(center(source), center(target))}
                fill="none"
                stroke={highlighted ? "#1c82f2" : "#cbd5e1"}
                strokeWidth={highlighted ? 2.6 : 1.4}
                strokeDasharray={edge.animated ? "7 6" : undefined}
                initial={reduceMotion ? false : { opacity: 0.3, pathLength: 0.1 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : index * 0.02 }}
              />
            )
          })}
        </svg>

        {nodes.map((node, index) => {
          const active = selectedNodeId === node.id
          const highlighted = matched.size === 0 || matched.has(node.id)
          const color = entityTypeColor(node.type)
          return (
            <motion.button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(node.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white/95 text-left shadow-sm backdrop-blur ${active ? "ring-2 ring-brand-primary" : ""}`}
              style={{ left: node.x, top: node.y, width: node.radius * 2.8, minHeight: node.radius * 2.3, borderColor: color, opacity: highlighted ? 1 : 0.35 }}
              initial={reduceMotion ? false : { opacity: 0.8, scale: 0.96 }}
              animate={{ opacity: highlighted ? 1 : 0.35, scale: active ? 1.04 : 1 }}
              transition={{ duration: 0.2, delay: reduceMotion ? 0 : index * 0.01 }}
              aria-label={`Select ${node.label}`}
            >
              <span className="block px-3 py-2 text-center">
                <span className="block text-[11px] font-semibold leading-tight text-text-primary">{node.label}</span>
                <span className="mt-1 block text-[10px] capitalize text-text-muted">{node.type.replace(/-/g, " ")}</span>
              </span>
            </motion.button>
          )
        })}
      </div>
      <p className="mt-2 text-[11px] text-text-muted">Force-directed rendering, path highlighting, branch expansion, and Neo4j-compatible semantic models are architecture-ready in this graph layer.</p>
    </section>
  )
}