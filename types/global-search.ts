export type SearchSourceKey =
  | "memory"
  | "knowledge"
  | "customers"
  | "companies"
  | "contacts"
  | "tasks"
  | "executions"
  | "runtime-events"
  | "activity"
  | "reports"
  | "agents"
  | "documents"
  | "settings"
  | "commands"
  | "notifications"
  | "vector-placeholder"

export type SearchPriority = "low" | "medium" | "high" | "critical"

export type SearchDepartment =
  | "executive"
  | "sales"
  | "operations"
  | "support"
  | "knowledge"
  | "finance"
  | "marketing"
  | "hr"
  | "platform"

export type SearchDateFilter = "all" | "24h" | "7d" | "30d"

export type SearchResult = {
  id: string
  title: string
  summary: string
  source: SearchSourceKey
  category: string
  confidence: number
  timestamp: number
  priority: SearchPriority
  tags: string[]
  department: SearchDepartment
  referenceId: string
  metadata: Record<string, string | number | boolean | string[]>
}

export type SearchFilters = {
  sources: SearchSourceKey[]
  date: SearchDateFilter
  priorities: SearchPriority[]
  confidenceMin: number
  tags: string[]
  departments: SearchDepartment[]
}

export type SearchBookmark = {
  resultId: string
  pinned: boolean
  createdAt: number
}

export type SearchHistoryEntry = {
  query: string
  timestamp: number
}

export type RelatedEntity = {
  id: string
  type: "customer" | "task" | "execution" | "memory" | "knowledge" | "agent"
  label: string
}

export type SearchInspectorModel = {
  result: SearchResult | null
  related: RelatedEntity[]
  timeline: Array<{ id: string; label: string; timestamp: number }>
  linkedMemories: Array<{ id: string; summary: string; timestamp: number }>
  associatedAgents: Array<{ id: string; name: string; status: string }>
}

export type KnowledgeCollection = {
  id: string
  name: string
  documents: number
  topics: string[]
  pinned: boolean
  updatedAt: number
}

export type MemoryExplorerEntry = {
  id: string
  lane: "working" | "session" | "long-term"
  title: string
  summary: string
  pinned: boolean
  updatedAt: number
}

export type GlobalSearchState = {
  query: string
  filters: SearchFilters
  aiMode: boolean
  loading: boolean
  selectedResultId: string | null
  bookmarks: SearchBookmark[]
  recentSearches: SearchHistoryEntry[]
  results: SearchResult[]
  filteredResults: SearchResult[]
  knowledgeCollections: KnowledgeCollection[]
  memoryExplorer: MemoryExplorerEntry[]
  suggestedSearches: string[]
}
