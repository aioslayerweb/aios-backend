import { Priority, TaskStatus } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, GoalId, PersonId, ProjectId, TaskId, WorkflowId, WorkspaceId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Task extends Entity<TaskId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly workspaceId?: WorkspaceId
  readonly ownerId: PersonId
  readonly status: TaskStatus
  readonly priority: Priority
  readonly projectId?: ProjectId
  readonly goalId?: GoalId
  readonly workflowId?: WorkflowId
  readonly metadata: DomainMetadata
}

export function createTask(partial: Partial<Task> = {}): Task {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("task"),
    title: partial.title ?? "Business task",
    summary: partial.summary ?? "A unit of work within a project or workflow.",
    companyId: partial.companyId ?? createId("company"),
    workspaceId: partial.workspaceId,
    ownerId: partial.ownerId ?? createId("person"),
    status: partial.status ?? TaskStatus.Todo,
    priority: partial.priority ?? Priority.Medium,
    projectId: partial.projectId,
    goalId: partial.goalId,
    workflowId: partial.workflowId,
    metadata: partial.metadata ?? { namespace: "task", displayName: "Task", description: "An actionable work item.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isTask(value: unknown): value is Task {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).title === "string"
}