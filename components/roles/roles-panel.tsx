import type { RoleRecord } from "@/types"

type RolesPanelProps = {
  roles: RoleRecord[]
}

export function RolesPanel({ roles }: RolesPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Roles">
      <p className="text-xs uppercase tracking-wide text-text-muted">Roles</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Enterprise RBAC role model</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {roles.map((role) => (
          <article key={role.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{role.name}</p>
                <p className="mt-1 text-[11px] capitalize text-text-muted">{role.scope}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] text-text-muted">{role.permissions.length} perms</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{role.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}