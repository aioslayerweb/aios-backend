export type ActivityCategory =
  | "ai-runtime"
  | "agents"
  | "memory"
  | "knowledge"
  | "crm"
  | "customers"
  | "projects"
  | "tasks"
  | "communications"
  | "reports"
  | "notifications"
  | "automations"
  | "system-events"
  | "plugins"

export type ActivityPriority = "low" | "medium" | "high" | "critical"

export type ActivityStatus = "info" | "success" | "warning" | "error" | "running" | "completed"

export type ActivitySource = {
  key:
    | "ai-runtime"
    | "agents"
    | "memory"
    | "knowledge"
    | "crm"
    | "customers"
    | "projects"
    | "tasks"
    | "communications"
    | "reports"
    | "notifications"
    | "automations"
    | "system"
    | "plugin"
  label: string
  workspace: string
}

export type ActivityActor = {
  id: string
  name: string
  kind: "user" | "agent" | "system" | "service" | "ai"
  avatarFallback?: string
}

export type ActivityMetadata = {
  eventType:
    | "AI Decision"
    | "Memory Stored"
    | "Agent Started"
    | "Agent Finished"
    | "Task Created"
    | "Task Completed"
    | "Lead Created"
    | "Email Processed"
    | "Report Generated"
    | "Knowledge Updated"
    | "Priority Changed"
    | "Automation Executed"
    | "Customer Updated"
    | "System Connected"
    | "Warning"
    | "Error"
  workspace: string
  status: ActivityStatus
  relatedObjects: Array<{ type: string; id: string; label: string }>
  tags: string[]
  details?: string
  replayToken?: string
}

export type ActivityItem = {
  id: string
  title: string
  summary: string
  timestamp: number
  category: ActivityCategory
  source: ActivitySource
  actor: ActivityActor
  priority: ActivityPriority
  pinned: boolean
  unread: boolean
  metadata: ActivityMetadata
  agent?: string
  user?: string
}

export type ActivityDateFilter = "all" | "today" | "yesterday" | "week" | "earlier"

export type ActivityFilter = {
  category: ActivityCategory[]
  workspace: string[]
  priority: ActivityPriority[]
  agent: string[]
  date: ActivityDateFilter
  user: string[]
  source: ActivitySource["key"][]
  status: ActivityStatus[]
  pinned: boolean
  unread: boolean
  query: string
}

export type ActivityGroupKey = "today" | "yesterday" | "this-week" | "earlier"

export type ActivityGroup = {
  key: ActivityGroupKey
  label: string
  items: ActivityItem[]
  count: number
  startTimestamp: number
  endTimestamp: number
}

export type ActivityTimeline = {
  groups: ActivityGroup[]
  total: number
  filtered: number
}

export type ActivityFeedState = {
  activities: ActivityItem[]
  filteredActivities: ActivityItem[]
  timeline: ActivityTimeline
  filters: ActivityFilter
  selectedActivityId: string | null
  loading: boolean
  expandedGroups: Record<ActivityGroupKey, boolean>
  liveUpdatesEnabled: boolean
  externalSearchQuery: string
}

export type ActivityEventBridge = {
  publishRuntimeEvent: (event: Partial<ActivityItem>) => void
  connectEventStore: () => Promise<void>
  connectReplayEngine: () => Promise<void>
  connectPersistentMemory: () => Promise<void>
}
