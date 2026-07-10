"use client";

import { motion } from "framer-motion";
import {
  AgentStatusCard,
  CommandComposer,
  ConnectedSystemCard,
  DecisionCard,
  IntelligenceCard,
  LeftRailLinks,
  LinkList,
  NotificationCard,
  OrganizationSnapshot,
  PriorityCard,
  RuntimeHealthCard,
  SectionKicker,
  SidebarSection,
  SuggestionCard,
  UpcomingMeetingCard,
} from "./command-center-components";
import { commandCenterData } from "./mock-data";

const fadeIn = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function CommandCenterWorkspace() {
  const data = commandCenterData;

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8">
      <SectionKicker title="AIOS Command Center" subtitle="Enterprise Command Center v1.0" />

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <motion.aside variants={fadeIn} initial="hidden" animate="show" className="space-y-3" aria-label="Command Center left sidebar">
          <LeftRailLinks title="AIOS Navigation" items={data.leftNavigation} />
          <LeftRailLinks title="Favorites" items={data.favorites} />
          <LeftRailLinks title="Recent Workspaces" items={data.recentWorkspaces} />
          <LeftRailLinks title="Agent Shortcuts" items={data.agentShortcuts} />
        </motion.aside>

        <motion.main variants={fadeIn} initial="hidden" animate="show" className="space-y-4" aria-label="Command Center main panel">
          <CommandComposer chips={data.chips} suggestions={data.suggestions} quickActions={data.quickActions} />

          <div className="grid gap-4 2xl:grid-cols-2">
            <IntelligenceCard title="Executive Priorities" action="View all">
              {data.priorities.map((item) => (
                <PriorityCard key={item.id} item={item} />
              ))}
            </IntelligenceCard>

            <IntelligenceCard title="Decision Queue" action="Review">
              {data.decisions.map((item) => (
                <DecisionCard key={item.id} item={item} />
              ))}
            </IntelligenceCard>

            <IntelligenceCard title="Active Workflows" action="Open queue">
              {data.workflows.map((item) => (
                <WorkflowCard key={item.id} item={item} />
              ))}
            </IntelligenceCard>

            <IntelligenceCard title="AI Recommendations" action="Prioritize">
              {data.recommendations.map((item) => (
                <SuggestionCard key={item.id} title={item.label} meta={item.meta || ""} />
              ))}
            </IntelligenceCard>

            <IntelligenceCard title="Recent Activity" action="Explore">
              <LinkList items={data.recentActivity} />
            </IntelligenceCard>

            <IntelligenceCard title="Memory Summary" action="Memory explorer">
              <LinkList items={data.memorySummary} />
            </IntelligenceCard>

            <IntelligenceCard title="Knowledge Summary" action="Knowledge graph">
              <LinkList items={data.knowledgeSummary} />
            </IntelligenceCard>

            <IntelligenceCard title="Business Alerts" action="Escalate">
              {data.notifications.slice(0, 2).map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </IntelligenceCard>
          </div>
        </motion.main>

        <motion.aside variants={fadeIn} initial="hidden" animate="show" className="space-y-3" aria-label="Command Center right sidebar">
          <OrganizationSnapshot metrics={data.metrics} />
          <RuntimeHealthCard metrics={data.metrics} />

          <IntelligenceCard title="Active Agents" action="Manage">
            {data.agents.map((agent) => (
              <AgentStatusCard key={agent.id} item={agent} />
            ))}
          </IntelligenceCard>

          <IntelligenceCard title="Notifications" action="All notifications">
            {data.notifications.map((notification) => (
              <NotificationCard key={notification.id} item={notification} />
            ))}
          </IntelligenceCard>

          <IntelligenceCard title="Calendar" action="Open calendar">
            {data.meetings.map((meeting) => (
              <UpcomingMeetingCard key={meeting.id} item={meeting} />
            ))}
          </IntelligenceCard>

          <IntelligenceCard title="Connected Systems" action="Connections">
            {data.connectedSystems.map((item) => (
              <ConnectedSystemCard key={item.id} item={item} />
            ))}
          </IntelligenceCard>

          <SidebarSection title="Enterprise Insights">
            <LinkList items={data.enterpriseInsights} />
          </SidebarSection>
        </motion.aside>
      </div>
    </div>
  );
}

function WorkflowCard({ item }: { item: { id: string; name: string; stage: string; owner: string; progress: number } }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-brand-navy">{item.name}</h4>
        <span className="text-xs text-text-muted">{item.progress}%</span>
      </div>
      <p className="mt-2 text-xs text-text-secondary">Stage: {item.stage}</p>
      <p className="mt-1 text-xs text-text-muted">Owner: {item.owner}</p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full bg-brand-primary" style={{ width: `${item.progress}%` }} />
      </div>
    </article>
  );
}
