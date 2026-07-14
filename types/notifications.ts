export type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR"

export type NotificationCategory =
  | "SYSTEM"
  | "AI"
  | "MEMORY"
  | "AGENT"
  | "CRM"
  | "REPORT"
  | "INTEGRATION"
  | "AI_DECISION"
  | "WORKFLOW"
  | "SECURITY"
  | "KNOWLEDGE"
  | "PLANNING"
  | "EXECUTIVE"
  | "CUSTOMER"
  | "FINANCE"
  | "SALES"

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export type NotificationTone = "info" | "success" | "warning" | "error"

export type NotificationUrgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export type NotificationFilterPreset =
  | "all"
  | "critical"
  | "unread"
  | "assigned"
  | "today"
  | "week"
  | "ai-decisions"

export type NotificationFilters = {
  query: string
  unreadOnly: boolean
  categories: NotificationCategory[]
  priorities: NotificationPriority[]
  preset: NotificationFilterPreset
}

export type NotificationEvent = {
  id: string
  createdAt: number
  title: string
  description?: string
}

export type NotificationItem = {
  id: string
  title: string
  groupBaseTitle?: string
  groupKey?: string
  fingerprint: string
  groupedCount?: number
  groupedLabel?: string
  expanded?: boolean
  events?: NotificationEvent[]
  description?: string
  level: NotificationLevel
  category: NotificationCategory
  priority: NotificationPriority
  impact: number
  urgency: NotificationUrgency
  confidence: number
  assignedToMe?: boolean
  viewed: boolean
  acknowledged: boolean
  archived: boolean
  read: boolean
  createdAt: number
  source?: string
  toast: boolean
  autoDismissMs: number | null
  toastDismissed: boolean
}

export type NotificationCreateInput = {
  title: string
  description?: string
  level?: NotificationLevel
  category?: NotificationCategory
  priority?: NotificationPriority
  impact?: number
  urgency?: NotificationUrgency
  confidence?: number
  groupKey?: string
  groupedLabel?: string
  assignedToMe?: boolean
  fingerprint?: string
  read?: boolean
  source?: string
  toast?: boolean
  autoDismissMs?: number | null
}

export type LegacyPushInput = {
  title: string
  description?: string
  tone: NotificationTone
}

export type NotificationHistoryGroups = {
  today: NotificationItem[]
  yesterday: NotificationItem[]
  earlier: NotificationItem[]
}

export type NotificationPriorityGroups = Record<NotificationPriority, NotificationItem[]>

export type NotificationExecutiveSummary = {
  criticalDecisions: number
  workflowsCompleted: number
  integrationFailures: number
  newOpportunities: number
}
