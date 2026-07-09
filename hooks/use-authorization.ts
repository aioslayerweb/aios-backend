"use client"

import { usePermissions } from "@/hooks/use-permissions"

export function useAuthorization() {
  const {
    can,
    cannot,
    hasPermission,
    hasRole,
    resolvePermissions,
    resolvePolicies,
    effectivePermissions,
    permissions,
  } = usePermissions()

  return {
    can,
    cannot,
    hasPermission,
    hasRole,
    resolvePermissions,
    resolvePolicies,
    effectivePermissions,
    permissions,
  }
}
