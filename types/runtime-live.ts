import type { ActivityCategory, ActivityPriority } from "@/types"

export type RuntimeEventKind =
  | "memory-updated"
  | "agent-executing"
  | "email-classified"
  | "priority-changed"
  | "task-completed"
  | "crm-synchronized"
  | "calendar-updated"
  | "knowledge-indexed"
  | "decision-made"
  | "execution-failed"
  | "execution-retried"

export type RuntimeEvent = {
  id: string
  kind: RuntimeEventKind
  title: string
  summary: string
  timestamp: number
  priority: ActivityPriority
  category: ActivityCategory
}

export type LiveAgent = {
  id: string
  name: string
  status: "idle" | "running" | "complete" | "failed"
  currentTask: string
  confidence: number
  reasoningStage: string
  progress: number
  etaSeconds: number
  recentActions: string[]
}

export type ExecutionQueueItem = {
  id: string
  label: string
  status: "queued" | "running" | "waiting" | "completed" | "failed" | "retrying"
  updatedAt: number
}

export type MemoryUpdate = {
  id: string
  title: string
  lane: "long-term" | "working" | "session" | "knowledge"
  summary: string
  timestamp: number
}

export type RuntimeHealth = {
  cpu: number
  memory: number
  aiConfidence: number
  executionSpeed: number
  queueHealth: number
  database: number
  supabase: number
  vectorSearch: number
  knowledgeIndex: number
  connection: number
  latencyMs: number
}

export type RuntimeLiveState = {
  events: RuntimeEvent[]
  agents: LiveAgent[]
  executions: ExecutionQueueItem[]
  memoryUpdates: MemoryUpdate[]
  health: RuntimeHealth
  runningAgents: number
  pendingTasks: number
  queueDepth: number
}
