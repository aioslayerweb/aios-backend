"use client"

import { useMemo } from "react"
import { useRuntimeStatus } from "@/hooks/use-runtime-status"

export function useRuntimeModules() {
  const { modules } = useRuntimeStatus()

  const activeModules = useMemo(
    () => modules.filter((item) => item.status === "active" || item.status === "synchronizing"),
    [modules]
  )

  return {
    modules,
    activeModules,
  }
}
