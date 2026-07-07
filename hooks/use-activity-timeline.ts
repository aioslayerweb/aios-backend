"use client"

import { useMemo } from "react"
import { useActivityFeed } from "@/hooks/use-activity-feed"

export function useActivityTimeline() {
  const {
    timeline,
    expandedGroups,
    toggleGroupExpanded,
    selectedActivityId,
    setSelectedActivityId,
  } = useActivityFeed()

  const visibleGroups = useMemo(
    () =>
      timeline.groups.map((group) => ({
        ...group,
        expanded: expandedGroups[group.key],
      })),
    [expandedGroups, timeline.groups]
  )

  return {
    timeline,
    visibleGroups,
    expandedGroups,
    toggleGroupExpanded,
    selectedActivityId,
    setSelectedActivityId,
  }
}
