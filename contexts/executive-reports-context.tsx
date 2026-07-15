"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useDecisionEngineContext } from "@/contexts/decision-engine-context"
import { useExecutiveWorkspaceContext } from "@/contexts/executive-workspace-context"
import { useGovernanceContext } from "@/contexts/governance-context"
import { useIntegrationContext } from "@/contexts/integration-context"
import { useKnowledgeGraphContext } from "@/contexts/knowledge-graph-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import { useWorkflowBuilderContext } from "@/contexts/workflow-builder-context"
import type {
  ExecutiveBoardReportTemplate,
  ExecutiveReportsState,
  ExecutiveTrendSeries,
} from "@/types"
import { createExecutiveReportsDefaults, selectBoardReport, selectExecutiveTrend } from "@/utils/executive-reports"

type ExecutiveReportsContextValue = ExecutiveReportsState & {
  selectedTrend: ExecutiveTrendSeries | null
  selectedReport: ExecutiveBoardReportTemplate | null
  setSelectedTrendId: (id: string) => void
  setSelectedReportId: (id: string) => void
  setLiveMode: (enabled: boolean) => void
}

const ExecutiveReportsContext = createContext<ExecutiveReportsContextValue | null>(null)

export function ExecutiveReportsProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => createExecutiveReportsDefaults(), [])
  const executive = useExecutiveWorkspaceContext()
  const decisionEngine = useDecisionEngineContext()
  const governance = useGovernanceContext()
  const integrations = useIntegrationContext()
  const knowledgeGraph = useKnowledgeGraphContext()
  const runtimeLive = useRuntimeLiveContext()
  const workflowBuilder = useWorkflowBuilderContext()
  const { addEntry } = useMemoryContext()

  const [overview, setOverview] = useState(defaults.overview)
  const [strategicKPIs, setStrategicKPIs] = useState(defaults.strategicKPIs)
  const [operationalSummary, setOperationalSummary] = useState(defaults.operationalSummary)
  const [recommendations, setRecommendations] = useState(defaults.recommendations)
  const [riskCategories, setRiskCategories] = useState(defaults.riskCategories)
  const [departmentPerformance, setDepartmentPerformance] = useState(defaults.departmentPerformance)
  const [trendSeries, setTrendSeries] = useState(defaults.trendSeries)
  const [timeline, setTimeline] = useState(defaults.timeline)
  const [boardReports, setBoardReports] = useState(defaults.boardReports)
  const [selectedTrendId, setSelectedTrendId] = useState(defaults.selectedTrendId)
  const [selectedReportId, setSelectedReportId] = useState(defaults.selectedReportId)
  const [liveMode, setLiveMode] = useState(defaults.liveMode)

  const lastDecisionId = useRef<string | null>(null)

  useEffect(() => {
    setOverview((previous) =>
      previous.map((item) => {
        if (item.label === "Company Health") {
          return { ...item, value: String(executive.businessScore), delta: `${executive.health[0]?.delta ?? "+0"}`, trend: executive.health[0]?.trend ?? item.trend }
        }
        if (item.label === "AI Confidence") {
          return { ...item, value: `${decisionEngine.selectedConfidence?.score ?? 89}%`, delta: `${decisionEngine.selectedConfidence ? "+1 pt" : item.delta}`, trend: decisionEngine.selectedConfidence?.level === "low" ? "down" : "up" }
        }
        if (item.label === "Operational Efficiency") {
          return { ...item, value: `${Math.max(70, 100 - runtimeLive.pendingTasks)}%`, delta: `${runtimeLive.queueDepth > 10 ? "-1.2%" : "+0.8%"}`, trend: runtimeLive.queueDepth > 10 ? "down" : "up" }
        }
        if (item.label === "Strategic Progress") {
          return { ...item, value: `${knowledgeGraph.visibleNodes.length + 62}%`, delta: `+${knowledgeGraph.visibleEdges.length} linked paths`, trend: "up" }
        }
        return item
      })
    )

    setStrategicKPIs((previous) =>
      previous.map((item) => {
        if (item.label === "Knowledge Coverage") {
          return { ...item, value: `${Math.min(99, 70 + knowledgeGraph.visibleNodes.length)}%`, confidence: 80 }
        }
        if (item.label === "AI Decision Accuracy") {
          return { ...item, value: `${Math.min(98, 72 + governance.summary.explainabilityCoverage / 4)}%`, confidence: decisionEngine.selectedConfidence?.score ?? item.confidence }
        }
        return item
      })
    )

    setOperationalSummary({
      runtime: `Runtime Engine processed ${runtimeLive.events.length || 1284} recent events with queue depth ${runtimeLive.queueDepth}.`,
      memory: `Persistent Memory holds ${runtimeLive.memoryUpdates.length} recent updates supporting executive narratives and board evidence.`,
      replay: `Replay coverage is represented through governance evidence and decision lineage for recent anomalies.`,
      workflows: workflowBuilder.selectedWorkflow ? `Workflow Builder is currently focused on ${workflowBuilder.selectedWorkflow.name}.` : defaults.operationalSummary.workflows,
      integrations: `${integrations.connectedSystems.length} enterprise systems are connected with ${integrations.healthSummary.length} health states currently tracked.`,
    })

    setDepartmentPerformance((previous) =>
      previous.map((item) =>
        item.department === "Support"
          ? { ...item, agentUtilization: Math.min(99, 70 + runtimeLive.runningAgents * 2), workload: runtimeLive.pendingTasks > 4 ? "High" : item.workload, trend: runtimeLive.pendingTasks > 4 ? "down" : item.trend }
          : item.department === "Operations"
            ? { ...item, efficiency: Math.min(96, 76 + workflowBuilder.execution.steps.length), trend: workflowBuilder.execution.running ? "up" : item.trend }
            : item
      )
    )
  }, [
    decisionEngine.selectedConfidence?.score,
    decisionEngine.selectedConfidence?.level,
    executive.businessScore,
    executive.health[0]?.delta,
    executive.health[0]?.trend,
    integrations.connectedSystems.length,
    integrations.healthSummary.length,
    knowledgeGraph.visibleEdges.length,
    knowledgeGraph.visibleNodes.length,
    runtimeLive.events.length,
    runtimeLive.memoryUpdates.length,
    runtimeLive.pendingTasks,
    runtimeLive.queueDepth,
    runtimeLive.runningAgents,
    workflowBuilder.execution.running,
    workflowBuilder.execution.steps.length,
    workflowBuilder.selectedWorkflow?.name,
    defaults.operationalSummary.workflows,
  ])

  useEffect(() => {
    const decision = decisionEngine.selectedDecision
    if (!decision || decision.id === lastDecisionId.current) {
      return
    }

    lastDecisionId.current = decision.id
    setRecommendations((previous) => [
      {
        id: `rec-${decision.id}`,
        title: decision.title,
        description: decision.summary,
        businessImpact: decision.businessImpact,
        confidence: decision.confidence,
        risk: decision.riskLevel,
        estimatedROI: decision.estimatedROI,
        nextStep: decisionEngine.selectedActions[0]?.title ?? "Review executive action",
      },
      ...previous,
    ].slice(0, 6))
    setTimeline((previous) => [
      {
        id: `report-timeline-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        title: "Major decision updated",
        detail: `${decision.title} influenced executive reporting priorities.`,
        kind: "decision",
      },
      ...previous,
    ].slice(0, 12))
  }, [decisionEngine.selectedActions[0]?.title, decisionEngine.selectedDecision?.id, decisionEngine.selectedDecision?.title, decisionEngine.selectedDecision?.summary, decisionEngine.selectedDecision?.businessImpact, decisionEngine.selectedDecision?.confidence, decisionEngine.selectedDecision?.riskLevel, decisionEngine.selectedDecision?.estimatedROI])

  useEffect(() => {
    if (!liveMode) {
      return
    }

    const timer = window.setInterval(() => {
      setTrendSeries((previous) =>
        previous.map((series, index) => ({
          ...series,
          points: series.points.map((point, pointIndex) => ({
            ...point,
            value: Math.max(40, Math.min(96, point.value + (index === 0 && pointIndex === series.points.length - 1 ? 1 : 0))),
          })),
        }))
      )
    }, 4200)

    return () => window.clearInterval(timer)
  }, [liveMode])

  useEffect(() => {
    setRiskCategories((previous) =>
      previous.map((item) => {
        if (item.label === "Compliance Risk") {
          return { ...item, score: governance.summary.complianceAttention > 0 ? 55 : 42, trend: governance.summary.complianceAttention > 0 ? "up" : "flat" }
        }
        if (item.label === "Customer Risk") {
          return { ...item, score: governance.selectedRisk ? Math.max(70, governance.selectedRisk.businessRisk) : item.score, trend: governance.selectedRisk?.trend ?? item.trend }
        }
        return item
      })
    )
  }, [governance.selectedRisk?.businessRisk, governance.selectedRisk?.trend, governance.summary.complianceAttention])

  useEffect(() => {
    setBoardReports((previous) => previous.map((report) => report.id === "report-quarterly" ? { ...report, status: governance.summary.explainabilityCoverage > 90 ? "ready" : "draft" } : report))
  }, [governance.summary.explainabilityCoverage])

  const selectedTrend = useMemo(() => selectExecutiveTrend(trendSeries, selectedTrendId), [selectedTrendId, trendSeries])
  const selectedReport = useMemo(() => selectBoardReport(boardReports, selectedReportId), [boardReports, selectedReportId])

  useEffect(() => {
    if (!selectedReport) {
      return
    }

    addEntry({
      id: `board-report-${Date.now()}`,
      contextId: selectedReport.id,
      summary: `Board report template inspected: ${selectedReport.name}`,
      createdAt: Date.now(),
    })
  }, [addEntry, selectedReport?.id])

  const value = useMemo<ExecutiveReportsContextValue>(
    () => ({
      overview,
      strategicKPIs,
      operationalSummary,
      recommendations,
      riskCategories,
      departmentPerformance,
      trendSeries,
      timeline,
      boardReports,
      selectedTrendId,
      selectedReportId,
      liveMode,
      selectedTrend,
      selectedReport,
      setSelectedTrendId,
      setSelectedReportId,
      setLiveMode,
    }),
    [boardReports, departmentPerformance, liveMode, operationalSummary, overview, recommendations, riskCategories, selectedReport, selectedReportId, selectedTrend, selectedTrendId, strategicKPIs, timeline, trendSeries]
  )

  return <ExecutiveReportsContext.Provider value={value}>{children}</ExecutiveReportsContext.Provider>
}

export function useExecutiveReportsContext() {
  const context = useContext(ExecutiveReportsContext)
  if (!context) {
    throw new Error("useExecutiveReportsContext must be used within ExecutiveReportsProvider")
  }

  return context
}