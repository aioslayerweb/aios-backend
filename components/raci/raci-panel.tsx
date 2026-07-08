"use client"

import { motion, useReducedMotion } from "framer-motion"
import { FileSpreadsheet } from "lucide-react"
import { useDepartments } from "@/hooks"

const roles = ["Responsible", "Accountable", "Consulted", "Informed"] as const

export function RaciPanel() {
  const reduceMotion = useReducedMotion()
  const { selectedDepartment } = useDepartments()

  return (
    <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-3xl border border-border bg-white p-5 shadow-sm" aria-label="RACI matrix">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"><FileSpreadsheet className="h-3.5 w-3.5" />RACI matrix</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-950">Ownership for the selected department</h2>
      <p className="mt-1 text-sm text-slate-600">{selectedDepartment?.summary ?? "Select a department to inspect responsibility mapping."}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {roles.map((role) => (
          <div key={role} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{role}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{selectedDepartment ? `${selectedDepartment.label} uses this role for department-level workflows.` : "Mapped from the department and workflow stack."}</p>
          </div>
        ))}
      </div>
    </motion.section>
  )
}