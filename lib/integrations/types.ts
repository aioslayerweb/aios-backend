export type IntegrationCategory =
  | "communication"
  | "crm"
  | "erp"
  | "finance"
  | "support"
  | "storage"
  | "knowledge"
  | "productivity"
  | "marketing"
  | "hr"

export type IntegrationHealthState = "healthy" | "warning" | "offline" | "auth-required" | "rate-limited" | "paused"

export type IntegrationAuthMethod = "oauth" | "api-key" | "service-account" | "enterprise-sso"

export type IntegrationAuthState = "connected" | "configured" | "required"

export type IntegrationSyncObject =
  | "contacts"
  | "companies"
  | "deals"
  | "emails"
  | "meetings"
  | "files"
  | "tickets"
  | "invoices"
  | "knowledge"

export type IntegrationSyncState = "queued" | "running" | "completed" | "failed"

export type AdapterTransport = "webhook" | "polling" | "stream"

export type IntegrationAdapterDefinition = {
  id: string
  name: string
  vendor: string
  category: IntegrationCategory
  description: string
  logoText: string
  authMethods: IntegrationAuthMethod[]
  supportedObjects: IntegrationSyncObject[]
  transport: AdapterTransport[]
  rateLimitPerMinute: number
  retries: number
  queue: string
  health: IntegrationHealthState
  authState: IntegrationAuthState
  lastSync: string
  synchronizedObjects: number
  errors: number
  statusDetail: string
  linkedModules: string[]
  mock: boolean
}

export type ConnectedSystem = {
  id: string
  name: string
  vendor: string
  category: IntegrationCategory
  health: IntegrationHealthState
  authState: IntegrationAuthState
  lastSync: string
  synchronizedObjects: number
  errors: number
  statusDetail: string
  linkedModules: string[]
  authMethods: IntegrationAuthMethod[]
  supportedObjects: IntegrationSyncObject[]
  mock: boolean
}

export type AvailableIntegration = {
  id: string
  name: string
  category: IntegrationCategory
  description: string
  authMethods: IntegrationAuthMethod[]
  supportedObjects: IntegrationSyncObject[]
  status: "connected" | "available"
  mock: boolean
}

export type IntegrationSyncJob = {
  id: string
  systemId: string
  systemName: string
  object: IntegrationSyncObject
  status: IntegrationSyncState
  queued: number
  running: number
  completed: number
  failed: number
  updatedAt: string
}

export type IntegrationActivity = {
  id: string
  title: string
  detail: string
  source: string
  timestamp: string
  status: "synced" | "updated" | "created" | "warning"
}

export type IntegrationLogEntry = {
  id: string
  timestamp: string
  source: string
  target: string
  duration: string
  status: "success" | "warning" | "failed"
  retryable: boolean
  detail: string
}

export type IntegrationTouchpoint = {
  id: string
  name: string
  description: string
  adapterCount: number
  state: "ready" | "observing" | "replaying"
}

export type IntegrationDeveloperTool = {
  id: string
  name: string
  transport: AdapterTransport[]
  rateLimitPerMinute: number
  retries: number
  queue: string
  webhookTopics: string[]
  pollingWindow: string
}

export type IntegrationHealthSummaryItem = {
  state: IntegrationHealthState
  count: number
}

export type IntegrationState = {
  connectedSystems: ConnectedSystem[]
  availableIntegrations: AvailableIntegration[]
  syncJobs: IntegrationSyncJob[]
  activities: IntegrationActivity[]
  logs: IntegrationLogEntry[]
  touchpoints: IntegrationTouchpoint[]
  developerTools: IntegrationDeveloperTool[]
  selectedCategory: IntegrationCategory | "all"
  developerMode: boolean
}