"use client"

import { useRuntimePlatformContext } from "@/src/runtime/contexts/runtime-platform-context"

export function useRuntime() {
  const { state, refresh } = useRuntimePlatformContext()

  return {
    runtimeLifecycle: state.manager.lifecycle,
    managedComponents: state.manager.components,
    recoveryPlans: state.manager.recoveryPlans,
    gracefulShutdownInProgress: state.manager.gracefulShutdownInProgress,
    refresh,
  }
}
