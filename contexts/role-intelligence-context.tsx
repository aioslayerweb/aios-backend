"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useActivityFeedContext } from "@/contexts/activity-feed-context"
import { useDecisionEngineContext } from "@/contexts/decision-engine-context"
import { useExecutiveReportsContext } from "@/contexts/executive-reports-context"
import { useGovernanceContext } from "@/contexts/governance-context"
import { useKnowledgeGraphContext } from "@/contexts/knowledge-graph-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { usePlanningEngineContext } from "@/contexts/planning-engine-context"
import { usePromptOSContext } from "@/contexts/prompt-os-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import { useWorkflowBuilderContext } from "@/contexts/workflow-builder-context"
import type { ActivityItem, NotificationCreateInput, RoleContextState, RoleId, RoleProfile, RoleSnapshot } from "@/types"
import { buildRoleDashboard, createRoleIntelligenceDefaults, roleOrder, roleProfiles } from "@/utils/role-intelligence"

type RoleIntelligenceContextValue = RoleContextState & {
  setCurrentRoleId: (roleId: RoleId) => void
  setPreviewRoleId: (roleId: RoleId | null) => void
  setSimulationEnabled: (enabled: boolean) => void
}

const RoleIntelligenceContext = createContext<RoleIntelligenceContextValue | null>(null)

function createRoleActivity(role: RoleProfile): ActivityItem {
  return {
    id: `role-intelligence-${role.id}-${Date.now()}`,
    title: `${role.label} lens activated`,
    summary: `AIOS is now optimized for ${role.homeSummary.toLowerCase()}`,
    timestamp: Date.now(),
    category: "ai-runtime",
    source: {
      key: "ai-runtime",
      label: "Role Intelligence",
      workspace: "Executive",
    },
    actor: {
      id: "role-intelligence",
      name: "Role Intelligence Layer",
      kind: "system",
    },
    priority: "medium",
    pinned: false,
    unread: true,
    metadata: {
      eventType: "AI Decision",
      workspace: "Executive",
      status: "success",
      relatedObjects: [{ type: "role", id: role.id, label: role.label }],
      tags: ["role-intelligence", role.category, role.id],
    },
  }
}

export function RoleIntelligenceProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => createRoleIntelligenceDefaults(), [])
  const runtimeLive = useRuntimeLiveContext()
  const decisionEngine = useDecisionEngineContext()
  const planningEngine = usePlanningEngineContext()
  const governance = useGovernanceContext()
  const knowledgeGraph = useKnowledgeGraphContext()
  const executiveReports = useExecutiveReportsContext()
  const workflowBuilder = useWorkflowBuilderContext()
  const prompt = usePromptOSContext()
  const { addEntry } = useMemoryContext()
  const { addActivity } = useActivityFeedContext()
  const { notify } = useNotificationContext()

  const [currentRoleId, setCurrentRoleIdState] = useState<RoleId>(defaults.currentRoleId)
  const [previewRoleId, setPreviewRoleIdState] = useState<RoleId | null>(defaults.previewRoleId)
  const [simulationEnabled, setSimulationEnabledState] = useState(defaults.simulationEnabled)

  const currentRole = roleProfiles[currentRoleId]
  const previewRole = previewRoleId ? roleProfiles[previewRoleId] : null
  const effectiveRole = simulationEnabled && previewRole ? previewRole : currentRole

  const snapshot = useMemo<RoleSnapshot>(
    () => ({
      runtimeQueueDepth: runtimeLive.queueDepth,
      runtimePendingTasks: runtimeLive.pendingTasks,
      runtimeRunningAgents: runtimeLive.runningAgents,
      runtimeEventCount: runtimeLive.events.length,
      decisionSummary: decisionEngine.summary,
      decisionConfidence: decisionEngine.selectedConfidence?.score ?? null,
      decisionRisk: decisionEngine.selectedDecision?.riskLevel ?? null,
      planningFocus: planningEngine.selectedPlan?.objective ?? planningEngine.selectedGoal?.title ?? "",
      planningConfidence: planningEngine.selectedPlan?.confidence ?? null,
      complianceAttention: governance.summary.complianceAttention,
      explainabilityCoverage: governance.summary.explainabilityCoverage,
      knowledgeNodes: knowledgeGraph.visibleNodes.length,
      knowledgeEdges: knowledgeGraph.visibleEdges.length,
      activeWorkflow: workflowBuilder.selectedWorkflow?.name ?? null,
      workflowRunning: workflowBuilder.execution.running,
      promptPreview: prompt.prompt,
      boardReportName: executiveReports.selectedReport?.name ?? null,
    }),
    [decisionEngine.selectedConfidence?.score, decisionEngine.selectedDecision?.riskLevel, decisionEngine.summary, executiveReports.selectedReport?.name, governance.summary.complianceAttention, governance.summary.explainabilityCoverage, knowledgeGraph.visibleEdges.length, knowledgeGraph.visibleNodes.length, planningEngine.selectedGoal?.title, planningEngine.selectedPlan?.confidence, planningEngine.selectedPlan?.objective, prompt.prompt, runtimeLive.events.length, runtimeLive.pendingTasks, runtimeLive.queueDepth, runtimeLive.runningAgents, workflowBuilder.execution.running, workflowBuilder.selectedWorkflow?.name]
  )

  const roleDashboard = useMemo(() => buildRoleDashboard(effectiveRole, snapshot), [effectiveRole, snapshot])

  const lastRoleId = useRef<RoleId | null>(null)

  useEffect(() => {
    if (lastRoleId.current === effectiveRole.id) {
      return
    }

    lastRoleId.current = effectiveRole.id

    addEntry({
      id: `role-memory-${effectiveRole.id}-${Date.now()}`,
      contextId: "role-intelligence",
      summary: `Role intelligence activated for ${effectiveRole.label}.`,
      createdAt: Date.now(),
    })

    addActivity(createRoleActivity(effectiveRole))

    const notification: NotificationCreateInput = {
      title: `${effectiveRole.label} intelligence active`,
      description: `AIOS now prioritizes ${effectiveRole.currentPriorities[0] ?? "the current role context"}.`,
      level: "INFO",
      category: "AI",
      priority: "MEDIUM",
      source: "Role Intelligence",
      toast: true,
      autoDismissMs: 3600,
    }

    notify(notification)
  }, [addActivity, addEntry, effectiveRole, notify])

  useEffect(() => {
    if (!simulationEnabled) {
      setPreviewRoleIdState(null)
    }
  }, [simulationEnabled])

  const setCurrentRoleId = useCallback((roleId: RoleId) => {
    setCurrentRoleIdState(roleId)
  }, [])

  const setPreviewRoleId = useCallback((roleId: RoleId | null) => {
    setPreviewRoleIdState(roleId)
  }, [])

  const setSimulationEnabled = useCallback((enabled: boolean) => {
    setSimulationEnabledState(enabled)
  }, [])

  const value = useMemo<RoleIntelligenceContextValue>(
    () => ({
      currentRoleId,
      previewRoleId,
      simulationEnabled,
      currentRole,
      previewRole,
      effectiveRole,
      availableRoles: roleOrder.map((roleId) => roleProfiles[roleId]),
      roleDashboard,
      setCurrentRoleId,
      setPreviewRoleId,
      setSimulationEnabled,
    }),
    [currentRole, currentRoleId, effectiveRole, previewRole, previewRoleId, roleDashboard, simulationEnabled, setCurrentRoleId, setPreviewRoleId, setSimulationEnabled]
  )

  return <RoleIntelligenceContext.Provider value={value}>{children}</RoleIntelligenceContext.Provider>
}

export function useRoleIntelligenceContext() {
  const context = useContext(RoleIntelligenceContext)
  if (!context) {
    throw new Error("useRoleIntelligenceContext must be used within RoleIntelligenceProvider")
  }

  return context
}