"use client"

import { useRuntimePlatformContext } from "@/src/runtime/contexts/runtime-platform-context"

export function useQueues() {
  const { state, runtimePlatform, refresh, tenantId } = useRuntimePlatformContext()

  return {
    queues: state.queues,
    scheduleJob: runtimePlatform.scheduleJob.bind(runtimePlatform),
    enqueueJob: runtimePlatform.enqueueJob.bind(runtimePlatform),
    tickScheduler: () => {
      runtimePlatform.tickScheduler()
      refresh()
    },
    tenantId,
  }
}
