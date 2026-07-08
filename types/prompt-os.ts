export type PromptPriority = "low" | "medium" | "high" | "critical"

export type PromptDomain =
  | "executive"
  | "sales"
  | "operations"
  | "customer"
  | "finance"
  | "knowledge"
  | "platform"

export type PromptExecutionStatus =
  | "idle"
  | "planning"
  | "searching"
  | "analyzing"
  | "executing"
  | "reviewing"
  | "completed"
  | "failed"

export type PromptTemplate = {
  id: string
  name: string
  description: string
  content: string
  domain: PromptDomain
}

export type PromptInterpretation = {
  intent: string
  confidence: number
  domain: PromptDomain
  priority: PromptPriority
  estimatedMinutes: number
  suggestedAgents: string[]
}

export type PromptPlanStep = {
  id: string
  label: string
  status: "completed" | "current" | "pending"
  timestamp: number
}

export type PromptReasoningItem = {
  id: string
  title: string
  summary: string
  timestamp: number
}

export type PromptAssignedAgent = {
  id: string
  name: string
  status: "idle" | "running" | "complete" | "failed"
  progress: number
  confidence: number
  task: string
}

export type PromptTimelineItem = {
  id: string
  stage: "Planning" | "Searching" | "Analyzing" | "Executing" | "Reviewing" | "Completed"
  status: "completed" | "current" | "pending"
  timestamp: number
}

export type PromptResult = {
  executiveSummary: string
  actionsTaken: string[]
  recommendations: string[]
  risks: string[]
  opportunities: string[]
  linkedMemory: string[]
  relatedKnowledge: string[]
  futureActions: string[]
}

export type PromptMemoryUpdate = {
  id: string
  title: string
  summary: string
  timestamp: number
}

export type PromptHistoryEntry = {
  id: string
  prompt: string
  status: PromptExecutionStatus
  timestamp: number
  pinned: boolean
  favorite: boolean
}

export type PromptSuggestion = {
  id: string
  label: string
}

export type PromptOSState = {
  prompt: string
  status: PromptExecutionStatus
  interpretation: PromptInterpretation | null
  plan: PromptPlanStep[]
  reasoning: PromptReasoningItem[]
  agents: PromptAssignedAgent[]
  timeline: PromptTimelineItem[]
  result: PromptResult | null
  memoryUpdates: PromptMemoryUpdate[]
  history: PromptHistoryEntry[]
  templates: PromptTemplate[]
  followUps: PromptSuggestion[]
}
