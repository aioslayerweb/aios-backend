"use client"

import { useRuntimeContext } from "@/contexts/runtime-context"

export function useAIStatus() {
  const { aiStatus, connectionStatus, memoryStatus } = useRuntimeContext()

  return {
    aiStatus,
    connectionStatus,
    memoryStatus,
    isRunning: aiStatus === "running",
    isConnected: connectionStatus === "connected",
  }
}
