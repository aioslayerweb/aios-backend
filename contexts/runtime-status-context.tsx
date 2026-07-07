"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type {
  RuntimeConnectionState,
  RuntimeDomainKey,
  RuntimeModuleStatus,
  RuntimeStatusLevel,
  RuntimeStatusState,
  RuntimeWebsocketState,
} from "@/types"
import { useRuntimeContext } from "@/contexts/runtime-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { useAIAssistantContext } from "@/contexts/ai-assistant-context"
import { useCommandPaletteContext } from "@/contexts/command-palette-context"
import {
  deriveOverallHealth,
  mockRuntimeModules,
  runtimeDomainOrder,
  statusMeta,
} from "@/utils/runtime-status"

type RuntimeStatusContextValue = RuntimeStatusState & {
  setExpanded: (expanded: boolean) => void
  toggleExpanded: () => void
  setConnectionState: (state: RuntimeConnectionState) => void
  setWebsocketState: (state: RuntimeWebsocketState) => void
  updateModuleStatus: (
    key: RuntimeDomainKey,
    payload: Partial<Pick<RuntimeModuleStatus, "status" | "label" | "description">>
  ) => void
  refreshTimestamp: () => void
}

const RuntimeStatusContext = createContext<RuntimeStatusContextValue | null>(null)

function mergeModuleState(
  current: RuntimeModuleStatus[],
  next: RuntimeModuleStatus[]
): RuntimeModuleStatus[] {
  const map = new Map(current.map((item) => [item.key, item]))

  for (const item of next) {
    map.set(item.key, item)
  }

  return runtimeDomainOrder
    .map((key) => map.get(key))
    .filter((item): item is RuntimeModuleStatus => Boolean(item))
}

export function RuntimeStatusProvider({ children }: { children: ReactNode }) {
  const { aiStatus, connectionStatus, memoryStatus } = useRuntimeContext()
  const { unreadCount } = useNotificationContext()
  const { agentStatuses } = useAIAssistantContext()
  const { isOpen: searchOpen } = useCommandPaletteContext()

  const [modules, setModules] = useState<RuntimeModuleStatus[]>(mockRuntimeModules)
  const [expanded, setExpanded] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(Date.now())
  const [connectionState, setConnectionState] = useState<RuntimeConnectionState>(
    connectionStatus === "connected" ? "connected" : "disconnected"
  )
  const [websocketState, setWebsocketState] = useState<RuntimeWebsocketState>({
    mode: "idle",
    enabled: false,
  })

  useEffect(() => {
    const aiModule: RuntimeModuleStatus = {
      key: "ai-runtime",
      name: "AI Runtime",
      status: aiStatus === "running" ? "active" : aiStatus === "degraded" ? "degraded" : "healthy",
      label: aiStatus === "running" ? "Active" : aiStatus === "degraded" ? "Degraded" : "Healthy",
      icon: "bot",
      colorToken: statusMeta(
        aiStatus === "running" ? "active" : aiStatus === "degraded" ? "degraded" : "healthy"
      ).colorToken,
      description:
        aiStatus === "running"
          ? "AI runtime is processing active operations."
          : aiStatus === "degraded"
            ? "AI runtime is responding with reduced quality."
            : "AI runtime engine is stable.",
      timestamp: Date.now(),
    }

    const runningAgents = agentStatuses.filter((item) => item.status === "running").length
    const agentModule: RuntimeModuleStatus = {
      key: "agents",
      name: "Agents",
      status: runningAgents > 0 ? "active" : "healthy",
      label: runningAgents > 0 ? `${runningAgents} Active` : "Healthy",
      icon: "cpu",
      colorToken: statusMeta(runningAgents > 0 ? "active" : "healthy").colorToken,
      description:
        runningAgents > 0
          ? `${runningAgents} agent workflows are executing.`
          : "Agent system is ready.",
      timestamp: Date.now(),
    }

    const memoryModule: RuntimeModuleStatus = {
      key: "memory",
      name: "Memory",
      status:
        memoryStatus === "syncing"
          ? "synchronizing"
          : memoryStatus === "stale"
            ? "warning"
            : "healthy",
      label:
        memoryStatus === "syncing"
          ? "Synchronizing"
          : memoryStatus === "stale"
            ? "Warning"
            : "Healthy",
      icon: "database",
      colorToken: statusMeta(
        memoryStatus === "syncing"
          ? "synchronizing"
          : memoryStatus === "stale"
            ? "warning"
            : "healthy"
      ).colorToken,
      description:
        memoryStatus === "syncing"
          ? "Memory layer synchronization in progress."
          : memoryStatus === "stale"
            ? "Memory freshness is behind target."
            : "Memory services are healthy.",
      timestamp: Date.now(),
    }

    const notificationModule: RuntimeModuleStatus = {
      key: "notifications",
      name: "Notifications",
      status: unreadCount > 12 ? "warning" : unreadCount > 0 ? "active" : "healthy",
      label: unreadCount > 0 ? `${unreadCount} Pending` : "Healthy",
      icon: "bell",
      colorToken: statusMeta(unreadCount > 12 ? "warning" : unreadCount > 0 ? "active" : "healthy").colorToken,
      description:
        unreadCount > 0
          ? "Notification queue contains unread operational updates."
          : "Notification pipeline is clear.",
      timestamp: Date.now(),
    }

    const searchModule: RuntimeModuleStatus = {
      key: "search",
      name: "Search",
      status: searchOpen ? "active" : "healthy",
      label: searchOpen ? "Active" : "Healthy",
      icon: "search",
      colorToken: statusMeta(searchOpen ? "active" : "healthy").colorToken,
      description: searchOpen
        ? "Global search session is currently active."
        : "Global search services are healthy.",
      timestamp: Date.now(),
    }

    const nextConnectionState: RuntimeConnectionState =
      connectionStatus === "connected" ? "connected" : "disconnected"

    const supabaseModule: RuntimeModuleStatus = {
      key: "supabase",
      name: "Supabase Connection",
      status: nextConnectionState === "connected" ? "healthy" : "offline",
      label: nextConnectionState === "connected" ? "Connected" : "Offline",
      icon: "plug",
      colorToken: statusMeta(nextConnectionState === "connected" ? "healthy" : "offline").colorToken,
      description:
        nextConnectionState === "connected"
          ? "Supabase data channel is connected."
          : "Supabase connection is unavailable.",
      timestamp: Date.now(),
    }

    setConnectionState(nextConnectionState)

    setModules((previous) =>
      mergeModuleState(previous, [
        aiModule,
        agentModule,
        memoryModule,
        notificationModule,
        searchModule,
        supabaseModule,
      ])
    )
    setLastUpdated(Date.now())
  }, [
    agentStatuses,
    aiStatus,
    connectionStatus,
    memoryStatus,
    searchOpen,
    unreadCount,
  ])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLastUpdated(Date.now())
    }, 30_000)

    return () => window.clearInterval(timer)
  }, [])

  const updateModuleStatus = useCallback(
    (
      key: RuntimeDomainKey,
      payload: Partial<Pick<RuntimeModuleStatus, "status" | "label" | "description">>
    ) => {
      setModules((previous) =>
        previous.map((moduleStatus) => {
          if (moduleStatus.key !== key) {
            return moduleStatus
          }

          const nextStatus = payload.status ?? moduleStatus.status
          const nextMeta = statusMeta(nextStatus)

          return {
            ...moduleStatus,
            status: nextStatus,
            colorToken: nextMeta.colorToken,
            label: payload.label ?? nextMeta.label,
            description: payload.description ?? moduleStatus.description,
            timestamp: Date.now(),
          }
        })
      )
      setLastUpdated(Date.now())
    },
    []
  )

  const refreshTimestamp = useCallback(() => {
    setLastUpdated(Date.now())
  }, [])

  const overallHealth = useMemo(() => deriveOverallHealth(modules), [modules])

  const value = useMemo<RuntimeStatusContextValue>(
    () => ({
      overallHealth,
      modules,
      lastUpdated,
      expanded,
      connectionState,
      websocketState,
      setExpanded,
      toggleExpanded: () => setExpanded((previous) => !previous),
      setConnectionState,
      setWebsocketState,
      updateModuleStatus,
      refreshTimestamp,
    }),
    [
      connectionState,
      expanded,
      lastUpdated,
      modules,
      overallHealth,
      refreshTimestamp,
      updateModuleStatus,
      websocketState,
    ]
  )

  return (
    <RuntimeStatusContext.Provider value={value}>
      {children}
    </RuntimeStatusContext.Provider>
  )
}

export function useRuntimeStatusContext(): RuntimeStatusContextValue {
  const context = useContext(RuntimeStatusContext)
  if (!context) {
    throw new Error("useRuntimeStatusContext must be used within RuntimeStatusProvider")
  }

  return context
}
