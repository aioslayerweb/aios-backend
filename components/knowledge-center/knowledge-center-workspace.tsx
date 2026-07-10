"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { BarChart3, Import, Plus, ShieldCheck, Bot, LibraryBig } from "lucide-react";
import {
  BusinessImpactPanel,
  KnowledgeConstellation,
  KnowledgeDomainsPanel,
  KnowledgeExplorer,
  KnowledgeHeader,
  KnowledgeHealthPanel,
  KnowledgeInspector,
  KnowledgeInsightsPanel,
  KnowledgeLeftRail,
  KnowledgeRibbonPanel,
  KnowledgeSearch,
  KnowledgeSummaryStrip,
  KnowledgeTimeline,
} from "./knowledge-center-components";
import {
  governanceRibbon,
  knowledgeCollaboration,
  knowledgeConstellation,
  knowledgeContext,
  knowledgeDomains,
  knowledgeFilters,
  knowledgeGovernance,
  knowledgeInsights,
  knowledgeLifecycle,
  knowledgeMetrics,
  knowledgeRecords,
  knowledgeSavedSearches,
} from "./mock-data";
import { WorkspaceGrid, WorkspaceShell, WorkspaceCard, WorkspaceSection, MetricCard } from "@/components/workspace";
import type { WorkspaceAction } from "@/components/workspace";

const LazyKnowledgeConstellation = lazy(async () => ({ default: KnowledgeConstellation }));

const headerActions: WorkspaceAction[] = [
  { id: "new", label: "New Knowledge", icon: <Plus size={14} />, tone: "primary", onClick: () => undefined },
  { id: "import", label: "Import", icon: <Import size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "graph", label: "Knowledge Graph", icon: <LibraryBig size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "policies", label: "Policies", icon: <ShieldCheck size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "assistant", label: "AI Assistant", icon: <Bot size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={14} />, tone: "secondary", onClick: () => undefined },
];

export function KnowledgeCenterWorkspace() {
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState(knowledgeRecords.find((record) => record.id === "n1")?.id ?? knowledgeRecords[0]?.id ?? "");
  const [searchValue, setSearchValue] = useState("");

  const selectedKnowledge = useMemo(
    () => knowledgeRecords.find((record) => record.id === selectedKnowledgeId) ?? knowledgeRecords[0],
    [selectedKnowledgeId]
  );

  const filteredRecords = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    if (!normalized) {
      return knowledgeRecords;
    }

    return knowledgeRecords.filter((record) => {
      const haystack = [
        record.title,
        record.description,
        record.executiveSummary,
        record.aiSummary,
        record.owner,
        record.department,
        record.businessArea,
        record.knowledgeType,
        record.tags.join(" "),
        record.relationships.join(" "),
        record.linkedWorkflows.join(" "),
        record.linkedDecisions.join(" "),
      ].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [searchValue]);

  const sidebarSections = [
    {
      title: "Knowledge Domains",
      items: knowledgeDomains.slice(0, 12).map((item) => ({ id: item.id, label: item.title, href: "#", meta: String(item.documents) })),
    },
    {
      title: "Executive",
      items: ["Executive", "Corporate", "Finance", "Sales", "Marketing"].map((item) => ({ id: item, label: item, href: "#", meta: "Core" })),
    },
    {
      title: "Operations",
      items: ["Operations", "Engineering", "Legal", "Compliance", "HR"].map((item) => ({ id: item, label: item, href: "#", meta: "Active" })),
    },
    {
      title: "Knowledge Types",
      items: ["AI Playbooks", "Business Rules", "Policies", "Standards", "Processes", "Templates"].map((item) => ({ id: item, label: item, href: "#", meta: "Governed" })),
    },
    {
      title: "Customers",
      items: ["Customer Success", "Customer Onboarding", "Renewal Playbooks", "Escalations"].map((item) => ({ id: item, label: item, href: "#", meta: "Linked" })),
    },
    {
      title: "Favorites",
      items: ["Executive Operating Principles", "AI Governance Framework", "Financial Controls", "Business Continuity Framework"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#", meta: "Pinned" })),
    },
    {
      title: "Archived",
      items: ["Legacy Playbooks", "Deprecated Standards", "Old Procedures"].map((item, index) => ({ id: `${item}-${index}`, label: item, href: "#", meta: "Cold" })),
    },
  ];

  if (!selectedKnowledge) {
    return null;
  }

  return (
    <WorkspaceShell>
      <KnowledgeHeader
        breadcrumbs={[{ label: "AIOS", href: "/app" }, { label: "Knowledge Center" }]}
        actions={headerActions}
        searchValue={searchValue}
        onSearch={setSearchValue}
      />

      <WorkspaceGrid className="xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <KnowledgeLeftRail sections={sidebarSections} />

        <main className="space-y-4" aria-label="Knowledge center main panel">
          <WorkspaceCard>
            <KnowledgeSummaryStrip record={selectedKnowledge} />
          </WorkspaceCard>

          <section>
            <WorkspaceSection id="kpi" title="Executive KPI Cards" subtitle="Knowledge intelligence metrics" actionLabel="AIOS">
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {knowledgeMetrics.map((metric) => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            </WorkspaceSection>
          </section>

          <section>
            <WorkspaceSection id="governance" title="Governance Command Ribbon" subtitle="Executive knowledge controls" actionLabel="AIOS">
              <KnowledgeRibbonPanel items={governanceRibbon} />
            </WorkspaceSection>
          </section>

          <section>
            <WorkspaceSection id="explorer" title="Knowledge Explorer" subtitle="Searchable enterprise knowledge" actionLabel="AIOS">
              <KnowledgeExplorer records={filteredRecords} selectedId={selectedKnowledge.id} onSelect={setSelectedKnowledgeId} filters={knowledgeFilters} />
            </WorkspaceSection>
          </section>

          <section>
            <WorkspaceSection id="search" title="Semantic Search" subtitle="Natural language exploration" actionLabel="AIOS">
              <KnowledgeSearch
                value={searchValue}
                onChange={setSearchValue}
                recentSearches={["board policy updates", "AI governance framework", "customer onboarding standard"]}
                suggestedKnowledge={[
                  "Executive Operating Principles",
                  "Enterprise Security Policy",
                  "Sales Methodology",
                  "AI Governance Framework",
                ]}
                relatedKnowledge={[
                  "Engineering Deployment Standard",
                  "Customer Onboarding Standard",
                  "Business Rules Catalog",
                ]}
                savedSearches={knowledgeSavedSearches}
              />
            </WorkspaceSection>
          </section>

          <section>
            <WorkspaceSection id="constellation" title="Enterprise Knowledge Constellation" subtitle="The approved central knowledge graph" actionLabel="AIOS">
              <Suspense fallback={<WorkspaceCard><div className="p-4 text-sm text-text-muted">Loading constellation...</div></WorkspaceCard>}>
                <LazyKnowledgeConstellation data={knowledgeConstellation} selectedNodeId={selectedKnowledge.id} selectedLabel={selectedKnowledge.title} onSelectNode={setSelectedKnowledgeId} />
              </Suspense>
            </WorkspaceSection>
          </section>

          <section>
            <WorkspaceSection id="domains" title="Knowledge Domains" subtitle="Premium enterprise domain cards" actionLabel="AIOS">
              <KnowledgeDomainsPanel domains={knowledgeDomains} />
            </WorkspaceSection>
          </section>

          <section>
            <WorkspaceSection id="health" title="Knowledge Health" subtitle="Enterprise analytics cards" actionLabel="AIOS">
              <KnowledgeHealthPanel metrics={knowledgeMetrics.slice(0, 10)} />
            </WorkspaceSection>
          </section>

          <section>
            <WorkspaceSection id="insights" title="AI Knowledge Insights" subtitle="Recommendation cards" actionLabel="AIOS">
              <KnowledgeInsightsPanel insights={knowledgeInsights} />
            </WorkspaceSection>
          </section>

          <section>
            <WorkspaceSection id="timeline" title="Knowledge Lifecycle" subtitle="Draft through archive" actionLabel="AIOS">
              <KnowledgeTimeline events={knowledgeLifecycle} />
            </WorkspaceSection>
          </section>

          <section>
            <WorkspaceSection id="business-impact" title="Business Impact" subtitle="Executive cards" actionLabel="AIOS">
              <BusinessImpactPanel metrics={knowledgeMetrics.slice(0, 8)} />
            </WorkspaceSection>
          </section>
        </main>

        <KnowledgeInspector
          record={selectedKnowledge}
          relationships={selectedKnowledge.relationships}
          governance={knowledgeGovernance}
          collaboration={knowledgeCollaboration}
          context={knowledgeContext}
        />
      </WorkspaceGrid>
    </WorkspaceShell>
  );
}
