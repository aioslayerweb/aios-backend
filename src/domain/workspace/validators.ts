import type { Workspace } from "@/src/domain/workspace/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for Workspace entities. */
export function isWorkspace(value: unknown): value is Workspace {
  return isRecord(value) && typeof value.id === "string" && typeof value.slug === "string"
}
