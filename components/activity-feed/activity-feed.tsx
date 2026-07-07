"use client"

import { useMemo } from "react"
import { useActivityFeed, useActivityFilters, useActivitySelection, useActivityTimeline } from "@/hooks"
import { ActivityDetails } from "./activity-details"
import { ActivityEmptyState } from "./activity-empty-state"
import { ActivityFilterBar } from "./activity-filter-bar"
import { ActivityLoadingState } from "./activity-loading-state"
import { ActivitySidebar } from "./activity-sidebar"
import { ActivityTimeline } from "./activity-timeline"

export function ActivityFeed() {
  const {
    filteredActivities,
    timeline,
    loading,
    setFilters,
    resetFilters,
    markRead,
    togglePinned,
    filters,
  } = useActivityFeed()
  const { visibleGroups, selectedActivityId, setSelectedActivityId, toggleGroupExpanded } = useActivityTimeline()
  const { selectedActivity, clearSelection } = useActivitySelection()
  const { hasActiveFilters } = useActivityFilters()

  const pinnedCount = useMemo(
    () => filteredActivities.filter((item) => item.pinned).length,
    [filteredActivities]
  )

  const unreadCount = useMemo(
    () => filteredActivities.filter((item) => item.unread).length,
    [filteredActivities]
  )

  return (
    <div className="space-y-4">
      <ActivityFilterBar filters={filters} onChange={setFilters} onReset={resetFilters} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]" aria-label="Activity feed workspace">
        <div className="space-y-4">
          {loading ? (
            <ActivityLoadingState />
          ) : filteredActivities.length === 0 ? (
            <ActivityEmptyState hasFilters={hasActiveFilters} onReset={resetFilters} />
          ) : (
            <ActivityTimeline
              groups={visibleGroups}
              selectedActivityId={selectedActivityId}
              onSelect={setSelectedActivityId}
              onTogglePinned={togglePinned}
              onToggleRead={markRead}
              onToggleGroup={toggleGroupExpanded}
            />
          )}
        </div>

        <div className="space-y-4">
          <ActivitySidebar
            total={timeline.total}
            filtered={timeline.filtered}
            pinnedCount={pinnedCount}
            unreadCount={unreadCount}
          />
          <ActivityDetails item={selectedActivity} onClose={clearSelection} />
        </div>
      </section>
    </div>
  )
}
