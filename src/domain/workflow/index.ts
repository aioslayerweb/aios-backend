import { WorkflowStatus } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, DecisionId, EventId, GoalId, ProjectId, TaskId, UserId, WorkflowId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Workflow extends Entity<WorkflowId>, TimestampedEntity, VersionedEntity, OwnedEntity<UserId>, AuditableEntity {
  readonly name: string
  readonly description: string
  readonly companyId: CompanyId
  readonly ownerId: UserId
  readonly status: WorkflowStatus
  readonly goalId?: GoalId
  readonly projectIds: ReadonlyArray<ProjectId>
  readonly taskIds: ReadonlyArray<TaskId>
  readonly decisionIds: ReadonlyArray<DecisionId>
  readonly eventIds: ReadonlyArray<EventId>
  readonly metadata: DomainMetadata
}

export function createWorkflow(partial: Partial<Workflow> = {}): Workflow {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("workflow"),
    name: partial.name ?? "Executive Review Flow",
    description: partial.description ?? "Coordinates approvals, tasks, and decision checkpoints.",
    companyId: partial.companyId ?? createId("company"),
    ownerId: partial.ownerId ?? createId("user"),
    status: partial.status ?? WorkflowStatus.Draft,
    goalId: partial.goalId,
    projectIds: partial.projectIds ?? [],
    taskIds: partial.taskIds ?? [],
    decisionIds: partial.decisionIds ?? [],
    eventIds: partial.eventIds ?? [],
    metadata: partial.metadata ?? { namespace: "workflow", displayName: "Workflow", description: "A reusable sequence of business work.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isWorkflow(value: unknown): value is Workflow {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).name === "string"
}