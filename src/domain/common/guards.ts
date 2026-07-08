import type { Entity } from "@/src/domain/common/base"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Generic entity guard based on id existence. */
export function isEntity(value: unknown): value is Entity<string> {
  return isRecord(value) && typeof value.id === "string"
}
