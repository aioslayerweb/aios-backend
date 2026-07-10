"use client"

import type { GovernanceComplianceItem, GovernanceState } from "@/types"
import { cn } from "@/utils"

type ComplianceCenterPanelProps = {
  compliance: GovernanceComplianceItem[]
  complianceView: GovernanceState["complianceView"]
  onChangeView: (view: GovernanceState["complianceView"]) => void
}

const frameworks: GovernanceState["complianceView"][] = ["all", "GDPR", "SOC 2", "ISO 27001", "HIPAA"]

export function ComplianceCenterPanel({ compliance, complianceView, onChangeView }: ComplianceCenterPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Compliance center">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Compliance Center</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Framework-aware governance views</h2>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Compliance framework filters">
          {frameworks.map((framework) => {
            const active = framework === complianceView
            return (
              <button
                key={framework}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChangeView(framework)}
                className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", active ? "bg-brand-primary text-white" : "border border-border bg-white text-text-secondary hover:bg-surface-muted")}
              >
                {framework}
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {compliance.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{item.framework}</p>
                <p className="mt-1 text-[11px] text-text-muted">Owner {item.owner}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{item.status}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{item.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.mappedPolicies.map((policy) => <span key={policy} className="rounded-full border border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] px-2 py-1 text-[11px] text-[var(--color-semantic-info-text)]">{policy}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}