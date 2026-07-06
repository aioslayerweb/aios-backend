export type AIAssistantTab =
  | "context"
  | "suggestions"
  | "agents"
  | "memory"
  | "timeline"
  | "actions"

export type CurrentContext = {
  workspace: string
  customer: string
  company: string
  task: string
  workflow: string
}

export type AISuggestion = {
  id: string
  title: string
  summary: string
  priority: "low" | "medium" | "high"
  type: "action" | "automation" | "warning" | "insight"
}

export type AgentStatus = {
  id: string
  name: string
  status: "idle" | "running" | "complete" | "failed"
  progress: number
  step: string
}

export type MemoryEntry = {
  id: string
  title: string
  summary: string
  pinned: boolean
  timestamp: number
}

export type ExecutionEvent = {
  id: string
  label: string
  status: "queued" | "running" | "complete" | "failed"
  timestamp: number
}

export type AIQuickAction = {
  id: string
  label: string
  intent: "summarise" | "generate" | "analyse" | "create-task" | "create-workflow" | "search-memory" | "run-agent"
}

export type AIAssistantState = {
  open: boolean
  collapsed: boolean
  width: number
  minWidth: number
  maxWidth: number
  selectedTab: AIAssistantTab
  mobileExpanded: boolean
  conversationDraft: string
}
