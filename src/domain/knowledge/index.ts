import { KnowledgeType, Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, RelationshipDefinition, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, DecisionId, GoalId, KnowledgeId, MemoryId, PersonId, ProjectId, WorkflowId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Knowledge extends Entity<KnowledgeId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly ownerId: PersonId
  readonly type: KnowledgeType
  readonly status: Status
  readonly relatedGoalIds: ReadonlyArray<GoalId>
  readonly relatedProjectIds: ReadonlyArray<ProjectId>
  readonly relatedWorkflowIds: ReadonlyArray<WorkflowId>
  readonly relatedDecisionIds: ReadonlyArray<DecisionId>
  readonly relatedMemoryIds: ReadonlyArray<MemoryId>
  readonly metadata: DomainMetadata
}

export const knowledgeRelationships: ReadonlyArray<RelationshipDefinition<KnowledgeId>> = [
  { fromId: "knowledge" as KnowledgeId, toId: "memory" as KnowledgeId, relationship: "informs-memory", direction: "one-way" },
  { fromId: "knowledge" as KnowledgeId, toId: "workflow" as KnowledgeId, relationship: "guides-workflow", direction: "one-way" },
]

export function createKnowledge(partial: Partial<Knowledge> = {}): Knowledge {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("knowledge"),
    title: partial.title ?? "Executive knowledge",
    summary: partial.summary ?? "Reusable knowledge object for the operating model.",
    companyId: partial.companyId ?? createId("company"),
    ownerId: partial.ownerId ?? createId("person"),
    type: partial.type ?? KnowledgeType.Reference,
    status: partial.status ?? Status.Active,
    relatedGoalIds: partial.relatedGoalIds ?? [],
    relatedProjectIds: partial.relatedProjectIds ?? [],
    relatedWorkflowIds: partial.relatedWorkflowIds ?? [],
    relatedDecisionIds: partial.relatedDecisionIds ?? [],
    relatedMemoryIds: partial.relatedMemoryIds ?? [],
    metadata: partial.metadata ?? { namespace: "knowledge", displayName: "Knowledge", description: "A reusable business knowledge entity.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isKnowledge(value: unknown): value is Knowledge {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).title === "string"
}
