import { DecisionStatus, Priority } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, DecisionId, GoalId, KnowledgeId, MemoryId, UserId, WorkflowId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Decision extends Entity<DecisionId>, TimestampedEntity, VersionedEntity, OwnedEntity<UserId>, AuditableEntity {
  readonly title: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly ownerId: UserId
  readonly priority: Priority
  readonly status: DecisionStatus
  readonly goalId?: GoalId
  readonly workflowId?: WorkflowId
  readonly memoryIds: ReadonlyArray<MemoryId>
  readonly knowledgeIds: ReadonlyArray<KnowledgeId>
  readonly metadata: DomainMetadata
}

export function createDecision(partial: Partial<Decision> = {}): Decision {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("decision"),
    title: partial.title ?? "Executive decision",
    summary: partial.summary ?? "Decision supporting business execution.",
    companyId: partial.companyId ?? createId("company"),
    ownerId: partial.ownerId ?? createId("user"),
    priority: partial.priority ?? Priority.High,
    status: partial.status ?? DecisionStatus.Proposed,
    goalId: partial.goalId,
    workflowId: partial.workflowId,
    memoryIds: partial.memoryIds ?? [],
    knowledgeIds: partial.knowledgeIds ?? [],
    metadata: partial.metadata ?? { namespace: "decision", displayName: "Decision", description: "A governed choice in the enterprise operating model.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isDecision(value: unknown): value is Decision {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).title === "string"
}