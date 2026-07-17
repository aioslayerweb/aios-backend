type GraphNode = {
  id: string
  label: string
  group: "organization" | "operations" | "finance" | "systems" | "users"
}

type GraphEdge = {
  from: string
  to: string
}

type RelationshipGraphProps = {
  nodes: ReadonlyArray<GraphNode>
  edges: ReadonlyArray<GraphEdge>
}

function colorByGroup(group: GraphNode["group"]): string {
  if (group === "organization") return "#1c82f2"
  if (group === "operations") return "#10b981"
  if (group === "finance") return "#f59e0b"
  if (group === "systems") return "#8b5cf6"
  return "#0f172a"
}

export function RelationshipGraph({ nodes, edges }: RelationshipGraphProps) {
  const placed = nodes.map((node, index) => {
    const cols = 3
    const col = index % cols
    const row = Math.floor(index / cols)
    return {
      ...node,
      x: 110 + col * 180,
      y: 80 + row * 120,
    }
  })

  const byId = new Map(placed.map((node) => [node.id, node]))

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Relationship Graph</p>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox="0 0 760 420" className="h-[280px] min-w-[620px] w-full" role="img" aria-label="Blueprint relationship graph">
          {edges.map((edge) => {
            const from = byId.get(edge.from)
            const to = byId.get(edge.to)
            if (!from || !to) {
              return null
            }

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
            )
          })}

          {placed.map((node) => (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r="28" fill={colorByGroup(node.group)} fillOpacity="0.14" stroke={colorByGroup(node.group)} strokeWidth="1.5" />
              <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-slate-800 text-[10px] font-semibold">
                {node.label.slice(0, 12)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

export type { GraphEdge, GraphNode }
