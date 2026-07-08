import { Priority, RuntimeStatus, Status } from "@/src/domain/common/enums"
import type { Memory, MemoryEntry, MemorySnapshot } from "@/src/domain/memory/types"
import { createId } from "@/src/domain/utils/id"

/** Creates a memory aggregate. */
export function createMemory(partial: Partial<Memory> = {}): Memory {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("memory"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    name: partial.name ?? "Customer Intelligence Memory",
    description: partial.description ?? "Persistent customer context and execution learnings.",
    status: partial.status ?? Status.Active,
    entryIds: partial.entryIds ?? [],
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "customer intelligence memory",
    searchKeywords: partial.searchKeywords ?? ["memory", "customer", "context"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a memory entry. */
export function createMemoryEntry(partial: Partial<MemoryEntry> = {}): MemoryEntry {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("memory_entry"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    memoryId: partial.memoryId ?? createId("memory"),
    title: partial.title ?? "Procurement Concern",
    summary: partial.summary ?? "Customer requires security review before procurement.",
    content: partial.content ?? "SOC2 and data residency assurances are mandatory for expansion.",
    priority: partial.priority ?? Priority.High,
    sourceConversationId: partial.sourceConversationId,
    searchText: partial.searchText ?? "procurement concern security review",
    searchKeywords: partial.searchKeywords ?? ["procurement", "security", "memory"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a memory snapshot record. */
export function createMemorySnapshot(partial: Partial<MemorySnapshot> = {}): MemorySnapshot {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("memory_snapshot"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    memoryId: partial.memoryId ?? createId("memory"),
    runtimeStatus: partial.runtimeStatus ?? RuntimeStatus.Completed,
    entryCount: partial.entryCount ?? 0,
    hash: partial.hash ?? `hash_${Date.now().toString(36)}`,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
