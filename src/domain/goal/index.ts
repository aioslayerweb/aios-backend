import { GoalStatus, Priority } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, DepartmentId, DecisionId, GoalId, PersonId, ProjectId, TaskId, TeamId, WorkflowId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Goal extends Entity<GoalId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly description: string
  readonly companyId: CompanyId
  readonly ownerId: PersonId
  readonly priority: Priority
  readonly status: GoalStatus
  readonly departmentId?: DepartmentId
  readonly teamId?: TeamId
  readonly projectIds: ReadonlyArray<ProjectId>
  readonly taskIds: ReadonlyArray<TaskId>
  readonly workflowIds: ReadonlyArray<WorkflowId>
  readonly decisionIds: ReadonlyArray<DecisionId>
  readonly metadata: DomainMetadata
}

export function createGoal(partial: Partial<Goal> = {}): Goal {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("goal"),
    title: partial.title ?? "Growth objective",
    description: partial.description ?? "Primary business goal for the operating cycle.",
    companyId: partial.companyId ?? createId("company"),
    ownerId: partial.ownerId ?? createId("person"),
    priority: partial.priority ?? Priority.High,
    status: partial.status ?? GoalStatus.Active,
    departmentId: partial.departmentId,
    teamId: partial.teamId,
    projectIds: partial.projectIds ?? [],
    taskIds: partial.taskIds ?? [],
    workflowIds: partial.workflowIds ?? [],
    decisionIds: partial.decisionIds ?? [],
    metadata: partial.metadata ?? { namespace: "goal", displayName: "Goal", description: "Outcome the business wants to achieve.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isGoal(value: unknown): value is Goal {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).title === "string"
}