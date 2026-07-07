"use client"

import { useMemo } from "react"
import { useActivityFeed } from "@/hooks/use-activity-feed"

export function useRecentActivity(limit = 8) {
  const { filteredActivities } = useActivityFeed()

  const items = useMemo(
    () => filteredActivities.slice(0, limit),
    [filteredActivities, limit]
  )

  return {
    items,
    count: items.length,
  }
}
