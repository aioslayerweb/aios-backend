"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WorkspaceGrid, WorkspaceShell } from "@/components/workspace";
import {
  AgentDetailsPanel,
  AgentGrid,
  AgentStudioLeftRail,
  CollaborationGraph,
  QuickActionBar,
  RecentActivityFeed,
  SectionTitle,
  StudioHeader,
  StudioRightRail,
  TemplatePanel,
  OverviewMetricCard,
} from "./agent-studio-components";
import { agentStudioData } from "./mock-data";

const LazyActivityFeed = lazy(async () => ({ default: RecentActivityFeed }));
const LazyCollaborationGraph = lazy(async () => ({ default: CollaborationGraph }));

const blockMotion = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.34,
      ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function AgentStudioWorkspace() {
  const [selectedAgentId, setSelectedAgentId] = useState(agentStudioData.agents[0]?.id || "");

  const selectedAgent = useMemo(
    () => agentStudioData.agents.find((agent) => agent.id === selectedAgentId) || agentStudioData.agents[0],
    [selectedAgentId]
  );

  const templateLinks = useMemo(
    () =>
      agentStudioData.templates.map((template) => ({
        id: template.id,
        label: template.name,
        meta: template.usageCount,
        href: "#",
      })),
    []
  );

  if (!selectedAgent) {
    return null;
  }

  return (
    <WorkspaceShell>
      <StudioHeader />

      <WorkspaceGrid className="2xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <AgentStudioLeftRail
          nav={agentStudioData.leftNavigation}
          categories={agentStudioData.categories}
          favorites={agentStudioData.favorites}
          templates={templateLinks}
          teams={agentStudioData.teams}
          recent={agentStudioData.recentAgents}
        />

        <motion.main variants={blockMotion} initial="hidden" animate="show" className="space-y-4" aria-label="Agent Studio main dashboard">
          <section>
            <SectionTitle title="Enterprise Overview" subtitle="AI Workforce Metrics" />
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {agentStudioData.metrics.map((metric) => (
                <OverviewMetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>

          <section>
            <SectionTitle title="Featured Agents" subtitle="Active AI Employees" />
            <QuickActionBar />
            <div className="mt-3">
              <AgentGrid agents={agentStudioData.agents} selectedAgentId={selectedAgent.id} onSelect={setSelectedAgentId} />
            </div>
          </section>

          <section>
            <SectionTitle title="Agent Details" subtitle={selectedAgent.name} />
            <AgentDetailsPanel
              selectedAgent={selectedAgent}
              capabilities={agentStudioData.capabilities}
              knowledge={agentStudioData.knowledge}
              memoryCollections={agentStudioData.memoryCollections}
              mcpTools={agentStudioData.mcpTools}
              permissions={agentStudioData.permissions}
              workflows={agentStudioData.workflows}
              executionHistory={agentStudioData.executionHistory.map((event) => ({ id: event.id, label: `${event.title} • ${event.timestamp}` }))}
              suggestedImprovements={agentStudioData.suggestedImprovements}
            />
          </section>

          <section>
            <SectionTitle title="Agent Collaboration" subtitle="Delegation, knowledge and workflow orchestration" />
            <Suspense fallback={<div className="rounded-xl border border-border bg-white p-4 text-sm text-text-muted">Loading collaboration...</div>}>
              <LazyCollaborationGraph agents={agentStudioData.agents} links={agentStudioData.collaboration} />
            </Suspense>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <div>
              <SectionTitle title="Templates" subtitle="Reusable agent blueprints" />
              <TemplatePanel templates={agentStudioData.templates} />
            </div>
            <div>
              <SectionTitle title="Recent Activity" subtitle="Enterprise agent events" />
              <Suspense fallback={<div className="rounded-xl border border-border bg-white p-4 text-sm text-text-muted">Loading activity...</div>}>
                <LazyActivityFeed activities={agentStudioData.activities} />
              </Suspense>
            </div>
          </section>
        </motion.main>

        <StudioRightRail
          metrics={agentStudioData.metrics}
          systems={agentStudioData.rightConnectedSystems}
          notifications={agentStudioData.notifications}
          events={agentStudioData.upcomingEvents}
          quickInsights={agentStudioData.quickInsights}
        />
      </WorkspaceGrid>
    </WorkspaceShell>
  );
}
