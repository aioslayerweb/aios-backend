import type { PermissionRecord } from "@/types"

type PermissionsPanelProps = {
  permissions: PermissionRecord[]
}

export function PermissionsPanel({ permissions }: PermissionsPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Permissions">
      <p className="text-xs uppercase tracking-wide text-text-muted">Permissions</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Granular enterprise permission architecture</h2>
      <div className="mt-4 space-y-3">
        {permissions.map((permission) => (
          <article key={permission.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{permission.key}</p>
                <p className="mt-1 text-[11px] capitalize text-text-muted">{permission.category}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] text-text-muted">{permission.assignedRoles.length} roles</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{permission.description}</p>
            <p className="mt-2 text-[11px] text-text-muted">Assigned roles: {permission.assignedRoles.join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  )
}