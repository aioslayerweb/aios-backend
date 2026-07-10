"use client";

import Link from "next/link";
import { lazy, memo, Suspense, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  CircleAlert,
  Gauge,
  Goal,
  Search,
  Sparkles,
  WandSparkles,
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
  IntelligenceAnomaly,
  IntelligenceCardRecord,
  IntelligenceExecutiveBrief,
  IntelligenceGraphEdge,
  IntelligenceGraphNode,
  IntelligenceInsight,
  IntelligenceKpi,
  IntelligenceRecommendation,
  IntelligenceRibbonItem,
  IntelligenceRole,
  IntelligenceRoleView,
  IntelligenceScenario,
  IntelligenceSignal,
  IntelligenceTimelineEvent,
  IntelligenceWorkspaceSection,
} from "./types";

const LazyGraphCanvas = lazy(async () => ({ default: IntelligenceGraphCanvas }));

const fadeMotion = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  },
};

function nodeClass(type: IntelligenceGraphNode["type"]) {
  if (type === "revenue") return "border-emerald-400 bg-emerald-50 text-emerald-800";
  if (type === "risk") return "border-rose-400 bg-rose-50 text-rose-800";
  if (type === "goal") return "border-indigo-400 bg-indigo-50 text-indigo-800";
  if (type === "mcp") return "border-cyan-400 bg-cyan-50 text-cyan-800";
  return "border-slate-300 bg-white text-slate-700";
}

export function IntelligenceHeader({
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
            <h1 className="mt-1 text-2xl font-semibold text-brand-navy">Intelligence Center</h1>
            <p className="mt-1 text-sm text-text-secondary">Enterprise AI Intelligence Engine</p>
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
          <Input value={searchValue} onChange={(event) => onSearch(event.target.value)} className="h-auto border-0 bg-transparent p-0 shadow-none" placeholder="Search intelligence, signals, recommendations, and scenarios" aria-label="Search intelligence" />
        </label>
      </CardContent>
    </Card>
  );
}

export function IntelligenceLeftRail({ sections }: { sections: IntelligenceWorkspaceSection[] }) {
  return (
    <WorkspaceSidebar ariaLabel="Intelligence center left sidebar">
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

export function IntelligenceKpiStrip({ metrics }: { metrics: IntelligenceKpi[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <motion.div key={metric.id} variants={fadeMotion} initial="hidden" animate="show">
          <MetricCard metric={metric} />
        </motion.div>
      ))}
    </div>
  );
}

export function IntelligenceRibbon({ items }: { items: IntelligenceRibbonItem[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Executive Intelligence Ribbon</h3>
            <p className="text-xs text-text-secondary">Animated enterprise intelligence updates</p>
          </div>
          <StatusBadge label="Live intelligence" tone="running" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <motion.article key={item.id} variants={fadeMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-brand-navy">{item.value}</p>
              </div>
              {index === 0 ? <CircleAlert className="h-4 w-4 text-brand-primary" /> : index === 1 ? <WandSparkles className="h-4 w-4 text-brand-primary" /> : index === 2 ? <Gauge className="h-4 w-4 text-brand-primary" /> : index === 3 ? <Bell className="h-4 w-4 text-brand-primary" /> : index === 4 ? <Goal className="h-4 w-4 text-brand-primary" /> : index === 5 ? <Sparkles className="h-4 w-4 text-brand-primary" /> : <CheckCircle2 className="h-4 w-4 text-brand-primary" />}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-xs text-text-secondary">
              <span>{item.status}</span>
              <span className={cn(item.trend.startsWith("-") ? "text-rose-600" : "text-emerald-600")}>{item.trend}</span>
            </div>
          </motion.article>
        ))}
      </CardContent>
    </Card>
  );
}

export function IntelligenceSignalRail({ signals }: { signals: IntelligenceSignal[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Intelligence Signals</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {signals.map((signal) => (
          <article key={signal.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{signal.label}</p>
                <p className="mt-1 text-xs text-text-secondary">{signal.detail}</p>
              </div>
              <Badge tone="info">{signal.value}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-text-muted">
              <span>Source: {signal.source}</span>
              <span className={cn(signal.trend.startsWith("-") ? "text-rose-600" : "text-emerald-600")}>{signal.trend}</span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function IntelligenceCard({ record, selected, onSelect }: { record: IntelligenceCardRecord; selected: boolean; onSelect: (id: string) => void }) {
  const actionButtons = ["Expand", "Pin", "Export", "Bookmark", "Share"];

  return (
    <motion.article variants={fadeMotion} className={cn("rounded-2xl border bg-white p-4 shadow-sm", selected ? "border-brand-primary bg-brand-subtle/20" : "border-border")}> 
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{record.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{record.executiveSummary}</p>
        </div>
        <StatusBadge label={record.status} tone={record.status === "validated" ? "success" : record.status === "recommended" ? "running" : "paused"} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConfidenceBadge label={`Confidence ${record.confidence}%`} />
        <HealthBadge label={`Priority ${record.priority}`} />
        <Badge tone="default">{record.sourceChips[0]}</Badge>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <InfoCard title="AI Analysis" detail={record.aiAnalysis} />
        <InfoCard title="Business Impact" detail={record.businessImpact} />
      </div>

      <div className="mt-3 grid gap-1.5 text-[11px] text-text-muted sm:grid-cols-2 xl:grid-cols-3">
        <span>Predicted Outcome: {record.predictedOutcome}</span>
        <span>Recommended Action: {record.recommendedAction}</span>
        <span>Source tooltip: {record.sourceTooltip}</span>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Supporting Evidence</p>
        <div className="space-y-1.5">
          {record.supportingEvidence.map((item) => (
            <div key={item} className="rounded-lg border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {record.sourceChips.map((chip) => (
          <span key={chip} title={record.sourceTooltip} className="rounded-full border border-border bg-surface-canvas px-2 py-0.5 text-[11px] text-text-secondary">
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {actionButtons.map((action) => (
          <Button key={action} size="sm" variant={action === "Expand" ? "primary" : "secondary"} onClick={() => onSelect(record.id)}>
            {action}
          </Button>
        ))}
      </div>
    </motion.article>
  );
}

export const IntelligenceExplorer = memo(function IntelligenceExplorer({
  records,
  selectedId,
  onSelect,
  signals,
}: {
  records: IntelligenceCardRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
  signals: IntelligenceSignal[];
}) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Intelligence Cards</h3>
            <p className="text-xs text-text-secondary">Premium enterprise reasoning cards</p>
          </div>
          <span className="text-xs text-text-muted">{records.length} items</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          {signals.slice(0, 4).map((signal) => (
            <Badge key={signal.id} tone="info" className="border border-sky-200 bg-sky-50 text-sky-700">
              {signal.source}
            </Badge>
          ))}
        </div>
        <div className="max-h-[880px] space-y-3 overflow-y-auto pr-1">
          {records.length > 0 ? (
            records.map((record) => <IntelligenceCard key={record.id} record={record} selected={record.id === selectedId} onSelect={onSelect} />)
          ) : (
            <EmptyState title="No Intelligence" description="No matching intelligence records were found for the active query." />
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export function IntelligenceGraph({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}: {
  nodes: IntelligenceGraphNode[];
  edges: IntelligenceGraphEdge[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Predictive Intelligence Graph</h3>
            <p className="text-xs text-text-secondary">Relationships between departments, agents, knowledge, memory, MCP, and executive goals</p>
          </div>
          <Badge tone="info">Live topology</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Suspense fallback={<div className="rounded-2xl border border-border bg-surface-canvas p-4 text-sm text-text-muted">Loading intelligence graph...</div>}>
          <LazyGraphCanvas nodes={nodes} edges={edges} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

function IntelligenceGraphCanvas({ nodes, edges, selectedNodeId, onSelectNode }: { nodes: IntelligenceGraphNode[]; edges: IntelligenceGraphEdge[]; selectedNodeId: string; onSelectNode: (id: string) => void }) {
  const reduceMotion = useReducedMotion();
  const nodeLookup = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  return (
    <div className="relative h-[560px] overflow-hidden rounded-[24px] border border-slate-100 bg-[radial-gradient(circle_at_top_left,rgba(28,130,242,0.12),transparent_38%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {edges.map((edge, index) => {
          const from = nodeLookup.get(edge.from);
          const to = nodeLookup.get(edge.to);
          if (!from || !to) return null;

          const x1 = from.x + from.radius;
          const y1 = from.y + from.radius;
          const x2 = to.x;
          const y2 = to.y + to.radius;
          const midpoint = (x1 + x2) / 2;
          const highlighted = selectedNodeId === edge.from || selectedNodeId === edge.to;

          return (
            <g key={edge.id}>
              <motion.path
                d={`M ${x1} ${y1} C ${midpoint} ${y1}, ${midpoint} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={highlighted ? "#1c82f2" : "#cbd5e1"}
                strokeWidth={highlighted ? 2.8 : 1.4}
                strokeDasharray={edge.animated ? "8 6" : undefined}
                initial={reduceMotion ? false : { opacity: 0.3, pathLength: 0.1 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 0.8, delay: index * 0.02 }}
              />
              <text x={midpoint} y={(y1 + y2) / 2 - 4} textAnchor="middle" fontSize="10" fill="#64748b">
                {edge.label}
              </text>
            </g>
          );
        })}
      </svg>

      {nodes.map((node, index) => {
        const active = node.id === selectedNodeId;
        return (
          <motion.button
            key={node.id}
            type="button"
            onClick={() => onSelectNode(node.id)}
            className={cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-center shadow-sm backdrop-blur", nodeClass(node.type), active ? "ring-2 ring-brand-primary" : "")}
            style={{ left: node.x, top: node.y, minWidth: node.radius * 3.4 }}
            initial={reduceMotion ? false : { opacity: 0.85, scale: 0.96 }}
            animate={{ opacity: active ? 1 : 0.8, scale: active ? 1.04 : 1 }}
            transition={{ duration: 0.2, delay: index * 0.01 }}
            aria-label={`Select ${node.label}`}
          >
            <span className="block text-[11px] font-semibold">{node.label}</span>
            <span className="mt-1 block text-[10px] opacity-80">{node.detail}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export function ExecutiveBriefingPanel({ brief }: { brief: IntelligenceExecutiveBrief }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Executive Briefing Panel</h3>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <InfoCard title="Today's Summary" detail={brief.todaySummary} />
        <InfoCard title="Forecast" detail={brief.forecast} />
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Weekly Trends</p>
          <div className="space-y-2">
            {brief.weeklyTrends.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
          </div>
        </section>
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Top Opportunities</p>
          <div className="space-y-2">
            {brief.topOpportunities.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
          </div>
        </section>
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Strategic Risks</p>
          <div className="space-y-2">
            {brief.strategicRisks.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
          </div>
        </section>
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Priority Actions</p>
          <div className="space-y-2">
            {brief.priorityActions.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
          </div>
        </section>
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Recommended Decisions</p>
          <div className="space-y-2">
            {brief.recommendedDecisions.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export function IntelligenceTimeline({ events }: { events: IntelligenceTimelineEvent[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Enterprise Intelligence Timeline</h3>
      </CardHeader>
      <CardContent className="overflow-x-auto p-4">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-6 gap-3">
            {events.map((event, index) => (
              <motion.article key={event.id} variants={fadeMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
                <p className="text-[11px] uppercase tracking-wide text-text-muted">{event.stage}</p>
                <p className="mt-1 text-sm font-semibold text-brand-navy">{event.businessArea}</p>
                <p className="mt-1 text-xs text-text-secondary">{event.detail}</p>
                <p className="mt-2 text-[11px] text-text-muted">{new Date(event.timestamp).toLocaleString()}</p>
                <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-text-muted">
                  <span>Confidence</span>
                  <span>{event.confidence}%</span>
                </div>
                {index < events.length - 1 ? <div className="mt-3 h-px bg-slate-200" /> : null}
              </motion.article>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BusinessInsightsPanel({ insights }: { insights: IntelligenceInsight[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Business Insights</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-brand-navy">{insight.title}</p>
              <Badge tone="info">{insight.confidence}%</Badge>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{insight.detail}</p>
            <p className="mt-2 text-[11px] text-text-muted">Impact: {insight.impact}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function RecommendationEngine({ recommendations, onAction }: { recommendations: IntelligenceRecommendation[]; onAction: (id: string) => void }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">AI Recommendation Engine</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {recommendations.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{item.recommendation}</p>
                <p className="mt-1 text-xs text-text-secondary">{item.reasoning}</p>
              </div>
              <Badge tone="info">{item.confidence}%</Badge>
            </div>
            <div className="mt-2 grid gap-1.5 text-[11px] text-text-muted sm:grid-cols-2">
              <span>Expected ROI: {item.expectedROI}</span>
              <span>Implementation: {item.implementationEffort}</span>
              <span>Priority: {item.priority}</span>
              <span>Sources: {item.sourceChips.join(", ")}</span>
            </div>
            <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
              {item.evidence.map((evidence) => <p key={evidence}>{evidence}</p>)}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="primary" onClick={() => onAction(item.id)}>Approve</Button>
              <Button size="sm" variant="secondary" onClick={() => onAction(item.id)}>Delegate</Button>
              <Button size="sm" variant="secondary" onClick={() => onAction(item.id)}>Create Workflow</Button>
              <Button size="sm" variant="ghost" onClick={() => onAction(item.id)}>Schedule</Button>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function ScenarioAnalysisPanel({ scenarios }: { scenarios: IntelligenceScenario[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Scenario Analysis</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-5">
        {scenarios.map((scenario) => (
          <article key={scenario.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-sm font-semibold text-brand-navy">{scenario.label}</p>
            <div className="mt-2 space-y-1 text-[11px] text-text-secondary">
              <p>Revenue: {scenario.revenue}</p>
              <p>Profit: {scenario.profit}</p>
              <p>Growth: {scenario.growth}</p>
              <p>Risk: {scenario.risk}</p>
              <p>Customer Satisfaction: {scenario.customerSatisfaction}</p>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function AnomalyDetectionPanel({ anomalies }: { anomalies: IntelligenceAnomaly[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Anomaly Detection</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {anomalies.map((anomaly) => (
          <article key={anomaly.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{anomaly.title}</p>
                <p className="mt-1 text-xs text-text-secondary">{anomaly.detail}</p>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", anomaly.severity === "critical" ? "bg-rose-50 text-rose-700" : anomaly.severity === "high" ? "bg-amber-50 text-amber-700" : anomaly.severity === "medium" ? "bg-sky-50 text-sky-700" : "bg-slate-100 text-slate-700")}>
                {anomaly.severity}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-text-muted">
              <span>{anomaly.category}</span>
              <span>{new Date(anomaly.timestamp).toLocaleTimeString()}</span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function IntelligenceInspector({ brief }: { brief: IntelligenceExecutiveBrief }) {
  return (
    <WorkspaceRightPanel ariaLabel="Intelligence inspector">
      <Card className="border-border bg-white">
        <CardHeader className="py-3">
          <h3 className="text-sm font-semibold text-brand-navy">Executive Briefing</h3>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <ExecutiveBriefingPanel brief={brief} />
          <InfoCard title="Today's Summary" detail={brief.todaySummary} />
          <InfoCard title="Forecast" detail={brief.forecast} />
          <InfoCard title="Weekly Trends" detail={brief.weeklyTrends.join(" • ")} />
          <InfoCard title="Top Opportunities" detail={brief.topOpportunities.join(" • ")} />
          <InfoCard title="Strategic Risks" detail={brief.strategicRisks.join(" • ")} />
          <InfoCard title="Priority Actions" detail={brief.priorityActions.join(" • ")} />
          <InfoCard title="Recommended Decisions" detail={brief.recommendedDecisions.join(" • ")} />
        </CardContent>
      </Card>
    </WorkspaceRightPanel>
  );
}

export function RoleIntelligencePanel({
  activeRole,
  roles,
  roleViews,
  onRoleChange,
}: {
  activeRole: IntelligenceRole;
  roles: IntelligenceRole[];
  roleViews: IntelligenceRoleView[];
  onRoleChange: (role: IntelligenceRole) => void;
}) {
  const current = roleViews.find((view) => view.role === activeRole) ?? roleViews[0];

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-brand-navy">Role-Based Intelligence</h3>
          <Badge tone="info">Dynamic layout</Badge>
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
          <p className="text-sm font-semibold text-brand-navy">{current.role}</p>
          <p className="mt-1 text-xs text-text-secondary">{current.headline}</p>
        </article>
        <article className="rounded-xl border border-border bg-surface-canvas p-3">
          <p className="text-sm font-semibold text-brand-navy">Priorities</p>
          <div className="mt-2 space-y-1 text-xs text-text-secondary">
            {current.priorities.map((priority) => <p key={priority}>{priority}</p>)}
          </div>
        </article>
        <article className="rounded-xl border border-border bg-surface-canvas p-3">
          <p className="text-sm font-semibold text-brand-navy">Focus Areas</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {current.focusAreas.map((item) => <Badge key={item} tone="default">{item}</Badge>)}
          </div>
        </article>
      </CardContent>
    </Card>
  );
}

export function IntelligenceSidebarFilters({ signals }: { signals: IntelligenceSignal[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Cross-Workspace Intelligence</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {signals.slice(0, 4).map((signal) => (
          <article key={signal.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-sm font-semibold text-brand-navy">{signal.label}</p>
            <p className="mt-1 text-xs text-text-secondary">{signal.source}</p>
            <p className="mt-2 text-[11px] text-text-muted">{signal.detail}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
