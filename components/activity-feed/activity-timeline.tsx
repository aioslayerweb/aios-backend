"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { ActivityGroup, ActivityItem } from "@/types"
import { staggerContainer } from "@/theme"
import { ActivityCard } from "./activity-card"
import { ActivityGroupHeader } from "./activity-group-header"

type ActivityTimelineProps = {
  groups: Array<ActivityGroup & { expanded: boolean }>
  selectedActivityId: string | null
  onSelect: (id: string) => void
  onTogglePinned: (id: string) => void
  onToggleRead: (id: string, unread: boolean) => void
  onToggleGroup: (groupKey: ActivityGroup["key"]) => void
}

type FlatTimelineEntry =
  | { kind: "header"; key: string; group: ActivityGroup & { expanded: boolean } }
  | { kind: "item"; key: string; item: ActivityItem; groupKey: ActivityGroup["key"] }

const HEADER_HEIGHT = 52
const ITEM_HEIGHT = 148
const OVERSCAN = 8

export function ActivityTimeline({
  groups,
  selectedActivityId,
  onSelect,
  onTogglePinned,
  onToggleRead,
  onToggleGroup,
}: ActivityTimelineProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const flattened = useMemo<FlatTimelineEntry[]>(() => {
    const entries: FlatTimelineEntry[] = []

    for (const group of groups) {
      entries.push({
        kind: "header",
        key: `header-${group.key}`,
        group,
      })

      if (group.expanded) {
        for (const item of group.items) {
          entries.push({
            kind: "item",
            key: item.id,
            item,
            groupKey: group.key,
          })
        }
      }
    }

    return entries
  }, [groups])

  const useVirtual = flattened.length > 120

  if (!useVirtual) {
    return (
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
        {groups.map((group) => (
          <section key={group.key} className="space-y-3" aria-label={`${group.label} activities`}>
            <ActivityGroupHeader
              group={group}
              expanded={group.expanded}
              onToggle={() => onToggleGroup(group.key)}
            />

            <AnimatePresence initial={false}>
              {group.expanded ? (
                <motion.div layout className="space-y-3">
                  {group.items.map((item) => (
                    <ActivityCard
                      key={item.id}
                      item={item}
                      selected={selectedActivityId === item.id}
                      onSelect={onSelect}
                      onTogglePinned={onTogglePinned}
                      onToggleRead={onToggleRead}
                    />
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>
        ))}
      </motion.div>
    )
  }

  const totalHeight = flattened.reduce((height, entry) => {
    return height + (entry.kind === "header" ? HEADER_HEIGHT : ITEM_HEIGHT)
  }, 0)

  const viewportHeight = 740
  const averageHeight = 136
  const startIndex = Math.max(0, Math.floor(scrollTop / averageHeight) - OVERSCAN)
  const endIndex = Math.min(flattened.length, Math.ceil((scrollTop + viewportHeight) / averageHeight) + OVERSCAN)
  const visibleEntries = flattened.slice(startIndex, endIndex)

  const offsetTop = flattened.slice(0, startIndex).reduce((height, entry) => {
    return height + (entry.kind === "header" ? HEADER_HEIGHT : ITEM_HEIGHT)
  }, 0)

  return (
    <div
      className="h-[740px] overflow-y-auto"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      aria-label="Virtualized activity timeline"
    >
      <div className="relative" style={{ height: `${totalHeight}px` }}>
        <div className="absolute left-0 right-0" style={{ transform: `translateY(${offsetTop}px)` }}>
          {visibleEntries.map((entry) => {
            if (entry.kind === "header") {
              return (
                <div key={entry.key} className="mb-3" style={{ height: `${HEADER_HEIGHT}px` }}>
                  <ActivityGroupHeader
                    group={entry.group}
                    expanded={entry.group.expanded}
                    onToggle={() => onToggleGroup(entry.group.key)}
                  />
                </div>
              )
            }

            return (
              <div key={entry.key} className="mb-3" style={{ minHeight: `${ITEM_HEIGHT}px` }}>
                <ActivityCard
                  item={entry.item}
                  selected={selectedActivityId === entry.item.id}
                  onSelect={onSelect}
                  onTogglePinned={onTogglePinned}
                  onToggleRead={onToggleRead}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
