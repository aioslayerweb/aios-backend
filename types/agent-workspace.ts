export type AgentWorkspaceStatus = "idle" | "running" | "waiting" | "failed" | "completed"

export type AgentDepartment =
  | "sales"
  | "executive"
  | "operations"
  | "knowledge"
  | "support"
  | "marketing"
  | "finance"
  | "hr"
  | "custom"

export type AgentCardItem = {
  id: string
  name: string
  avatar: string
  department: AgentDepartment
  status: AgentWorkspaceStatus
  currentTask: string
  confidence: number
  health: number
  recentActivity: string
  unreadNotifications: number
  memoryUsage: number
  etaMinutes: number
  objective: string
  contextSummary: string
  activeTools: string[]
}

export type ReasoningStage = {
  id: string
  label: string
  status: "completed" | "current" | "pending"
  timestamp: number
}

export type QueueTaskStatus = "queued" | "running" | "waiting" | "retrying" | "failed" | "completed"

export type AgentQueueTask = {
  id: string
  title: string
  priority: "low" | "medium" | "high" | "critical"
  status: QueueTaskStatus
  updatedAt: number
  ownerAgentId: string
}

export type MemoryRecord = {
  id: string
  lane: "working" | "long-term" | "session" | "knowledge"
  title: string
  summary: string
  confidence: number
  source: string
  updatedAt: number
}

export type ToolConnectionStatus = "connected" | "disconnected" | "executing" | "error"

export type ToolRecord = {
  id: string
  name: string
  status: ToolConnectionStatus
  latencyMs: number
  lastAction: string
}

export type DecisionRecord = {
  id: string
  title: string
  reason: string
  confidence: number
  timestamp: number
  explanation: string
}

export type AgentEventRecord = {
  id: string
  type: "thinking" | "memory-updated" | "task-completed" | "decision-stored" | "tool-executed"
  title: string
  summary: string
  timestamp: number
  agentId: string
}

export type AgentCollaborationHop = {
  id: string
  from: string
  to: string
  action: string
  status: "completed" | "active" | "pending"
}

export type AgentWorkspaceFilters = {
  statuses: AgentWorkspaceStatus[]
  departments: AgentDepartment[]
  confidenceMin: number
  onlyRunning: boolean
  showCompleted: boolean
  showFailed: boolean
  priority: Array<"low" | "medium" | "high" | "critical">
  query: string
}

export type AgentWorkspaceMetrics = {
  runningAgents: number
  queuedTasks: number
  averageConfidence: number
  runtimeHealth: number
  eventsPerSecond: number
  memorySizeMb: number
  latencyMs: number
}

export type AgentWorkspaceState = {
  agents: AgentCardItem[]
  selectedAgentId: string
  reasoningTimeline: ReasoningStage[]
  tasks: AgentQueueTask[]
  memories: MemoryRecord[]
  tools: ToolRecord[]
  decisions: DecisionRecord[]
  events: AgentEventRecord[]
  collaboration: AgentCollaborationHop[]
  filters: AgentWorkspaceFilters
  splitView: boolean
  selectedSplitAgentIds: string[]
  metrics: AgentWorkspaceMetrics
}
