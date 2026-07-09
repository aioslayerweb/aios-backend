export type SDKModuleName =
  | "core"
  | "authentication"
  | "organizations"
  | "memory"
  | "knowledge"
  | "workflows"
  | "agents"
  | "models"
  | "prompts"
  | "policies"
  | "runtime"
  | "mcp"
  | "events"
  | "search"
  | "analytics"

export type SDKLanguageTarget = "typescript" | "python" | "java" | "go" | "dotnet" | "other"

export type APIVersion = {
  major: number
  minor: number
  patch: number
}

export type StablePublicAPI = {
  id: string
  module: SDKModuleName
  name: string
  description: string
  version: APIVersion
  deprecated: boolean
  backwardCompatibleSince?: string
}

export type PluginScope =
  | "agents"
  | "commands"
  | "workflows"
  | "knowledge-providers"
  | "memory-providers"
  | "decision-engines"
  | "prompt-packs"
  | "models"
  | "reports"
  | "dashboards"
  | "developer-tools"
  | "administration"
  | "navigation"
  | "notifications"

export type PluginManifest = {
  id: string
  name: string
  version: string
  author: string
  organization?: string
  description: string
  scopes: PluginScope[]
  permissions: string[]
  minPlatformVersion: string
  maxPlatformVersion?: string
  signed: boolean
}

export type ExtensionPoint =
  | "lifecycle-hooks"
  | "event-subscriptions"
  | "command-registration"
  | "workflow-registration"
  | "sidebar-extensions"
  | "dashboard-widgets"
  | "settings-panels"
  | "background-services"
  | "custom-actions"

export type ExtensionContribution = {
  id: string
  pluginId: string
  point: ExtensionPoint
  title: string
  enabled: boolean
  metadata?: Record<string, unknown>
}

export type AgentCapability = {
  id: string
  title: string
  description: string
}

export type AgentSDKDefinition = {
  id: string
  name: string
  version: string
  metadata: {
    owner: string
    organization?: string
    description: string
  }
  capabilities: AgentCapability[]
  tools: string[]
  prompts: string[]
  policies: string[]
  memoryAccess: "none" | "read" | "read-write"
  knowledgeAccess: "none" | "read" | "read-write"
  mcpAccess: "none" | "read" | "read-write"
  observabilityEnabled: boolean
}

export type WorkflowTriggerType = "event" | "schedule" | "manual" | "api"

export type WorkflowSDKDefinition = {
  id: string
  name: string
  version: string
  triggers: WorkflowTriggerType[]
  conditions: string[]
  actions: string[]
  retries: number
  scheduling: "none" | "cron" | "interval"
  approvalsRequired: boolean
  rollbackSupported: boolean
  validationRules: string[]
}

export type KnowledgeProviderDefinition = {
  id: string
  name: string
  providerType:
    | "internal-wiki"
    | "sharepoint"
    | "confluence"
    | "custom-database"
    | "document-repository"
    | "industry-specific"
  version: string
  supportsSearch: boolean
  supportsSync: boolean
}

export type MemoryProviderDefinition = {
  id: string
  name: string
  providerType:
    | "long-term"
    | "short-term"
    | "vector-store"
    | "enterprise-database"
    | "hybrid-storage"
    | "ai-native"
  version: string
  supportsIsolation: boolean
  supportsEncryption: boolean
}

export type MCPConnectorDefinition = {
  id: string
  name: string
  version: string
  authModes: Array<"oauth" | "api-key" | "jwt" | "custom">
  supportsDiscovery: boolean
  supportsHealthChecks: boolean
  toolsExposed: string[]
  resourcesExposed: string[]
  promptsExposed: string[]
  supportsStreaming: boolean
  compatibility: {
    minMcpVersion: string
    maxMcpVersion?: string
  }
}

export type UIExtensionTarget =
  | "workspace-pages"
  | "widgets"
  | "panels"
  | "inspector-views"
  | "developer-center"
  | "runtime-center"
  | "command-palette"
  | "context-menus"

export type UIExtensionDefinition = {
  id: string
  pluginId: string
  target: UIExtensionTarget
  title: string
  route?: string
  icon?: string
  enabled: boolean
}

export type PackageMetadata = {
  name: string
  version: string
  author: string
  organization?: string
  dependencies: string[]
  permissions: string[]
  capabilities: string[]
  compatibility: {
    minPlatformVersion: string
    maxPlatformVersion?: string
  }
  license: string
  signature: string
  releaseHistory: string[]
}

export type MarketplaceListing = {
  id: string
  packageName: string
  version: string
  summary: string
  category: string
  approved: boolean
  installCount: number
  averageRating: number
  requiresOrgApproval: boolean
}

export type MarketplaceReview = {
  id: string
  listingId: string
  reviewer: string
  rating: number
  comment: string
  createdAt: string
}

export type OrganizationMarketplacePolicy = {
  organizationId: string
  requireApproval: boolean
  allowUnsignedPackages: boolean
  allowedCategories: string[]
  blockedPackages: string[]
}

export type MarketplaceInstallRecord = {
  id: string
  organizationId: string
  listingId: string
  version: string
  installedAt: string
  status: "installed" | "updated" | "blocked"
  reason?: string
}

export type ExtensionSecurityProfile = {
  pluginId: string
  sandboxed: boolean
  permissionValidated: boolean
  rbacCompliant: boolean
  roleIntelligenceCompliant: boolean
  tenantIsolationVerified: boolean
  policyEnforced: boolean
  auditLoggingEnabled: boolean
  digitallySigned: boolean
}

export type DeveloperToolingProfile = {
  cliAvailable: boolean
  templatesAvailable: boolean
  scaffoldingAvailable: boolean
  docGeneratorAvailable: boolean
  diagnosticsAvailable: boolean
  referenceImplementationsAvailable: boolean
}

export type SDKPlatformState = {
  languageTargets: SDKLanguageTarget[]
  publicApis: StablePublicAPI[]
  plugins: PluginManifest[]
  extensions: ExtensionContribution[]
  agents: AgentSDKDefinition[]
  workflows: WorkflowSDKDefinition[]
  knowledgeProviders: KnowledgeProviderDefinition[]
  memoryProviders: MemoryProviderDefinition[]
  connectors: MCPConnectorDefinition[]
  uiExtensions: UIExtensionDefinition[]
  packages: PackageMetadata[]
  marketplaceListings: MarketplaceListing[]
  marketplaceReviews: MarketplaceReview[]
  marketplacePolicies: OrganizationMarketplacePolicy[]
  marketplaceInstalls: MarketplaceInstallRecord[]
  securityProfiles: ExtensionSecurityProfile[]
  developerTooling: DeveloperToolingProfile
}
