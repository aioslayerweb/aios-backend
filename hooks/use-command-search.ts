"use client"

import { useMemo } from "react"
import type { CommandItem, CommandPaletteGroup, GroupedCommandSection } from "@/types"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { useRecentCommands } from "@/hooks/use-recent-commands"
import { searchCommandItems } from "@/utils/command-palette"

export type GroupedCommands = GroupedCommandSection[]

function section(group: CommandPaletteGroup, items: CommandItem[]) {
  return { group, items }
}

function byGroup(items: CommandItem[], group: CommandPaletteGroup): CommandItem[] {
  return items.filter((item) => item.group === group)
}

export function useCommandSearch(localQuery?: string) {
  const { commands, query, pinnedCommandIds, history } = useCommandPalette()
  const { recent } = useRecentCommands()

  const activeQuery = typeof localQuery === "string" ? localQuery : query

  const filtered = useMemo(() => {
    const ranked = searchCommandItems(commands, activeQuery)
    return ranked.map((entry) => entry.item)
  }, [activeQuery, commands])

  const pinned = useMemo(
    () => commands.filter((item) => item.pinned || pinnedCommandIds.includes(item.id)),
    [commands, pinnedCommandIds]
  )

  const grouped = useMemo<GroupedCommands>(() => {
    const hasQuery = activeQuery.trim().length > 0
    const frequent = commands
      .map((item) => ({ item, usage: history.filter((entry) => entry.commandId === item.id).length }))
      .filter((entry) => entry.usage > 0)
      .sort((left, right) => right.usage - left.usage)
      .map((entry) => entry.item)
      .slice(0, 6)

    const trending = byGroup(commands, "trending")

    if (hasQuery) {
      return [
        section("suggestions", filtered.slice(0, 6)),
        section("navigation", byGroup(filtered, "navigation")),
        section("runtime", byGroup(filtered, "runtime")),
        section("memory", byGroup(filtered, "memory")),
        section("knowledge", byGroup(filtered, "knowledge")),
        section("agents", byGroup(filtered, "agents")),
        section("actions", byGroup(filtered, "actions")),
        section("activity", byGroup(filtered, "activity")),
        section("executions", byGroup(filtered, "executions")),
        section("tasks", byGroup(filtered, "tasks")),
        section("customers", byGroup(filtered, "customers")),
        section("reports", byGroup(filtered, "reports")),
        section("settings", byGroup(filtered, "settings")),
        section("system", byGroup(filtered, "system")),
        section("entities", byGroup(filtered, "entities")),
        section("commands", byGroup(filtered, "commands")),
        section("ai", byGroup(filtered, "ai")),
        section("ai-suggestions", byGroup(filtered, "ai-suggestions")),
      ].filter((section) => section.items.length > 0)
    }

    return [
      section("recent", recent),
      section("favorites", pinned.slice(0, 6)),
      section("frequent", frequent),
      section("trending", trending),
      section("navigation", byGroup(commands, "navigation")),
      section("runtime", byGroup(commands, "runtime")),
      section("memory", byGroup(commands, "memory")),
      section("knowledge", byGroup(commands, "knowledge")),
      section("agents", byGroup(commands, "agents")),
      section("actions", byGroup(commands, "actions")),
      section("activity", byGroup(commands, "activity")),
      section("executions", byGroup(commands, "executions")),
      section("tasks", byGroup(commands, "tasks")),
      section("customers", byGroup(commands, "customers")),
      section("reports", byGroup(commands, "reports")),
      section("settings", byGroup(commands, "settings")),
      section("system", byGroup(commands, "system")),
      section("entities", byGroup(commands, "entities")),
      section("commands", byGroup(commands, "commands")),
      section("ai", byGroup(commands, "ai")),
      section("ai-suggestions", byGroup(commands, "ai-suggestions")),
    ].filter((section) => section.items.length > 0)
  }, [activeQuery, commands, filtered, history, pinned, recent])

  const flatItems = useMemo(() => grouped.flatMap((group) => group.items), [grouped])

  const sectionStartIndexes = useMemo(() => {
    let cursor = 0
    return grouped.map((section) => {
      const start = cursor
      cursor += section.items.length
      return { group: section.group, startIndex: start, size: section.items.length }
    })
  }, [grouped])

  return {
    query: activeQuery,
    grouped,
    flatItems,
    sectionStartIndexes,
    isEmpty: flatItems.length === 0,
  }
}
