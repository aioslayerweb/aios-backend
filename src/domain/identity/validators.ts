import type { Permission, Role, Team, User } from "@/src/domain/identity/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for Permission entities. */
export function isPermission(value: unknown): value is Permission {
  return isRecord(value) && typeof value.id === "string" && typeof value.resource === "string"
}

/** Type guard for Role entities. */
export function isRole(value: unknown): value is Role {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.permissionIds)
}

/** Type guard for Team entities. */
export function isTeam(value: unknown): value is Team {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.memberIds)
}

/** Type guard for User entities. */
export function isUser(value: unknown): value is User {
  return isRecord(value) && typeof value.id === "string" && isRecord(value.email)
}
