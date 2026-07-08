import type { UserRecord } from "@/types"

type UsersPanelProps = {
  users: UserRecord[]
}

export function UsersPanel({ users }: UsersPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Users">
      <p className="text-xs uppercase tracking-wide text-text-muted">Users</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Profiles, departments, roles, and assignments</h2>
      <div className="mt-4 space-y-3 max-h-[560px] overflow-y-auto pr-1">
        {users.map((user) => (
          <article key={user.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{user.name}</p>
                <p className="mt-1 text-[11px] text-text-muted">{user.email}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{user.status}</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4 text-xs text-text-secondary">
              <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Department</p><p className="mt-1 text-brand-navy capitalize">{user.department}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Role</p><p className="mt-1 text-brand-navy">{user.roleId}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Last login</p><p className="mt-1 text-brand-navy">{user.lastLogin}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Agents</p><p className="mt-1 text-brand-navy">{user.assignedAgents.length}</p></div>
            </div>
            <p className="mt-2 text-[11px] text-text-muted">Workflows: {user.assignedWorkflows.join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  )
}