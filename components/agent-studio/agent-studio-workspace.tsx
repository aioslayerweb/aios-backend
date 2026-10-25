"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WorkspaceGrid, WorkspaceShell } from "@/components/workspace";
import { useNavigationBase } from "@/contexts/navigation-context";
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
  const [searchValue, setSearchValue] = useState("");
  const [notice, setNotice] = useState("");
  const { baseHref } = useNavigationBase();

  const filteredAgents = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return agentStudioData.agents;
    return agentStudioData.agents.filter((agent) =>
      [agent.name, agent.role, agent.status, agent.team, agent.objective].some((value) => value.toLowerCase().includes(query))
    );
  }, [searchValue]);

  const selectedAgent = filteredAgents.find((agent) => agent.id === selectedAgentId) ?? filteredAgents[0];
  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const templateLinks = useMemo(
    () =>
      agentStudioData.templates.map((template) => ({
        id: template.id,
        label: template.name,
        meta: template.usageCount,
        href: "#agent-templates",
      })),
    []
  );

  const handleQuickAction = (action: "collaborate" | "export" | "assign-workflow") => {
    if (action === "collaborate") {
      jumpTo("agent-collaboration");
      setNotice("Showing the sample collaboration graph. No agent was contacted.");
      return;
    }
    if (action === "assign-workflow") {
      setNotice("Workflow assignment is not connected. No workflow was changed.");
      return;
    }

    const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = [
      ["Name", "Role", "Team", "Status", "Confidence", "Health"],
      ...agentStudioData.agents.map((agent) => [agent.name, agent.role, agent.team, agent.status, `${agent.confidence}%`, `${agent.health}%`]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "aios-sample-agents.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Exported the synthetic sample agent list as a CSV file.");
  };

  if (!selectedAgent) {
    return (
      <WorkspaceShell>
        <StudioHeader
          searchValue={searchValue}
          onSearch={setSearchValue}
          onAction={(action) => {
            if (action === "templates") {
              jumpTo("agent-templates");
            } else {
              setNotice(`${action === "new" ? "Agent creation" : "Import"} is not connected. No agent data was changed.`);
            }
          }}
        />
        <div className="rounded-xl border border-border bg-white p-6 text-center">
          <p className="text-sm text-text-secondary">No sample agents match this search.</p>
          <button type="button" className="mt-3 rounded-lg border border-border px-3 py-2 text-sm font-medium text-brand-navy" onClick={() => setSearchValue("")}>
            Clear search
          </button>
        </div>
      </WorkspaceShell>
    );
  }

  const navigationLinks = agentStudioData.leftNavigation.map((item) => ({
    ...item,
    href: item.href.replace(/^\/app/, baseHref),
  }));

  return (
    <WorkspaceShell>
      <StudioHeader
        searchValue={searchValue}
        onSearch={setSearchValue}
        onAction={(action) => {
          if (action === "templates") {
            jumpTo("agent-templates");
          } else {
            setNotice(`${action === "new" ? "Agent creation" : "Import"} is not connected. No agent data was changed.`);
          }
        }}
      />
      {notice ? <p className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900" role="status" aria-live="polite">{notice}</p> : null}

      <WorkspaceGrid className="2xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <AgentStudioLeftRail
          nav={navigationLinks}
          categories={agentStudioData.categories}
          favorites={agentStudioData.favorites}
          templates={templateLinks}
          teams={agentStudioData.teams}
          recent={agentStudioData.recentAgents}
          onCategorySelect={(item) => {
            setSearchValue(item.label);
            jumpTo("agent-list");
          }}
          onAgentSelect={(item) => {
            const agent = agentStudioData.agents.find((candidate) => candidate.name === item.label);
            if (agent) setSelectedAgentId(agent.id);
            setSearchValue(item.label);
            jumpTo("agent-list");
          }}
          onTeamSelect={(item) => {
            setSearchValue(item.label);
            jumpTo("agent-list");
          }}
          onTemplates={() => jumpTo("agent-templates")}
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

          <section id="agent-list">
            <SectionTitle title="Featured Agents" subtitle="Active AI Employees" />
            <QuickActionBar onAction={handleQuickAction} />
            <div className="mt-3">
              {filteredAgents.length ? (
                <AgentGrid agents={filteredAgents} selectedAgentId={selectedAgent.id} onSelect={setSelectedAgentId} />
              ) : (
                <p className="rounded-xl border border-border bg-white p-4 text-sm text-text-secondary">No sample agents match this search.</p>
              )}
            </div>
          </section>

          <section id="agent-collaboration">
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
              <div id="agent-templates">
                <SectionTitle title="Templates" subtitle="Reusable agent blueprints" />
              </div>
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
