"use client"

import { useRuntimeLive } from "@/hooks/use-runtime-live"
import { useHealth as useRuntimePlatformHealth } from "@/src/runtime/hooks/use-health"

export function useHealth() {
  const { health } = useRuntimeLive()
  const runtimeHealth = useRuntimePlatformHealth()

  return {
    health,
    runtimeChecks: runtimeHealth.checks,
    runtimeOverall: runtimeHealth.overall,
    refreshRuntimeHealth: runtimeHealth.refresh,
  }
}
