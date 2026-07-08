"use client"

import { LockKeyhole, Network, ShieldCheck, Users } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import {
  useApiKeys,
  useAuditLogs,
  useOrganizations,
  usePermissions,
  useRoles,
  useSecurity,
  useSecurityPolicies,
  useSessions,
  useUsers,
  useWorkspaces,
} from "@/hooks"
import { ApiKeysPanel } from "@/components/api-keys/api-keys-panel"
import { SecurityAuditLogsPanel } from "@/components/audit/security-audit-logs-panel"
import { OrganizationPanel } from "@/components/organizations/organization-panel"
import { PermissionsPanel } from "@/components/permissions/permissions-panel"
import { RolesPanel } from "@/components/roles/roles-panel"
import { ActiveSessionsPanel } from "@/components/sessions/active-sessions-panel"
import { SecurityPoliciesPanel } from "./security-policies-panel"
import { SecurityWorkspacesPanel } from "@/components/workspaces/security-workspaces-panel"
import { UsersPanel } from "@/components/users/users-panel"
import { StatusIndicator } from "@/components/ui"

export function EnterpriseSecurityView() {
  const reduceMotion = useReducedMotion()
  const {
    selectedOrganization,
    selectedWorkspace,
    query,
    updateQuery,
    liveMode,
    setLiveMode,
    filteredTeams,
  } = useSecurity()
  const { organizations, selectedOrganizationId, setSelectedOrganizationId } = useOrganizations()
  const { workspaces, selectedWorkspaceId, setSelectedWorkspaceId } = useWorkspaces()
  const { users } = useUsers()
  const { roles } = useRoles()
  const { permissions } = usePermissions()
  const { auditTrail } = useAuditLogs()
  const { policies } = useSecurityPolicies()
  const { apiKeys, rotateApiKey } = useApiKeys()
  const { sessions, revokeSession } = useSessions()

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_rgba(28,130,242,0.10)]"
        aria-label="Enterprise administration header"
      >
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(28,130,242,0.16),_transparent_38%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#eef6ff_100%)] p-6 md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-primary">Enterprise Administration</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy md:text-[2.2rem]">AIOS Enterprise Security, RBAC & Multi-Tenancy</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                Secure multi-organization, multi-workspace AIOS deployment architecture with tenant isolation, workspace segmentation, role-based permissions, auditability, policy controls, API key governance, and session management.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">Supabase Authentication linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Runtime + Memory linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Knowledge + Decisions + Governance linked</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:max-w-[500px]">
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Organizations</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{organizations.length}</p>
                <p className="mt-1 text-xs text-text-secondary">Tenant-level enterprise isolation architecture.</p>
              </article>
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Users</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{users.length}</p>
                <p className="mt-1 text-xs text-text-secondary">Role, department, agent, and workflow assignments.</p>
              </article>
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Security mode</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <StatusIndicator tone={liveMode ? "success" : "neutral"} label={liveMode ? "Monitoring" : "Paused"} />
                  <button type="button" onClick={() => setLiveMode(!liveMode)} className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-muted">{liveMode ? "Pause" : "Resume"}</button>
                </div>
              </article>
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Selected scope</p>
                <p className="mt-2 text-sm font-semibold text-brand-navy">{selectedOrganization?.name ?? "No organization selected"}</p>
                <p className="mt-1 text-xs text-text-secondary">{selectedWorkspace?.name ?? "Select a workspace"}</p>
              </article>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Security overview">
        <div className="flex flex-wrap items-start gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Enterprise Governance Layer</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-navy">Organizations, workspaces, users, teams, roles, permissions, audit, sessions</h2>
            <p className="mt-1 text-sm text-text-secondary">Everything is structured for enterprise tenancy, secure isolation, governed workflow execution, and future SSO, SAML, SCIM, Entra ID, Okta, Google Workspace, and ABAC expansion.</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span className="rounded border border-border px-1.5 py-0.5"><ShieldCheck className="mr-1 inline h-3 w-3" />Enterprise ready</span>
            <span className="rounded border border-border px-1.5 py-0.5"><Users className="mr-1 inline h-3 w-3" />Multi-tenant</span>
            <span className="rounded border border-border px-1.5 py-0.5"><Network className="mr-1 inline h-3 w-3" />Workspace isolated</span>
            <span className="rounded border border-border px-1.5 py-0.5"><LockKeyhole className="mr-1 inline h-3 w-3" />RBAC governed</span>
          </div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <input
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search organizations, users, roles, sessions, API keys"
              className="w-full bg-transparent text-sm text-text-primary outline-none"
              aria-label="Search enterprise administration"
            />
          </label>
          <div className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-sm text-text-secondary">
            {filteredTeams.length} teams in filtered scope
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside className="space-y-4" aria-label="Security left column">
          <OrganizationPanel organizations={organizations} selectedOrganizationId={selectedOrganizationId} onSelectOrganization={setSelectedOrganizationId} />
          <SecurityWorkspacesPanel workspaces={workspaces} selectedWorkspaceId={selectedWorkspaceId} onSelectWorkspace={setSelectedWorkspaceId} />
        </aside>

        <main className="space-y-4" aria-label="Security main administration content">
          <UsersPanel users={users} />
          <RolesPanel roles={roles} />
          <PermissionsPanel permissions={permissions} />
          <SecurityPoliciesPanel policies={policies} />
        </main>

        <aside className="space-y-4" aria-label="Security right column">
          <SecurityAuditLogsPanel logs={auditTrail} />
          <ApiKeysPanel apiKeys={apiKeys} onRotateApiKey={rotateApiKey} />
          <ActiveSessionsPanel sessions={sessions} onRevokeSession={revokeSession} />
        </aside>
      </div>
    </div>
  )
}