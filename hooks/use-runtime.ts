"use client"

import { useRuntimeLive } from "@/hooks/use-runtime-live"
import { useRuntime as useRuntimePlatform } from "@/src/runtime/hooks/use-runtime"

export function useRuntime() {
  const { events, runningAgents, pendingTasks, queueDepth } = useRuntimeLive()
  const runtimePlatform = useRuntimePlatform()

  return {
    events,
    runningAgents,
    pendingTasks,
    queueDepth,
    runtimeLifecycle: runtimePlatform.runtimeLifecycle,
    managedComponents: runtimePlatform.managedComponents,
    recoveryPlans: runtimePlatform.recoveryPlans,
    gracefulShutdownInProgress: runtimePlatform.gracefulShutdownInProgress,
    refreshRuntime: runtimePlatform.refresh,
  }
}
