import type { BlueprintSnapshot, CompareSectionChange, CompareVersionsResult } from "@/src/core/business-blueprint/types"

function stringify(value: unknown): string {
  if (typeof value === "string") {
    return value
  }

  return JSON.stringify(value)
}

function flatten(value: unknown, parent = ""): ReadonlyArray<{ path: string; value: unknown }> {
  if (value === null || value === undefined) {
    return [{ path: parent, value }]
  }

  if (Array.isArray(value)) {
    return [{ path: parent, value }]
  }

  if (typeof value !== "object") {
    return [{ path: parent, value }]
  }

  const entries = Object.entries(value as Record<string, unknown>)
  if (!entries.length) {
    return [{ path: parent, value }]
  }

  return entries.flatMap(([key, nested]) => flatten(nested, parent ? `${parent}.${key}` : key))
}

export function compareSnapshots(left: BlueprintSnapshot, right: BlueprintSnapshot): ReadonlyArray<CompareSectionChange> {
  const leftMap = new Map(flatten(left).map((entry) => [entry.path, entry.value]))
  const rightMap = new Map(flatten(right).map((entry) => [entry.path, entry.value]))

  const keys = new Set([...Array.from(leftMap.keys()), ...Array.from(rightMap.keys())])
  const changes: CompareSectionChange[] = []

  keys.forEach((key) => {
    const leftValue = leftMap.get(key)
    const rightValue = rightMap.get(key)

    if (stringify(leftValue) === stringify(rightValue)) {
      return
    }

    const section = key.split(".")[0] ?? "unknown"
    const field = key.includes(".") ? key.split(".").slice(1).join(".") : key
    changes.push({
      section,
      field,
      before: stringify(leftValue),
      after: stringify(rightValue),
    })
  })

  return changes
}

export function formatCompareResult(leftVersionId: string, rightVersionId: string, changes: ReadonlyArray<CompareSectionChange>): CompareVersionsResult {
  return {
    leftVersionId,
    rightVersionId,
    changes,
  }
}
