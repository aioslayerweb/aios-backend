"use client"

import { motion, useReducedMotion } from "framer-motion"
import { KeyRound, ShieldCheck, UserCheck } from "lucide-react"
import { useAuth } from "@/hooks"

export function AuthStatusCard() {
  const reduceMotion = useReducedMotion()
  const { currentUser, isAuthenticated, authenticationMethod } = useAuth()

  return (
    <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Authentication status">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-muted"><ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />Authentication</div>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Signed-in identity</h2>
      <div className="mt-3 grid gap-2 text-sm text-text-secondary">
        <div className="rounded-2xl bg-surface-canvas p-3">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">User</p>
          <p className="mt-1 font-medium text-brand-navy">{currentUser?.name ?? "No identity"}</p>
          <p className="mt-1 text-xs">{currentUser?.email ?? "No email"}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface-canvas p-3"><p className="text-[11px] uppercase tracking-wide text-text-muted">Auth method</p><p className="mt-1 flex items-center gap-2 text-xs font-medium text-brand-navy"><KeyRound className="h-3.5 w-3.5" />{authenticationMethod}</p></div>
          <div className="rounded-2xl bg-surface-canvas p-3"><p className="text-[11px] uppercase tracking-wide text-text-muted">Status</p><p className="mt-1 flex items-center gap-2 text-xs font-medium text-brand-navy"><UserCheck className="h-3.5 w-3.5" />{isAuthenticated ? "Authenticated" : "Signed out"}</p></div>
        </div>
      </div>
    </motion.section>
  )
}