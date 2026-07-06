"use client"

import { useMemo } from "react"
import { useCommandPalette } from "@/hooks/use-command-palette"

export function useRecentCommands() {
  const { commands, recentCommandIds } = useCommandPalette()

  const recent = useMemo(() => {
    const index = new Map(commands.map((item) => [item.id, item]))
    return recentCommandIds
      .map((id) => index.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
  }, [commands, recentCommandIds])

  return {
    recent,
    hasRecent: recent.length > 0,
  }
}
