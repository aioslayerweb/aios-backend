"use client";

import { useMemo, useState } from "react";
import { BarChart3, ClipboardList, History, Plus, Radar } from "lucide-react";
import {
  AnomalyDetectionPanel,
  BusinessInsightsPanel,
  IntelligenceGraph,
  IntelligenceHeader,
  IntelligenceInspector,
  IntelligenceKpiStrip,
  IntelligenceLeftRail,
  IntelligenceRibbon,
  IntelligenceSignalRail,
  IntelligenceTimeline,
  RecommendationEngine,
  RoleIntelligencePanel,
  ScenarioAnalysisPanel,
  IntelligenceExplorer,
} from "./intelligence-center-components";
import {
  intelligenceAnomalies,
  intelligenceCards,
  intelligenceExecutiveBrief,
  intelligenceGraphEdges,
  intelligenceGraphNodes,
  intelligenceInsights,
  intelligenceKpis,
  intelligenceRecommendations,
  intelligenceRibbon,
  intelligenceRoleViews,
  intelligenceScenarios,
  intelligenceSignals,
  intelligenceTimeline,
  intelligenceWorkspaceSections,
} from "./mock-data";
import { WorkspaceGrid, WorkspaceSection, WorkspaceShell } from "@/components/workspace";
import type { WorkspaceAction } from "@/components/workspace";
import type { IntelligenceRole } from "./types";

const headerActions: WorkspaceAction[] = [
  { id: "generate", label: "Generate Intelligence", icon: <Plus size={14} />, tone: "primary", onClick: () => undefined },
  { id: "briefing", label: "Executive Briefing", icon: <ClipboardList size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "predict", label: "Predict", icon: <Radar size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "recommendations", label: "Recommendations", icon: <History size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "scenario", label: "Scenario Analysis", icon: <Radar size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "reports", label: "Reports", icon: <BarChart3 size={14} />, tone: "secondary", onClick: () => undefined },
];

export function IntelligenceCenterWorkspace() {
  const [selectedCardId, setSelectedCardId] = useState(intelligenceCards[0]?.id ?? "");
  const [selectedNodeId, setSelectedNodeId] = useState(intelligenceGraphNodes[0]?.id ?? "");
  const [searchValue, setSearchValue] = useState("");
  const [activeRole, setActiveRole] = useState<IntelligenceRole>("CEO");

  const selectedCard = useMemo(
    () => intelligenceCards.find((card) => card.id === selectedCardId) ?? intelligenceCards[0],
    [selectedCardId]
  );

  const filteredCards = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return intelligenceCards;

    return intelligenceCards.filter((card) => {
      const haystack = [
        card.title,
        card.executiveSummary,
        card.aiAnalysis,
        card.businessImpact,
        card.predictedOutcome,
        card.recommendedAction,
        card.supportingEvidence.join(" "),
        card.sourceChips.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchValue]);

  if (!selectedCard) {
    return null;
  }

  return (
    <WorkspaceShell>
      <IntelligenceHeader
        breadcrumbs={[{ label: "AIOS", href: "/app" }, { label: "Intelligence Center" }]}
        actions={headerActions}
        searchValue={searchValue}
        onSearch={setSearchValue}
      />

      <WorkspaceGrid className="xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <IntelligenceLeftRail sections={intelligenceWorkspaceSections} />

        <main className="space-y-4" aria-label="Intelligence center main panel">
          <WorkspaceSection id="intelligence-kpis" title="Top KPI Strip" subtitle="Enterprise intelligence metrics" actionLabel="AIOS">
            <IntelligenceKpiStrip metrics={intelligenceKpis} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-ribbon" title="Executive Intelligence Ribbon" subtitle="Live enterprise intelligence updates" actionLabel="AIOS">
            <IntelligenceRibbon items={intelligenceRibbon} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-cards" title="Main Grid" subtitle="Premium intelligence cards" actionLabel="AIOS">
            <IntelligenceExplorer records={filteredCards} selectedId={selectedCard.id} onSelect={setSelectedCardId} signals={intelligenceSignals} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-recommendations" title="AI Recommendation Engine" subtitle="Enterprise recommendations and actions" actionLabel="AIOS">
            <RecommendationEngine recommendations={intelligenceRecommendations} onAction={setSelectedCardId} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-graph" title="Predictive Intelligence Graph" subtitle="Connected business intelligence topology" actionLabel="AIOS">
            <IntelligenceGraph nodes={intelligenceGraphNodes} edges={intelligenceGraphEdges} selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-timeline" title="Enterprise Intelligence Timeline" subtitle="Signals through outcome" actionLabel="AIOS">
            <IntelligenceTimeline events={intelligenceTimeline} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-insights" title="Business Insights" subtitle="Cross-workspace intelligence trends" actionLabel="AIOS">
            <BusinessInsightsPanel insights={intelligenceInsights} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-anomalies" title="Anomaly Detection" subtitle="Detected enterprise anomalies" actionLabel="AIOS">
            <AnomalyDetectionPanel anomalies={intelligenceAnomalies} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-scenarios" title="Scenario Analysis" subtitle="Business outcome simulations" actionLabel="AIOS">
            <ScenarioAnalysisPanel scenarios={intelligenceScenarios} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-role" title="Role-Based Intelligence" subtitle="Dynamic leadership views" actionLabel="AIOS">
            <RoleIntelligencePanel activeRole={activeRole} roles={["CEO", "CFO", "COO", "Sales", "Marketing", "HR", "Operations", "Compliance", "IT"]} roleViews={intelligenceRoleViews} onRoleChange={setActiveRole} />
          </WorkspaceSection>

          <WorkspaceSection id="intelligence-signals" title="Cross-Workspace Intelligence" subtitle="Signals sourced from the AIOS platform" actionLabel="AIOS">
            <IntelligenceSignalRail signals={intelligenceSignals} />
          </WorkspaceSection>
        </main>

        <IntelligenceInspector brief={intelligenceExecutiveBrief} />
      </WorkspaceGrid>
    </WorkspaceShell>
  );
}
