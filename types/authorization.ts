import type { PermissionRecord, RoleRecord, SecurityPermissionKey, SecurityPolicy } from "./security"

export type AuthorizationService = {
  can: (required: SecurityPermissionKey) => boolean
  cannot: (required: SecurityPermissionKey) => boolean
  hasPermission: (required: SecurityPermissionKey) => boolean
  hasRole: (expected: RoleRecord["name"] | RoleRecord["name"][]) => boolean
  resolvePermissions: () => SecurityPermissionKey[]
  resolvePolicies: () => SecurityPolicy[]
  permissionsCatalog: PermissionRecord[]
  activePolicies: SecurityPolicy[]
}
