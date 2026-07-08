import type { Department, Organization } from "@/src/domain/organization/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for Organization entities. */
export function isOrganization(value: unknown): value is Organization {
  return isRecord(value) && typeof value.id === "string" && typeof value.domain === "string"
}

/** Type guard for Department entities. */
export function isDepartment(value: unknown): value is Department {
  return isRecord(value) && typeof value.id === "string" && typeof value.workspaceId === "string"
}
