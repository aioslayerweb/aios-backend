"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Activity, AlertTriangle, Brain, Gauge, Layers3, Target } from "lucide-react"
import { useTeamHealth, useTeams } from "@/hooks"

const iconMap = [Gauge, Activity, Target, Brain, Layers3]

export function TeamHealthPanel() {
  const reduceMotion = useReducedMotion()
  const { teamHealth } = useTeamHealth()
  const { selectedTeam, setSelectedTeamId } = useTeams()

  return (
    <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-3xl border border-border bg-white p-5 shadow-sm" aria-label="Team health">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Team health</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-950">Workload, capacity, velocity, and risks</h2>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {teamHealth.map((team, index) => {
          const Icon = iconMap[index % iconMap.length]
          const active = selectedTeam?.id === team.id

          return (
            <button key={team.id} type="button" onClick={() => setSelectedTeamId(team.id)} className={`rounded-2xl border p-4 text-left transition ${active ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50/70 hover:border-blue-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-blue-700" />
                    <p className="text-sm font-semibold text-slate-950">{team.name}</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{team.department}</p>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">{team.taskCompletion}% complete</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100">Workload {team.workload}%</div>
                <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100">Capacity {team.capacity}%</div>
                <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100">Velocity {team.velocity}%</div>
                <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100">AI {team.aiAdoption}%</div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                {team.openRisks} open risks · {team.dependencies} dependencies · {team.knowledgeCoverage}% knowledge coverage
              </div>
            </button>
          )
        })}
      </div>
    </motion.section>
  )
}