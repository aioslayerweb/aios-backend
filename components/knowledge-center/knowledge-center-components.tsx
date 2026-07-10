"use client";

import { lazy, memo, Suspense } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Layers3,
  LibraryBig,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
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
import { BusinessKnowledgeGraphCanvas } from "@/components/knowledge-graph/business-knowledge-graph-canvas";
import type { WorkspaceAction, WorkspaceBreadcrumb } from "@/components/workspace";
import type {
  KnowledgeCollaborationItem,
  KnowledgeConstellationData,
  KnowledgeContextItem,
  KnowledgeDomain,
  KnowledgeFilter,
  KnowledgeGovernanceItem,
  KnowledgeInsight,
  KnowledgeLifecycleEvent,
  KnowledgeMetric,
  KnowledgeRecord,
  KnowledgeRibbonMetric,
  KnowledgeSavedSearch,
} from "./types";

const LazyBusinessKnowledgeGraphCanvas = lazy(async () => ({ default: BusinessKnowledgeGraphCanvas }));

const cardMotion = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  },
};

export function KnowledgeHeader({
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
            <h1 className="mt-1 text-2xl font-semibold text-brand-navy">Knowledge Center</h1>
            <p className="mt-1 text-sm text-text-secondary">Govern, organize and distribute enterprise knowledge.</p>
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
          <Input
            value={searchValue}
            onChange={(event) => onSearch(event.target.value)}
            className="h-auto border-0 bg-transparent p-0 shadow-none"
            placeholder="Natural language search across enterprise knowledge"
            aria-label="Search knowledge"
          />
        </label>
      </CardContent>
    </Card>
  );
}

export function KnowledgeFilterBar({ filters }: { filters: KnowledgeFilter[] }) {
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

export function KnowledgeCard({ record, selected, onSelect }: { record: KnowledgeRecord; selected: boolean; onSelect: (id: string) => void }) {
  return (
    <motion.button
      variants={cardMotion}
      whileHover={{ y: -2 }}
      type="button"
      onClick={() => onSelect(record.id)}
      className={cn(
        "w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        selected ? "border-brand-primary bg-brand-subtle/25" : "border-border hover:border-brand-primary/35"
      )}
      aria-label={`Select knowledge ${record.title}`}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{record.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{record.description}</p>
        </div>
        <StatusBadge label={record.status} tone={selected ? "running" : "paused"} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ConfidenceBadge label={`Confidence ${record.confidence}%`} />
        <HealthBadge label={`AI readiness ${record.aiReadiness}%`} />
        <Badge tone="default">{record.knowledgeType}</Badge>
      </div>

      <div className="mt-3 grid gap-1.5 text-[11px] text-text-muted sm:grid-cols-2">
        <span>Owner: {record.owner}</span>
        <span>Department: {record.department}</span>
        <span>Business area: {record.businessArea}</span>
        <span>Version: {record.version}</span>
        <span>Updated: {new Date(record.updatedAt).toLocaleString()}</span>
        <span>Compliance: {record.compliance}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {record.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-surface-canvas px-2 py-0.5 text-[11px] text-text-secondary">
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-text-muted">Relationships: {record.relationships.join(", ")}</p>
    </motion.button>
  );
}

export const KnowledgeExplorer = memo(function KnowledgeExplorer({
  records,
  selectedId,
  onSelect,
  filters,
}: {
  records: KnowledgeRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
  filters: KnowledgeFilter[];
}) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Knowledge Explorer</h3>
            <p className="text-xs text-text-secondary">Searchable enterprise knowledge records</p>
          </div>
          <span className="text-xs text-text-muted">{records.length} records</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <KnowledgeFilterBar filters={filters} />
        <div className="max-h-[780px] space-y-3 overflow-y-auto pr-1">
          {records.length > 0 ? (
            records.map((record) => <KnowledgeCard key={record.id} record={record} selected={selectedId === record.id} onSelect={onSelect} />)
          ) : (
            <EmptyState title="No Knowledge" description="No matching knowledge items were found in the current filter set." />
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export function KnowledgeDomainCard({ domain }: { domain: KnowledgeDomain }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{domain.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{domain.detail}</p>
        </div>
        <span className="rounded-full bg-brand-subtle px-2 py-0.5 text-[11px] font-semibold text-brand-navy">{domain.documents}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {domain.tags.map((tag) => (
          <Badge key={tag} tone="default">
            {tag}
          </Badge>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-text-muted">Owner: {domain.owner} · {domain.status}</p>
    </article>
  );
}

export function GovernanceRibbon({ items }: { items: KnowledgeRibbonMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Governance Command Ribbon</h3>
            <p className="text-xs text-text-secondary">Executive controls and knowledge governance indicators</p>
          </div>
          <StatusBadge label="Live governance" tone="running" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <motion.article key={item.id} variants={cardMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-brand-navy">{item.value}</p>
              </div>
              {index === 0 ? <BookOpen className="h-4 w-4 text-brand-primary" /> : index === 1 ? <ShieldCheck className="h-4 w-4 text-brand-primary" /> : index === 2 ? <CheckCircle2 className="h-4 w-4 text-brand-primary" /> : index === 3 ? <Clock3 className="h-4 w-4 text-brand-primary" /> : index === 4 ? <LibraryBig className="h-4 w-4 text-brand-primary" /> : index === 5 ? <FolderKanban className="h-4 w-4 text-brand-primary" /> : index === 6 ? <Layers3 className="h-4 w-4 text-brand-primary" /> : <Sparkles className="h-4 w-4 text-brand-primary" />}
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

export function KnowledgeHealthCard({ metric }: { metric: KnowledgeMetric }) {
  return <MetricCard metric={metric} />;
}

export function KnowledgeInsightCard({ insight }: { insight: KnowledgeInsight }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">{insight.title}</p>
        <Badge tone="info">{insight.confidence}%</Badge>
      </div>
      <p className="mt-1 text-xs text-text-secondary">{insight.detail}</p>
      <p className="mt-2 text-xs font-medium text-brand-navy">Recommendation: {insight.recommendation}</p>
    </article>
  );
}

export function BusinessImpactCard({ metric }: { metric: KnowledgeMetric }) {
  return <MetricCard metric={metric} />;
}

export function KnowledgeTimeline({ events }: { events: KnowledgeLifecycleEvent[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Knowledge Lifecycle</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {events.map((event) => (
          <motion.article key={event.id} variants={cardMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-brand-navy">{event.type}</p>
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

export function KnowledgeSearch({
  value,
  onChange,
  recentSearches,
  suggestedKnowledge,
  relatedKnowledge,
  savedSearches,
}: {
  value: string;
  onChange: (value: string) => void;
  recentSearches: string[];
  suggestedKnowledge: string[];
  relatedKnowledge: string[];
  savedSearches: KnowledgeSavedSearch[];
}) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Semantic Search</h3>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <Input value={value} onChange={(event) => onChange(event.target.value)} className="h-auto border-0 bg-transparent p-0 shadow-none" placeholder="Natural language search" aria-label="Semantic knowledge search" />
        </label>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Recent searches</p>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((item) => <Badge key={item} tone="default">{item}</Badge>)}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Suggested knowledge</p>
          <div className="space-y-2">
            {suggestedKnowledge.map((item) => <InfoCard key={item} title={item} />)}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Related knowledge</p>
          <div className="space-y-2">
            {relatedKnowledge.map((item) => <InfoCard key={item} title={item} />)}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Saved searches</p>
          <div className="space-y-2">
            {savedSearches.map((item) => (
              <article key={item.id} className="rounded-xl border border-border bg-surface-canvas p-3">
                <p className="text-sm font-semibold text-brand-navy">{item.label}</p>
                <p className="mt-1 text-xs text-text-secondary">{item.query}</p>
              </article>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KnowledgeConstellation({ data, selectedNodeId, selectedLabel, onSelectNode }: { data: KnowledgeConstellationData; selectedNodeId: string; selectedLabel: string; onSelectNode: (id: string) => void; }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Enterprise Knowledge Constellation</h3>
            <p className="text-xs text-text-secondary">Clustered graph of policies, standards, workflows, and decisions</p>
          </div>
          <span className="text-xs text-text-muted">{selectedLabel}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Suspense fallback={<div className="rounded-2xl border border-border bg-surface-canvas p-4 text-sm text-text-muted">Loading constellation...</div>}>
          <LazyConstellationWrapper data={data} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

function LazyConstellationWrapper({ data, selectedNodeId, onSelectNode }: { data: KnowledgeConstellationData; selectedNodeId: string; onSelectNode: (id: string) => void; }) {
  const matchedNodeIds = data.nodes.some((node) => node.id === selectedNodeId) ? [selectedNodeId] : [];

  return <LazyBusinessKnowledgeGraphCanvas nodes={data.nodes} edges={data.edges} selectedNodeId={selectedNodeId} matchedNodeIds={matchedNodeIds} onSelectNode={onSelectNode} />;
}

export function KnowledgeInspector({
  record,
  relationships,
  governance,
  collaboration,
  context,
}: {
  record: KnowledgeRecord;
  relationships: string[];
  governance: KnowledgeGovernanceItem[];
  collaboration: KnowledgeCollaborationItem[];
  context: KnowledgeContextItem[];
}) {
  return (
    <WorkspaceRightPanel ariaLabel="Knowledge inspector">
      <Card className="border-border bg-white">
        <CardHeader className="py-3">
          <h3 className="text-sm font-semibold text-brand-navy">Selected Knowledge</h3>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <section className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Overview</p>
            <p className="mt-1 text-sm font-semibold text-brand-navy">{record.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{record.description}</p>
          </section>

          <InfoCard title="Executive Summary" detail={record.executiveSummary} />
          <InfoCard title="AI Summary" detail={record.aiSummary} />
          <InfoCard title="Business Purpose" detail={record.businessPurpose} />
          <InfoCard title="Owner" detail={record.owner} />
          <InfoCard title="Version" detail={record.version} />
          <InfoCard title="Permissions" detail={record.permissions} />
          <InfoCard title="Approvals" detail={record.approvals} />
          <InfoCard title="Compliance" detail={record.compliance} />

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Relationships</p>
            <div className="space-y-2">
              {relationships.map((relationship) => (
                <article key={relationship} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{relationship}</article>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Linked Memories</p>
            <div className="space-y-2">
              {record.linkedMemories.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Linked Workflows</p>
            <div className="space-y-2">
              {record.linkedWorkflows.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Linked Decisions</p>
            <div className="space-y-2">
              {record.linkedDecisions.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Related Policies</p>
            <div className="space-y-2">
              {record.relatedPolicies.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Related Standards</p>
            <div className="space-y-2">
              {record.relatedStandards.map((item) => <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">{item}</article>)}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Governance</p>
            <div className="space-y-2">
              {governance.map((item) => (
                <article key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs">
                  <span className="text-brand-navy">{item.label}</span>
                  <span className="text-text-muted">{item.value}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Collaboration</p>
            <div className="space-y-2">
              {collaboration.map((item) => (
                <article key={item.id} className="rounded-xl border border-border bg-surface-canvas px-3 py-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-brand-navy">{item.label}</span>
                    <span className="text-text-muted">{item.value}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-text-secondary">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Timeline</p>
            <div className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">Updated {new Date(record.updatedAt).toLocaleString()}</div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Context</p>
            <div className="space-y-2">
              {context.map((item) => (
                <article key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs">
                  <span className="text-brand-navy">{item.label}</span>
                  <span className="text-text-muted">{item.value}</span>
                </article>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </WorkspaceRightPanel>
  );
}

export function KnowledgeDomainsPanel({ domains }: { domains: KnowledgeDomain[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Knowledge Domains</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {domains.map((domain) => <KnowledgeDomainCard key={domain.id} domain={domain} />)}
      </CardContent>
    </Card>
  );
}

export function KnowledgeHealthPanel({ metrics }: { metrics: KnowledgeMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Knowledge Health</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => <KnowledgeHealthCard key={metric.id} metric={metric} />)}
      </CardContent>
    </Card>
  );
}

export function KnowledgeInsightsPanel({ insights }: { insights: KnowledgeInsight[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">AI Knowledge Insights</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {insights.map((insight) => <KnowledgeInsightCard key={insight.id} insight={insight} />)}
      </CardContent>
    </Card>
  );
}

export function BusinessImpactPanel({ metrics }: { metrics: KnowledgeMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Business Impact</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <BusinessImpactCard key={metric.id} metric={metric} />)}
      </CardContent>
    </Card>
  );
}

export function KnowledgeLeftRail({ sections }: { sections: Array<{ title: string; items: { id: string; label: string; meta?: string; href: string }[] }> }) {
  return (
    <WorkspaceSidebar ariaLabel="Knowledge center left sidebar">
      {sections.map((section) => (
        <Card key={section.title} className="border-border bg-white">
          <CardHeader className="py-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{section.title}</h3>
          </CardHeader>
          <CardContent className="space-y-1.5 p-3">
            {section.items.map((item) => (
              <a key={item.id} href={item.href} className="flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2 text-sm hover:border-brand-primary/35">
                <span className="font-medium text-brand-navy">{item.label}</span>
                <span className="text-[11px] text-text-muted">{item.meta}</span>
              </a>
            ))}
          </CardContent>
        </Card>
      ))}
    </WorkspaceSidebar>
  );
}

export function KnowledgeSummaryStrip({ record }: { record: KnowledgeRecord }) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Owner" detail={record.owner} />
        <InfoCard title="Department" detail={record.department} />
        <InfoCard title="Business Area" detail={record.businessArea} />
        <InfoCard title="Version" detail={record.version} />
      </CardContent>
    </Card>
  );
}

export function KnowledgeRibbonPanel({ items }: { items: KnowledgeRibbonMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Governance Command Ribbon</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <motion.article key={item.id} variants={cardMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-brand-navy">{item.value}</p>
              </div>
              {index % 4 === 0 ? <ShieldCheck className="h-4 w-4 text-brand-primary" /> : index % 4 === 1 ? <CheckCircle2 className="h-4 w-4 text-brand-primary" /> : index % 4 === 2 ? <LibraryBig className="h-4 w-4 text-brand-primary" /> : <Workflow className="h-4 w-4 text-brand-primary" />}
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
