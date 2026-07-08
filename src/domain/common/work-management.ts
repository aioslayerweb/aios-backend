import type { Entity, OwnedEntity, SearchableEntity, TaggableEntity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { Priority, TaskStatus } from "@/src/domain/common/enums"
import type { DateRange } from "@/src/domain/common/value-objects"
import type { ProjectId, TaskId, UserId, WorkspaceId } from "@/src/domain/types/ids"

/** Task is a unit of work in projects and workflows. */
export interface Task
  extends Entity<TaskId>,
    Timestamped,
    OwnedEntity<UserId>,
    VersionedEntity,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly projectId?: ProjectId
  readonly title: string
  readonly description?: string
  readonly status: TaskStatus
  readonly priority: Priority
  readonly assigneeId?: UserId
  readonly dueAt?: string
}

/** Project groups tasks and delivery outcomes. */
export interface Project extends Entity<ProjectId>, Timestamped, OwnedEntity<UserId>, VersionedEntity, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description?: string
  readonly taskIds: ReadonlyArray<TaskId>
  readonly period?: DateRange
}
