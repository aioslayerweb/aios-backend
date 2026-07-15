"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { useSecurityContext } from "@/contexts/security-context"
import type { TenantProfile } from "@/types/security-foundation"
import { createTenantProfile } from "@/utils/security-foundation"

type TenantContextValue = TenantProfile & {
  selectedTenantId: string
  setSelectedTenantId: (tenantId: string) => void
  updateSecuritySettings: (updater: (current: TenantProfile["settings"]) => TenantProfile["settings"]) => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

export function TenantProvider({ children }: { children: ReactNode }) {
  const security = useSecurityContext()
  const [selectedTenantId, setSelectedTenantId] = useState(security.selectedOrganizationId)
  const [settings, setSettings] = useState(() => createTenantProfile(security).settings)

  const tenant = useMemo(() => createTenantProfile({ ...security, selectedOrganizationId: selectedTenantId }), [security, selectedTenantId])

  const updateSecuritySettings = useCallback((updater: (current: TenantProfile["settings"]) => TenantProfile["settings"]) => {
    setSettings((current) => updater(current))
  }, [])

  const value = useMemo<TenantContextValue>(() => ({ ...tenant, settings, selectedTenantId, setSelectedTenantId, updateSecuritySettings }), [selectedTenantId, settings, tenant, updateSecuritySettings])

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenantContext() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error("useTenantContext must be used within TenantProvider")
  }

  return context
}