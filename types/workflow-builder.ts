export type WorkflowVersionStatus = "draft" | "published" | "archived"

export type WorkflowDepartment =
  | "executive"
  | "sales"
  | "operations"
  | "support"
  | "knowledge"
  | "finance"
  | "marketing"
  | "platform"

export type WorkflowNodeType =
  | "start"
  | "end"
  | "ai-prompt"
  | "decision"
  | "condition"
  | "memory-read"
  | "memory-write"
  | "knowledge-search"
  | "customer-lookup"
  | "crm-update"
  | "email"
  | "slack"
  | "calendar"
  | "approval"
  | "delay"
  | "loop"
  | "parallel-branch"
  | "merge"
  | "webhook"
  | "api-call"
  | "custom-action"

export type WorkflowNodeStatus = "idle" | "queued" | "running" | "success" | "error"

export type WorkflowErrorStrategy = "retry" | "skip" | "escalate" | "stop" | "failure-branch"

export type WorkflowAgentId =
  | "sales-agent"
  | "knowledge-agent"
  | "finance-agent"
  | "executive-agent"
  | "support-agent"
  | "operations-agent"
  | "marketing-agent"

export type WorkflowNodeData = {
  title: string
  description: string
  inputs: string[]
  outputs: string[]
  configuration: Record<string, string | number | boolean>
  conditions: string[]
  assignedAgents: WorkflowAgentId[]
  runtimeStatus: string
  loop?: {
    repeat: boolean
    retry: boolean
    timeoutSeconds: number
    fallbackNodeId?: string
    maxAttempts: number
  }
  errorStrategy: WorkflowErrorStrategy
}

export type WorkflowNode = {
  id: string
  type: WorkflowNodeType
  x: number
  y: number
  width: number
  height: number
  status: WorkflowNodeStatus
  selected: boolean
  data: WorkflowNodeData
}

export type WorkflowEdge = {
  id: string
  source: string
  target: string
  label?: string
  animated: boolean
  selected: boolean
  condition?: "yes" | "no" | "default"
}

export type WorkflowHistoryEvent = {
  id: string
  type: "created" | "edited" | "executed" | "published" | "archived"
  timestamp: number
  actor: string
  summary: string
}

export type WorkflowVersion = {
  id: string
  version: number
  status: WorkflowVersionStatus
  timestamp: number
  note: string
}

export type WorkflowExecutionStep = {
  id: string
  nodeId: string
  nodeTitle: string
  status: "pending" | "running" | "completed"
  assignedAgents: WorkflowAgentId[]
  estimatedSeconds: number
}

export type WorkflowTemplate = {
  id: string
  name: string
  description: string
  department: WorkflowDepartment
  tags: string[]
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export type WorkflowDefinition = {
  id: string
  name: string
  description: string
  owner: string
  department: WorkflowDepartment
  tags: string[]
  status: WorkflowVersionStatus
  createdAt: number
  updatedAt: number
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  history: WorkflowHistoryEvent[]
  versions: WorkflowVersion[]
}

export type WorkflowSearchFilters = {
  query: string
  departments: WorkflowDepartment[]
  statuses: WorkflowVersionStatus[]
  agents: WorkflowAgentId[]
  owners: string[]
  tags: string[]
}

export type WorkflowCanvasState = {
  zoom: number
  panX: number
  panY: number
  snapToGrid: boolean
  gridSize: number
}

export type WorkflowExecutionState = {
  running: boolean
  activeNodeId: string | null
  steps: WorkflowExecutionStep[]
  timeline: Array<{ id: string; label: string; timestamp: number }>
  estimatedDurationSeconds: number
}

export type WorkflowBuilderState = {
  workflows: WorkflowDefinition[]
  selectedWorkflowId: string
  selectedNodeId: string | null
  selectedEdgeId: string | null
  templates: WorkflowTemplate[]
  canvas: WorkflowCanvasState
  execution: WorkflowExecutionState
  filters: WorkflowSearchFilters
}
