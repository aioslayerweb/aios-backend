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
import { useKnowledgeGraphContext } from "@/contexts/knowledge-graph-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { usePlanningEngineContext } from "@/contexts/planning-engine-context"
import { useRoleIntelligenceContext } from "@/contexts/role-intelligence-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import { useWorkflowBuilderContext } from "@/contexts/workflow-builder-context"
import { useIntegrationContext } from "@/contexts/integration-context"
import { useSecurityContext } from "@/contexts/security-context"
import type { ActivityItem, OrgIntelligenceContextState, OrgIntelligenceSnapshot, OrgStructureItem } from "@/types"
import { buildOrganizationSnapshot, createOrganizationIntelligenceDefaults, filterOrgItems, selectOrganizationItem } from "@/utils/organization-intelligence"

type OrganizationIntelligenceContextValue = OrgIntelligenceContextState & {
  snapshot: OrgIntelligenceSnapshot
}

const OrganizationIntelligenceContext = createContext<OrganizationIntelligenceContextValue | null>(null)

function createOrgActivity(label: string, detail: string, id: string): ActivityItem {
  return {
    id: `org-intelligence-${id}-${Date.now()}`,
    title: label,
    summary: detail,
    timestamp: Date.now(),
    category: "ai-runtime",
    source: { key: "ai-runtime", label: "Organization Intelligence", workspace: "Executive" },
    actor: { id: "organization-intelligence", name: "Organization Intelligence Layer", kind: "system" },
    priority: "medium",
    pinned: false,
    unread: true,
    metadata: {
      eventType: "AI Decision",
      workspace: "Executive",
      status: "success",
      relatedObjects: [{ type: "organization", id, label }],
      tags: ["organization-intelligence", id],
    },
  }
}

export function OrganizationIntelligenceProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => createOrganizationIntelligenceDefaults(), [])
  const security = useSecurityContext()
  const role = useRoleIntelligenceContext()
  const runtimeLive = useRuntimeLiveContext()
  const decisionEngine = useDecisionEngineContext()
  const planningEngine = usePlanningEngineContext()
  const executiveReports = useExecutiveReportsContext()
  const knowledgeGraph = useKnowledgeGraphContext()
  const workflowBuilder = useWorkflowBuilderContext()
  const integrations = useIntegrationContext()
  const { addEntry } = useMemoryContext()
  const { addActivity } = useActivityFeedContext()

  const [organizations] = useState(defaults.organizations)
  const [businessUnits] = useState(defaults.businessUnits)
  const [regions] = useState(defaults.regions)
  const [departments] = useState(defaults.departments)
  const [teams] = useState(defaults.teams)
  const [squads] = useState(defaults.squads)
  const [employees] = useState(defaults.employees)
  const [externalPartners] = useState(defaults.externalPartners)
  const [contractors] = useState(defaults.contractors)
  const [customers] = useState(defaults.customers)
  const [vendors] = useState(defaults.vendors)
  const [chartNodes] = useState(defaults.chartNodes)
  const [chartEdges] = useState(defaults.chartEdges)
  const [teamHealth] = useState(defaults.teamHealth)
  const [objectives] = useState(defaults.objectives)
  const [decisionPaths] = useState(defaults.decisionPaths)
  const [collaborationEdges] = useState(defaults.collaborationEdges)
  const [timeline, setTimeline] = useState(defaults.timeline)
  const [selectedOrganizationId, setSelectedOrganizationIdState] = useState(defaults.selectedOrganizationId)
  const [selectedDepartmentId, setSelectedDepartmentIdState] = useState(defaults.selectedDepartmentId)
  const [selectedTeamId, setSelectedTeamIdState] = useState(defaults.selectedTeamId)
  const [query, setQuery] = useState(defaults.query)
  const [liveMode, setLiveMode] = useState(defaults.liveMode)

  const selectedOrganization = useMemo(() => security.selectedOrganization ?? organizations.find((item) => item.id === selectedOrganizationId) ?? organizations[0] ?? null, [organizations, security.selectedOrganization, selectedOrganizationId])
  const selectedDepartment = useMemo(() => selectOrganizationItem(departments, selectedDepartmentId), [departments, selectedDepartmentId])
  const selectedTeam = useMemo(() => selectOrganizationItem(teams, selectedTeamId), [selectedTeamId, teams])

  const filteredDepartments = useMemo(() => filterOrgItems(departments, query), [departments, query])
  const filteredTeams = useMemo(() => filterOrgItems(teams, query), [teams, query])
  const filteredObjectives = useMemo(() => filterOrgItems(objectives, query), [objectives, query])

  const snapshot = useMemo<OrgIntelligenceSnapshot>(
    () =>
      buildOrganizationSnapshot({
        organizations,
        workspaces: security.workspaces,
        users: security.users,
        teams: security.teams,
        integrationCount: integrations.connectedSystems.length,
        integrationHealthCount: integrations.healthSummary.length,
        runtimeQueueDepth: runtimeLive.queueDepth,
        runtimePendingTasks: runtimeLive.pendingTasks,
        runtimeRunningAgents: runtimeLive.runningAgents,
        memoryEntries: runtimeLive.memoryUpdates.length,
        decisionSummary: decisionEngine.summary,
        decisionConfidence: decisionEngine.selectedConfidence?.score ?? null,
        planningObjective: planningEngine.selectedPlan?.objective ?? planningEngine.selectedGoal?.title ?? "",
        planningConfidence: planningEngine.selectedPlan?.confidence ?? null,
        knowledgeNodes: knowledgeGraph.visibleNodes.length,
        knowledgeEdges: knowledgeGraph.visibleEdges.length,
        workflowName: workflowBuilder.selectedWorkflow?.name ?? null,
        workflowRunning: workflowBuilder.execution.running,
        boardReportName: executiveReports.selectedReport?.name ?? null,
        currentRoleLabel: role.currentRole.label,
        currentRoleId: role.currentRole.id,
      }),
    [organizations, security.teams, security.users, security.workspaces, decisionEngine.selectedConfidence?.score, decisionEngine.summary, executiveReports.selectedReport?.name, knowledgeGraph.visibleEdges.length, knowledgeGraph.visibleNodes.length, planningEngine.selectedGoal?.title, planningEngine.selectedPlan?.confidence, planningEngine.selectedPlan?.objective, role.currentRole.id, role.currentRole.label, runtimeLive.memoryUpdates.length, runtimeLive.pendingTasks, runtimeLive.queueDepth, runtimeLive.runningAgents, workflowBuilder.execution.running, workflowBuilder.selectedWorkflow?.name]
  )

  const lastDepartmentId = useRef<string | null>(null)

  useEffect(() => {
    if (lastDepartmentId.current === selectedDepartment?.id) {
      return
    }

    lastDepartmentId.current = selectedDepartment?.id ?? null

    if (!selectedDepartment) {
      return
    }

    addEntry({
      id: `org-memory-${selectedDepartment.id}-${Date.now()}`,
      contextId: "organization-intelligence",
      summary: `Organization intelligence focused on ${selectedDepartment.label}.`,
      createdAt: Date.now(),
    })

    addActivity(createOrgActivity(`${selectedDepartment.label} selected`, selectedDepartment.summary, selectedDepartment.id))

    setTimeline((previous) => [
      {
        id: `timeline-${selectedDepartment.id}-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        title: `${selectedDepartment.label} analyzed`,
        detail: `Organization Intelligence mapped ownership, dependencies, and impact for ${selectedDepartment.label}.`,
        impact: selectedDepartment.summary,
      },
      ...previous,
    ].slice(0, 24))
  }, [addActivity, addEntry, selectedDepartment])

  const updateQuery = useCallback((nextQuery: string) => {
    setQuery(nextQuery)
  }, [])

  const setSelectedOrganizationId = useCallback((id: string) => {
    setSelectedOrganizationIdState(id)
  }, [])

  const setSelectedDepartmentId = useCallback((id: string) => {
    setSelectedDepartmentIdState(id)
  }, [])

  const setSelectedTeamId = useCallback((id: string) => {
    setSelectedTeamIdState(id)
  }, [])

  const value = useMemo<OrganizationIntelligenceContextValue>(
    () => ({
      organizations,
      businessUnits,
      regions,
      departments,
      teams,
      squads,
      employees,
      externalPartners,
      contractors,
      customers,
      vendors,
      chartNodes,
      chartEdges,
      teamHealth,
      objectives,
      decisionPaths,
      collaborationEdges,
      timeline,
      impactSummary: {
        ...defaults.impactSummary,
        departmentId: selectedDepartment?.id ?? defaults.impactSummary.departmentId,
        affectedWorkflows: workflowBuilder.selectedWorkflow ? [workflowBuilder.selectedWorkflow.name, ...defaults.impactSummary.affectedWorkflows].slice(0, 4) : defaults.impactSummary.affectedWorkflows,
        businessImpact: selectedDepartment ? `${selectedDepartment.label} influences ${role.effectiveRole.label} priorities through ${decisionEngine.selectedDecision?.title ?? "decision flow"}.` : defaults.impactSummary.businessImpact,
        dependencies: [
          ...(selectedDepartment?.summary ? [selectedDepartment.summary] : []),
          `Runtime queue depth ${runtimeLive.queueDepth}`,
          `Knowledge graph nodes ${knowledgeGraph.visibleNodes.length}`,
        ].slice(0, 4),
        risks: [
          ...(runtimeLive.queueDepth > 10 ? ["Backlog pressure"] : []),
          ...(decisionEngine.selectedDecision?.riskLevel ? [decisionEngine.selectedDecision.riskLevel] : []),
          ...(selectedDepartment ? ["Cross-functional dependency risk"] : []),
        ].slice(0, 4),
        initiatives: [
          ...(planningEngine.selectedPlan ? [planningEngine.selectedPlan.objective] : []),
          ...(executiveReports.selectedReport ? [executiveReports.selectedReport.name] : []),
          ...(workflowBuilder.selectedWorkflow ? [workflowBuilder.selectedWorkflow.name] : []),
        ].slice(0, 4),
        relatedKpis: [
          `Teams: ${security.teams.length}`,
          `Users: ${security.users.length}`,
          `Agents: ${runtimeLive.runningAgents}`,
          `Integrations: ${integrations.connectedSystems.length}`,
        ],
      },
      selectedOrganizationId,
      selectedDepartmentId: selectedDepartment?.id ?? selectedDepartmentId,
      selectedTeamId: selectedTeam?.id ?? selectedTeamId,
      query,
      liveMode,
      selectedDepartment,
      selectedTeam,
      selectedOrganization,
      filteredDepartments,
      filteredTeams,
      filteredObjectives,
      setSelectedOrganizationId,
      setSelectedDepartmentId,
      setSelectedTeamId,
      updateQuery,
      setLiveMode,
      snapshot,
    }),
    [chartEdges, chartNodes, collaborationEdges, contractors, customers, defaults.impactSummary, decisionEngine.selectedDecision?.riskLevel, decisionEngine.selectedDecision?.title, departments, employees, executiveReports.selectedReport, externalPartners, filteredDepartments, filteredObjectives, filteredTeams, integrations.connectedSystems.length, integrations.healthSummary.length, liveMode, objectives, organizations, query, regions, role.currentRole.id, role.currentRole.label, role.effectiveRole.label, squads, selectedDepartment, selectedDepartmentId, selectedOrganization, selectedOrganizationId, selectedTeam, selectedTeamId, security.teams.length, security.users.length, security.workspaces, snapshot, teamHealth, timeline, updateQuery, vendors, workflowBuilder.execution.running, workflowBuilder.selectedWorkflow, runtimeLive.queueDepth, runtimeLive.runningAgents, runtimeLive.memoryUpdates.length, knowledgeGraph.visibleNodes.length, knowledgeGraph.visibleEdges.length, planningEngine.selectedGoal?.title, planningEngine.selectedPlan?.confidence, planningEngine.selectedPlan?.objective, planningEngine.selectedPlan, setSelectedDepartmentId, setSelectedOrganizationId, setSelectedTeamId, setLiveMode]
  )

  return <OrganizationIntelligenceContext.Provider value={value}>{children}</OrganizationIntelligenceContext.Provider>
}

export function useOrganizationIntelligenceContext() {
  const context = useContext(OrganizationIntelligenceContext)
  if (!context) {
    throw new Error("useOrganizationIntelligenceContext must be used within OrganizationIntelligenceProvider")
  }

  return context
}