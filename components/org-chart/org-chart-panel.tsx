"use client"

import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Minus, ZoomIn, ZoomOut } from "lucide-react"
import { useOrganizationChart, useDepartments } from "@/hooks"

export function OrgChartPanel() {
  const reduceMotion = useReducedMotion()
  const { chartNodes, chartEdges } = useOrganizationChart()
  const { selectedDepartment, setSelectedDepartmentId } = useDepartments()
  const [zoom, setZoom] = useState(1)

  const visibleNodes = useMemo(() => chartNodes.slice(0, 10), [chartNodes])

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-border bg-white p-5 shadow-sm"
      aria-label="Organization chart"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Org chart</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">Interactive hierarchy</h2>
          <p className="mt-1 text-sm text-slate-600">{selectedDepartment?.label ?? "Select a department to inspect structure"}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">
          <button type="button" onClick={() => setZoom((value) => Math.max(0.8, value - 0.1))} className="rounded-full p-1 hover:bg-white" aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></button>
          <span className="min-w-12 text-center text-xs font-semibold">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom((value) => Math.min(1.4, value + 0.1))} className="rounded-full p-1 hover:bg-white" aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></button>
          <button type="button" onClick={() => setZoom(1)} className="rounded-full p-1 hover:bg-white" aria-label="Reset zoom"><Minus className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-4" style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
        <div className="space-y-3">
          {visibleNodes.map((node, index) => (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedDepartmentId(node.id)}
              className={`block w-full rounded-2xl border px-4 py-3 text-left transition ${selectedDepartment?.id === node.id ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{index === 0 ? "CEO" : node.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{node.type} · {node.department}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">{node.importance}% importance</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                {chartEdges.filter((edge) => edge.from === node.id || edge.to === node.id).slice(0, 3).map((edge) => (
                  <span key={edge.id} className="rounded-full bg-slate-100 px-2 py-1">{edge.label}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  )
}