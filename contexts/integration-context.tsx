"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  createDefaultIntegrationState,
  selectFilteredAvailableIntegrations,
  selectHealthSummary,
  selectSyncSummary,
  type ConnectedSystem,
  type IntegrationActivity,
  type IntegrationCategory,
  type IntegrationLogEntry,
  type IntegrationState,
  type IntegrationSyncObject,
} from "@/lib/integrations"

type IntegrationContextValue = IntegrationState & {
  filteredAvailableIntegrations: IntegrationState["availableIntegrations"]
  healthSummary: ReturnType<typeof selectHealthSummary>
  syncSummary: ReturnType<typeof selectSyncSummary>
  setSelectedCategory: (category: IntegrationCategory | "all") => void
  toggleDeveloperMode: () => void
  connectSystem: (systemId: string) => void
  pauseSystem: (systemId: string) => void
  triggerSync: (systemId: string, object?: IntegrationSyncObject) => void
  retryLog: (logId: string) => void
}

const IntegrationContext = createContext<IntegrationContextValue | null>(null)

function appendSystemUpdate(
  systems: ConnectedSystem[],
  systemId: string,
  updater: (system: ConnectedSystem) => ConnectedSystem
) {
  return systems.map((system) => (system.id === systemId ? updater(system) : system))
}

function activityItem(title: string, detail: string, source: string, status: IntegrationActivity["status"]): IntegrationActivity {
  return {
    id: `activity-${Date.now()}-${Math.round(Math.random() * 999)}`,
    title,
    detail,
    source,
    timestamp: "just now",
    status,
  }
}

function logEntry(source: string, target: string, detail: string, status: IntegrationLogEntry["status"], retryable: boolean): IntegrationLogEntry {
  return {
    id: `log-${Date.now()}-${Math.round(Math.random() * 999)}`,
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    source,
    target,
    duration: "120ms",
    status,
    retryable,
    detail,
  }
}

export function IntegrationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IntegrationState>(() => createDefaultIntegrationState())

  const value = useMemo<IntegrationContextValue>(() => {
    const connectSystem = (systemId: string) => {
      setState((previous) => {
        const system = previous.connectedSystems.find((item) => item.id === systemId)
        if (!system) {
          return previous
        }

        return {
          ...previous,
          connectedSystems: appendSystemUpdate(previous.connectedSystems, systemId, (item) => ({
            ...item,
            authState: "connected",
            health: item.health === "offline" ? "warning" : "healthy",
            lastSync: "just now",
            statusDetail: `${item.name} connection handshake validated in mock mode.`,
          })),
          activities: [
            activityItem("Connection activated", `${system.name} is now available to AIOS adapters.`, system.name, "updated"),
            ...previous.activities,
          ].slice(0, 12),
          logs: [
            logEntry(system.name, "Runtime Engine", "Adapter connection request accepted.", "success", false),
            ...previous.logs,
          ].slice(0, 12),
        }
      })
    }

    const pauseSystem = (systemId: string) => {
      setState((previous) => {
        const system = previous.connectedSystems.find((item) => item.id === systemId)
        if (!system) {
          return previous
        }

        const nextHealth = system.health === "paused" ? "healthy" : "paused"
        const detail = nextHealth === "paused" ? "Synchronization paused for change control review." : "Synchronization resumed through adapter policy."

        return {
          ...previous,
          connectedSystems: appendSystemUpdate(previous.connectedSystems, systemId, (item) => ({
            ...item,
            health: nextHealth,
            statusDetail: detail,
          })),
          activities: [activityItem(nextHealth === "paused" ? "Connection paused" : "Connection resumed", detail, system.name, "warning"), ...previous.activities].slice(0, 12),
          logs: [logEntry(system.name, "Workflow Builder", detail, nextHealth === "paused" ? "warning" : "success", false), ...previous.logs].slice(0, 12),
        }
      })
    }

    const triggerSync = (systemId: string, object: IntegrationSyncObject = "knowledge") => {
      setState((previous) => {
        const system = previous.connectedSystems.find((item) => item.id === systemId)
        if (!system) {
          return previous
        }

        return {
          ...previous,
          connectedSystems: appendSystemUpdate(previous.connectedSystems, systemId, (item) => ({
            ...item,
            lastSync: "queued now",
          })),
          syncJobs: previous.syncJobs.map((job) =>
            job.systemId === systemId
              ? {
                  ...job,
                  object,
                  status: "running",
                  queued: Math.max(0, job.queued - 1),
                  running: job.running + 1,
                  updatedAt: "just now",
                }
              : job
          ),
          activities: [activityItem("Synchronization started", `${system.name} ${object} sync accepted by Runtime Engine.`, system.name, "synced"), ...previous.activities].slice(0, 12),
          logs: [logEntry(system.name, "Memory Layer", `${object} synchronization queued in adapter pipeline.`, "success", false), ...previous.logs].slice(0, 12),
        }
      })
    }

    const retryLog = (logId: string) => {
      setState((previous) => {
        const existing = previous.logs.find((entry) => entry.id === logId)
        if (!existing) {
          return previous
        }

        return {
          ...previous,
          activities: [activityItem("Retry requested", `Replay requested for ${existing.source} to ${existing.target}.`, existing.source, "updated"), ...previous.activities].slice(0, 12),
          logs: [logEntry(existing.source, existing.target, `Retry accepted for ${existing.detail}`, "success", false), ...previous.logs].slice(0, 12),
        }
      })
    }

    return {
      ...state,
      filteredAvailableIntegrations: selectFilteredAvailableIntegrations(state),
      healthSummary: selectHealthSummary(state),
      syncSummary: selectSyncSummary(state),
      setSelectedCategory: (category) => setState((previous) => ({ ...previous, selectedCategory: category })),
      toggleDeveloperMode: () => setState((previous) => ({ ...previous, developerMode: !previous.developerMode })),
      connectSystem,
      pauseSystem,
      triggerSync,
      retryLog,
    }
  }, [state])

  return <IntegrationContext.Provider value={value}>{children}</IntegrationContext.Provider>
}

export function useIntegrationContext() {
  const context = useContext(IntegrationContext)
  if (!context) {
    throw new Error("useIntegrationContext must be used within IntegrationProvider")
  }

  return context
}