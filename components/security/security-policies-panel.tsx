import type { SecurityPolicy } from "@/types"

type SecurityPoliciesPanelProps = {
  policies: SecurityPolicy[]
}

export function SecurityPoliciesPanel({ policies }: SecurityPoliciesPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Security policies">
      <p className="text-xs uppercase tracking-wide text-text-muted">Security Policies</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Password, MFA, session, network, and retention controls</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {policies.map((policy) => (
          <article key={policy.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{policy.name}</p>
                <p className="mt-1 text-[11px] capitalize text-text-muted">{policy.category}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{policy.status}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{policy.summary}</p>
            <p className="mt-2 text-[11px] text-text-muted">{policy.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}