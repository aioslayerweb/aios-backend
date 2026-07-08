"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Bot, Users } from "lucide-react"
import { useRoleAgents } from "@/hooks/use-role-agents"

export function RoleAgentsPanel() {
  const shouldReduceMotion = useReducedMotion()
  const { agents } = useRoleAgents()

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-3xl border border-border bg-white p-5 shadow-sm"
      aria-label="Role agents"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
        <Users className="h-3.5 w-3.5" />
        Recommended agents
      </div>
      <h2 className="mt-2 text-lg font-semibold text-slate-950">Agents aligned to the role</h2>

      <div className="mt-4 grid gap-3">
        {agents.map((agent, index) => (
          <motion.article
            key={agent.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <Bot className="mt-0.5 h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-950">{agent.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{agent.focus}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{agent.reason}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}