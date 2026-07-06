import type {
  NotificationCategory,
  NotificationFilters,
  NotificationHistoryGroups,
  NotificationItem,
  NotificationLevel,
  NotificationPriority,
  NotificationTone,
} from "@/types"

export const notificationCategories: NotificationCategory[] = [
  "SYSTEM",
  "AI",
  "MEMORY",
  "AGENT",
  "CRM",
  "REPORT",
  "INTEGRATION",
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
  return items.filter((item) => {
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

    return true
  })
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
