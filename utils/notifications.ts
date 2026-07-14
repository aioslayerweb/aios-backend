import type {
  NotificationCategory,
  NotificationExecutiveSummary,
  NotificationFilterPreset,
  NotificationFilters,
  NotificationHistoryGroups,
  NotificationItem,
  NotificationLevel,
  NotificationPriorityGroups,
  NotificationPriority,
  NotificationTone,
} from "@/types"

export const notificationCategories: NotificationCategory[] = [
  "AI_DECISION",
  "WORKFLOW",
  "INTEGRATION",
  "AGENT",
  "SECURITY",
  "MEMORY",
  "KNOWLEDGE",
  "PLANNING",
  "EXECUTIVE",
  "CUSTOMER",
  "FINANCE",
  "SALES",
  "SYSTEM",
  "AI",
  "CRM",
  "REPORT",
]

export const notificationFilterPresets: NotificationFilterPreset[] = [
  "all",
  "critical",
  "unread",
  "assigned",
  "today",
  "week",
  "ai-decisions",
]

export const notificationPriorities: NotificationPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]

const priorityScore: Record<NotificationPriority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
}

export const priorityColorClass: Record<NotificationPriority, string> = {
  CRITICAL: "text-red-600",
  HIGH: "text-orange-600",
  MEDIUM: "text-blue-600",
  LOW: "text-slate-500",
}

const toneToLevelMap: Record<NotificationTone, NotificationLevel> = {
  info: "INFO",
  success: "SUCCESS",
  warning: "WARNING",
  error: "ERROR",
}

const levelToToneMap: Record<NotificationLevel, NotificationTone> = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
}

export function toneToLevel(tone: NotificationTone): NotificationLevel {
  return toneToLevelMap[tone]
}

export function levelToTone(level: NotificationLevel): NotificationTone {
  return levelToToneMap[level]
}

export function sortNotifications(items: NotificationItem[]): NotificationItem[] {
  return [...items].sort((left, right) => {
    const priorityDelta = priorityScore[right.priority] - priorityScore[left.priority]
    if (priorityDelta !== 0) {
      return priorityDelta
    }

    return right.createdAt - left.createdAt
  })
}

function matchesQuery(item: NotificationItem, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  const haystack = [
    item.title,
    item.description,
    item.category,
    item.level,
    item.priority,
    item.source,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase()

  return haystack.includes(normalized)
}

export function filterNotifications(
  items: NotificationItem[],
  filters: NotificationFilters
): NotificationItem[] {
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000
  const oneWeekMs = 7 * oneDayMs

  return items.filter((item) => {
    if (item.archived) {
      return false
    }

    if (!matchesQuery(item, filters.query)) {
      return false
    }

    if (filters.unreadOnly && item.read) {
      return false
    }

    if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
      return false
    }

    if (filters.priorities.length > 0 && !filters.priorities.includes(item.priority)) {
      return false
    }

    if (filters.preset === "critical" && item.priority !== "CRITICAL") {
      return false
    }

    if (filters.preset === "unread" && item.read) {
      return false
    }

    if (filters.preset === "assigned" && !item.assignedToMe) {
      return false
    }

    if (filters.preset === "today" && now - item.createdAt > oneDayMs) {
      return false
    }

    if (filters.preset === "week" && now - item.createdAt > oneWeekMs) {
      return false
    }

    if (filters.preset === "ai-decisions" && item.category !== "AI_DECISION") {
      return false
    }

    return true
  })
}

export function groupByPriority(items: NotificationItem[]): NotificationPriorityGroups {
  return items.reduce<NotificationPriorityGroups>(
    (accumulator, item) => {
      accumulator[item.priority].push(item)
      return accumulator
    },
    {
      CRITICAL: [],
      HIGH: [],
      MEDIUM: [],
      LOW: [],
    }
  )
}

export function autoExpireMs(priority: NotificationPriority): number | null {
  if (priority === "LOW") {
    return 20_000
  }

  if (priority === "MEDIUM") {
    return 60_000
  }

  return null
}

export function buildExecutiveSummary(items: NotificationItem[]): NotificationExecutiveSummary {
  return items.reduce<NotificationExecutiveSummary>(
    (accumulator, item) => {
      if (item.priority === "CRITICAL" && item.category === "AI_DECISION") {
        accumulator.criticalDecisions += 1
      }

      if (
        item.category === "WORKFLOW" &&
        (item.title.toLowerCase().includes("completed") || item.title.toLowerCase().includes("completion"))
      ) {
        accumulator.workflowsCompleted += 1
      }

      if (
        item.category === "INTEGRATION" &&
        (item.title.toLowerCase().includes("failed") || item.title.toLowerCase().includes("lost"))
      ) {
        accumulator.integrationFailures += 1
      }

      if (item.title.toLowerCase().includes("opportunit")) {
        accumulator.newOpportunities += 1
      }

      return accumulator
    },
    {
      criticalDecisions: 0,
      workflowsCompleted: 0,
      integrationFailures: 0,
      newOpportunities: 0,
    }
  )
}

function isSameDate(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export function groupNotificationHistory(items: NotificationItem[]): NotificationHistoryGroups {
  const now = new Date()
  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(now.getDate() - 1)

  return items.reduce<NotificationHistoryGroups>(
    (accumulator, item) => {
      const createdDate = new Date(item.createdAt)
      if (isSameDate(createdDate, now)) {
        accumulator.today.push(item)
      } else if (isSameDate(createdDate, yesterdayDate)) {
        accumulator.yesterday.push(item)
      } else {
        accumulator.earlier.push(item)
      }
      return accumulator
    },
    {
      today: [],
      yesterday: [],
      earlier: [],
    }
  )
}

export function formatNotificationTime(value: number): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}
