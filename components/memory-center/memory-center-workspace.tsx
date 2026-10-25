"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Import, Plus, Search, ShieldCheck, Sparkles } from "lucide-react";
import {
  BusinessImpactPanel,
  MemoryCollectionsPanel,
  MemoryHeader,
  MemoryGraph,
  MemoryHealthPanel,
  MemoryInspector,
  MemoryInsightsPanel,
  MemoryLeftRail,
  MemoryExplorer,
  MemorySummaryStrip,
  MemoryTimeline,
  SemanticSearch,
} from "./memory-center-components";
import {
  memoryCollections,
  memoryContext,
  memoryFilters,
  memoryGraphLinks,
  memoryGraphNodes,
  memoryInsights,
  memoryMetrics,
  memoryRecords,
  memoryTimeline,
  savedSearches,
} from "./mock-data";
import { MetricCard, WorkspaceGrid, WorkspaceShell, WorkspaceCard, WorkspaceSection } from "@/components/workspace";
import type { WorkspaceAction } from "@/components/workspace";
import { useNavigationBase } from "@/contexts/navigation-context";
import { useRoleContext } from "@/hooks/use-role-context";
import { usePermissions } from "@/hooks/use-permissions";
import { BusinessMemoryExplorer } from "./business-memory-explorer";

const LazyMemoryGraph = lazy(async () => ({ default: MemoryGraph }));

export function MemoryCenterWorkspace() {
  const [selectedMemoryId, setSelectedMemoryId] = useState(memoryRecords.find((record) => record.selected)?.id ?? memoryRecords[0]?.id ?? "");
  const [searchValue, setSearchValue] = useState("");
  const [notice, setNotice] = useState("");
  const { baseHref } = useNavigationBase();
  const { organization } = useRoleContext();
  const { effectivePermissions, hasPermission } = usePermissions();
  const isDemo = baseHref === "/demo-platform";
  const jumpTo = (id: string, message?: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (message) setNotice(message);
  };
  const headerActions: WorkspaceAction[] = [
    { id: "new", label: "New Memory", icon: <Plus size={14} />, tone: "primary", onClick: () => setNotice("Memory creation is not connected. The sample records are unchanged.") },
    { id: "import", label: "Import", icon: <Import size={14} />, tone: "secondary", onClick: () => setNotice("Memory import is not connected. No files were imported.") },
    { id: "search", label: "Search", icon: <Search size={14} />, tone: "secondary", onClick: () => jumpTo("semantic-search") },
    { id: "policies", label: "Policies", icon: <ShieldCheck size={14} />, tone: "secondary", onClick: () => jumpTo("memory-health", "Showing sample memory health and governance metrics; no policy service is connected.") },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={14} />, tone: "secondary", onClick: () => jumpTo("memory-business-impact") },
  ];

  const selectedMemory = useMemo(
    () => memoryRecords.find((record) => record.id === selectedMemoryId) ?? memoryRecords[0],
    [selectedMemoryId]
  );

  const filteredRecords = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    if (!normalized) {
      return memoryRecords;
    }

    return memoryRecords.filter((record) => {
      const haystack = [record.title, record.summary, record.owner, record.department, record.type, record.tags.join(" "), record.relationships.join(" ")].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [searchValue]);

  const sidebarSections = [
    {
      title: "Memory Collections",
      items: memoryCollections.slice(0, 10).map((item) => ({ id: item.id, label: item.title, href: "#memory-collections", meta: String(item.count) })),
    },
    {
      title: "Departments",
      items: ["Executive", "Finance", "Sales", "Marketing", "Legal", "Operations", "HR", "Engineering", "Customer Success"].map((item) => ({ id: item, label: item, href: "#memory-explorer", meta: "Memory" })),
    },
    {
      title: "Projects",
      items: ["Q3 Planning", "Revenue Protection", "Compliance Modernization", "Workflow Builder", "Board Narrative"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#memory-explorer", meta: "Active" })),
    },
    {
      title: "Customers",
      items: ["North America Enterprise", "EMEA Strategic Accounts", "APAC Renewal Pool", "Top 20 At-Risk"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#memory-explorer", meta: "Tracked" })),
    },
    {
      title: "Meetings",
      items: ["Board Planning", "QBR Review", "Risk Council", "Executive Briefing"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#memory-explorer", meta: "Captured" })),
    },
    {
      title: "Agents",
      items: ["Executive Assistant", "Finance Agent", "Knowledge Curator", "Compliance Officer"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#memory-explorer", meta: "Active" })),
    },
    {
      title: "Workflows",
      items: ["Board Briefing", "Churn Recovery", "Policy Validation", "Forecast Update"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#memory-explorer", meta: "Linked" })),
    },
    {
      title: "Decisions",
      items: ["Budget Approval", "Policy Change", "Market Expansion", "Risk Escalation"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#memory-explorer", meta: "Logged" })),
    },
    {
      title: "Knowledge Links",
      items: ["Policy Library", "Board Pack", "Customer Playbooks", "Operational Runbooks"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#memory-explorer", meta: "Synced" })),
    },
    {
      title: "Archived",
      items: ["Q2 Notes", "Legacy Policies", "Expired Workflows"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#memory-explorer", meta: "Cold" })),
    },
    {
      title: "Favorites",
      items: ["Executive Memory", "Finance Forecast", "Customer Risk", "Policy Review"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#memory-explorer", meta: "Pinned" })),
    },
  ];

  if (!selectedMemory) {
    return null;
  }

  return (
    <WorkspaceShell>
      <MemoryHeader
        breadcrumbs={[{ label: "AIOS", href: baseHref }, { label: "Memory Center" }]}
        actions={headerActions}
        searchValue={searchValue}
        onSearch={setSearchValue}
      />
      {notice ? <p className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900" role="status" aria-live="polite">{notice}</p> : null}

      <WorkspaceGrid className="xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <MemoryLeftRail sections={sidebarSections} />

        <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" aria-label="Memory center main panel">
          {isDemo && hasPermission("view_dashboard") ? (
            <WorkspaceSection id="business-memory-context" title="Business Memory & Context" subtitle="Traceable evidence, lifecycle, and authorized retrieval" actionLabel="AIOS">
              <BusinessMemoryExplorer
                organizationId={organization?.id}
                grantedPermissions={effectivePermissions}
                canManageMemory={hasPermission("manage_memory")}
              />
            </WorkspaceSection>
          ) : null}
          <WorkspaceCard>
            <MemorySummaryStrip record={selectedMemory} />
          </WorkspaceCard>

          <section>
            <SectionTitle title="Executive KPI Cards" subtitle="Memory Intelligence Metrics" />
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {memoryMetrics.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>

          <section id="memory-explorer">
            <SectionTitle title="Memory Explorer" subtitle="Searchable enterprise memory" />
            <MemoryExplorer records={filteredRecords} selectedId={selectedMemory.id} onSelect={setSelectedMemoryId} filters={memoryFilters} />
          </section>

          <section id="semantic-search">
            <SectionTitle title="Deterministic Memory Search" subtitle="Literal matching over sample fields" />
            <SemanticSearch
              value={searchValue}
              onChange={setSearchValue}
              recentSearches={["board decisions", "renewal risk", "policy review"]}
              suggestedMemories={[
                "Executive board memory",
                "Finance approval lineage",
                "Customer risk context",
                "Workflow decision notes",
              ]}
              relatedMemories={[
                "Board approval discussion",
                "Finance policy memory",
                "Customer escalation summary",
              ]}
              savedSearches={savedSearches}
            />
          </section>

          <section>
            <SectionTitle title="Memory Graph" subtitle="Connected memory relationships" />
            <Suspense fallback={<WorkspaceCard><div className="p-4 text-sm text-text-muted">Loading memory graph...</div></WorkspaceCard>}>
              <LazyMemoryGraph nodes={memoryGraphNodes} links={memoryGraphLinks} />
            </Suspense>
          </section>

          <section id="memory-collections">
            <SectionTitle title="Memory Collections" subtitle="Governed collection centers" />
            <MemoryCollectionsPanel collections={memoryCollections} />
          </section>

          <section id="memory-health">
            <SectionTitle title="Memory Health" subtitle="Coverage and governance quality" />
            <MemoryHealthPanel metrics={memoryMetrics.slice(0, 8)} />
          </section>

          <section>
            <SectionTitle title="AI Insights" subtitle="Recommendation cards" />
            <MemoryInsightsPanel insights={memoryInsights} />
          </section>

          <section>
            <SectionTitle title="Memory Lifecycle" subtitle="Captured through deletion" />
            <MemoryTimeline events={memoryTimeline} />
          </section>

          <section id="memory-business-impact">
            <SectionTitle title="Business Impact" subtitle="Executive value metrics" />
            <BusinessImpactPanel metrics={memoryMetrics.slice(0, 8)} />
          </section>
        </motion.main>

        <MemoryInspector
          record={selectedMemory}
          relatedMemories={selectedMemory.relationships}
          context={memoryContext}
        />
      </WorkspaceGrid>
    </WorkspaceShell>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">{title}</h2>
        <p className="mt-1 text-lg font-semibold text-brand-navy">{subtitle}</p>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-subtle px-2.5 py-1 text-[11px] font-semibold text-brand-navy">
        <Sparkles size={12} />
        AIOS
      </span>
    </div>
  );
}
