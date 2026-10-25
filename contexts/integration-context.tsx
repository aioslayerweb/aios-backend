"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  createDefaultIntegrationState,
  selectFilteredAvailableIntegrations,
  selectHealthSummary,
  selectSyncSummary,
  type IntegrationCategory,
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

function unavailable(action: string): never {
  throw new Error(`${action} unavailable: no verified external connector service is configured.`)
}

export function IntegrationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IntegrationState>(() => createDefaultIntegrationState())

  const value = useMemo<IntegrationContextValue>(() => ({
    ...state,
    filteredAvailableIntegrations: selectFilteredAvailableIntegrations(state),
    healthSummary: selectHealthSummary(state),
    syncSummary: selectSyncSummary(state),
    setSelectedCategory: (category) => setState((previous) => ({ ...previous, selectedCategory: category })),
    toggleDeveloperMode: () => setState((previous) => ({ ...previous, developerMode: !previous.developerMode })),
    connectSystem: (systemId) => unavailable(`Connect ${systemId}`),
    pauseSystem: (systemId) => unavailable(`Pause ${systemId}`),
    triggerSync: (systemId) => unavailable(`Synchronize ${systemId}`),
    retryLog: (logId) => unavailable(`Retry ${logId}`),
  }), [state])

  return <IntegrationContext.Provider value={value}>{children}</IntegrationContext.Provider>
}

export function useIntegrationContext() {
  const context = useContext(IntegrationContext)
  if (!context) {
    throw new Error("useIntegrationContext must be used within IntegrationProvider")
  }

  return context
}
