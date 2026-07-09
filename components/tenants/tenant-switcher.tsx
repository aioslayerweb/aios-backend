"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Building2, Globe2, Layers3 } from "lucide-react"
import { useSecurity, useTenant } from "@/hooks"

export function TenantSwitcher() {
  const reduceMotion = useReducedMotion()
  const { organizations, workspaces } = useSecurity()
  const { selectedTenantId, setSelectedTenantId, organization, workspace, environment, settings } = useTenant()

  return (
    <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Tenant switcher">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-muted"><Layers3 className="h-3.5 w-3.5 text-brand-primary" />Tenant</div>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Tenant hierarchy and settings</h2>
      <div className="mt-3 grid gap-2 text-sm text-text-secondary">
        <div className="rounded-2xl bg-surface-canvas p-3">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Selected organization</p>
          <p className="mt-1 font-medium text-brand-navy">{organization?.name ?? "No organization"}</p>
          <p className="mt-1 text-xs">{environment}</p>
        </div>
        <div className="rounded-2xl bg-surface-canvas p-3">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Workspace</p>
          <p className="mt-1 font-medium text-brand-navy">{workspace?.name ?? "No workspace"}</p>
        </div>
        <div className="rounded-2xl bg-surface-canvas p-3">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Domains</p>
          <p className="mt-1 flex items-center gap-2 text-xs font-medium text-brand-navy"><Globe2 className="h-3.5 w-3.5" />{settings.domains.join(", ")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {organizations.slice(0, 3).map((item) => (
            <button key={item.id} type="button" onClick={() => setSelectedTenantId(item.id)} className={`rounded-full border px-3 py-1.5 text-xs transition ${selectedTenantId === item.id ? "border-brand-primary bg-brand-subtle/40 text-brand-navy" : "border-border bg-surface-canvas text-text-secondary"}`}>
              <Building2 className="mr-1 inline h-3 w-3" />
              {item.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-muted">{workspaces.length} workspaces governed under the current tenant.</p>
      </div>
    </motion.section>
  )
}