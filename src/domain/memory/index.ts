import { MemoryType, Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, DecisionId, KnowledgeId, MemoryId, PersonId, ProjectId, WorkflowId, WorkspaceId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Memory extends Entity<MemoryId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly workspaceId?: WorkspaceId
  readonly ownerId: PersonId
  readonly type: MemoryType
  readonly status: Status
  readonly sourceEntityIds: ReadonlyArray<string>
  readonly relatedKnowledgeIds: ReadonlyArray<KnowledgeId>
  readonly relatedDecisionIds: ReadonlyArray<DecisionId>
  readonly relatedWorkflowIds: ReadonlyArray<WorkflowId>
  readonly relatedProjectIds: ReadonlyArray<ProjectId>
  readonly metadata: DomainMetadata
}

export function createMemory(partial: Partial<Memory> = {}): Memory {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("memory"),
    title: partial.title ?? "Working memory",
    summary: partial.summary ?? "A memory object capturing business context.",
    companyId: partial.companyId ?? createId("company"),
    workspaceId: partial.workspaceId,
    ownerId: partial.ownerId ?? createId("person"),
    type: partial.type ?? MemoryType.Working,
    status: partial.status ?? Status.Active,
    sourceEntityIds: partial.sourceEntityIds ?? [],
    relatedKnowledgeIds: partial.relatedKnowledgeIds ?? [],
    relatedDecisionIds: partial.relatedDecisionIds ?? [],
    relatedWorkflowIds: partial.relatedWorkflowIds ?? [],
    relatedProjectIds: partial.relatedProjectIds ?? [],
    metadata: partial.metadata ?? { namespace: "memory", displayName: "Memory", description: "A persistent memory artifact.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isMemory(value: unknown): value is Memory {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).summary === "string"
}
