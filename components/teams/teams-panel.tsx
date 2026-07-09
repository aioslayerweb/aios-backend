import type { TeamRecord } from "@/types"

type TeamsPanelProps = {
  teams: TeamRecord[]
}

export function TeamsPanel({ teams }: TeamsPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Teams">
      <p className="text-xs uppercase tracking-wide text-text-muted">Teams</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Department and team ownership</h2>
      <div className="mt-4 space-y-3">
        {teams.map((team) => (
          <article key={team.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{team.name}</p>
                <p className="mt-1 text-[11px] text-text-muted">Lead: {team.lead}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] text-text-muted">{team.members} members</span>
            </div>
            <p className="mt-2 text-xs text-text-secondary">Workspace {team.workspaceId} · Department {team.departmentId}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
