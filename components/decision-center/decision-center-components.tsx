"use client";

import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  GitBranch,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from "@/components/ui";
import {
  ActionBar,
  ConfidenceBadge,
  EmptyState,
  HealthBadge,
  InfoCard,
  MetricCard,
  PageBreadcrumbs,
  StatusBadge,
  WorkspaceRightPanel,
  WorkspaceSidebar,
} from "@/components/workspace";
import { cn } from "@/utils";
import type { WorkspaceAction, WorkspaceBreadcrumb } from "@/components/workspace";
import type {
  ApprovalStep,
  DecisionFilter,
  DecisionGraphEdge,
  DecisionGraphNode,
  DecisionInsight,
  DecisionMetrics,
  DecisionRecord,
  DecisionRibbonItem,
  DecisionRoleView,
  DecisionScenario,
  DecisionSidebarSection,
  DecisionTimelineEvent,
  RoleIntelligenceItem,
} from "./types";

const cardMotion = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  },
};

function getTone(status: DecisionRecord["approvalStatus"]) {
  if (status === "approved" || status === "executed") return "success" as const;
  if (status === "rejected") return "critical" as const;
  if (status === "pending" || status === "review") return "warning" as const;
  return "running" as const;
}

function toneClass(tone: DecisionRibbonItem["tone"]) {
  if (tone === "success") return "bg-[var(--color-semantic-success-soft)] text-[var(--color-semantic-success-text)]";
  if (tone === "warning") return "bg-[var(--color-semantic-warning-soft)] text-[var(--color-semantic-warning-text)]";
  if (tone === "critical") return "bg-[var(--color-semantic-error-soft)] text-[var(--color-semantic-error-text)]";
  return "bg-slate-100 text-slate-700";
}

function nodeClass(type: DecisionGraphNode["type"]) {
  if (type === "decision") return "border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] text-sky-800";
  if (type === "risk") return "border-[var(--color-semantic-error)] bg-[var(--color-semantic-error-soft)] text-rose-800";
  if (type === "executive") return "border-indigo-400 bg-indigo-50 text-indigo-800";
  if (type === "policy") return "border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-soft)] text-emerald-800";
  return "border-slate-300 bg-white text-slate-700";
}

export function DecisionHeader({
  breadcrumbs,
  actions,
  searchValue,
  onSearch,
}: {
  breadcrumbs: WorkspaceBreadcrumb[];
  actions: WorkspaceAction[];
  searchValue: string;
  onSearch: (value: string) => void;
}) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <PageBreadcrumbs items={breadcrumbs} />
            <h1 className="mt-1 text-2xl font-semibold text-brand-navy">Decision Center</h1>
            <p className="mt-1 text-sm text-text-secondary">Enterprise AI Decision Intelligence</p>
          </div>
          <ActionBar>
            {actions.map((action) => (
              <Button key={action.id} variant={action.tone === "primary" ? "primary" : action.tone === "ghost" ? "ghost" : "secondary"} size="sm" onClick={action.onClick}>
                {action.icon}
                {action.label}
              </Button>
            ))}
          </ActionBar>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <Input value={searchValue} onChange={(event) => onSearch(event.target.value)} className="h-auto border-0 bg-transparent p-0 shadow-none" placeholder="Search decisions, evidence, risk, and impact" aria-label="Search decisions" />
        </label>
      </CardContent>
    </Card>
  );
}

export function DecisionLeftRail({ sections }: { sections: DecisionSidebarSection[] }) {
  return (
    <WorkspaceSidebar ariaLabel="Decision center left sidebar">
      {sections.map((section) => (
        <Card key={section.title} className="border-border bg-white">
          <CardHeader className="py-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{section.title}</h3>
          </CardHeader>
          <CardContent className="space-y-1.5 p-3">
            {section.items.map((item) => (
              <Link key={item.id} href={item.href} className="flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2 text-sm hover:border-brand-primary/35">
                <span className="font-medium text-brand-navy">{item.label}</span>
                <span className="text-[11px] text-text-muted">{item.meta}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      ))}
    </WorkspaceSidebar>
  );
}

export function DecisionKpiStrip({ metrics }: { metrics: DecisionMetrics }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}

export function DecisionIntelligenceRibbon({ items }: { items: DecisionRibbonItem[] }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const liveItems = useMemo(() => {
    return items.map((item, index) => {
      if (index > 3) return item;
      const base = Number.parseInt(item.value.replace(/[^0-9-]/g, ""), 10);
      if (Number.isNaN(base)) return item;
      const delta = tick % 2 === 0 ? 1 : -1;
      const adjusted = Math.max(base + delta, 0);
      const prefix = item.value.includes("$") ? "$" : "";
      const suffix = item.value.includes("%") ? "%" : "";
      return {
        ...item,
        value: `${prefix}${adjusted}${suffix}`,
      };
    });
  }, [items, tick]);

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Decision Intelligence Ribbon</h3>
            <p className="text-xs text-text-secondary">Live executive intelligence stream</p>
          </div>
          <StatusBadge label="Live updates" tone="running" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {liveItems.map((item, index) => (
          <motion.article key={item.id} variants={cardMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-brand-navy">{item.value}</p>
              </div>
              {index === 0 ? <BrainCircuit className="h-4 w-4 text-brand-primary" /> : index === 1 ? <AlertTriangle className="h-4 w-4 text-brand-primary" /> : index === 2 ? <Bot className="h-4 w-4 text-brand-primary" /> : index === 3 ? <CheckCircle2 className="h-4 w-4 text-brand-primary" /> : index === 4 ? <ShieldCheck className="h-4 w-4 text-brand-primary" /> : index === 5 ? <Sparkles className="h-4 w-4 text-brand-primary" /> : index === 6 ? <CircleDollarSign className="h-4 w-4 text-brand-primary" /> : <Clock3 className="h-4 w-4 text-brand-primary" />}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", toneClass(item.tone))}>{item.status}</span>
              <span className={cn("text-xs font-medium", item.trend.startsWith("-") ? "text-rose-600" : "text-emerald-600")}>{item.trend}</span>
            </div>
          </motion.article>
        ))}
      </CardContent>
    </Card>
  );
}

export function DecisionFilterBar({ filters }: { filters: DecisionFilter[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Badge key={filter.id} tone="info" className="border border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] text-[var(--color-semantic-info-text)]">
          {filter.label}
        </Badge>
      ))}
    </div>
  );
}

export function DecisionConfidenceMatrix({ decision }: { decision: DecisionRecord }) {
  const metrics = [
    { label: "Confidence", value: `${decision.confidence}%` },
    { label: "Business Impact", value: decision.businessImpact },
    { label: "Financial Impact", value: decision.financialImpact },
    { label: "Risk Level", value: decision.risk },
    { label: "Strategic Alignment", value: `${decision.strategicAlignment}%` },
    { label: "Time Sensitivity", value: `${decision.timeSensitivity}%` },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-xl border border-border bg-surface-canvas p-2.5">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">{metric.label}</p>
          <p className="mt-1 text-xs font-semibold text-brand-navy">{metric.value}</p>
        </article>
      ))}
    </div>
  );
}

export function DecisionCard({ decision, selected, onSelect }: { decision: DecisionRecord; selected: boolean; onSelect: (id: string) => void }) {
  return (
    <motion.article variants={cardMotion} className={cn("rounded-2xl border bg-white p-4 shadow-sm", selected ? "border-brand-primary bg-brand-subtle/20" : "border-border")}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{decision.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{decision.executiveSummary}</p>
        </div>
        <StatusBadge label={decision.approvalStatus} tone={getTone(decision.approvalStatus)} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConfidenceBadge label={`Confidence ${decision.confidence}%`} />
        <HealthBadge label={`ROI ${decision.estimatedROI}`} />
        <Badge tone="default">{decision.category}</Badge>
      </div>

      <div className="mt-3 grid gap-1.5 text-[11px] text-text-muted sm:grid-cols-2">
        <span>Risk: {decision.risk}</span>
        <span>Urgency: {decision.urgency}</span>
        <span>Strategic Alignment: {decision.strategicAlignment}%</span>
        <span>Time Sensitivity: {decision.timeSensitivity}%</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {decision.affectedDepartments.map((dept) => (
          <span key={dept} className="rounded-full border border-border bg-surface-canvas px-2 py-0.5 text-[11px] text-text-secondary">{dept}</span>
        ))}
      </div>

      <div className="mt-3 space-y-2 text-xs text-text-secondary">
        <p><span className="font-semibold text-brand-navy">Recommendation:</span> {decision.recommendation}</p>
        <p><span className="font-semibold text-brand-navy">Linked Memory:</span> {decision.linkedMemory.join(", ")}</p>
        <p><span className="font-semibold text-brand-navy">Linked Knowledge:</span> {decision.linkedKnowledge.join(", ")}</p>
        <p><span className="font-semibold text-brand-navy">Linked Workflow:</span> {decision.linkedWorkflow.join(", ")}</p>
        <p><span className="font-semibold text-brand-navy">Linked Agent:</span> {decision.linkedAgent.join(", ")}</p>
      </div>

      <div className="mt-3">
        <DecisionConfidenceMatrix decision={decision} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="primary">Approve</Button>
        <Button size="sm" variant="secondary">Reject</Button>
        <Button size="sm" variant="secondary">Review</Button>
        <Button size="sm" variant="ghost" onClick={() => onSelect(decision.id)}>
          Open Details
        </Button>
      </div>
    </motion.article>
  );
}

export const DecisionExplorer = memo(function DecisionExplorer({ decisions, selectedId, onSelect, filters }: { decisions: DecisionRecord[]; selectedId: string; onSelect: (id: string) => void; filters: DecisionFilter[]; }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Decision Cards</h3>
            <p className="text-xs text-text-secondary">AI recommendations ready for executive review</p>
          </div>
          <span className="text-xs text-text-muted">{decisions.length} decisions</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <DecisionFilterBar filters={filters} />
        <div className="max-h-[860px] space-y-3 overflow-y-auto pr-1">
          {decisions.length > 0 ? (
            decisions.map((decision) => <DecisionCard key={decision.id} decision={decision} selected={decision.id === selectedId} onSelect={onSelect} />)
          ) : (
            <EmptyState title="No Decisions" description="No matching decisions found for the current filter and search." />
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export function RecommendationCards({ decisions }: { decisions: DecisionRecord[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Recommendation Cards</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {decisions.slice(0, 3).map((decision) => (
          <article key={decision.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-sm font-semibold text-brand-navy">{decision.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{decision.aiRecommendation}</p>
            <p className="mt-2 text-[11px] text-text-muted">Impact: {decision.financialImpact}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function DecisionGraph({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}: {
  nodes: DecisionGraphNode[];
  edges: DecisionGraphEdge[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}) {
  const nodeLookup = new Map(nodes.map((node) => [node.id, node]));

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Decision Graph</h3>
            <p className="text-xs text-text-secondary">Memory, knowledge, workflows, agents, and risk context</p>
          </div>
          <Badge tone="info">Interactive</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative h-[520px] overflow-hidden rounded-2xl border border-border bg-[radial-gradient(circle_at_top_left,rgba(28,130,242,0.12),transparent_40%),linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)]">
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            {edges.map((edge) => {
              const from = nodeLookup.get(edge.from);
              const to = nodeLookup.get(edge.to);
              if (!from || !to) return null;

              const highlighted = selectedNodeId === edge.from || selectedNodeId === edge.to;
              const midpoint = (from.x + to.x) / 2;

              return (
                <g key={edge.id}>
                  <motion.path
                    d={`M ${from.x} ${from.y} C ${midpoint} ${from.y}, ${midpoint} ${to.y}, ${to.x} ${to.y}`}
                    fill="none"
                    stroke={highlighted ? "#1c82f2" : "#cbd5e1"}
                    strokeWidth={highlighted ? 2.5 : 1.4}
                    strokeDasharray={edge.animated ? "7 6" : undefined}
                    initial={{ opacity: 0.4, pathLength: 0.2 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.7 }}
                  />
                  <text x={midpoint} y={(from.y + to.y) / 2 - 5} textAnchor="middle" fontSize="10" fill="#64748b">{edge.label}</text>
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => {
            const active = node.id === selectedNodeId;
            return (
              <motion.button
                key={node.id}
                type="button"
                onClick={() => onSelectNode(node.id)}
                className={cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-center shadow-sm backdrop-blur", nodeClass(node.type), active ? "ring-2 ring-brand-primary" : "")}
                style={{ left: node.x, top: node.y, minWidth: node.radius * 3.2 }}
                whileHover={{ y: -2 }}
                aria-label={`Select ${node.label}`}
              >
                <span className="block text-[11px] font-semibold">{node.label}</span>
                <span className="mt-1 block text-[10px] capitalize opacity-80">{node.type}</span>
              </motion.button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function ApprovalFlowPanel({ steps }: { steps: ApprovalStep[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Approval Flow</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {steps.map((step) => (
          <article key={step.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <div>
              <p className="text-xs font-semibold text-brand-navy">{step.label}</p>
              <p className="text-[11px] text-text-secondary">{step.owner}</p>
            </div>
            <StatusBadge label={step.status} tone={step.status === "completed" ? "success" : step.status === "in-progress" ? "running" : "paused"} />
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function AIReasoningPanel({ decision }: { decision: DecisionRecord }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">AI Reasoning Panel</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 xl:grid-cols-2">
        <InfoCard title="Why AI recommends this" detail={decision.reasoning} />
        <InfoCard title="Confidence" detail={`${decision.confidence}% confidence with ${decision.risk} risk profile`} />

        <article className="rounded-xl border border-border bg-surface-canvas p-3">
          <p className="text-sm font-semibold text-brand-navy">Evidence</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {decision.supportingEvidence.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-surface-canvas p-3">
          <p className="text-sm font-semibold text-brand-navy">Signals</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {decision.signals.map((item) => (
              <Badge key={item} tone="default">{item}</Badge>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-surface-canvas p-3">
          <p className="text-sm font-semibold text-brand-navy">Dependencies</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {decision.dependencies.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-surface-canvas p-3">
          <p className="text-sm font-semibold text-brand-navy">Tradeoffs</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {decision.tradeoffs.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-surface-canvas p-3 xl:col-span-2">
          <p className="text-sm font-semibold text-brand-navy">Alternative Options</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {decision.alternatives.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>
      </CardContent>
    </Card>
  );
}

export function DecisionSimulator({ scenarios }: { scenarios: DecisionScenario[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Decision Simulator</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-5">
        {scenarios.map((scenario) => (
          <article key={scenario.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-sm font-semibold text-brand-navy">{scenario.label}</p>
            <div className="mt-2 space-y-1 text-[11px] text-text-secondary">
              <p>Revenue: {scenario.revenue}</p>
              <p>Cost: {scenario.cost}</p>
              <p>Risk: {scenario.risk}</p>
              <p>Customer Satisfaction: {scenario.customerSatisfaction}</p>
              <p>Operational Efficiency: {scenario.operationalEfficiency}</p>
              <p>Strategic Alignment: {scenario.strategicAlignment}</p>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function BusinessImpactPanel({ metrics }: { metrics: DecisionMetrics }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Business Impact</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </CardContent>
    </Card>
  );
}

export function ExecutiveTimeline({ events }: { events: DecisionTimelineEvent[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Executive Timeline</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {events.map((event) => (
          <motion.article key={event.id} variants={cardMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold capitalize text-brand-navy">{event.stage}</p>
              <span className="text-xs text-text-muted">{new Date(event.timestamp).toLocaleString()}</span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{event.title}</p>
            <p className="mt-1 text-[11px] text-text-muted">{event.detail}</p>
          </motion.article>
        ))}
      </CardContent>
    </Card>
  );
}

export function AIInsightsPanel({ insights }: { insights: DecisionInsight[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">AI Insights</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-brand-navy">{insight.title}</p>
              <Badge tone="info">{insight.confidence}%</Badge>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{insight.detail}</p>
            <p className="mt-1 text-[11px] text-text-muted">Impact: {insight.impact}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function RoleBasedIntelligence({
  activeRole,
  roles,
  roleIntelligence,
  onRoleChange,
}: {
  activeRole: DecisionRoleView;
  roles: DecisionRoleView[];
  roleIntelligence: RoleIntelligenceItem[];
  onRoleChange: (role: DecisionRoleView) => void;
}) {
  const current = roleIntelligence.find((item) => item.role === activeRole) ?? roleIntelligence[0];

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-brand-navy">Role-Based Intelligence</h3>
          <Badge tone="default">Dynamic layout ready</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Role-based intelligence tabs">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              role="tab"
              aria-selected={role === activeRole}
              onClick={() => onRoleChange(role)}
              className={cn("rounded-full border px-2.5 py-1 text-xs font-medium", role === activeRole ? "border-brand-primary bg-brand-subtle text-brand-navy" : "border-border bg-surface-canvas text-text-secondary")}
            >
              {role}
            </button>
          ))}
        </div>

        <article className="rounded-xl border border-border bg-surface-canvas p-3">
          <p className="text-sm font-semibold text-brand-navy">{current.role} Priorities</p>
          <div className="mt-2 space-y-1 text-xs text-text-secondary">
            {current.priorities.map((priority) => (
              <p key={priority}>{priority}</p>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-surface-canvas p-3">
          <p className="text-sm font-semibold text-brand-navy">Focus Metrics</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {current.focusMetrics.map((metric) => (
              <Badge key={metric} tone="default">{metric}</Badge>
            ))}
          </div>
        </article>
      </CardContent>
    </Card>
  );
}

export function DecisionInspector({ decision, approvalSteps }: { decision: DecisionRecord; approvalSteps: ApprovalStep[] }) {
  return (
    <WorkspaceRightPanel ariaLabel="Decision inspector">
      <Card className="border-border bg-white">
        <CardHeader className="py-3">
          <h3 className="text-sm font-semibold text-brand-navy">Selected Decision</h3>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <section className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Executive Summary</p>
            <p className="mt-1 text-sm font-semibold text-brand-navy">{decision.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{decision.executiveSummary}</p>
          </section>

          <InfoCard title="AI Recommendation" detail={decision.aiRecommendation} />
          <InfoCard title="Reasoning" detail={decision.reasoning} />
          <InfoCard title="Supporting Evidence" detail={decision.supportingEvidence.join(" | ")} />
          <InfoCard title="Confidence" detail={`${decision.confidence}%`} />
          <InfoCard title="Business Impact" detail={decision.businessImpact} />
          <InfoCard title="Financial Impact" detail={decision.financialImpact} />
          <InfoCard title="Risk Analysis" detail={decision.risk} />
          <InfoCard title="Compliance" detail={decision.compliance} />
          <InfoCard title="Dependencies" detail={decision.dependencies.join(", ")} />
          <InfoCard title="Stakeholders" detail={decision.stakeholders.join(", ")} />

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Approval Flow</p>
            <div className="space-y-2">
              {approvalSteps.map((step) => (
                <article key={step.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs">
                  <span className="text-brand-navy">{step.label}</span>
                  <StatusBadge label={step.status} tone={step.status === "completed" ? "success" : step.status === "in-progress" ? "running" : "paused"} />
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Linked Memory</p>
            {decision.linkedMemory.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Linked Knowledge</p>
            {decision.linkedKnowledge.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Linked Workflows</p>
            {decision.linkedWorkflow.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Linked Agents</p>
            {decision.linkedAgent.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
          </section>
        </CardContent>
      </Card>
    </WorkspaceRightPanel>
  );
}

export function DecisionSummaryStrip({ decision }: { decision: DecisionRecord }) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Owner" detail={decision.stakeholders[0] ?? "Executive"} />
        <InfoCard title="Category" detail={decision.category} />
        <InfoCard title="Approval Status" detail={decision.approvalStatus} />
        <InfoCard title="Estimated ROI" detail={decision.estimatedROI} />
      </CardContent>
    </Card>
  );
}

export function DecisionSectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">{title}</h2>
        <p className="mt-1 text-lg font-semibold text-brand-navy">{subtitle}</p>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-subtle px-2.5 py-1 text-[11px] font-semibold text-brand-navy">
        <GitBranch size={12} />
        AIOS
      </span>
    </div>
  );
}

export function DecisionGraphMeta() {
  return (
    <div className="flex flex-wrap gap-1.5 text-[11px] text-text-muted">
      <span className="rounded border border-border px-2 py-1"><Network className="mr-1 inline h-3 w-3" />Animated connections</span>
      <span className="rounded border border-border px-2 py-1"><Sparkles className="mr-1 inline h-3 w-3" />Soft glow</span>
      <span className="rounded border border-border px-2 py-1"><BrainCircuit className="mr-1 inline h-3 w-3" />AI context linked</span>
    </div>
  );
}
