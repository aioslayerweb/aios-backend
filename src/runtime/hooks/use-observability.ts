"use client"

import { useRuntimePlatformContext } from "@/src/runtime/contexts/runtime-platform-context"

export function useObservability() {
  const { state, runtimePlatform, refresh, tenantId } = useRuntimePlatformContext()

  return {
    observability: state.observability,
    logs: runtimePlatform.observability.listLogs(tenantId),
    traces: runtimePlatform.observability.listTraces(),
    log: runtimePlatform.observability.log.bind(runtimePlatform.observability),
    startSpan: runtimePlatform.observability.startSpan.bind(runtimePlatform.observability),
    endSpan: runtimePlatform.observability.endSpan.bind(runtimePlatform.observability),
    registerAlert: runtimePlatform.observability.registerAlert.bind(runtimePlatform.observability),
    refresh,
  }
}
