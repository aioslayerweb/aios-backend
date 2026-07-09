"use client"

import { useRuntimePlatformContext } from "@/src/runtime/contexts/runtime-platform-context"

export function useHealth() {
  const { state, runtimePlatform, tenantId, refresh } = useRuntimePlatformContext()

  return {
    checks: state.health,
    overall: runtimePlatform.health.evaluate(tenantId),
    updateCheck: runtimePlatform.health.updateCheck.bind(runtimePlatform.health),
    refresh,
  }
}
