import type { BusinessBlueprint } from "@/src/core/business-blueprint/types"

type MergeMode = "preserve-existing" | "prefer-incoming"

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function mergeValue(current: unknown, incoming: unknown, mode: MergeMode): unknown {
  if (incoming === undefined) {
    return current
  }

  if (Array.isArray(current) && Array.isArray(incoming)) {
    return mode === "prefer-incoming" ? incoming : current.length ? current : incoming
  }

  if (isPlainObject(current) && isPlainObject(incoming)) {
    const keys = new Set([...Object.keys(current), ...Object.keys(incoming)])
    const merged: Record<string, unknown> = {}
    keys.forEach((key) => {
      merged[key] = mergeValue(current[key], incoming[key], mode)
    })
    return merged
  }

  if (mode === "prefer-incoming") {
    return incoming
  }

  return current ?? incoming
}

export function mergeBlueprintPatch(
  current: BusinessBlueprint,
  incoming: Partial<BusinessBlueprint>,
  mode: MergeMode,
): BusinessBlueprint {
  return mergeValue(current, incoming, mode) as BusinessBlueprint
}
