"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  History,
  Plus,
  Radar,
} from "lucide-react";
import {
  AIInsightsPanel,
  AIReasoningPanel,
  ApprovalFlowPanel,
  BusinessImpactPanel,
  DecisionExplorer,
  DecisionGraph,
  DecisionGraphMeta,
  DecisionHeader,
  DecisionIntelligenceRibbon,
  DecisionInspector,
  DecisionKpiStrip,
  DecisionLeftRail,
  DecisionSectionTitle,
  DecisionSimulator,
  DecisionSummaryStrip,
  ExecutiveTimeline,
  RecommendationCards,
  RoleBasedIntelligence,
} from "./decision-center-components";
import {
  approvalFlow,
  businessImpactMetrics,
  decisionFilters,
  decisionGraphEdges,
  decisionGraphNodes,
  decisionInsights,
  decisionMetrics,
  decisionRecords,
  decisionRibbonItems,
  decisionScenarios,
  decisionSidebarSections,
  decisionTimeline,
  roleIntelligence,
  roleViews,
} from "./mock-data";
import { WorkspaceGrid, WorkspaceSection, WorkspaceShell } from "@/components/workspace";
import type { WorkspaceAction } from "@/components/workspace";
import type { DecisionRoleView } from "./types";

const headerActions: WorkspaceAction[] = [
  { id: "new", label: "New Decision", icon: <Plus size={14} />, tone: "primary", onClick: () => undefined },
  { id: "queue", label: "Decision Queue", icon: <ClipboardList size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "approvals", label: "Approvals", icon: <CheckCircle2 size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "simulations", label: "Simulations", icon: <Radar size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "history", label: "History", icon: <History size={14} />, tone: "secondary", onClick: () => undefined },
];

export function DecisionCenterWorkspace() {
  const [selectedDecisionId, setSelectedDecisionId] = useState(decisionRecords[0]?.id ?? "");
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState("d1");
  const [searchValue, setSearchValue] = useState("");
  const [activeRole, setActiveRole] = useState<DecisionRoleView>("CEO");

  const selectedDecision = useMemo(
    () => decisionRecords.find((item) => item.id === selectedDecisionId) ?? decisionRecords[0],
    [selectedDecisionId]
  );

  const filteredDecisions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return decisionRecords;

    return decisionRecords.filter((item) => {
      const haystack = [
        item.title,
        item.executiveSummary,
        item.recommendation,
        item.aiRecommendation,
        item.reasoning,
        item.businessImpact,
        item.financialImpact,
        item.category,
        item.approvalStatus,
        item.risk,
        item.affectedDepartments.join(" "),
        item.linkedMemory.join(" "),
        item.linkedKnowledge.join(" "),
        item.linkedWorkflow.join(" "),
        item.linkedAgent.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchValue]);

  if (!selectedDecision) {
    return null;
  }

  return (
    <WorkspaceShell>
      <DecisionHeader
        breadcrumbs={[{ label: "AIOS", href: "/app" }, { label: "Decision Center" }]}
        actions={headerActions}
        searchValue={searchValue}
        onSearch={setSearchValue}
      />

      <WorkspaceGrid className="xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <DecisionLeftRail sections={decisionSidebarSections} />

        <main className="space-y-4" aria-label="Decision center main panel">
          <DecisionSummaryStrip decision={selectedDecision} />

          <WorkspaceSection id="decision-kpi" title="Executive KPI Strip" subtitle="Enterprise decision metrics" actionLabel="AIOS">
            <DecisionKpiStrip metrics={decisionMetrics} />
          </WorkspaceSection>

          <WorkspaceSection id="decision-ribbon" title="Decision Intelligence Ribbon" subtitle="Live decision stream" actionLabel="AIOS">
            <DecisionIntelligenceRibbon items={decisionRibbonItems} />
          </WorkspaceSection>

          <WorkspaceSection id="decision-cards" title="AI Decision Cards" subtitle="Recommendations ready for action" actionLabel="AIOS">
            <DecisionExplorer decisions={filteredDecisions} selectedId={selectedDecision.id} onSelect={setSelectedDecisionId} filters={decisionFilters} />
          </WorkspaceSection>

          <WorkspaceSection id="recommendations" title="Recommendation Cards" subtitle="Top executive recommendations" actionLabel="AIOS">
            <RecommendationCards decisions={filteredDecisions} />
          </WorkspaceSection>

          <section className="space-y-2" id="decision-graph" aria-label="Decision graph section">
            <DecisionSectionTitle title="Decision Graph" subtitle="Connected decision intelligence graph" />
            <DecisionGraphMeta />
            <DecisionGraph nodes={decisionGraphNodes} edges={decisionGraphEdges} selectedNodeId={selectedGraphNodeId} onSelectNode={setSelectedGraphNodeId} />
          </section>

          <WorkspaceSection id="approval-flow" title="Approval Flow" subtitle="Governed decision approvals" actionLabel="AIOS">
            <ApprovalFlowPanel steps={approvalFlow} />
          </WorkspaceSection>

          <WorkspaceSection id="reasoning" title="AI Reasoning Panel" subtitle="Why AI recommends this decision" actionLabel="AIOS">
            <AIReasoningPanel decision={selectedDecision} />
          </WorkspaceSection>

          <WorkspaceSection id="simulator" title="Decision Simulator" subtitle="Scenario outcomes" actionLabel="AIOS">
            <DecisionSimulator scenarios={decisionScenarios} />
          </WorkspaceSection>

          <WorkspaceSection id="impact" title="Business Impact" subtitle="Revenue, savings, and strategic value" actionLabel="AIOS">
            <BusinessImpactPanel metrics={businessImpactMetrics} />
          </WorkspaceSection>

          <WorkspaceSection id="timeline" title="Executive Timeline" subtitle="Created through measured" actionLabel="AIOS">
            <ExecutiveTimeline events={decisionTimeline} />
          </WorkspaceSection>

          <WorkspaceSection id="insights" title="AI Insights" subtitle="Decision insights for executives" actionLabel="AIOS">
            <AIInsightsPanel insights={decisionInsights} />
          </WorkspaceSection>

          <WorkspaceSection id="role-intelligence" title="Role-Based Intelligence" subtitle="Dynamic perspective by leadership role" actionLabel="AIOS">
            <RoleBasedIntelligence activeRole={activeRole} roles={roleViews} roleIntelligence={roleIntelligence} onRoleChange={setActiveRole} />
          </WorkspaceSection>
        </main>

        <DecisionInspector decision={selectedDecision} approvalSteps={approvalFlow} />
      </WorkspaceGrid>
    </WorkspaceShell>
  );
}
