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
import { useNavigationBase } from "@/contexts/navigation-context";
import { useRoleContext } from "@/hooks/use-role-context";
import { usePermissions } from "@/hooks/use-permissions";
import { RbiIntelligencePanel } from "@/components/intelligence-center/rbi-intelligence-panel";
import { intelligenceRoleToRoleId, syntheticRbiIntelligence } from "@/components/intelligence-center/rbi-data";
import { demoBusinessMemory } from "@/lib/business-memory/demo-fixtures";

export function DecisionCenterWorkspace() {
  const [selectedDecisionId, setSelectedDecisionId] = useState(decisionRecords[0]?.id ?? "");
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState("d1");
  const [searchValue, setSearchValue] = useState("");
  const [activeRole, setActiveRole] = useState<DecisionRoleView>("CEO");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<Record<string, string>>({});
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
    { id: "new", label: "New Decision", icon: <Plus size={14} />, tone: "primary", onClick: () => jumpTo("decision-cards", "Decision creation is not connected in this preview. You can review the synthetic sample decisions below.") },
    { id: "queue", label: "Decision Queue", icon: <ClipboardList size={14} />, tone: "secondary", onClick: () => jumpTo("decision-cards") },
    { id: "approvals", label: "Approvals", icon: <CheckCircle2 size={14} />, tone: "secondary", onClick: () => jumpTo("approval-flow") },
    { id: "simulations", label: "Simulations", icon: <Radar size={14} />, tone: "secondary", onClick: () => jumpTo("simulator") },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={14} />, tone: "secondary", onClick: () => jumpTo("impact") },
    { id: "history", label: "History", icon: <History size={14} />, tone: "secondary", onClick: () => jumpTo("timeline") },
  ];

  const filteredDecisions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return decisionRecords.filter((item) => {
      const matchesFilter = !activeFilter
        || (activeFilter === "pending" && item.approvalStatus === "pending")
        || (activeFilter === "recommended" && item.approvalStatus === "recommended")
        || (activeFilter === "approved" && item.approvalStatus === "approved")
        || (activeFilter === "rejected" && item.approvalStatus === "rejected")
        || (activeFilter === "high-risk" && (item.risk === "high" || item.risk === "critical"))
        || item.category === activeFilter;
      if (!matchesFilter) return false;
      if (!query) return true;
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
  }, [activeFilter, searchValue]);

  const selectedDecision = useMemo(
    () => filteredDecisions.find((item) => item.id === selectedDecisionId) ?? filteredDecisions[0],
    [filteredDecisions, selectedDecisionId]
  );

  const recordDemoAction = (decisionId: string, action: "approve" | "reject" | "review") => {
    const actionLabel = action === "approve" ? "approval" : action === "reject" ? "rejection" : "review";
    const feedback = `Local demo ${actionLabel} preview recorded. No approval service was called and no business decision was changed.`;
    setActionFeedback((current) => ({ ...current, [decisionId]: feedback }));
    setNotice(feedback);
  };

  if (decisionRecords.length === 0) {
    return null;
  }

  if (!selectedDecision) {
    return (
      <WorkspaceShell>
        <DecisionHeader
          breadcrumbs={[{ label: "AIOS", href: baseHref }, { label: "Decision Center" }]}
          actions={headerActions}
          searchValue={searchValue}
          onSearch={setSearchValue}
        />
        <div className="rounded-xl border border-border bg-white p-6 text-center">
          <p className="text-sm text-text-secondary">No sample decisions match the current search and filters.</p>
          <button
            type="button"
            className="mt-3 rounded-lg border border-border px-3 py-2 text-sm font-medium text-brand-navy hover:border-brand-primary/40"
            onClick={() => {
              setSearchValue("");
              setActiveFilter(null);
            }}
          >
            Clear search and filters
          </button>
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell>
      <DecisionHeader
        breadcrumbs={[{ label: "AIOS", href: baseHref }, { label: "Decision Center" }]}
        actions={headerActions}
        searchValue={searchValue}
        onSearch={setSearchValue}
      />

      {isDemo ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900" role="note">
          Synthetic decision examples. Preview actions are stored only in this page session; no approval or workflow service is connected.
        </div>
      ) : null}
      {notice ? <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900" role="status" aria-live="polite">{notice}</p> : null}

      <WorkspaceGrid className="xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <DecisionLeftRail
          sections={decisionSidebarSections}
          activeFilter={activeFilter}
          onSelectFilter={(id) => {
            setActiveFilter(id);
            setNotice(`Showing ${id.replace("-", " ")} sample decisions.`);
          }}
          onClearFilter={() => {
            setActiveFilter(null);
            setNotice("Decision filters cleared.");
          }}
        />

        <main className="space-y-4" aria-label="Decision center main panel">
          <DecisionSummaryStrip decision={selectedDecision} />

          <WorkspaceSection id="decision-kpi" title="Executive KPI Strip" subtitle="Enterprise decision metrics" actionLabel="AIOS">
            <DecisionKpiStrip metrics={decisionMetrics} />
          </WorkspaceSection>

          <WorkspaceSection id="decision-ribbon" title="Decision Intelligence Ribbon" subtitle="Live decision stream" actionLabel="AIOS">
            <DecisionIntelligenceRibbon items={decisionRibbonItems} />
          </WorkspaceSection>

          {isDemo && hasPermission("view_dashboard") ? (
            <WorkspaceSection id="role-based-business-intelligence" title="Role-Based Business Intelligence" subtitle="Explainable, permission-filtered sample signals" actionLabel="AIOS">
              <RbiIntelligencePanel
                items={syntheticRbiIntelligence}
                roleId={intelligenceRoleToRoleId(activeRole)}
                grantedPermissions={effectivePermissions}
                memoryRecords={demoBusinessMemory}
                organizationId={organization?.id}
              />
            </WorkspaceSection>
          ) : null}

          <WorkspaceSection id="decision-cards" title="AI Decision Cards" subtitle="Recommendations ready for action" actionLabel="AIOS">
            <DecisionExplorer
              decisions={filteredDecisions}
              selectedId={selectedDecision.id}
              onSelect={setSelectedDecisionId}
              filters={decisionFilters}
              onAction={isDemo ? recordDemoAction : undefined}
              actionFeedback={actionFeedback}
            />
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
