export type BusinessEntityType =
  | "company"
  | "contact"
  | "employee"
  | "department"
  | "project"
  | "task"
  | "meeting"
  | "email"
  | "ticket"
  | "deal"
  | "product"
  | "service"
  | "knowledge-document"
  | "agent"
  | "workflow"
  | "memory-node"
  | "event"
  | "external-system"
  | "policy"
  | "goal"
  | "kpi"

export type KnowledgeGraphDepartment =
  | "executive"
  | "sales"
  | "operations"
  | "support"
  | "knowledge"
  | "finance"
  | "marketing"
  | "hr"
  | "platform"

export type KnowledgeEntityStatus = "active" | "monitoring" | "at-risk" | "completed" | "archived"

export type KnowledgeGraphNode = {
  id: string
  label: string
  type: BusinessEntityType
  department: KnowledgeGraphDepartment
  businessUnit: string
  owner: string
  status: KnowledgeEntityStatus
  priority: "low" | "medium" | "high" | "critical"
  confidence: number
  summary: string
  metadata: Record<string, string | number | boolean>
  x: number
  y: number
  radius: number
}

export type KnowledgeGraphEdge = {
  id: string
  source: string
  target: string
  label: string
  strength: number
  category: "direct" | "indirect" | "dependency" | "decision-influence" | "workflow-dependency" | "knowledge-dependency"
  animated: boolean
}

export type KnowledgeTimelineEvent = {
  id: string
  entityId: string
  timestamp: number
  type: "created" | "updated" | "connected" | "executed" | "completed" | "archived"
  title: string
  detail: string
}

export type EntityInspectorModel = {
  entityId: string
  metadata: Array<{ label: string; value: string }>
  relationships: Array<{ id: string; label: string; targetLabel: string }>
  linkedMemory: Array<{ id: string; summary: string; timestamp: number }>
  recentActivity: Array<{ id: string; title: string; timestamp: number }>
  connectedWorkflows: string[]
  responsibleAgents: string[]
  openActions: string[]
}

export type GraphSearchMatch = {
  query: string
  matchedNodeIds: string[]
}

export type KnowledgeGraphFilters = {
  entityTypes: BusinessEntityType[]
  departments: KnowledgeGraphDepartment[]
  businessUnits: string[]
  statuses: KnowledgeEntityStatus[]
  priorities: Array<KnowledgeGraphNode["priority"]>
  owners: string[]
  confidenceMin: number
}

export type KnowledgeGraphState = {
  nodes: KnowledgeGraphNode[]
  edges: KnowledgeGraphEdge[]
  timeline: KnowledgeTimelineEvent[]
  inspectors: EntityInspectorModel[]
  selectedNodeId: string
  search: GraphSearchMatch
  filters: KnowledgeGraphFilters
  liveMode: boolean
}