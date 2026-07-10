"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Clock4,
  Command,
  Download,
  FileUp,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Avatar, Badge, Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import { cn } from "@/utils";
import type {
  AgentCapability,
  AgentCardData,
  AgentCollaborationLink,
  AgentStatus,
  AgentStudioMetric,
  AgentTemplate,
  ConnectedSystem,
  MCPTool,
  OrganizationNotification,
  StudioActivity,
  StudioSidebarLink,
  UpcomingEvent,
} from "./types";

const panelReveal = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.34,
      ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    },
  },
};

function statusTone(status: AgentStatus): "success" | "warning" | "error" {
  if (status === "active") return "success";
  if (status === "attention") return "error";
  return "warning";
}

function notificationTone(tone: OrganizationNotification["tone"]): string {
  if (tone === "critical") return "bg-semantic-error";
  if (tone === "warning") return "bg-semantic-warning";
  return "bg-semantic-info";
}

function collaborationTone(type: AgentCollaborationLink["type"]): string {
  if (type === "delegation") return "from-sky-200 to-sky-500";
  if (type === "knowledge") return "from-violet-200 to-violet-500";
  if (type === "workflow") return "from-emerald-200 to-emerald-500";
  return "from-amber-200 to-amber-500";
}

export function StudioHeader() {
  return (
    <Card className="border-border bg-white">
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">Agent Studio</p>
            <h1 className="mt-1 text-2xl font-semibold text-brand-navy">Enterprise AI Workforce Management</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Create, supervise and orchestrate AI agents across your organization.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm">
              <Plus size={14} />
              New Agent
            </Button>
            <Button variant="secondary" size="sm">
              <FileUp size={14} />
              Import
            </Button>
            <Button variant="secondary" size="sm">
              <Sparkles size={14} />
              Templates
            </Button>
          </div>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <Input
            className="h-auto border-0 bg-transparent p-0 shadow-none"
            placeholder="Search agents, templates, teams, workflows"
            aria-label="Search Agent Studio"
          />
        </label>
      </CardContent>
    </Card>
  );
}

export function SidebarSection({ title, links }: { title: string; links: StudioSidebarLink[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-1.5 p-3">
        {links.map((link) => (
          <Link key={link.id} href={link.href} className="flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2 text-sm hover:border-brand-primary/35">
            <span className="font-medium text-brand-navy">{link.label}</span>
            <span className="text-[11px] text-text-muted">{link.meta}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export const OverviewMetricCard = memo(function OverviewMetricCard({ metric }: { metric: AgentStudioMetric }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <p className="text-[11px] uppercase tracking-wide text-text-muted">{metric.label}</p>
      <p className="mt-1 text-lg font-semibold text-brand-navy">{metric.value}</p>
      <p className="text-xs text-text-secondary">{metric.detail}</p>
    </article>
  );
});

export function AgentHealthBadge({ confidence, health }: { confidence: number; health: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
      <span className="rounded-full border border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] px-2 py-0.5 text-[var(--color-semantic-info-text)]">Confidence {confidence}%</span>
      <span className="rounded-full border border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-soft)] px-2 py-0.5 text-[var(--color-semantic-success-text)]">Health {health}%</span>
    </div>
  );
}

export function QuickActionBar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" size="sm">
        <Users size={14} />
        Collaborate
      </Button>
      <Button variant="secondary" size="sm">
        <Download size={14} />
        Export
      </Button>
      <Button variant="secondary" size="sm">
        <Command size={14} />
        Assign Workflow
      </Button>
    </div>
  );
}

export const AgentCard = memo(function AgentCard({
  agent,
  selected,
  onSelect,
}: {
  agent: AgentCardData;
  selected: boolean;
  onSelect: (agentId: string) => void;
}) {
  return (
    <motion.button
      type="button"
      variants={panelReveal}
      whileHover={{ y: -2 }}
      onClick={() => onSelect(agent.id)}
      className={cn(
        "w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition",
        selected ? "border-brand-primary bg-brand-subtle/30" : "border-border hover:border-brand-primary/35"
      )}
      aria-label={`Select ${agent.name}`}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Avatar name={agent.avatarSeed} className="h-9 w-9" />
          <div>
            <p className="text-sm font-semibold text-brand-navy">{agent.name}</p>
            <p className="text-xs text-text-secondary">{agent.role}</p>
          </div>
        </div>
        <Badge tone={statusTone(agent.status)} className="capitalize">
          {agent.status}
        </Badge>
      </div>

      <p className="mt-3 text-xs text-text-secondary">{agent.objective}</p>
      <p className="mt-2 text-[11px] text-text-muted">Team: {agent.team}</p>

      <div className="mt-3">
        <AgentHealthBadge confidence={agent.confidence} health={agent.health} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-brand-primary">
        <span className="inline-flex items-center gap-1">
          Open details
          <ArrowUpRight size={13} />
        </span>
      </div>
    </motion.button>
  );
});

export function AgentGrid({
  agents,
  selectedAgentId,
  onSelect,
}: {
  agents: AgentCardData[];
  selectedAgentId: string;
  onSelect: (agentId: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} selected={agent.id === selectedAgentId} onSelect={onSelect} />
      ))}
    </div>
  );
}

function PillList({
  title,
  items,
}: {
  title: string;
  items: AgentCapability[];
}) {
  return (
    <section className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item.id} className="rounded-full border border-border bg-surface-canvas px-2.5 py-1 text-[11px] text-text-secondary">
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}

export function CapabilityBadge({ label }: { label: string }) {
  return <span className="rounded-full border border-border bg-surface-canvas px-2.5 py-1 text-[11px] text-text-secondary">{label}</span>;
}

export function KnowledgeBadge({ label }: { label: string }) {
  return <span className="rounded-full border border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] px-2.5 py-1 text-[11px] text-[var(--color-semantic-info-text)]">{label}</span>;
}

export function MemoryBadge({ label }: { label: string }) {
  return <span className="rounded-full border border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-soft)] px-2.5 py-1 text-[11px] text-[var(--color-semantic-success-text)]">{label}</span>;
}

export function MCPConnectionCard({ tool }: { tool: MCPTool }) {
  return (
    <article className="flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2">
      <p className="text-sm font-medium text-brand-navy">{tool.name}</p>
      <span className={cn("h-2.5 w-2.5 rounded-full", tool.status === "connected" ? "bg-semantic-success" : "bg-semantic-warning")} />
    </article>
  );
}

export function AgentDetailsPanel({
  selectedAgent,
  capabilities,
  knowledge,
  memoryCollections,
  mcpTools,
  permissions,
  workflows,
  executionHistory,
  suggestedImprovements,
}: {
  selectedAgent: AgentCardData;
  capabilities: AgentCapability[];
  knowledge: AgentCapability[];
  memoryCollections: AgentCapability[];
  mcpTools: MCPTool[];
  permissions: AgentCapability[];
  workflows: AgentCapability[];
  executionHistory: AgentCapability[];
  suggestedImprovements: AgentCapability[];
}) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-brand-navy">Agent Details</h3>
            <p className="text-xs text-text-secondary">Selected: {selectedAgent.name}</p>
          </div>
          <AgentHealthBadge confidence={selectedAgent.confidence} health={selectedAgent.health} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <section className="rounded-xl border border-border bg-surface-canvas p-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Overview</h4>
          <p className="mt-2 text-sm text-text-secondary">{selectedAgent.objective}</p>
          <p className="mt-2 text-xs text-text-muted">Team: {selectedAgent.team}</p>
        </section>

        <PillList title="Capabilities" items={capabilities} />

        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Knowledge</h4>
          <div className="flex flex-wrap gap-1.5">
            {knowledge.map((item) => (
              <KnowledgeBadge key={item.id} label={item.label} />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Memory</h4>
          <div className="flex flex-wrap gap-1.5">
            {memoryCollections.map((item) => (
              <MemoryBadge key={item.id} label={item.label} />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Connected MCP Tools</h4>
          <div className="space-y-1.5">
            {mcpTools.map((tool) => (
              <MCPConnectionCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        <PillList title="Permissions" items={permissions} />
        <PillList title="Assigned Workflows" items={workflows} />
        <PillList title="Activity Timeline" items={executionHistory} />
        <PillList title="Execution History" items={executionHistory} />
        <PillList title="Suggested Improvements" items={suggestedImprovements} />
      </CardContent>
    </Card>
  );
}

export function CollaborationGraph({
  agents,
  links,
}: {
  agents: AgentCardData[];
  links: AgentCollaborationLink[];
}) {
  const nodeLookup = useMemo(() => {
    const map = new Map<string, AgentCardData>();
    agents.forEach((agent) => map.set(agent.name, agent));
    return map;
  }, [agents]);

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Agent Collaboration</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {links.map((link) => {
          const from = nodeLookup.get(link.from);
          const to = nodeLookup.get(link.to);
          return (
            <article key={link.id} className="rounded-xl border border-border bg-surface-canvas p-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-white p-1.5">
                  <Bot size={14} className="text-brand-primary" />
                </span>
                <div className="text-xs text-text-secondary">
                  <span className="font-semibold text-brand-navy">{from?.name || link.from}</span>
                  <span className={cn("mx-2 inline-block h-[2px] w-8 rounded-full bg-gradient-to-r", collaborationTone(link.type))} />
                  <span className="font-semibold text-brand-navy">{to?.name || link.to}</span>
                </div>
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">{link.type}</p>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function TemplatePanel({ templates }: { templates: AgentTemplate[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Templates</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {templates.map((template) => (
          <article key={template.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-sm font-semibold text-brand-navy">{template.name}</p>
            <p className="mt-1 text-xs text-text-secondary">{template.category}</p>
            <p className="mt-1 text-[11px] text-text-muted">{template.usageCount}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function RecentActivityFeed({ activities }: { activities: StudioActivity[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Recent Activity</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {activities.map((activity) => (
          <article key={activity.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-sm font-medium text-brand-navy">{activity.title}</p>
            <div className="mt-1 flex items-center justify-between text-[11px] text-text-muted">
              <span>{activity.actor}</span>
              <span>{activity.time}</span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function OrganizationSnapshot({ metrics }: { metrics: AgentStudioMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Organization Snapshot</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2">
        {metrics.slice(0, 4).map((metric) => (
          <OverviewMetricCard key={metric.id} metric={metric} />
        ))}
      </CardContent>
    </Card>
  );
}

export function RuntimeSummary({ metrics }: { metrics: AgentStudioMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Runtime Health</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {metrics.slice(4).map((metric) => (
          <article key={metric.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2.5">
            <p className="text-xs text-text-secondary">{metric.label}</p>
            <p className="text-sm font-semibold text-brand-navy">{metric.value}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function ConnectedSystemsPanel({ systems }: { systems: ConnectedSystem[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Connected Systems</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {systems.map((system) => (
          <article key={system.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <p className="text-sm font-medium text-brand-navy">{system.name}</p>
            <span className={cn("h-2.5 w-2.5 rounded-full", system.status === "online" ? "bg-semantic-success" : "bg-semantic-warning")} />
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function NotificationsPanel({ items }: { items: OrganizationNotification[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Notifications</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-start gap-2">
              <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", notificationTone(item.tone))} />
              <div>
                <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
                <p className="mt-1 text-xs text-text-secondary">{item.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function UpcomingEventsPanel({ events }: { events: UpcomingEvent[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Upcoming Events</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {events.map((event) => (
          <article key={event.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2.5">
            <div className="inline-flex items-center gap-2">
              <Clock4 size={13} className="text-text-muted" />
              <p className="text-sm font-medium text-brand-navy">{event.title}</p>
            </div>
            <p className="text-xs text-text-muted">{event.schedule}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function QuickInsightsPanel({ insights }: { insights: AgentCapability[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Quick Insights</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-sm text-text-secondary">{insight.label}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">{title}</h2>
        {subtitle ? <p className="mt-1 text-base font-semibold text-brand-navy">{subtitle}</p> : null}
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-subtle px-2.5 py-1 text-[11px] font-semibold text-brand-navy">
        <Activity size={12} />
        Live
      </span>
    </div>
  );
}

export function AgentStudioLeftRail({
  nav,
  categories,
  favorites,
  templates,
  teams,
  recent,
}: {
  nav: StudioSidebarLink[];
  categories: StudioSidebarLink[];
  favorites: StudioSidebarLink[];
  templates: StudioSidebarLink[];
  teams: StudioSidebarLink[];
  recent: StudioSidebarLink[];
}) {
  return (
    <motion.aside variants={panelReveal} initial="hidden" animate="show" className="space-y-3" aria-label="Agent Studio left sidebar">
      <SidebarSection title="AIOS Navigation" links={nav} />
      <SidebarSection title="Agent Categories" links={categories} />
      <SidebarSection title="Favorites" links={favorites} />
      <SidebarSection title="Templates" links={templates} />
      <SidebarSection title="Teams" links={teams} />
      <SidebarSection title="Recent Agents" links={recent} />
    </motion.aside>
  );
}

export function StudioRightRail({
  metrics,
  systems,
  notifications,
  events,
  quickInsights,
}: {
  metrics: AgentStudioMetric[];
  systems: ConnectedSystem[];
  notifications: OrganizationNotification[];
  events: UpcomingEvent[];
  quickInsights: AgentCapability[];
}) {
  return (
    <motion.aside variants={panelReveal} initial="hidden" animate="show" className="space-y-3" aria-label="Agent Studio right sidebar">
      <OrganizationSnapshot metrics={metrics} />
      <RuntimeSummary metrics={metrics} />
      <ConnectedSystemsPanel systems={systems} />
      <NotificationsPanel items={notifications} />
      <UpcomingEventsPanel events={events} />
      <QuickInsightsPanel insights={quickInsights} />

      <Card className="border-border bg-white">
        <CardHeader className="py-3">
          <h3 className="text-sm font-semibold text-brand-navy">MCP Status</h3>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <ShieldCheck size={14} />
              Federation health
            </span>
            <span className="text-sm font-semibold text-brand-navy">Stable</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <Bot size={14} />
              Runtime sync
            </span>
            <span className="text-sm font-semibold text-brand-navy">99.97%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-white">
        <CardHeader className="py-3">
          <h3 className="text-sm font-semibold text-brand-navy">Organization Confidence</h3>
        </CardHeader>
        <CardContent className="p-4">
          <div className="rounded-xl border border-border bg-surface-canvas p-3 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Confidence</p>
            <p className="mt-1 text-2xl font-semibold text-brand-navy">97%</p>
            <p className="text-xs text-text-secondary">Enterprise AI workforce trust level</p>
          </div>
        </CardContent>
      </Card>
    </motion.aside>
  );
}
