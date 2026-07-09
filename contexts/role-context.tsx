"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useAuthContext } from "@/contexts/auth-context"
import { useSecurityContext } from "@/contexts/security-context"
import { useTenantContext } from "@/contexts/tenant-context"
import type { RoleContextValue } from "@/types/security-foundation"
import { createRoleContextValue } from "@/utils/security-foundation"

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleContextProvider({ children }: { children: ReactNode }) {
  const security = useSecurityContext()
  const auth = useAuthContext()
  const tenant = useTenantContext()

  const value = useMemo(() => createRoleContextValue(security, auth, tenant), [auth, security, tenant])

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRoleContextValue() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useRoleContextValue must be used within RoleContextProvider")
  }

  return context
}