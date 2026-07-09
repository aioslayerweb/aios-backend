export type RoleId =
  | "ceo"
  | "coo"
  | "cfo"
  | "cto"
  | "cmo"
  | "cro"
  | "chro"
  | "sales-director"
  | "sales-manager"
  | "account-executive"
  | "marketing-director"
  | "marketing-manager"
  | "operations-director"
  | "operations-manager"
  | "customer-success"
  | "support-manager"
  | "finance-manager"
  | "project-manager"
  | "team-lead"
  | "individual-contributor"
  | "system-administrator"
  | "custom-role"

export type RoleCategory =
  | "executive"
  | "revenue"
  | "marketing"
  | "operations"
  | "finance"
  | "support"
  | "people"
  | "delivery"
  | "individual"
  | "administration"
  | "custom"

export type RolePriority = "critical" | "high" | "medium" | "low"

export type RoleMetric = {
  label: string
  value: string
  change: string
  detail: string
  tone: "positive" | "warning" | "neutral"
}

export type RoleRecommendation = {
  id: string
  title: string
  reason: string
  action: string
  expectedOutcome: string
  confidence: number
  priority: RolePriority
}

export type RoleAgent = {
  id: string
  name: string
  focus: string
  reason: string
}

export type RoleAlert = {
  id: string
  title: string
  detail: string
  priority: RolePriority
  source: string
  recommendation: string
}

export type RoleWorkflow = {
  id: string
  name: string
  reason: string
  owner: string
  status: "ready" | "recommended" | "running"
}

export type RolePrompt = {
  id: string
  title: string
  prompt: string
  context: string
}

export type RoleInsight = {
  id: string
  title: string
  detail: string
  evidence: string
}

export type RoleProfile = {
  id: RoleId
  label: string
  category: RoleCategory
  department: string
  responsibilities: string[]
  primaryObjectives: string[]
  decisionAuthority: string
  approvalLimits: string[]
  reportingStructure: string
  preferredWorkflows: string[]
  relevantAgents: string[]
  criticalSignals: string[]
  homeSummary: string
  currentPriorities: string[]
  pendingDecisions: string[]
  searchPriorities: string[]
}

export type RoleDashboardState = {
  headline: string
  subheadline: string
  summaryPoints: string[]
  kpis: RoleMetric[]
  recommendations: RoleRecommendation[]
  agents: RoleAgent[]
  alerts: RoleAlert[]
  workflows: RoleWorkflow[]
  prompts: RolePrompt[]
  insights: RoleInsight[]
}

export type RoleSnapshot = {
  runtimeQueueDepth: number
  runtimePendingTasks: number
  runtimeRunningAgents: number
  runtimeEventCount: number
  decisionSummary: string
  decisionConfidence: number | null
  decisionRisk: string | null
  planningFocus: string
  planningConfidence: number | null
  complianceAttention: number
  explainabilityCoverage: number
  knowledgeNodes: number
  knowledgeEdges: number
  activeWorkflow: string | null
  workflowRunning: boolean
  promptPreview: string
  boardReportName: string | null
}

export type RoleContextState = {
  currentRoleId: RoleId
  previewRoleId: RoleId | null
  simulationEnabled: boolean
  currentRole: RoleProfile
  previewRole: RoleProfile | null
  effectiveRole: RoleProfile
  availableRoles: RoleProfile[]
  roleDashboard: RoleDashboardState
}

export type BusinessFunctionRole =
  | "CEO"
  | "Sales Director"
  | "Customer Success"
  | "Finance"
  | "Marketing"
  | "Operations"
  | "HR"

export type RoleIntelligenceProfile = {
  id: BusinessFunctionRole
  focusAreas: string[]
  dashboardPriorities: string[]
  alertPreferences: string[]
  recommendationThemes: string[]
  insightBias: string[]
  agentSuggestions: string[]
  priorityQueues: string[]
  homeScreenModules: string[]
  commandPaletteHints: string[]
}