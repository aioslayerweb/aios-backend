"use client"

import { useRuntimePlatformContext } from "@/src/runtime/contexts/runtime-platform-context"

export function useLiveEvents() {
  const { state, runtimePlatform, tenantId } = useRuntimePlatformContext()

  return {
    liveEvents: state.liveEvents,
    replayEvents: runtimePlatform.eventBus.replay({ tenantId }),
    eventHistory: state.events,
  }
}
