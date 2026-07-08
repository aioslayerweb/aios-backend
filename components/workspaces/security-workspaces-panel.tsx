"use client"

import type { WorkspaceRecord } from "@/types"
import { cn } from "@/utils"

type SecurityWorkspacesPanelProps = {
  workspaces: WorkspaceRecord[]
  selectedWorkspaceId: string
  onSelectWorkspace: (id: string) => void
}

export function SecurityWorkspacesPanel({ workspaces, selectedWorkspaceId, onSelectWorkspace }: SecurityWorkspacesPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Workspaces">
      <p className="text-xs uppercase tracking-wide text-text-muted">Workspaces</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Multi-workspace architecture</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {workspaces.map((workspace) => {
          const active = workspace.id === selectedWorkspaceId
          return (
            <button
              key={workspace.id}
              type="button"
              onClick={() => onSelectWorkspace(workspace.id)}
              className={cn("rounded-2xl border p-3 text-left transition-colors", active ? "border-brand-primary bg-brand-subtle/40" : "border-slate-100 bg-slate-50/70 hover:bg-slate-50")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{workspace.name}</p>
                  <p className="mt-1 text-[11px] capitalize text-text-muted">{workspace.key}</p>
                </div>
                <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{workspace.status}</span>
              </div>
              <div className="mt-3 grid gap-2 grid-cols-3 text-center text-xs">
                <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Users</p><p className="mt-1 font-semibold text-brand-navy">{workspace.users}</p></div>
                <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Agents</p><p className="mt-1 font-semibold text-brand-navy">{workspace.agents}</p></div>
                <div className="rounded-xl bg-white p-2"><p className="text-text-muted">Flows</p><p className="mt-1 font-semibold text-brand-navy">{workspace.workflows}</p></div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}