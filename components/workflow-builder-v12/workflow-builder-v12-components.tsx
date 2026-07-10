"use client";

import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  GitMerge,
  GitPullRequestArrow,
  Scale,
  Search,
  Shield,
  UserCheck,
  Workflow,
} from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import { cn } from "@/utils";
import type {
  ChipItem,
  RecommendationItem,
  SidebarLink,
  TimelineItem,
  ToolAction,
  WorkflowEdgeModel,
  WorkflowMetric,
  WorkflowNodeModel,
  WorkflowNodeType,
} from "./types";

function nodeIcon(type: WorkflowNodeType) {
  if (type === "ai-agent") return Bot;
  if (type === "human-approval") return UserCheck;
  if (type === "business-rule") return Scale;
  if (type === "decision") return GitPullRequestArrow;
  if (type === "merge") return GitMerge;
  if (type === "knowledge-lookup") return Search;
  if (type === "policy") return Shield;
  if (type === "report") return CheckCircle2;
  return Workflow;
}

function statusTone(status: WorkflowNodeModel["status"]): "success" | "warning" | "info" {
  if (status === "success") return "success";
  if (status === "attention") return "warning";
  return "info";
}

export function SidebarSection({ title, items }: { title: string; items: SidebarLink[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-1.5 p-3">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2 text-sm hover:border-brand-primary/30">
            <span className="font-medium text-brand-navy">{item.label}</span>
            <span className="text-[11px] text-text-muted">{item.meta}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export function WorkflowHeader({ actions }: { actions: ToolAction[] }) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">Workflow Builder</p>
            <h1 className="mt-1 text-2xl font-semibold text-brand-navy">AIOS Workflow Builder v1.2</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Design, simulate and orchestrate enterprise workflows powered by AI.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button key={action.id} variant={index === actions.length - 2 ? "primary" : "secondary"} size="sm">
                  <Icon size={14} />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <Input className="h-auto border-0 bg-transparent p-0 shadow-none" placeholder="Search workflows, nodes, templates" aria-label="Search workflows" />
        </label>
      </CardContent>
    </Card>
  );
}

export function WorkflowToolbar({ actions }: { actions: ToolAction[] }) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="flex flex-wrap items-center gap-2 p-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold",
                index === 6 ? "border-brand-primary bg-brand-subtle text-brand-navy" : "border-border bg-surface-canvas text-text-secondary"
              )}
            >
              <Icon size={13} />
              {action.label}
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

export const WorkflowNode = memo(function WorkflowNode({
  node,
  selected,
  onSelect,
}: {
  node: WorkflowNodeModel;
  selected: boolean;
  onSelect: (nodeId: string) => void;
}) {
  const Icon = nodeIcon(node.type);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      onClick={() => onSelect(node.id)}
      className={cn(
        "absolute w-44 rounded-xl border bg-white p-2.5 text-left shadow-sm",
        selected ? "border-brand-primary ring-2 ring-brand-primary/30" : "border-border"
      )}
      style={{ left: node.x, top: node.y }}
      aria-label={node.title}
    >
      <div className="flex items-start gap-2">
        <span className="rounded-md border border-border bg-surface-muted p-1.5 text-brand-navy">
          <Icon size={14} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-brand-navy">{node.title}</p>
          <p className="truncate text-[11px] text-text-muted">{node.type}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-[11px] text-text-secondary">{node.description}</p>
      <div className="mt-2 flex items-center justify-between">
        <Badge tone={statusTone(node.status)} className="capitalize">
          {node.status}
        </Badge>
        <span className="text-[10px] text-text-muted">{node.owner}</span>
      </div>
    </motion.button>
  );
});

export function WorkflowCanvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}: {
  nodes: WorkflowNodeModel[];
  edges: WorkflowEdgeModel[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
}) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Workflow Canvas</h3>
      </CardHeader>
      <CardContent className="p-3">
        <div className="relative h-[540px] overflow-auto rounded-xl border border-border bg-surface-canvas">
          <div className="relative h-[900px] w-[1700px] bg-[linear-gradient(to_right,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.16)_1px,transparent_1px)] bg-[size:24px_24px]">
            <svg className="absolute inset-0 h-full w-full" aria-label="workflow connections">
              {edges.map((edge) => {
                const from = nodeById.get(edge.from);
                const to = nodeById.get(edge.to);
                if (!from || !to) return null;
                const x1 = from.x + 176;
                const y1 = from.y + 42;
                const x2 = to.x;
                const y2 = to.y + 42;
                const cx = (x1 + x2) / 2;
                return (
                  <g key={edge.id}>
                    <path d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`} fill="none" stroke="rgba(28,130,242,0.55)" strokeWidth="2" />
                    {edge.label ? (
                      <text x={cx} y={(y1 + y2) / 2 - 4} textAnchor="middle" fontSize="10" fill="#4B5563">
                        {edge.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {nodes.map((node) => (
              <WorkflowNode key={node.id} node={node} selected={node.id === selectedNodeId} onSelect={onSelectNode} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricCard({ metric }: { metric: WorkflowMetric }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <p className="text-[11px] uppercase tracking-wide text-text-muted">{metric.label}</p>
      <p className="mt-1 text-lg font-semibold text-brand-navy">{metric.value}</p>
      <p className="text-xs text-text-secondary">{metric.detail}</p>
    </article>
  );
}

export function WorkflowAnalyticsCard({ metric }: { metric: WorkflowMetric }) {
  return <MetricCard metric={metric} />;
}

export function WorkflowIntelligenceCard({ metric }: { metric: WorkflowMetric }) {
  return <MetricCard metric={metric} />;
}

export function SimulationPanel({ items }: { items: WorkflowMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Simulation Mode</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <MetricCard key={item.id} metric={item} />
        ))}
      </CardContent>
    </Card>
  );
}

export function OptimizationPanel({ recommendations }: { recommendations: RecommendationItem[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">AI Optimization</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {recommendations.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{item.impact}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function OrganizationContext({ chips }: { chips: ChipItem[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Organization Context</h3>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5 p-4">
        {chips.map((chip) => (
          <span key={chip.id} className="rounded-full border border-border bg-surface-canvas px-2.5 py-1 text-[11px] text-text-secondary">
            {chip.label}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}

export function BusinessOutcomeCard({ metric }: { metric: WorkflowMetric }) {
  return <MetricCard metric={metric} />;
}

export function VersionTimeline({ entries }: { entries: TimelineItem[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Version Timeline</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-navy">{entry.title}</p>
              <span className="text-xs text-text-muted">{entry.time}</span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{entry.description}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function DecisionTimeline({ entries }: { entries: TimelineItem[] }) {
  return <VersionTimeline entries={entries} />;
}

export function ExecutionTimeline({ entries }: { entries: TimelineItem[] }) {
  return <VersionTimeline entries={entries} />;
}

export function WorkflowTemplateCard({ item }: { item: SidebarLink }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <p className="text-sm font-semibold text-brand-navy">{item.label}</p>
      <p className="mt-1 text-xs text-text-muted">{item.meta}</p>
    </article>
  );
}

export function InspectorPanel({
  selectedNode,
  decisionMetrics,
  inputs,
  outputs,
  permissions,
  knowledgeSources,
  memoryCollections,
  policies,
  runtimeSettings,
  connectedMcpTools,
  executionHistory,
  suggestedImprovements,
}: {
  selectedNode: WorkflowNodeModel;
  decisionMetrics: WorkflowMetric[];
  inputs: SidebarLink[];
  outputs: SidebarLink[];
  permissions: SidebarLink[];
  knowledgeSources: SidebarLink[];
  memoryCollections: SidebarLink[];
  policies: SidebarLink[];
  runtimeSettings: SidebarLink[];
  connectedMcpTools: SidebarLink[];
  executionHistory: TimelineItem[];
  suggestedImprovements: SidebarLink[];
}) {
  const sections: Array<{ title: string; items: SidebarLink[] }> = [
    { title: "Inputs", items: inputs },
    { title: "Outputs", items: outputs },
    { title: "Permissions", items: permissions },
    { title: "Knowledge Sources", items: knowledgeSources },
    { title: "Memory Collections", items: memoryCollections },
    { title: "Policies", items: policies },
    { title: "Runtime Settings", items: runtimeSettings },
    { title: "Connected MCP Tools", items: connectedMcpTools },
    { title: "Suggested Improvements", items: suggestedImprovements },
  ];

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Inspector Panel</h3>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <section className="rounded-xl border border-border bg-surface-canvas p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Overview</p>
          <p className="mt-1 text-sm font-semibold text-brand-navy">{selectedNode.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{selectedNode.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge tone={statusTone(selectedNode.status)}>{selectedNode.status}</Badge>
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-text-muted">Owner {selectedNode.owner}</span>
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-text-muted">Decision Intelligence</p>
          <div className="grid gap-2">
            {decisionMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        {sections.map((section) => (
          <section key={section.title} className="space-y-1.5">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{section.title}</p>
            {section.items.map((item) => (
              <article key={item.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2 text-xs">
                <span className="text-brand-navy">{item.label}</span>
                <span className="text-text-muted">{item.meta}</span>
              </article>
            ))}
          </section>
        ))}

        <section>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-text-muted">Execution History</p>
          <div className="space-y-1.5">
            {executionHistory.map((entry) => (
              <article key={entry.id} className="rounded-lg border border-border bg-surface-canvas p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-brand-navy">{entry.title}</p>
                  <span className="text-[11px] text-text-muted">{entry.time}</span>
                </div>
                <p className="mt-1 text-[11px] text-text-secondary">{entry.description}</p>
              </article>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
