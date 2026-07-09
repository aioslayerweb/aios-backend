import { Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, GoalId, PersonId, ProjectId, TaskId, WorkflowId, WorkspaceId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Project extends Entity<ProjectId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly name: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly workspaceId?: WorkspaceId
  readonly ownerId: PersonId
  readonly status: Status
  readonly goalIds: ReadonlyArray<GoalId>
  readonly taskIds: ReadonlyArray<TaskId>
  readonly workflowIds: ReadonlyArray<WorkflowId>
  readonly metadata: DomainMetadata
}

export function createProject(partial: Partial<Project> = {}): Project {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("project"),
    name: partial.name ?? "Operating initiative",
    summary: partial.summary ?? "A business project that connects goals, tasks, and workflows.",
    companyId: partial.companyId ?? createId("company"),
    workspaceId: partial.workspaceId,
    ownerId: partial.ownerId ?? createId("person"),
    status: partial.status ?? Status.Active,
    goalIds: partial.goalIds ?? [],
    taskIds: partial.taskIds ?? [],
    workflowIds: partial.workflowIds ?? [],
    metadata: partial.metadata ?? { namespace: "project", displayName: "Project", description: "A bounded body of work.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isProject(value: unknown): value is Project {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).summary === "string"
}