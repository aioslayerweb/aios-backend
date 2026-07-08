export type OrchestratorAgentStatus = "idle" | "thinking" | "coordinating" | "running" | "waiting" | "failed" | "completed"

export type OrchestratorDepartment =
  | "executive"
  | "sales"
  | "support"
  | "operations"
  | "finance"
  | "knowledge"
  | "research"
  | "marketing"
  | "memory"
  | "planner"

export type OrchestratorAgentNode = {
  id: string
  name: string
  department: OrchestratorDepartment
  status: OrchestratorAgentStatus
  currentTask: string
  confidence: number
  memoryUsage: number
  eventsProcessed: number
  lastAction: string
  cpu: number
  latencyMs: number
  availability: number
  heartbeat: string
  x: number
  y: number
}

export type OrchestratorExecutionStatus = "queued" | "running" | "waiting" | "review" | "completed" | "failed"

export type OrchestratorExecutionItem = {
  id: string
  title: string
  workflow: string
  status: OrchestratorExecutionStatus
  ownerAgentId: string
  priority: "low" | "medium" | "high" | "critical"
  runtimeProgress: number
  estimatedMinutes: number
  dependencies: string[]
  retryCount: number
  updatedAt: number
}

export type OrchestratorCommunicationMessage = {
  id: string
  from: string
  to: string
  message: string
  timestamp: number
  status: "sent" | "received" | "processing"
}

export type OrchestratorTimelineEvent = {
  id: string
  label: string
  description: string
  timestamp: number
  type: "workflow-started" | "agent-assigned" | "decision-made" | "memory-updated" | "execution-completed" | "error-detected" | "recovery-initiated"
}

export type OrchestratorMemorySync = {
  id: string
  label: string
  status: "syncing" | "complete" | "lagging"
  timestamp: number
  detail: string
}

export type OrchestratorMetric = {
  id: string
  label: string
  value: number
  suffix?: string
  delta?: number
}

export type OrchestratorFilterState = {
  agent: string
  status: OrchestratorAgentStatus | "all"
  priority: OrchestratorExecutionItem["priority"] | "all"
  workflow: string
  department: OrchestratorDepartment | "all"
  time: "all" | "1h" | "24h" | "7d"
  query: string
}

export type OrchestratorState = {
  agents: OrchestratorAgentNode[]
  executions: OrchestratorExecutionItem[]
  messages: OrchestratorCommunicationMessage[]
  timeline: OrchestratorTimelineEvent[]
  health: OrchestratorMetric[]
  memorySync: OrchestratorMemorySync[]
  metrics: OrchestratorMetric[]
  filters: OrchestratorFilterState
  selectedAgentId: string
  selectedExecutionId: string
  liveMode: boolean
}
