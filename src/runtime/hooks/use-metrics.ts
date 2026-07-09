"use client"

import { useRuntimePlatformContext } from "@/src/runtime/contexts/runtime-platform-context"

export function useMetrics() {
  const { state, runtimePlatform, tenantId, refresh } = useRuntimePlatformContext()

  return {
    metrics: state.metrics,
    recordMetric: runtimePlatform.metrics.record.bind(runtimePlatform.metrics),
    incrementMetric: runtimePlatform.metrics.increment.bind(runtimePlatform.metrics),
    refresh,
    tenantId,
  }
}
