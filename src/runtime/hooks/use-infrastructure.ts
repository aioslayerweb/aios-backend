"use client"

import { useRuntimePlatformContext } from "@/src/runtime/contexts/runtime-platform-context"

export function useInfrastructure() {
  const { state, runtimePlatform, tenantId, refresh } = useRuntimePlatformContext()

  return {
    resources: state.resources,
    circuits: state.circuits,
    scalabilityProfiles: state.scalabilityProfiles,
    dashboards: state.dashboards.filter((dashboard) =>
      ["runtime", "health", "performance", "infrastructure", "mcp-health"].includes(dashboard.dashboard)
    ),
    activeWorkers: runtimePlatform.workers.listActiveByTenant(tenantId),
    workerUsage: runtimePlatform.workers.usage(),
    refresh,
  }
}
