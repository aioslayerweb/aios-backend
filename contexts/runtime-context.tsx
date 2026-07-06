"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

type RuntimeStatus = "idle" | "running" | "degraded"

type RuntimeContextValue = {
  aiStatus: RuntimeStatus
  connectionStatus: "connected" | "disconnected"
  memoryStatus: "synced" | "syncing" | "stale"
  setAiStatus: (value: RuntimeStatus) => void
  setConnectionStatus: (value: "connected" | "disconnected") => void
  setMemoryStatus: (value: "synced" | "syncing" | "stale") => void
}

const RuntimeContext = createContext<RuntimeContextValue | null>(null)

export function RuntimeProvider({ children }: { children: ReactNode }) {
  const [aiStatus, setAiStatus] = useState<RuntimeStatus>("idle")
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("connected")
  const [memoryStatus, setMemoryStatus] = useState<"synced" | "syncing" | "stale">("synced")

  const value = useMemo(
    () => ({
      aiStatus,
      connectionStatus,
      memoryStatus,
      setAiStatus,
      setConnectionStatus,
      setMemoryStatus,
    }),
    [aiStatus, connectionStatus, memoryStatus]
  )

  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>
}

export function useRuntimeContext(): RuntimeContextValue {
  const context = useContext(RuntimeContext)
  if (!context) {
    throw new Error("useRuntimeContext must be used within RuntimeProvider")
  }

  return context
}
