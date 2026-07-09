import { DepartmentType, Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, DepartmentId, GoalId, PersonId, ProjectId, TeamId, UserId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Department extends Entity<DepartmentId>, TimestampedEntity, VersionedEntity, OwnedEntity<UserId>, AuditableEntity {
  readonly name: string
  readonly companyId: CompanyId
  readonly type: DepartmentType
  readonly leadId?: PersonId
  readonly teamIds: ReadonlyArray<TeamId>
  readonly goalIds: ReadonlyArray<GoalId>
  readonly projectIds: ReadonlyArray<ProjectId>
  readonly status: Status
  readonly metadata: DomainMetadata
}

export function createDepartment(partial: Partial<Department> = {}): Department {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("department"),
    name: partial.name ?? "Operations",
    companyId: partial.companyId ?? createId("company"),
    type: partial.type ?? DepartmentType.Operations,
    leadId: partial.leadId,
    teamIds: partial.teamIds ?? [],
    goalIds: partial.goalIds ?? [],
    projectIds: partial.projectIds ?? [],
    status: partial.status ?? Status.Active,
    metadata: partial.metadata ?? { namespace: "department", displayName: "Department", description: "Business function grouped by operating responsibility.", tags: [] },
    ownerId: partial.ownerId ?? createId("user"),
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isDepartment(value: unknown): value is Department {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).type === "string"
}