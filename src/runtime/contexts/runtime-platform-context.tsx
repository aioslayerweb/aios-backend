"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { RuntimePlatform } from "@/src/runtime/runtime-manager/runtime-platform"
import type { RuntimePlatformState } from "@/src/runtime/types"

type RuntimePlatformContextValue = {
  tenantId: string
  state: RuntimePlatformState
  runtimePlatform: RuntimePlatform
  refresh: () => void
}

const DEFAULT_TENANT_ID = "tenant-default"
const RuntimePlatformContext = createContext<RuntimePlatformContextValue | null>(null)

function createRuntimePlatform(tenantId: string): RuntimePlatform {
  const platform = new RuntimePlatform()
  platform.registerDefaultTenant(tenantId)
  return platform
}

export function RuntimePlatformProvider({ children }: { children: ReactNode }) {
  const [tenantId] = useState(DEFAULT_TENANT_ID)
  const runtimePlatform = useMemo(() => createRuntimePlatform(tenantId), [tenantId])
  const [state, setState] = useState<RuntimePlatformState>(() => runtimePlatform.toState(tenantId))

  const value = useMemo(
    () => ({
      tenantId,
      state,
      runtimePlatform,
      refresh: () => {
        setState(runtimePlatform.toState(tenantId))
      },
    }),
    [runtimePlatform, state, tenantId]
  )

  return <RuntimePlatformContext.Provider value={value}>{children}</RuntimePlatformContext.Provider>
}

export function useRuntimePlatformContext(): RuntimePlatformContextValue {
  const context = useContext(RuntimePlatformContext)
  if (!context) {
    throw new Error("useRuntimePlatformContext must be used within RuntimePlatformProvider")
  }
  return context
}
