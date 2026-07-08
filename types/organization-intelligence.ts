import type { OrganizationRecord, TeamRecord, UserRecord, WorkspaceRecord } from "@/types"

export type OrgEntityType =
  | "organization"
  | "business-unit"
  | "region"
  | "department"
  | "team"
  | "squad"
  | "employee"
  | "external-partner"
  | "contractor"
  | "customer"
  | "vendor"

export type OrgDecisionPath = {
  id: string
  title: string
  owner: string
  approvers: string[]
  escalationPath: string[]
  blocked: boolean
}

export type OrgTeamHealth = {
  id: string
  name: string
  department: string
  workload: number
  capacity: number
  velocity: number
  taskCompletion: number
  openRisks: number
  dependencies: number
  knowledgeCoverage: number
  aiAdoption: number
}

export type OrgObjective = {
  id: string
  title: string
  level: "company" | "department" | "team" | "personal"
  owner: string
  linkedKpis: string[]
  linkedWorkflows: string[]
  linkedInitiatives: string[]
  progress: number
}

export type OrgTimelineEvent = {
  id: string
  date: string
  title: string
  detail: string
  impact: string
}

export type OrgGraphEdge = {
  id: string
  from: string
  to: string
  label: string
  weight: number
}

export type OrgGraphNode = {
  id: string
  name: string
  type: OrgEntityType
  department: string
  importance: number
}

export type OrgImpactSummary = {
  departmentId: string
  affectedWorkflows: string[]
  businessImpact: string
  dependencies: string[]
  risks: string[]
  initiatives: string[]
  relatedKpis: string[]
}

export type OrgStructureItem = {
  id: string
  label: string
  type: OrgEntityType
  parentId: string | null
  owner: string
  summary: string
}

export type OrgIntelligenceState = {
  organizations: OrganizationRecord[]
  businessUnits: OrgStructureItem[]
  regions: OrgStructureItem[]
  departments: OrgStructureItem[]
  teams: OrgStructureItem[]
  squads: OrgStructureItem[]
  employees: UserRecord[]
  externalPartners: OrgStructureItem[]
  contractors: OrgStructureItem[]
  customers: OrgStructureItem[]
  vendors: OrgStructureItem[]
  chartNodes: OrgGraphNode[]
  chartEdges: OrgGraphEdge[]
  teamHealth: OrgTeamHealth[]
  objectives: OrgObjective[]
  decisionPaths: OrgDecisionPath[]
  collaborationEdges: OrgGraphEdge[]
  timeline: OrgTimelineEvent[]
  impactSummary: OrgImpactSummary
  selectedOrganizationId: string
  selectedDepartmentId: string
  selectedTeamId: string
  query: string
  liveMode: boolean
}

export type OrgIntelligenceSnapshot = {
  organizationCount: number
  workspaceCount: number
  userCount: number
  teamCount: number
  integrationCount: number
  integrationHealthCount: number
  runtimeQueueDepth: number
  runtimePendingTasks: number
  runtimeRunningAgents: number
  memoryEntries: number
  decisionSummary: string
  decisionConfidence: number | null
  planningObjective: string
  planningConfidence: number | null
  knowledgeNodes: number
  knowledgeEdges: number
  workflowName: string | null
  workflowRunning: boolean
  boardReportName: string | null
  currentRoleLabel: string
  currentRoleId: string
}

export type OrgIntelligenceContextState = OrgIntelligenceState & {
  selectedDepartment: OrgStructureItem | null
  selectedTeam: OrgStructureItem | null
  selectedOrganization: OrganizationRecord | null
  filteredDepartments: OrgStructureItem[]
  filteredTeams: OrgStructureItem[]
  filteredObjectives: OrgObjective[]
  setSelectedOrganizationId: (id: string) => void
  setSelectedDepartmentId: (id: string) => void
  setSelectedTeamId: (id: string) => void
  updateQuery: (query: string) => void
  setLiveMode: (enabled: boolean) => void
}