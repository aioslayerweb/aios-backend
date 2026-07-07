"use client"

import { useMemo } from "react"
import { useActivityFeed } from "@/hooks/use-activity-feed"

export function useActivitySelection() {
  const {
    selectedActivity,
    selectedActivityId,
    setSelectedActivityId,
    markRead,
    togglePinned,
  } = useActivityFeed()

  const hasSelection = useMemo(
    () => Boolean(selectedActivityId && selectedActivity),
    [selectedActivity, selectedActivityId]
  )

  return {
    selectedActivity,
    selectedActivityId,
    hasSelection,
    clearSelection: () => setSelectedActivityId(null),
    selectActivity: setSelectedActivityId,
    markRead,
    togglePinned,
  }
}
