"use client"

import { useMemo } from "react"
import { useRoleContext } from "@/hooks/use-role-context"
import { useSecurityContext } from "@/contexts/security-context"
import { can, cannot, hasPermission, hasRole, resolvePermissions, resolvePolicies } from "@/utils/authorization"

export function usePermissions() {
  const { filteredPermissions, policies } = useSecurityContext()
  const { role, organization, workspace } = useRoleContext()

  const effectivePermissions = useMemo(() => resolvePermissions(role, filteredPermissions), [filteredPermissions, role])
  const activePolicies = useMemo(() => resolvePolicies(policies, { organizationId: organization?.id, workspaceId: workspace?.id }), [organization?.id, policies, workspace?.id])

  const authorization = useMemo(
    () => ({
      can: (required: (typeof effectivePermissions)[number]) => can({ role, permissions: filteredPermissions, policies: activePolicies }, required),
      cannot: (required: (typeof effectivePermissions)[number]) => cannot({ role, permissions: filteredPermissions, policies: activePolicies }, required),
      hasPermission: (required: (typeof effectivePermissions)[number]) => hasPermission(effectivePermissions, required),
      hasRole: (expected: NonNullable<typeof role>["name"] | NonNullable<typeof role>["name"][]) => hasRole(role, expected),
      resolvePermissions: () => effectivePermissions,
      resolvePolicies: () => activePolicies,
    }),
    [activePolicies, effectivePermissions, filteredPermissions, role]
  )

  return {
    permissions: filteredPermissions,
    effectivePermissions,
    ...authorization,
  }
}