"use client"

import type { OrganizationRecord } from "@/types"
import { cn } from "@/utils"

type OrganizationPanelProps = {
  organizations: OrganizationRecord[]
  selectedOrganizationId: string
  onSelectOrganization: (id: string) => void
}

export function OrganizationPanel({ organizations, selectedOrganizationId, onSelectOrganization }: OrganizationPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Organizations">
      <p className="text-xs uppercase tracking-wide text-text-muted">Organizations</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Tenant isolation across companies</h2>
      <div className="mt-4 space-y-3">
        {organizations.map((org) => {
          const active = org.id === selectedOrganizationId
          return (
            <button
              key={org.id}
              type="button"
              onClick={() => onSelectOrganization(org.id)}
              className={cn("w-full rounded-2xl border p-3 text-left transition-colors", active ? "border-brand-primary bg-brand-subtle/40" : "border-slate-100 bg-slate-50/70 hover:bg-slate-50")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{org.name}</p>
                  <p className="mt-1 text-[11px] text-text-muted">{org.subscription} · {org.region}</p>
                </div>
                <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{org.status}</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Environment</p><p className="mt-1 text-xs text-brand-navy">{org.environment}</p></div>
                <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Owner</p><p className="mt-1 text-xs text-brand-navy">{org.owner}</p></div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}