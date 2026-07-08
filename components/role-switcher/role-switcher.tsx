"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Eye, Lock, MonitorSmartphone, Sparkles } from "lucide-react"
import { useRoleDashboard } from "@/hooks/use-role-dashboard"

export function RoleSwitcher() {
  const shouldReduceMotion = useReducedMotion()
  const {
    availableRoles,
    currentRole,
    previewRoleId,
    roleDashboard,
    simulationEnabled,
    setCurrentRoleId,
    setPreviewRoleId,
    setSimulationEnabled,
  } = useRoleDashboard()

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-3xl border border-border bg-white p-5 shadow-sm"
      aria-label="Role switcher"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            <MonitorSmartphone className="h-3.5 w-3.5" />
            Role simulation mode
          </div>
          <h2 className="text-lg font-semibold text-slate-950">Preview AIOS through the decisions behind the role</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            {simulationEnabled
              ? "Simulation mode is active. Choose a preview lens without changing permissions or the actual role assignment."
              : "Simulation mode is off. Switch the active role lens or enable preview mode to inspect another decision profile."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSimulationEnabled(!simulationEnabled)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${simulationEnabled ? "bg-blue-950 text-white" : "bg-slate-100 text-slate-700"}`}
          aria-pressed={simulationEnabled}
        >
          {simulationEnabled ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {simulationEnabled ? "Preview enabled" : "Enable preview"}
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current lens</p>
          <p className="mt-1 text-sm text-slate-700">
            {currentRole.label} is the base role lens. {simulationEnabled && previewRoleId ? `Previewing ${roleDashboard.headline}.` : "Select a role to reframe the home experience."}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {availableRoles.map((role) => {
            const selected = simulationEnabled ? previewRoleId === role.id : currentRole.id === role.id

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  if (simulationEnabled) {
                    setPreviewRoleId(role.id)
                    return
                  }

                  setCurrentRoleId(role.id)
                }}
                className={`rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${selected ? "border-blue-500 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"}`}
                aria-pressed={selected}
                aria-label={`Switch role lens to ${role.label}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{role.label}</p>
                    <p className="text-xs text-slate-500">{role.department}</p>
                  </div>
                  <Eye className={`h-4 w-4 ${selected ? "text-blue-700" : "text-slate-400"}`} />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{role.currentPriorities[0] ?? role.homeSummary}</p>
              </button>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}