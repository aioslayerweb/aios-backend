"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WorkspaceGrid, WorkspaceShell } from "@/components/workspace";
import { useNavigationBase } from "@/contexts/navigation-context";
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
  const [searchValue, setSearchValue] = useState("");
  const [notice, setNotice] = useState("");
  const { baseHref } = useNavigationBase();

  const visibleNodes = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return workflowBuilderData.nodes;
    return workflowBuilderData.nodes.filter((node) =>
      [node.title, node.type, node.owner, node.description].some((value) => value.toLowerCase().includes(query))
    );
  }, [searchValue]);
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = workflowBuilderData.edges.filter((edge) => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to));
  const selectedNode = visibleNodes.find((node) => node.id === selectedNodeId) ?? visibleNodes[0];
  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleHeaderAction = (id: string) => {
    if (id === "templates") {
      jumpTo("workflow-templates");
    } else if (id === "history") {
      jumpTo("workflow-history");
    } else if (id === "new") {
      setNotice("Workflow creation is not connected. The sample workflow was not changed.");
    } else if (id === "import") {
      setNotice("Workflow import is not connected. No workflow file was imported.");
    } else if (id === "publish") {
      setNotice("Publishing is not connected. No workflow was deployed.");
    }
  };

  const handleToolbarAction = (id: string) => {
    if (id === "simulation") {
      jumpTo("workflow-simulation");
      setNotice(`Local simulation preview for ${workflowBuilderData.nodes.length} sample nodes; no workflow was executed.`);
    } else if (id === "validate") {
      const nodeIds = new Set(workflowBuilderData.nodes.map((node) => node.id));
      const invalidEdges = workflowBuilderData.edges.filter((edge) => !nodeIds.has(edge.from) || !nodeIds.has(edge.to));
      setNotice(invalidEdges.length
        ? `Sample graph validation found ${invalidEdges.length} edge${invalidEdges.length === 1 ? "" : "s"} with missing node references.`
        : `Sample graph validation passed: ${workflowBuilderData.nodes.length} nodes and ${workflowBuilderData.edges.length} connections. This does not publish or execute the workflow.`);
    } else if (id === "publish") {
      setNotice("Publishing is not connected. No workflow was deployed.");
    } else if (id === "versions") {
      jumpTo("workflow-history");
    } else if (id === "zoom") {
      jumpTo("workflow-canvas");
    } else if (id === "undo" || id === "redo") {
      setNotice("The sample workflow is read-only; there are no local edits to undo or redo.");
    } else if (id === "minimap") {
      setNotice("A workflow minimap is not available in this preview.");
    }
  };

  const headerActions = primaryHeaderActions.map((action) => ({
    ...action,
    onClick: () => handleHeaderAction(action.id),
  }));
  const toolbarActionsWithHandlers = toolbarActions.map((action) => ({
    ...action,
    onClick: () => handleToolbarAction(action.id),
  }));
  const libraryLinks = workflowBuilderData.leftLibrary.map((item) => ({
    ...item,
    href: item.href.replace(/^\/app/, baseHref),
  }));
  const templateLinks = workflowBuilderData.templates.map((item) => ({ ...item, href: "#workflow-templates" }));
  const canvasLinks = (items: typeof workflowBuilderData.favorites) => items.map((item) => ({ ...item, href: "#workflow-canvas" }));

  if (!selectedNode) {
    return (
      <WorkspaceShell>
        <WorkflowHeader
          actions={headerActions}
          searchValue={searchValue}
          onSearch={setSearchValue}
        />
        <div className="rounded-xl border border-border bg-white p-6 text-center">
          <p className="text-sm text-text-secondary">No sample workflow nodes match this search.</p>
          <button type="button" className="mt-3 rounded-lg border border-border px-3 py-2 text-sm font-medium text-brand-navy" onClick={() => setSearchValue("")}>
            Clear search
          </button>
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell>
      <WorkflowHeader actions={headerActions} searchValue={searchValue} onSearch={setSearchValue} />
      {notice ? <p className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900" role="status" aria-live="polite">{notice}</p> : null}

      <WorkspaceGrid className="2xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3" aria-label="Workflow builder left sidebar">
          <SidebarSection title="Workflow Library" items={libraryLinks} />
          <SidebarSection title="Templates" items={templateLinks} />
          <SidebarSection title="Favorites" items={canvasLinks(workflowBuilderData.favorites)} />
          <SidebarSection title="Recent Workflows" items={canvasLinks(workflowBuilderData.recent)} />
          <SidebarSection title="Categories" items={canvasLinks(workflowBuilderData.categories)} />
          <SidebarSection title="Teams" items={canvasLinks(workflowBuilderData.teams)} />
          <SidebarSection
            title="Node Palette"
            items={workflowBuilderData.nodePalette.map((item) => ({
              id: item.type,
              label: item.label,
              meta: item.type,
              href: "#workflow-canvas",
            }))}
            onSelect={(item) => {
              const match = workflowBuilderData.nodes.find((node) => node.type === item.id);
              if (match) {
                setSearchValue("");
                setSelectedNodeId(match.id);
                jumpTo("workflow-canvas");
                setNotice(`Selected the existing sample ${item.label} node. The read-only canvas did not add a node.`);
              } else {
                setNotice(`No ${item.label} node exists in this sample workflow; the read-only canvas cannot add nodes.`);
              }
            }}
          />
        </motion.aside>

        <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" aria-label="Workflow builder main panel">
          <WorkflowToolbar actions={toolbarActionsWithHandlers} />

          <div id="workflow-canvas">
            <WorkflowCanvas
              nodes={visibleNodes}
              edges={visibleEdges}
              selectedNodeId={selectedNode.id}
              onSelectNode={setSelectedNodeId}
            />
          </div>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Workflow Intelligence</h2>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {workflowBuilderData.intelligence.map((metric) => (
                <WorkflowIntelligenceCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>

          <div id="workflow-simulation"><SimulationPanel items={workflowBuilderData.simulation} /></div>
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

          <section className="grid gap-4 xl:grid-cols-3" id="workflow-history">
            <VersionTimeline entries={workflowBuilderData.executionHistory} />
            <Suspense fallback={<div className="rounded-xl border border-border bg-white p-4 text-sm text-text-muted">Loading decision timeline...</div>}>
              <LazyDecisionTimeline entries={workflowBuilderData.recentExecutions} />
            </Suspense>
            <ExecutionTimeline entries={workflowBuilderData.recentExecutions} />
          </section>

          <section id="workflow-templates">
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
