"use client"

import { useExecutiveWorkspace, useExecutiveKPIs, useNotificationCenter, useRuntimeStatus } from "@/hooks"
import { WorkspaceGrid, WorkspaceRightPanel } from "@/components/workspace"
import { KPICard } from "./kpi-card"
import { BusinessHealth } from "./business-health"
import { DecisionCenter } from "./decision-center"
import { ExecutiveBriefing } from "./executive-briefing"
import { ExecutiveHeader } from "./executive-header"
import { ExecutiveSummary } from "./executive-summary"
import { PriorityActions } from "./priority-actions"
import { QuickActions } from "./quick-actions"
import { RecentBusinessActivity } from "./recent-business-activity"
import { TimelineCard } from "./timeline-card"
import { WorkspaceHero } from "./workspace-hero"

function RightRail() {
  return (
    <aside className="space-y-3" aria-label="Executive right sidebar">
      {/* Right rail intentionally empty — status widgets are in ExecutiveWorkspace section */}
    </aside>
  )
}

function ExecutiveWorkspaceStatusWidgets() {
  const { unreadCount } = useNotificationCenter()
  const { overallHealth } = useRuntimeStatus()
  const { summary } = useExecutiveWorkspace()

  return (
    <section className="grid gap-3 sm:grid-cols-3" aria-label="Executive workspace status">
      <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-text-muted">AI Assistant</p>
        <p className="mt-2 text-sm font-semibold text-brand-navy">{summary.metrics.find((item) => item.label === "Running Agents")?.value} active agents</p>
        <p className="mt-1 text-xs text-text-secondary">AI assistance is available in the right dock.</p>
      </article>
      <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-text-muted">Notifications</p>
        <p className="mt-2 text-sm font-semibold text-brand-navy">{unreadCount} unread updates</p>
        <p className="mt-1 text-xs text-text-secondary">Notification Center is available from the shell top bar.</p>
      </article>
      <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-text-muted">Runtime Status</p>
        <p className="mt-2 text-sm font-semibold text-brand-navy">Overall health {overallHealth}</p>
        <p className="mt-1 text-xs text-text-secondary">Runtime panel is available from the global status bar.</p>
      </article>
    </section>
  )
}

export function ExecutiveWorkspaceView() {
  const { timeline } = useExecutiveWorkspace()
  const { kpis } = useExecutiveKPIs()

  return (
    <WorkspaceGrid className="xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <WorkspaceHero />
        <ExecutiveHeader />

        {/* Status widgets anchored under the Executive Workspace hero */}
        <ExecutiveWorkspaceStatusWidgets />

        <ExecutiveSummary />
        <BusinessHealth />
        <PriorityActions />
        <ExecutiveBriefing />

        <section className="space-y-3" aria-label="Today timeline">
          <p className="text-lg font-semibold text-brand-navy">Today Timeline</p>
          <div className="space-y-2">
            {timeline.map((item) => (
              <TimelineCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="space-y-3" aria-label="Key performance indicators">
          <p className="text-lg font-semibold text-brand-navy">Key Performance Indicators</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((item) => (
              <KPICard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <DecisionCenter />
        <RecentBusinessActivity />
        <QuickActions />
      </div>

      <WorkspaceRightPanel ariaLabel="Executive right sidebar">
        <RightRail />
      </WorkspaceRightPanel>
    </WorkspaceGrid>
  )
}
