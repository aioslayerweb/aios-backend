import type {
  ActivityItem,
  ExecutiveBriefing,
  ExecutiveTimelineItem,
  LiveAgent,
  MemoryUpdate,
  RuntimeHealth,
  RuntimeEvent,
  ExecutionQueueItem,
} from "@/types"

export type RuntimeSource = "backend" | "supabase" | "fallback"

export type RuntimeBackendEventType =
  | "EXECUTION_START"
  | "EXECUTION_STEP"
  | "EXECUTION_COMPLETE"
  | "EXECUTION_ERROR"
  | "STATE_TRANSITION"

export type RuntimeBackendEventPayload = Record<string, unknown>

export type RuntimeBackendEvent = {
  id: string
  type: RuntimeBackendEventType
  timestamp: number
  contextId: string
  payload: RuntimeBackendEventPayload
  storedAt?: number
}

export type RuntimeEventResponse = {
  count: number
  events: RuntimeBackendEvent[]
}

export type RuntimeTimelineResponse = {
  count: number
  timeline: RuntimeBackendEvent[]
}

export type RuntimeReplayResponse = {
  contextId: string
  count: number
  timeline: RuntimeBackendEvent[]
}

export type RuntimeDebugResponse = {
  summary: {
    contextId: string
    totalEvents: number
    types: RuntimeBackendEventType[]
    countsByType: Record<RuntimeBackendEventType, number>
    firstEvent: RuntimeBackendEvent | null
    lastEvent: RuntimeBackendEvent | null
    spanMs: number
  }
  events: RuntimeBackendEvent[]
}

export type RuntimeBusinessKpi = {
  id: string
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "flat"
}

export type RuntimeBusinessMetrics = {
  kpis: RuntimeBusinessKpi[]
  briefing: ExecutiveBriefing | null
  activityCount: number
  insightCount: number
  memoryCount: number
  workflowCount: number
  agentCount: number
}

export type RuntimeLiveSnapshot = {
  source: RuntimeSource
  fetchedAt: number
  events: RuntimeEvent[]
  rawEvents: RuntimeBackendEvent[]
  agents: LiveAgent[]
  executions: ExecutionQueueItem[]
  memoryUpdates: MemoryUpdate[]
  health: RuntimeHealth
  runningAgents: number
  pendingTasks: number
  queueDepth: number
  activities: ActivityItem[]
  businessMetrics: RuntimeBusinessMetrics
  timeline: ExecutiveTimelineItem[]
}
