"use client"

import { useMemo } from "react"
import { useActivityFeed } from "@/hooks/use-activity-feed"

export function useActivityFilters() {
  const { filters, setFilters, resetFilters } = useActivityFeed()

  const hasActiveFilters = useMemo(() => {
    return (
      filters.category.length > 0 ||
      filters.workspace.length > 0 ||
      filters.priority.length > 0 ||
      filters.agent.length > 0 ||
      filters.user.length > 0 ||
      filters.source.length > 0 ||
      filters.status.length > 0 ||
      filters.date !== "all" ||
      filters.pinned ||
      filters.unread ||
      filters.query.trim().length > 0
    )
  }, [filters])

  return {
    filters,
    setFilters,
    resetFilters,
    hasActiveFilters,
  }
}
