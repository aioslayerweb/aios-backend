"use client"

import { useMemo } from "react"
import { useCommandPalette } from "@/hooks/use-command-palette"

export function useCommandHistory() {
  const { history, commands } = useCommandPalette()

  const hydratedHistory = useMemo(() => {
    const map = new Map(commands.map((item) => [item.id, item]))

    return history
      .map((entry) => ({
        ...entry,
        command: map.get(entry.commandId) ?? null,
      }))
      .filter((entry) => Boolean(entry.command))
  }, [commands, history])

  return {
    history: hydratedHistory,
    hasHistory: hydratedHistory.length > 0,
  }
}
