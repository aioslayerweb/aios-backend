import type { PermissionRecord, RoleRecord, SecurityPermissionKey, SecurityPolicy } from "@/types"

export type AuthorizationContext = {
  role: RoleRecord | null
  permissions: PermissionRecord[]
  policies: SecurityPolicy[]
}

export function hasRole(role: RoleRecord | null, expected: RoleRecord["name"] | RoleRecord["name"][]): boolean {
  if (!role) {
    return false
  }

  const allowed = Array.isArray(expected) ? expected : [expected]
  return allowed.includes(role.name)
}

export function resolvePermissions(role: RoleRecord | null, catalog: PermissionRecord[]): SecurityPermissionKey[] {
  if (!role) {
    return []
  }

  const resolvedFromRole = role.permissions
  const resolvedFromAssignments = catalog
    .filter((permission) => permission.assignedRoles.includes(role.name))
    .map((permission) => permission.key)

  return Array.from(new Set([...resolvedFromRole, ...resolvedFromAssignments]))
}

export function hasPermission(permissions: SecurityPermissionKey[], required: SecurityPermissionKey): boolean {
  return permissions.includes(required)
}

export function resolvePolicies(policies: SecurityPolicy[], scope?: { organizationId?: string; workspaceId?: string }): SecurityPolicy[] {
  return policies.filter((policy) => {
    if (policy.status !== "active") {
      return false
    }

    if (scope?.organizationId && policy.organizationId !== scope.organizationId) {
      return false
    }

    if (scope?.workspaceId && policy.workspaceId && policy.workspaceId !== scope.workspaceId) {
      return false
    }

    return true
  })
}

export function can(context: AuthorizationContext, required: SecurityPermissionKey): boolean {
  const effectivePermissions = resolvePermissions(context.role, context.permissions)
  return hasPermission(effectivePermissions, required)
}

export function cannot(context: AuthorizationContext, required: SecurityPermissionKey): boolean {
  return !can(context, required)
}
