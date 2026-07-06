export type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR"

export type NotificationCategory =
  | "SYSTEM"
  | "AI"
  | "MEMORY"
  | "AGENT"
  | "CRM"
  | "REPORT"
  | "INTEGRATION"

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export type NotificationTone = "info" | "success" | "warning" | "error"

export type NotificationFilters = {
  query: string
  unreadOnly: boolean
  categories: NotificationCategory[]
  priorities: NotificationPriority[]
}

export type NotificationItem = {
  id: string
  title: string
  description?: string
  level: NotificationLevel
  category: NotificationCategory
  priority: NotificationPriority
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
