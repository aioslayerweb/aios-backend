import type { Project, Task } from "@/src/domain/common/work-management"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for Task entities. */
export function isTask(value: unknown): value is Task {
  return isRecord(value) && typeof value.id === "string" && typeof value.title === "string"
}

/** Type guard for Project entities. */
export function isProject(value: unknown): value is Project {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.taskIds)
}
