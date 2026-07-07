"use client"

import { useMemo } from "react"
import { useRuntimeStatus } from "@/hooks/use-runtime-status"

export function useSystemHealth() {
  const { overallHealth, modules } = useRuntimeStatus()

  const summary = useMemo(() => {
    const byLevel = modules.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1
      return acc
    }, {})

    return byLevel
  }, [modules])

  return {
    overallHealth,
    summary,
  }
}
