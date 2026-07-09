"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { InfrastructurePlatform } from "@/src/infrastructure/deployment/infrastructure-platform"
import type { InfrastructureState } from "@/src/infrastructure/types"

type InfrastructureContextValue = {
  platform: InfrastructurePlatform
  state: InfrastructureState
  refresh: () => void
}

const InfrastructureContext = createContext<InfrastructureContextValue | null>(null)

function createInfrastructurePlatform(): InfrastructurePlatform {
  return new InfrastructurePlatform()
}

export function InfrastructureProvider({ children }: { children: ReactNode }) {
  const platform = useMemo(() => createInfrastructurePlatform(), [])
  const [state, setState] = useState<InfrastructureState>(() => platform.snapshot())

  const value = useMemo(
    () => ({
      platform,
      state,
      refresh: () => setState(platform.snapshot()),
    }),
    [platform, state]
  )

  return <InfrastructureContext.Provider value={value}>{children}</InfrastructureContext.Provider>
}

export function useInfrastructureContext(): InfrastructureContextValue {
  const context = useContext(InfrastructureContext)
  if (!context) {
    throw new Error("useInfrastructureContext must be used within InfrastructureProvider")
  }
  return context
}
