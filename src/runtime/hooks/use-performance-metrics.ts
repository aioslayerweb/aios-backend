"use client"

import { useRuntimePlatformContext } from "@/src/runtime/contexts/runtime-platform-context"

export function usePerformanceMetrics() {
  const { state, runtimePlatform, tenantId, refresh } = useRuntimePlatformContext()

  return {
    resources: state.resources,
    scalabilityProfiles: state.scalabilityProfiles,
    recordResource: runtimePlatform.performance.recordResource.bind(runtimePlatform.performance),
    updateScalabilityProfile: runtimePlatform.performance.updateScalabilityProfile.bind(runtimePlatform.performance),
    latestResources: runtimePlatform.performance.latestResources(tenantId),
    refresh,
  }
}
