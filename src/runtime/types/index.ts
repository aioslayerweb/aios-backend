export type RuntimeLifecycleState =
  | "booting"
  | "running"
  | "degraded"
  | "recovering"
  | "shutting-down"
  | "stopped"

export type ManagedComponentKind =
  | "application"
  | "agent"
  | "workflow"
  | "background-job"
  | "scheduler"
  | "memory-sync"
  | "mcp-connection"

export type ComponentStatus = "starting" | "running" | "paused" | "degraded" | "stopped"

export type RuntimeComponent = {
  id: string
  kind: ManagedComponentKind
  tenantId: string
  name: string
  status: ComponentStatus
  startedAt?: string
  metadata?: Record<string, unknown>
}

export type RuntimeRecoveryStep = {
  id: string
  title: string
  completed: boolean
  detail: string
}

export type RuntimeRecoveryPlan = {
  id: string
  tenantId: string
  reason: string
  createdAt: string
  steps: RuntimeRecoveryStep[]
}

export type JobQueueName =
  | "default"
  | "priority"
  | "retry"
  | "dead-letter"
  | "workflow"
  | "delayed"

export type JobPriority = "critical" | "high" | "normal" | "low"

export type JobStatus =
  | "queued"
  | "scheduled"
  | "running"
  | "retrying"
  | "completed"
  | "failed"
  | "cancelled"
  | "dead-letter"

export type RuntimeJob = {
  id: string
  tenantId: string
  queue: JobQueueName
  type: "background" | "recurring" | "long-running" | "workflow"
  name: string
  payload: Record<string, unknown>
  priority: JobPriority
  status: JobStatus
  attempts: number
  maxAttempts: number
  scheduledFor?: string
  startedAt?: string
  completedAt?: string
  progressPercent: number
  cancellable: boolean
}

export type CacheNamespace =
  | "memory"
  | "distributed"
  | "model-response"
  | "knowledge"
  | "workflow"
  | "mcp"
  | "configuration"
  | "prompt"

export type CacheEntry<T> = {
  key: string
  tenantId: string
  namespace: CacheNamespace
  value: T
  createdAt: number
  expiresAt: number
  tags: string[]
}

export type CachePolicy = {
  namespace: CacheNamespace
  ttlMs: number
  staleWhileRevalidateMs?: number
}

export type RuntimeEventDomain =
  | "domain"
  | "system"
  | "workflow"
  | "agent"
  | "memory"
  | "knowledge"
  | "mcp"
  | "security"
  | "notification"
  | "replay"

export type RuntimeEventEnvelope<T = Record<string, unknown>> = {
  id: string
  type: string
  domain: RuntimeEventDomain
  tenantId: string
  timestamp: string
  correlationId: string
  causationId?: string
  actor?: string
  payload: T
}

export type EventReplayFilter = {
  tenantId?: string
  domain?: RuntimeEventDomain
  fromTimestamp?: string
  toTimestamp?: string
  correlationId?: string
}

export type LiveChannel =
  | "runtime-status"
  | "activity-feed"
  | "agent-stream"
  | "workflow-progress"
  | "memory-updates"
  | "notifications"
  | "collaboration"

export type LiveEvent = {
  id: string
  channel: LiveChannel
  tenantId: string
  eventType: string
  payload: Record<string, unknown>
  timestamp: string
  correlationId: string
}

export type LogLevel = "debug" | "info" | "warn" | "error"

export type StructuredLogRecord = {
  id: string
  timestamp: string
  level: LogLevel
  service: string
  message: string
  tenantId?: string
  correlationId?: string
  context?: Record<string, unknown>
}

export type TraceSpan = {
  traceId: string
  spanId: string
  parentSpanId?: string
  name: string
  startedAt: string
  endedAt?: string
  status: "ok" | "error"
  attributes: Record<string, string | number | boolean>
}

export type AlertSeverity = "critical" | "high" | "medium" | "low"

export type AlertDefinition = {
  id: string
  name: string
  severity: AlertSeverity
  description: string
  condition: string
}

export type RuntimeMetricName =
  | "agent-executions"
  | "workflow-duration"
  | "memory-growth"
  | "knowledge-usage"
  | "prompt-execution"
  | "model-latency"
  | "mcp-latency"
  | "database-latency"
  | "queue-depth"
  | "cache-hit-ratio"
  | "system-throughput"
  | "cpu-usage"
  | "memory-usage"
  | "network-throughput"
  | "storage-usage"
  | "active-sessions"
  | "concurrent-agents"
  | "concurrent-workflows"
  | "open-mcp-connections"
  | "database-connections"

export type RuntimeMetricPoint = {
  name: RuntimeMetricName
  tenantId: string
  value: number
  unit: string
  timestamp: string
  labels?: Record<string, string>
}

export type HealthStatus = "healthy" | "degraded" | "unhealthy"

export type HealthCheckResult = {
  id: string
  name: string
  tenantId: string
  status: HealthStatus
  checkedAt: string
  latencyMs: number
  detail: string
}

export type CircuitState = "closed" | "open" | "half-open"

export type CircuitBreakerState = {
  id: string
  tenantId: string
  dependency: string
  state: CircuitState
  failureCount: number
  openedAt?: string
  nextAttemptAt?: string
}

export type RuntimeResourceSnapshot = {
  tenantId: string
  timestamp: string
  cpuPercent: number
  memoryPercent: number
  networkMbps: number
  storagePercent: number
  activeSessions: number
  concurrentAgents: number
  concurrentWorkflows: number
  openMcpConnections: number
  databaseConnections: number
}

export type RuntimeScalabilityProfile = {
  tenantId: string
  statelessServices: boolean
  workerPoolSize: number
  queueWorkerCount: number
  supportsHorizontalScale: boolean
  kubernetesReady: boolean
  edgeReady: boolean
  microservicesReady: boolean
}

export type DashboardType =
  | "runtime"
  | "queue"
  | "health"
  | "performance"
  | "infrastructure"
  | "mcp-health"
  | "memory"
  | "workflow"

export type DashboardSnapshot = {
  dashboard: DashboardType
  tenantId: string
  generatedAt: string
  widgets: Array<{
    id: string
    title: string
    value: string
    trend?: string
  }>
}

export type RuntimeManagerState = {
  lifecycle: RuntimeLifecycleState
  components: RuntimeComponent[]
  recoveryPlans: RuntimeRecoveryPlan[]
  gracefulShutdownInProgress: boolean
}

export type QueueSnapshot = {
  tenantId: string
  queue: JobQueueName
  depth: number
  running: number
  failed: number
  delayed: number
}

export type CacheSnapshot = {
  tenantId: string
  namespace: CacheNamespace
  keys: number
  hitRatio: number
  invalidations: number
}

export type ObservabilitySnapshot = {
  logsPerMinute: number
  tracesPerMinute: number
  openAlerts: number
  correlationCoveragePercent: number
}

export type RuntimePlatformState = {
  manager: RuntimeManagerState
  queues: QueueSnapshot[]
  cache: CacheSnapshot[]
  health: HealthCheckResult[]
  metrics: RuntimeMetricPoint[]
  events: RuntimeEventEnvelope[]
  liveEvents: LiveEvent[]
  resources: RuntimeResourceSnapshot[]
  dashboards: DashboardSnapshot[]
  observability: ObservabilitySnapshot
  circuits: CircuitBreakerState[]
  scalabilityProfiles: RuntimeScalabilityProfile[]
}
