import type { Memory, MemoryEntry, MemorySnapshot } from "@/src/domain/memory/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for Memory entities. */
export function isMemory(value: unknown): value is Memory {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.entryIds)
}

/** Type guard for MemoryEntry entities. */
export function isMemoryEntry(value: unknown): value is MemoryEntry {
  return isRecord(value) && typeof value.id === "string" && typeof value.memoryId === "string"
}

/** Type guard for MemorySnapshot entities. */
export function isMemorySnapshot(value: unknown): value is MemorySnapshot {
  return isRecord(value) && typeof value.id === "string" && typeof value.hash === "string"
}
