"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BadgeInfo, Layers3, Sparkles } from "lucide-react"
import type { RoleProfile } from "@/types"

type RoleIntelligenceHeroProps = {
  effectiveRole: RoleProfile
  currentRole: RoleProfile
  simulationEnabled: boolean
  previewRole: RoleProfile | null
  summaryPoints: string[]
}

export function RoleIntelligenceHero({ effectiveRole, currentRole, simulationEnabled, previewRole, summaryPoints }: RoleIntelligenceHeroProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-br from-white via-sky-50 to-blue-50 px-6 py-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_35%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] lg:items-start">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              Role intelligence layer
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-950 px-3 py-1 text-white shadow-sm">
              <BadgeInfo className="h-3.5 w-3.5" />
              {simulationEnabled ? "Simulation mode" : "Live role lens"}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{effectiveRole.label} intelligence</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{effectiveRole.homeSummary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {summaryPoints.slice(0, 4).map((point) => (
              <div key={point} className="rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm backdrop-blur">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Lens status</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{effectiveRole.label}</p>
            </div>
            <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
              <Layers3 className="mr-1 inline-block h-3.5 w-3.5" />
              {currentRole.label}
              {previewRole && previewRole.id !== currentRole.id ? ` → ${previewRole.label}` : ""}
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Department:</span> {effectiveRole.department}</p>
            <p><span className="font-semibold text-slate-900">Decision authority:</span> {effectiveRole.decisionAuthority}</p>
            <p><span className="font-semibold text-slate-900">Reporting structure:</span> {effectiveRole.reportingStructure}</p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-xs leading-5 text-slate-200">
            <p className="font-semibold uppercase tracking-[0.18em] text-cyan-300">Primary priorities</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {effectiveRole.currentPriorities.slice(0, 3).map((priority) => (
                <span key={priority} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white">
                  {priority}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}