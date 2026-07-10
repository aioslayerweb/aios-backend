"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
import type {
  MemoryCollection,
  MemoryContextItem,
  MemoryFilter,
  MemoryGraphLink,
  MemoryGraphNode,
  MemoryInsight,
  MemoryMetric,
  MemoryRecord,
  MemoryTimelineEvent,
  SavedSearch,
} from "./types";

const cardMotion = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  },
};

function toneBadge(department: string) {
  if (department === "Executive") return "info";
  if (department === "Legal") return "warning";
  if (department === "Finance") return "success";
  return "default";
}

export function MemoryHeader({
  breadcrumbs,
  actions,
  searchValue,
  onSearch,
}: {
  breadcrumbs: { label: string; href?: string }[];
  actions: { id: string; label: string; icon?: ReactNode; tone?: "primary" | "secondary" | "ghost"; onClick?: () => void }[];
  searchValue: string;
  onSearch: (value: string) => void;
}) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <PageBreadcrumbs items={breadcrumbs} />
            <h1 className="mt-1 text-2xl font-semibold text-brand-navy">Memory Center</h1>
            <p className="mt-1 text-sm text-text-secondary">Manage, govern and explore your organization&apos;s living memory.</p>
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
          <Input value={searchValue} onChange={(event) => onSearch(event.target.value)} className="h-auto border-0 bg-transparent p-0 shadow-none" placeholder="Search memories, relationships, or organizations" aria-label="Search memories" />
        </label>
      </CardContent>
    </Card>
  );
}

export function MemoryFilterBar({ filters }: { filters: MemoryFilter[] }) {
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

export function MemoryCard({ record, selected, onSelect }: { record: MemoryRecord; selected: boolean; onSelect: (id: string) => void }) {
  return (
    <motion.button
      variants={cardMotion}
      whileHover={{ y: -2 }}
      type="button"
      onClick={() => onSelect(record.id)}
      className={cn(
        "w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        selected ? "border-brand-primary bg-brand-subtle/30" : "border-border hover:border-brand-primary/35"
      )}
      aria-label={`Select memory ${record.title}`}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{record.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{record.summary}</p>
        </div>
        <StatusBadge label={record.department} tone={selected ? "running" : "paused"} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ConfidenceBadge label={`Confidence ${record.confidence}%`} />
        <HealthBadge label={`Importance ${record.importance}%`} />
        <Badge tone={toneBadge(record.department)}>{record.type}</Badge>
      </div>

      <div className="mt-3 grid gap-1.5 text-[11px] text-text-muted sm:grid-cols-2">
        <span>Owner: {record.owner}</span>
        <span>Department: {record.department}</span>
        <span>Retention: {record.retention}</span>
        <span>Updated: {new Date(record.updatedAt).toLocaleString()}</span>
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

export function MemoryExplorer({ records, selectedId, onSelect, filters }: { records: MemoryRecord[]; selectedId: string; onSelect: (id: string) => void; filters: MemoryFilter[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Memory Explorer</h3>
            <p className="text-xs text-text-secondary">Searchable enterprise memory records</p>
          </div>
          <span className="text-xs text-text-muted">{records.length} memories</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <MemoryFilterBar filters={filters} />
        <div className="max-h-[720px] space-y-3 overflow-y-auto pr-1">
          {records.length > 0 ? (
            records.map((record) => <MemoryCard key={record.id} record={record} selected={selectedId === record.id} onSelect={onSelect} />)
          ) : (
            <EmptyState title="No Memories" description="No matching memories were found in the current filter set." />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MemoryCollectionCard({ collection }: { collection: MemoryCollection }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{collection.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{collection.detail}</p>
        </div>
        <span className="rounded-full bg-brand-subtle px-2 py-0.5 text-[11px] font-semibold text-brand-navy">{collection.count}</span>
      </div>
      <p className="mt-2 text-[11px] text-text-muted">Updated {new Date(collection.updatedAt).toLocaleString()}</p>
    </article>
  );
}

export function MemoryHealthCard({ metric }: { metric: MemoryMetric }) {
  return <MetricCard metric={metric} />;
}

export function MemoryInsightCard({ insight }: { insight: MemoryInsight }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <p className="text-sm font-semibold text-brand-navy">{insight.title}</p>
      <p className="mt-1 text-xs text-text-secondary">{insight.detail}</p>
    </article>
  );
}

export function BusinessImpactCard({ metric }: { metric: MemoryMetric }) {
  return <MetricCard metric={metric} />;
}

export function MemoryTimeline({ events }: { events: MemoryTimelineEvent[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Memory Lifecycle</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {events.map((event) => (
          <motion.article key={event.id} variants={cardMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-brand-navy">{event.stage}</p>
              <span className="text-xs text-text-muted">{new Date(event.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{event.description}</p>
          </motion.article>
        ))}
      </CardContent>
    </Card>
  );
}

export function SemanticSearch({
  value,
  onChange,
  recentSearches,
  suggestedMemories,
  relatedMemories,
  savedSearches,
}: {
  value: string;
  onChange: (value: string) => void;
  recentSearches: string[];
  suggestedMemories: string[];
  relatedMemories: string[];
  savedSearches: SavedSearch[];
}) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Semantic Search</h3>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <Input value={value} onChange={(event) => onChange(event.target.value)} className="h-auto border-0 bg-transparent p-0 shadow-none" placeholder="Natural language search" aria-label="Natural language memory search" />
        </label>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Recent Searches</p>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((item) => (
              <Badge key={item} tone="default">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Suggested Memories</p>
          <div className="space-y-2">
            {suggestedMemories.map((item) => (
              <InfoCard key={item} title={item} />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Related Memories</p>
          <div className="space-y-2">
            {relatedMemories.map((item) => (
              <InfoCard key={item} title={item} />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Saved Searches</p>
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

export function MemoryGraph({ nodes, links }: { nodes: MemoryGraphNode[]; links: MemoryGraphLink[] }) {
  const nodeLookup = new Map(nodes.map((node) => [node.id, node]));

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Memory Graph</h3>
            <p className="text-xs text-text-secondary">Connected nodes across people, knowledge and decisions</p>
          </div>
          <Badge tone="info">Mock graph</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border bg-surface-canvas">
          <svg className="absolute inset-0 h-full w-full" aria-label="Memory graph connections">
            {links.map((link) => {
              const from = nodeLookup.get(link.from);
              const to = nodeLookup.get(link.to);
              if (!from || !to) {
                return null;
              }

              const x1 = from.x + 64;
              const y1 = from.y + 18;
              const x2 = to.x;
              const y2 = to.y + 18;
              const midpoint = (x1 + x2) / 2;

              return (
                <g key={link.id}>
                  <path d={`M ${x1} ${y1} C ${midpoint} ${y1}, ${midpoint} ${y2}, ${x2} ${y2}`} fill="none" stroke="rgba(28,130,242,0.4)" strokeWidth="2" />
                  <text x={midpoint} y={(y1 + y2) / 2 - 4} textAnchor="middle" fontSize="10" fill="#4B5563">
                    {link.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute rounded-xl border border-border bg-white px-3 py-2 shadow-sm"
              style={{ left: node.x, top: node.y }}
            >
              <p className="text-xs font-semibold text-brand-navy">{node.label}</p>
              <p className="mt-1 text-[11px] text-text-muted">{node.category}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MemoryInspector({ record, relatedMemories, context }: { record: MemoryRecord; relatedMemories: string[]; context: MemoryContextItem[] }) {
  return (
    <WorkspaceRightPanel ariaLabel="Memory inspector">
      <Card className="border-border bg-white">
        <CardHeader className="py-3">
          <h3 className="text-sm font-semibold text-brand-navy">Selected Memory</h3>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <section className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Overview</p>
            <p className="mt-1 text-sm font-semibold text-brand-navy">{record.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{record.summary}</p>
          </section>

          <InfoCard title="AI Summary" detail={record.aiSummary} />
          <InfoCard title="Owner" detail={record.owner} />
          <InfoCard title="Department" detail={record.department} />
          <InfoCard title="Permissions" detail={record.permissions} />
          <InfoCard title="Retention" detail={record.retention} />

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Relationships</p>
            <div className="space-y-2">
              {record.relationships.map((relationship) => (
                <article key={relationship} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">
                  {relationship}
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Knowledge Links</p>
            <div className="space-y-2">
              {relatedMemories.map((item) => (
                <article key={item} className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">
                  {item}
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Timeline</p>
            <div className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs text-text-secondary">
              Updated {new Date(record.updatedAt).toLocaleString()}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Related Memories</p>
            {context.map((item) => (
              <article key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2 text-xs">
                <span className="text-brand-navy">{item.label}</span>
                <span className="text-text-muted">{item.value}</span>
              </article>
            ))}
          </section>
        </CardContent>
      </Card>
    </WorkspaceRightPanel>
  );
}

export function MemoryCollectionsPanel({ collections }: { collections: MemoryCollection[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Memory Collections</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <MemoryCollectionCard key={collection.id} collection={collection} />
        ))}
      </CardContent>
    </Card>
  );
}

export function MemoryHealthPanel({ metrics }: { metrics: MemoryMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Memory Health</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MemoryHealthCard key={metric.id} metric={metric} />
        ))}
      </CardContent>
    </Card>
  );
}

export function MemoryInsightsPanel({ insights }: { insights: MemoryInsight[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">AI Insights</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {insights.map((insight) => (
          <MemoryInsightCard key={insight.id} insight={insight} />
        ))}
      </CardContent>
    </Card>
  );
}

export function BusinessImpactPanel({ metrics }: { metrics: MemoryMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Business Impact</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <BusinessImpactCard key={metric.id} metric={metric} />
        ))}
      </CardContent>
    </Card>
  );
}

export function MemoryLeftRail({
  sections,
}: {
  sections: Array<{ title: string; items: { id: string; label: string; meta?: string; href: string }[] }>;
}) {
  return (
    <WorkspaceSidebar ariaLabel="Memory center left sidebar">
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

export function MemorySummaryStrip({ record }: { record: MemoryRecord }) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Owner" detail={record.owner} />
        <InfoCard title="Department" detail={record.department} />
        <InfoCard title="Type" detail={record.type} />
        <InfoCard title="Confidence" detail={`${record.confidence}%`} />
      </CardContent>
    </Card>
  );
}
