"use client"

import { useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Building2, Expand, Search, Sparkles } from "lucide-react"
import { EnterpriseSecurityView } from "@/components/security"
import { OrganizationPanel } from "@/components/organizations/organization-panel"
import { OrgChartPanel } from "@/components/org-chart/org-chart-panel"
import { TeamHealthPanel } from "@/components/team-health/team-health-panel"
import { ObjectivesPanel } from "@/components/objectives/objectives-panel"
import { CollaborationPanel } from "@/components/collaboration/collaboration-panel"
import { OwnershipPanel } from "@/components/ownership/ownership-panel"
import { RaciPanel } from "@/components/raci/raci-panel"
import { OrgTimelinePanel } from "@/components/org-timeline/org-timeline-panel"
import { useCurrentRole, useDepartments, useOrganization, useOrganizationIntelligenceContext, useTeams } from "@/hooks"

function metricCard(title: string, value: string, detail: string) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </article>
  )
}

export function OrganizationIntelligenceView() {
  const reduceMotion = useReducedMotion()
  const { currentRole } = useCurrentRole()
  const { snapshot, organizations, selectedOrganization, selectedOrganizationId, setSelectedOrganizationId, updateQuery, query, liveMode, setLiveMode, departments, selectedDepartment, selectedTeam, impactSummary } = useOrganizationIntelligenceContext()
  const { organizations: orgList } = useOrganization()
  const { filteredDepartments, setSelectedDepartmentId } = useDepartments()
  const { filteredTeams } = useTeams()

  useEffect(() => {
    if (selectedDepartment?.id) {
      setSelectedDepartmentId(selectedDepartment.id)
    }
  }, [selectedDepartment?.id, setSelectedDepartmentId])

  return (
    <div className="space-y-6 bg-slate-50 px-4 py-4 md:px-6 lg:px-8">
      <motion.section initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_rgba(28,130,242,0.10)]" aria-label="Organization intelligence header">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(28,130,242,0.16),_transparent_38%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#eef6ff_100%)] p-6 md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-primary">Organization Intelligence</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy md:text-[2.2rem]">AIOS Organization Intelligence Layer</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">AIOS understands the structure, ownership, dependencies, decision flows, and collaboration patterns of the organization, then adapts the operating view for the current role lens: {currentRole.label}.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">Role-based intelligence linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Runtime + Memory linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Knowledge + Decisions + Workflow linked</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:max-w-[500px]">
              {metricCard("Organizations", String(snapshot.organizationCount), `${snapshot.integrationCount} integrations across ${snapshot.integrationHealthCount} active health states`)}
              {metricCard("Teams", String(snapshot.teamCount), `${filteredTeams.length} matched in the current organization lens`)}
              {metricCard("Departments", String(filteredDepartments.length), `${departments.length} modeled in the organization graph`)}
              {metricCard("Role lens", currentRole.label, `${selectedOrganization?.name ?? "Selected organization"} · ${liveMode ? "live" : "paused"}`)}
            </div>
          </div>
        </div>
      </motion.section>

      <section className="rounded-3xl border border-border bg-white p-5 shadow-sm" aria-label="Organization search and controls">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Operating model</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">Who owns what, how work moves, and where impact lands</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <button type="button" onClick={() => setLiveMode(!liveMode)} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:bg-white">{liveMode ? "Pause updates" : "Resume updates"}</button>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Selected team: {selectedTeam?.label ?? "None"}</span>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={query} onChange={(event) => updateQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search organization, department, team, objective, workflow" aria-label="Search organization intelligence" />
          </label>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{selectedOrganization?.name ?? orgList[0]?.name ?? "Organization"}</div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside className="space-y-4" aria-label="Organization left column">
          <OrganizationPanel organizations={organizations} selectedOrganizationId={selectedOrganizationId} onSelectOrganization={setSelectedOrganizationId} />
          <OrgChartPanel />
          <OwnershipPanel />
        </aside>

        <main className="space-y-4" aria-label="Organization main content">
          <TeamHealthPanel />
          <ObjectivesPanel />
          <CollaborationPanel />
          <RaciPanel />
          <OrgTimelinePanel />

          <section className="rounded-3xl border border-border bg-white p-5 shadow-sm" aria-label="Impact analysis">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"><Expand className="h-3.5 w-3.5" />Impact analysis</div>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Selected department impact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{impactSummary.businessImpact}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Affected workflows</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {impactSummary.affectedWorkflows.map((workflow) => <span key={workflow} className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200">{workflow}</span>)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Dependencies</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {impactSummary.dependencies.map((dependency) => <span key={dependency} className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200">{dependency}</span>)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Risks</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {impactSummary.risks.map((risk) => <span key={risk} className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200">{risk}</span>)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Initiatives</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {impactSummary.initiatives.map((initiative) => <span key={initiative} className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200">{initiative}</span>)}
                </div>
              </div>
            </div>
          </section>

          <details className="rounded-3xl border border-border bg-white p-5 shadow-sm">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">Keep enterprise security controls available</summary>
            <div className="mt-4">
              <EnterpriseSecurityView />
            </div>
          </details>
        </main>

        <aside className="space-y-4" aria-label="Organization right column">
          <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"><Building2 className="h-3.5 w-3.5" />Organization snapshot</div>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Live operating view</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><p className="text-xs uppercase tracking-wide text-slate-500">Runtime</p><p className="mt-2 text-sm text-slate-700">Queue depth {snapshot.runtimeQueueDepth} · Pending tasks {snapshot.runtimePendingTasks} · Agents {snapshot.runtimeRunningAgents}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><p className="text-xs uppercase tracking-wide text-slate-500">Decision engine</p><p className="mt-2 text-sm text-slate-700">{snapshot.decisionSummary}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><p className="text-xs uppercase tracking-wide text-slate-500">Planning</p><p className="mt-2 text-sm text-slate-700">{snapshot.planningObjective || "No plan selected"}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><p className="text-xs uppercase tracking-wide text-slate-500">Knowledge + memory</p><p className="mt-2 text-sm text-slate-700">Nodes {snapshot.knowledgeNodes} · Edges {snapshot.knowledgeEdges} · Memory entries {snapshot.memoryEntries}</p></div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"><Sparkles className="h-3.5 w-3.5" />Multi-tenant readiness</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">Organizations, regions, business units, departments, teams, squads, employees, external partners, contractors, customers, and vendors are all represented in the org model so AIOS can support mergers, matrix structures, and cross-company collaboration later without rewrites.</p>
          </section>
        </aside>
      </div>
    </div>
  )
}