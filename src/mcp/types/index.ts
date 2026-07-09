import type { RoleRecord, SecurityPermissionKey } from "@/types"

export type MCPPlatformMode = "host" | "server" | "gateway" | "registry"

export type MCPProviderId =
  | "github"
  | "slack"
  | "microsoft-teams"
  | "notion"
  | "jira"
  | "confluence"
  | "salesforce"
  | "hubspot"
  | "supabase"
  | "postgresql"
  | "mysql"
  | "snowflake"
  | "sap"
  | "stripe"
  | "shopify"
  | "zendesk"
  | "servicenow"
  | "aws"
  | "azure"
  | "google-cloud"
  | "aios"
  | "custom"

export type MCPConnectionStatus = "connected" | "degraded" | "disconnected" | "auth-required"
export type MCPHealthState = "healthy" | "warning" | "critical" | "offline"
export type MCPApprovalStatus = "approved" | "pending" | "rejected"

export type MCPServerRuntimeMode = "external" | "internal" | "self-hosted" | "marketplace"

export type MCPAuthenticationMethod =
  | "oauth"
  | "api-key"
  | "service-account"
  | "enterprise-sso"
  | "oidc"
  | "saml"
  | "none"

export type MCPFeatureFlag = "streaming" | "realtime" | "batch" | "event-driven"

export type MCPDepartment =
  | "executive"
  | "sales"
  | "marketing"
  | "support"
  | "finance"
  | "operations"
  | "engineering"
  | "hr"
  | "legal"
  | "cross-functional"

export type MCPResourceCategory =
  | "documents"
  | "databases"
  | "knowledge"
  | "crm"
  | "erp"
  | "files"
  | "emails"
  | "messages"
  | "reports"
  | "dashboards"
  | "other"

export type MCPServerCapabilityKey =
  | "memory"
  | "knowledge-graph"
  | "workflow-engine"
  | "replay-engine"
  | "planning-engine"
  | "decision-engine"
  | "executive-intelligence"
  | "role-intelligence"
  | "organization-intelligence"
  | "reports"
  | "analytics"
  | "search"
  | "agent-registry"
  | "prompt-registry"
  | "model-registry"
  | "business-context"

export type MCPGatewayPipelineStage =
  | "authentication"
  | "tenant-resolution"
  | "rbac"
  | "role-context"
  | "organization-context"
  | "knowledge-graph"
  | "memory"
  | "decision-engine"
  | "workflow-engine"
  | "tool-selection"
  | "external-mcp-servers"
  | "response-aggregation"
  | "audit"
  | "response"

export type MCPGatewayResponsibility =
  | "tool-routing"
  | "request-enrichment"
  | "response-normalization"
  | "policy-enforcement"
  | "prompt-augmentation"
  | "caching"
  | "observability"
  | "retry-handling"
  | "circuit-breakers"

export type MCPExecutionStatus = "success" | "failed" | "partial" | "blocked"

export type MCPProviderDescriptor = {
  id: MCPProviderId
  name: string
  category: "collaboration" | "knowledge" | "crm" | "data" | "erp" | "finance" | "cloud" | "platform"
  runtimeMode: MCPServerRuntimeMode
  authenticationMethods: MCPAuthenticationMethod[]
  supportsStreaming: boolean
  supportsRealtime: boolean
  featureFlags: MCPFeatureFlag[]
}

export type MCPCapabilityDescriptor = {
  id: string
  name: string
  key: MCPServerCapabilityKey | string
  description: string
  version: string
  stable: boolean
}

export type MCPConnectionHealth = {
  status: MCPHealthState
  latencyMs: number
  availabilityPercent: number
  retryCount: number
  authenticationFailures: number
  toolFailures: number
  providerFailures: number
  versionCompatibility: "compatible" | "warning" | "incompatible"
  lastCheckedAt: string
}

export type MCPConnectionSecurity = {
  authenticationMethod: MCPAuthenticationMethod
  authenticationState: "validated" | "pending" | "failed"
  permissions: SecurityPermissionKey[]
  tenantAware: boolean
  workspaceAware: boolean
  departmentAware: boolean
  roleAware: boolean
}

export type MCPServerConnection = {
  id: string
  provider: MCPProviderId
  name: string
  runtimeMode: MCPServerRuntimeMode
  endpoint: string
  version: string
  status: MCPConnectionStatus
  tools: string[]
  resources: string[]
  prompts: string[]
  capabilities: MCPCapabilityDescriptor[]
  health: MCPConnectionHealth
  security: MCPConnectionSecurity
  organizationAssignment: string[]
  workspaceAssignment: string[]
  approvalStatus: MCPApprovalStatus
  updateAvailable: boolean
}

export type MCPHostState = {
  mode: "host"
  servers: MCPServerConnection[]
  activeServerIds: string[]
  supportsFutureServers: boolean
}

export type MCPServerExport = {
  id: string
  name: string
  description: string
  capability: MCPServerCapabilityKey
  requiredPermissions: SecurityPermissionKey[]
  endpoint: string
  version: string
}

export type MCPServerState = {
  mode: "server"
  serviceName: string
  version: string
  exports: MCPServerExport[]
}

export type MCPGatewayRequest = {
  id: string
  timestamp: string
  actorUserId: string
  organizationId: string
  workspaceId: string
  departmentId?: string
  roleId?: string
  toolId?: string
  promptId?: string
  resourceIds: string[]
  input: Record<string, unknown>
}

export type MCPGatewayResponse = {
  requestId: string
  status: MCPExecutionStatus
  durationMs: number
  providerCalls: Array<{ provider: MCPProviderId; latencyMs: number; status: MCPExecutionStatus }>
  output: Record<string, unknown>
  normalized: boolean
  audited: boolean
}

export type MCPGatewayDefinition = {
  mode: "gateway"
  pipeline: MCPGatewayPipelineStage[]
  responsibilities: MCPGatewayResponsibility[]
  retryPolicy: {
    maxRetries: number
    backoffMs: number
  }
  circuitBreaker: {
    failureThreshold: number
    resetTimeoutMs: number
  }
  cache: {
    enabled: boolean
    ttlMs: number
  }
}

export type MCPToolStatus = "ready" | "degraded" | "disabled"

export type MCPToolRegistryEntry = {
  id: string
  name: string
  description: string
  provider: MCPProviderId
  server: string
  version: string
  requiredPermissions: SecurityPermissionKey[]
  requiredRole: RoleRecord["name"] | "Any"
  requiredCapabilities: string[]
  supportedDepartments: MCPDepartment[]
  inputSchema: Record<string, unknown>
  outputSchema: Record<string, unknown>
  health: MCPHealthState
  status: MCPToolStatus
}

export type MCPResourceRegistryEntry = {
  id: string
  name: string
  category: MCPResourceCategory
  description: string
  provider: MCPProviderId
  server: string
  tenantScoped: boolean
  workspaceScoped: boolean
  departmentScoped: boolean
  health: MCPHealthState
  status: "available" | "restricted" | "offline"
}

export type MCPPromptApproval = {
  approver: string
  approvedAt: string
  status: "approved" | "rejected" | "pending"
  note?: string
}

export type MCPPromptRelease = {
  version: string
  releasedAt: string
  releasedBy: string
  summary: string
}

export type MCPPromptRegistryEntry = {
  id: string
  name: string
  version: string
  author: string
  approvals: MCPPromptApproval[]
  changes: string[]
  releaseHistory: MCPPromptRelease[]
  associatedAgents: string[]
  associatedModels: string[]
  status: "draft" | "active" | "deprecated"
}

export type MCPRegistryServerRecord = {
  id: string
  provider: MCPProviderId
  version: string
  health: MCPHealthState
  authentication: MCPAuthenticationMethod
  organizationAssignment: string[]
  workspaceAssignment: string[]
  usageCount: number
  latencyMs: number
  errors: number
  updateAvailable: boolean
  approvalStatus: MCPApprovalStatus
}

export type MCPRegistryState = {
  mode: "registry"
  installedServers: MCPRegistryServerRecord[]
  availableTools: MCPToolRegistryEntry[]
  resources: MCPResourceRegistryEntry[]
  prompts: MCPPromptRegistryEntry[]
}

export type MCPPolicyRule = {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: {
    disallowDepartments?: MCPDepartment[]
    requireApprovalForProviders?: MCPProviderId[]
    allowRoles?: Array<RoleRecord["name"]>
    allowPermissions?: SecurityPermissionKey[]
  }
  effect: "allow" | "deny" | "require-approval"
}

export type MCPPolicyDecision = {
  requestId: string
  effect: "allow" | "deny" | "require-approval"
  matchedRuleIds: string[]
  reason: string
}

export type MCPExecutionEvent = {
  id: string
  requestId: string
  status: MCPExecutionStatus
  startedAt: string
  finishedAt: string
  durationMs: number
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
  errors: string[]
  agent: string
  workflow: string
  userId: string
  organizationId: string
  workspaceId: string
  toolId?: string
  provider: MCPProviderId
}

export type MCPHealthSnapshot = {
  overall: MCPHealthState
  connectedServers: number
  degradedServers: number
  offlineServers: number
  averageLatencyMs: number
  authenticationFailures: number
  versionCompatibilityWarnings: number
  retryCount: number
  toolFailures: number
  providerFailures: number
}

export type MCPMetricsSnapshot = {
  requestCount: number
  successRatePercent: number
  averageLatencyMs: number
  providerCostEstimate: number
  toolInvocationCounts: Record<string, number>
  providerInvocationCounts: Record<string, number>
  errorCounts: Record<string, number>
}

export type MCPTraceEvent = {
  id: string
  requestId: string
  stage: MCPGatewayPipelineStage
  timestamp: string
  durationMs: number
  metadata: Record<string, unknown>
}

export type MCPStructuredLog = {
  id: string
  level: "debug" | "info" | "warning" | "error"
  message: string
  requestId?: string
  timestamp: string
  metadata: Record<string, unknown>
}

export type MCPObservabilityState = {
  traces: MCPTraceEvent[]
  logs: MCPStructuredLog[]
  metrics: MCPMetricsSnapshot
  executionGraphNodes: Array<{ id: string; label: string; stage: MCPGatewayPipelineStage }>
  executionGraphEdges: Array<{ from: string; to: string }>
}

export type MCPPlatformState = {
  platformModes: MCPPlatformMode[]
  host: MCPHostState
  server: MCPServerState
  gateway: MCPGatewayDefinition
  registry: MCPRegistryState
  policyRules: MCPPolicyRule[]
  health: MCPHealthSnapshot
  metrics: MCPMetricsSnapshot
  observability: MCPObservabilityState
  executionEvents: MCPExecutionEvent[]
}
