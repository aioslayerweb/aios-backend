"use client"

import { useMemo } from "react"
import type { CommandItem, CommandPaletteGroup } from "@/types"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { useRecentCommands } from "@/hooks/use-recent-commands"
import { searchCommandItems } from "@/utils/command-palette"

export type GroupedCommands = Array<{
  group: CommandPaletteGroup
  items: CommandItem[]
}>

function section(group: CommandPaletteGroup, items: CommandItem[]) {
  return { group, items }
}

function byGroup(items: CommandItem[], group: CommandPaletteGroup): CommandItem[] {
  return items.filter((item) => item.group === group)
}

export function useCommandSearch(localQuery?: string) {
  const { commands, query, pinnedCommandIds } = useCommandPalette()
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

    if (hasQuery) {
      return [
        section("suggestions", filtered.slice(0, 5)),
        section("navigation", byGroup(filtered, "navigation")),
        section("entities", byGroup(filtered, "entities")),
        section("commands", byGroup(filtered, "commands")),
        section("ai-suggestions", byGroup(filtered, "ai-suggestions")),
      ].filter((section) => section.items.length > 0)
    }

    return [
      section("recent", recent),
      section("suggestions", pinned.slice(0, 6)),
      section("navigation", byGroup(commands, "navigation")),
      section("entities", byGroup(commands, "entities")),
      section("commands", byGroup(commands, "commands")),
      section("ai-suggestions", byGroup(commands, "ai-suggestions")),
    ].filter((section) => section.items.length > 0)
  }, [activeQuery, commands, filtered, pinned, recent])

  const flatItems = useMemo(() => grouped.flatMap((group) => group.items), [grouped])

  return {
    query: activeQuery,
    grouped,
    flatItems,
    isEmpty: flatItems.length === 0,
  }
}
