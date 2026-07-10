"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WorkspaceGrid, WorkspaceShell } from "@/components/workspace";
import {
  BusinessOutcomeCard,
  ExecutionTimeline,
  InspectorPanel,
  OptimizationPanel,
  OrganizationContext,
  SidebarSection,
  SimulationPanel,
  VersionTimeline,
  WorkflowAnalyticsCard,
  WorkflowCanvas,
  WorkflowHeader,
  WorkflowIntelligenceCard,
  WorkflowTemplateCard,
  WorkflowToolbar,
} from "./workflow-builder-v12-components";
import {
  primaryHeaderActions,
  toolbarActions,
  workflowBuilderData,
} from "./mock-data";

const LazyDecisionTimeline = lazy(async () => ({
  default: (await import("./workflow-builder-v12-components")).DecisionTimeline,
}));

export function WorkflowBuilderV12() {
  const [selectedNodeId, setSelectedNodeId] = useState(workflowBuilderData.nodes[3]?.id || workflowBuilderData.nodes[0]?.id || "");

  const selectedNode = useMemo(
    () => workflowBuilderData.nodes.find((node) => node.id === selectedNodeId) || workflowBuilderData.nodes[0],
    [selectedNodeId]
  );

  if (!selectedNode) {
    return null;
  }

  return (
    <WorkspaceShell>
      <WorkflowHeader actions={primaryHeaderActions} />

      <WorkspaceGrid className="2xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3" aria-label="Workflow builder left sidebar">
          <SidebarSection title="Workflow Library" items={workflowBuilderData.leftLibrary} />
          <SidebarSection title="Templates" items={workflowBuilderData.templates} />
          <SidebarSection title="Favorites" items={workflowBuilderData.favorites} />
          <SidebarSection title="Recent Workflows" items={workflowBuilderData.recent} />
          <SidebarSection title="Categories" items={workflowBuilderData.categories} />
          <SidebarSection title="Teams" items={workflowBuilderData.teams} />
          <SidebarSection
            title="Node Palette"
            items={workflowBuilderData.nodePalette.map((item) => ({
              id: item.type,
              label: item.label,
              meta: item.type,
              href: "#",
            }))}
          />
        </motion.aside>

        <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" aria-label="Workflow builder main panel">
          <WorkflowToolbar actions={toolbarActions} />

          <WorkflowCanvas
            nodes={workflowBuilderData.nodes}
            edges={workflowBuilderData.edges}
            selectedNodeId={selectedNode.id}
            onSelectNode={setSelectedNodeId}
          />

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Workflow Intelligence</h2>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {workflowBuilderData.intelligence.map((metric) => (
                <WorkflowIntelligenceCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>

          <SimulationPanel items={workflowBuilderData.simulation} />
          <OptimizationPanel recommendations={workflowBuilderData.optimization} />
          <OrganizationContext chips={workflowBuilderData.organizationContext} />

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Business Outcome Summary</h2>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {workflowBuilderData.businessOutcomes.map((metric) => (
                <BusinessOutcomeCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Workflow Analytics</h2>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {workflowBuilderData.analytics.map((metric) => (
                <WorkflowAnalyticsCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <VersionTimeline entries={workflowBuilderData.executionHistory} />
            <Suspense fallback={<div className="rounded-xl border border-border bg-white p-4 text-sm text-text-muted">Loading decision timeline...</div>}>
              <LazyDecisionTimeline entries={workflowBuilderData.recentExecutions} />
            </Suspense>
            <ExecutionTimeline entries={workflowBuilderData.recentExecutions} />
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Workflow Templates</h2>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {workflowBuilderData.templates.map((template) => (
                <WorkflowTemplateCard key={template.id} item={template} />
              ))}
            </div>
          </section>
        </motion.main>

        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3" aria-label="Workflow builder right inspector">
          <InspectorPanel
            selectedNode={selectedNode}
            decisionMetrics={workflowBuilderData.decisionIntelligence}
            inputs={workflowBuilderData.inspectorInputs}
            outputs={workflowBuilderData.inspectorOutputs}
            permissions={workflowBuilderData.permissions}
            knowledgeSources={workflowBuilderData.knowledgeSources}
            memoryCollections={workflowBuilderData.memoryCollections}
            policies={workflowBuilderData.policies}
            runtimeSettings={workflowBuilderData.runtimeSettings}
            connectedMcpTools={workflowBuilderData.connectedMcpTools}
            executionHistory={workflowBuilderData.executionHistory}
            suggestedImprovements={workflowBuilderData.suggestedImprovements}
          />
        </motion.aside>
      </WorkspaceGrid>
    </WorkspaceShell>
  );
}
