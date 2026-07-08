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
import { useExecutiveReportsContext } from "@/contexts/executive-reports-context"
import { useGovernanceContext } from "@/contexts/governance-context"
import { useKnowledgeGraphContext } from "@/contexts/knowledge-graph-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { usePromptOSContext } from "@/contexts/prompt-os-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import { useSupabaseContext } from "@/contexts/supabase-context"
import { useWorkflowBuilderContext } from "@/contexts/workflow-builder-context"
import type {
  ApiKeyRecord,
  OrganizationRecord,
  PermissionRecord,
  RoleRecord,
  SecurityAuditLog,
  SecurityPolicy,
  SecurityState,
  SessionRecord,
  TeamRecord,
  UserRecord,
  WorkspaceRecord,
} from "@/types"
import { createSecurityDefaults, filterByQuery, selectOrganization, selectWorkspace } from "@/utils/security"

type SecurityContextValue = SecurityState & {
  filteredOrganizations: OrganizationRecord[]
  filteredWorkspaces: WorkspaceRecord[]
  filteredUsers: UserRecord[]
  filteredTeams: TeamRecord[]
  filteredRoles: RoleRecord[]
  filteredPermissions: PermissionRecord[]
  filteredAuditLogs: SecurityAuditLog[]
  filteredPolicies: SecurityPolicy[]
  filteredApiKeys: ApiKeyRecord[]
  filteredSessions: SessionRecord[]
  selectedOrganization: OrganizationRecord | null
  selectedWorkspace: WorkspaceRecord | null
  setSelectedOrganizationId: (id: string) => void
  setSelectedWorkspaceId: (id: string) => void
  updateQuery: (query: string) => void
  setLiveMode: (enabled: boolean) => void
  revokeSession: (id: string) => void
  rotateApiKey: (id: string) => void
}

const SecurityContext = createContext<SecurityContextValue | null>(null)

export function SecurityProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => createSecurityDefaults(), [])
  const runtimeLive = useRuntimeLiveContext()
  const governance = useGovernanceContext()
  const executiveReports = useExecutiveReportsContext()
  const knowledgeGraph = useKnowledgeGraphContext()
  const workflowBuilder = useWorkflowBuilderContext()
  const prompt = usePromptOSContext()
  const supabase = useSupabaseContext()
  const { addActivity } = useActivityFeedContext()
  const { addEntry } = useMemoryContext()
  const { notify } = useNotificationContext()

  const [organizations, setOrganizations] = useState(defaults.organizations)
  const [workspaces, setWorkspaces] = useState(defaults.workspaces)
  const [users, setUsers] = useState(defaults.users)
  const [teams] = useState(defaults.teams)
  const [roles] = useState(defaults.roles)
  const [permissions] = useState(defaults.permissions)
  const [auditLogs, setAuditLogs] = useState(defaults.auditLogs)
  const [policies, setPolicies] = useState(defaults.policies)
  const [apiKeys, setApiKeys] = useState(defaults.apiKeys)
  const [sessions, setSessions] = useState(defaults.sessions)
  const [selectedOrganizationId, setSelectedOrganizationIdState] = useState(defaults.selectedOrganizationId)
  const [selectedWorkspaceId, setSelectedWorkspaceIdState] = useState(defaults.selectedWorkspaceId)
  const [query, setQuery] = useState(defaults.query)
  const [liveMode, setLiveMode] = useState(defaults.liveMode)

  const lastRuntimeEventId = useRef<string | null>(null)

  useEffect(() => {
    const hasSupabaseClient = Boolean(supabase.client)

    setOrganizations((previous) =>
      previous.map((item, index) =>
        index === 0
          ? {
              ...item,
              environment: governance.summary.complianceAttention > 0 ? "production" : item.environment,
              status: runtimeLive.queueDepth > 20 ? "paused" : item.status,
            }
          : item
      )
    )
    setPolicies((previous) =>
      previous.map((item) =>
        item.name === "Session Timeout"
          ? { ...item, status: runtimeLive.pendingTasks > 4 ? "review" : item.status }
          : item.name === "MFA" && hasSupabaseClient
            ? { ...item, summary: "Supabase Authentication session bridge is available for enterprise MFA overlays." }
            : item
      )
    )
    setUsers((previous) =>
      previous.map((item) =>
        item.department === "executive"
          ? { ...item, assignedWorkflows: Array.from(new Set([...item.assignedWorkflows, executiveReports.selectedReport?.name ?? ""])).filter(Boolean) }
          : item
      )
    )
  }, [executiveReports.selectedReport?.name, governance.summary.complianceAttention, runtimeLive.pendingTasks, runtimeLive.queueDepth, supabase.client])

  useEffect(() => {
    const latest = runtimeLive.events[0]
    if (!latest || latest.id === lastRuntimeEventId.current) {
      return
    }

    lastRuntimeEventId.current = latest.id
    setAuditLogs((previous) => [
      {
        id: `audit-${Date.now()}`,
        timestamp: Date.now(),
        actor: "Runtime Engine",
        event: "security-event" as const,
        detail: `Runtime observed ${runtimeLive.queueDepth} queued events with tenant isolation monitoring active.`,
        source: "Runtime Engine",
        result: runtimeLive.queueDepth > 18 ? "warning" as const : "success" as const,
      },
      ...previous,
    ].slice(0, 48))
  }, [runtimeLive.events, runtimeLive.queueDepth])

  useEffect(() => {
    if (!liveMode) {
      return
    }

    const timer = window.setInterval(() => {
      setApiKeys((previous) =>
        previous.map((item, index) =>
          index === 1 && item.status === "rotating"
            ? { ...item, usage: `${1.1 + runtimeLive.runningAgents / 10}k calls / 30d` }
            : item
        )
      )
      setWorkspaces((previous) =>
        previous.map((item) =>
          item.key === "support"
            ? { ...item, users: item.users, agents: Math.max(item.agents, runtimeLive.runningAgents) }
            : item
        )
      )
    }, 4200)

    return () => window.clearInterval(timer)
  }, [liveMode, runtimeLive.runningAgents])

  useEffect(() => {
    if (!prompt.prompt) {
      return
    }

    setAuditLogs((previous) => [
      {
        id: `audit-${Date.now()}`,
        timestamp: Date.now(),
        actor: "Prompt OS",
        event: "security-event" as const,
        detail: `Prompt context updated under governed enterprise policy: ${prompt.prompt.slice(0, 88)}`,
        source: "Prompt OS",
        result: "success" as const,
      },
      ...previous,
    ].slice(0, 48))
  }, [prompt.prompt])

  useEffect(() => {
    const selectedWorkflow = workflowBuilder.selectedWorkflow
    if (!selectedWorkflow) {
      return
    }

    setAuditLogs((previous) => [
      {
        id: `audit-${Date.now()}`,
        timestamp: Date.now(),
        actor: "Workflow Builder",
        event: "workflow-execution" as const,
        detail: `Workflow ${selectedWorkflow.name} is linked to tenant-aware execution controls.`,
        source: "Workflow Builder",
        result: workflowBuilder.execution.running ? "warning" as const : "success" as const,
      },
      ...previous,
    ].slice(0, 48))
  }, [workflowBuilder.execution.running, workflowBuilder.selectedWorkflow])

  useEffect(() => {
    setPolicies((previous) =>
      previous.map((item) =>
        item.name === "Data Retention"
          ? { ...item, summary: `Data retention policy aligns with ${knowledgeGraph.visibleNodes.length} semantic entities and governed memory references.` }
          : item
      )
    )
  }, [knowledgeGraph.visibleNodes.length])

  const filteredOrganizations = useMemo(() => filterByQuery(organizations, query, ["name", "region", "owner", "subscription"]), [organizations, query])
  const filteredWorkspaces = useMemo(() => filterByQuery(workspaces, query, ["name", "key", "status"]), [workspaces, query])
  const filteredUsers = useMemo(() => filterByQuery(users, query, ["name", "email", "department", "lastLogin"]), [users, query])
  const filteredTeams = useMemo(() => filterByQuery(teams, query, ["name", "workspace", "lead"]), [teams, query])
  const filteredRoles = useMemo(() => filterByQuery(roles, query, ["name", "description", "scope"]), [roles, query])
  const filteredPermissions = useMemo(() => filterByQuery(permissions, query, ["key", "category", "description"]), [permissions, query])
  const filteredAuditLogs = useMemo(() => filterByQuery(auditLogs, query, ["actor", "event", "detail", "source", "result"]), [auditLogs, query])
  const filteredPolicies = useMemo(() => filterByQuery(policies, query, ["name", "category", "summary", "value"]), [policies, query])
  const filteredApiKeys = useMemo(() => filterByQuery(apiKeys, query, ["name", "status", "expiresAt", "usage"]), [apiKeys, query])
  const filteredSessions = useMemo(() => filterByQuery(sessions, query, ["user", "device", "location", "browser", "ip", "duration"]), [sessions, query])
  const selectedOrganization = useMemo(() => selectOrganization(organizations, selectedOrganizationId), [organizations, selectedOrganizationId])
  const selectedWorkspace = useMemo(() => selectWorkspace(workspaces, selectedWorkspaceId), [selectedWorkspaceId, workspaces])

  const setSelectedOrganizationId = useCallback((id: string) => {
    setSelectedOrganizationIdState(id)
  }, [])

  const setSelectedWorkspaceId = useCallback((id: string) => {
    setSelectedWorkspaceIdState(id)
  }, [])

  const revokeSession = useCallback(
    (id: string) => {
      const session = sessions.find((item) => item.id === id)
      if (!session) {
        return
      }

      setSessions((previous) => previous.filter((item) => item.id !== id))
      setAuditLogs((previous) => [
        {
          id: `audit-${Date.now()}`,
          timestamp: Date.now(),
          actor: "Enterprise Security",
          event: "security-event" as const,
          detail: `Session revoked for ${session.user} on ${session.device}.`,
          source: "Sessions",
          result: "success" as const,
        },
        ...previous,
      ].slice(0, 48))
      addEntry({
        id: `security-session-${Date.now()}`,
        contextId: id,
        summary: `Security revoked session ${session.device} for ${session.user}`,
        createdAt: Date.now(),
      })
      addActivity({
        id: `activity-security-${Date.now()}`,
        title: "Session revoked",
        summary: `${session.user} session revoked from ${session.device}`,
        timestamp: Date.now(),
        category: "system-events",
        source: { key: "system", label: "Enterprise Security", workspace: "Corporate" },
        actor: { id: "security-layer", name: "Enterprise Security", kind: "system" },
        priority: "high",
        pinned: false,
        unread: true,
        metadata: {
          eventType: "Warning",
          workspace: "Corporate",
          status: "completed",
          relatedObjects: [{ type: "session", id: session.id, label: session.device }],
          tags: ["security", "session"],
        },
      })
      notify({
        title: "Session revoked",
        description: `${session.user} on ${session.device}`,
        category: "AI",
        priority: "HIGH",
        level: "INFO",
        toast: true,
        autoDismissMs: 2800,
      })
    },
    [addActivity, addEntry, notify, sessions]
  )

  const rotateApiKey = useCallback(
    (id: string) => {
      const key = apiKeys.find((item) => item.id === id)
      if (!key) {
        return
      }

      setApiKeys((previous) => previous.map((item) => (item.id === id ? { ...item, status: "rotating", usage: `${item.usage} · rotation requested` } : item)))
      setAuditLogs((previous) => [
        {
          id: `audit-${Date.now()}`,
          timestamp: Date.now(),
          actor: "Enterprise Security",
          event: "security-event" as const,
          detail: `API key rotation requested for ${key.name}.`,
          source: "API Keys",
          result: "warning" as const,
        },
        ...previous,
      ].slice(0, 48))
      notify({
        title: "API key rotation requested",
        description: key.name,
        category: "AI",
        priority: "MEDIUM",
        level: "INFO",
        toast: true,
        autoDismissMs: 2600,
      })
    },
    [apiKeys, notify]
  )

  const value = useMemo<SecurityContextValue>(
    () => ({
      organizations,
      workspaces,
      users,
      teams,
      roles,
      permissions,
      auditLogs,
      policies,
      apiKeys,
      sessions,
      selectedOrganizationId,
      selectedWorkspaceId,
      query,
      liveMode,
      filteredOrganizations,
      filteredWorkspaces,
      filteredUsers,
      filteredTeams,
      filteredRoles,
      filteredPermissions,
      filteredAuditLogs,
      filteredPolicies,
      filteredApiKeys,
      filteredSessions,
      selectedOrganization,
      selectedWorkspace,
      setSelectedOrganizationId,
      setSelectedWorkspaceId,
      updateQuery: setQuery,
      setLiveMode,
      revokeSession,
      rotateApiKey,
    }),
    [apiKeys, auditLogs, filteredApiKeys, filteredAuditLogs, filteredOrganizations, filteredPermissions, filteredPolicies, filteredRoles, filteredSessions, filteredTeams, filteredUsers, filteredWorkspaces, liveMode, organizations, permissions, policies, query, revokeSession, roles, rotateApiKey, selectedOrganization, selectedOrganizationId, selectedWorkspace, selectedWorkspaceId, sessions, teams, users, workspaces]
  )

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>
}

export function useSecurityContext() {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error("useSecurityContext must be used within SecurityProvider")
  }

  return context
}