import { Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, RelationshipDefinition, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, DepartmentId, GoalId, PersonId, ProjectId, TeamId, UserId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Team extends Entity<TeamId>, TimestampedEntity, VersionedEntity, OwnedEntity<UserId>, AuditableEntity {
  readonly name: string
  readonly companyId: CompanyId
  readonly departmentId: DepartmentId
  readonly leadId?: PersonId
  readonly memberIds: ReadonlyArray<PersonId>
  readonly goalIds: ReadonlyArray<GoalId>
  readonly projectIds: ReadonlyArray<ProjectId>
  readonly status: Status
  readonly metadata: DomainMetadata
}

export const teamRelationships: ReadonlyArray<RelationshipDefinition<TeamId>> = [
  { fromId: "team" as TeamId, toId: "person" as TeamId, relationship: "contains-members", direction: "one-way" },
  { fromId: "team" as TeamId, toId: "goal" as TeamId, relationship: "pursues-goals", direction: "one-way" },
]

export function createTeam(partial: Partial<Team> = {}): Team {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("team"),
    name: partial.name ?? "Executive Leadership",
    companyId: partial.companyId ?? createId("company"),
    departmentId: partial.departmentId ?? createId("department"),
    leadId: partial.leadId,
    memberIds: partial.memberIds ?? [],
    goalIds: partial.goalIds ?? [],
    projectIds: partial.projectIds ?? [],
    status: partial.status ?? Status.Active,
    metadata: partial.metadata ?? { namespace: "team", displayName: "Team", description: "Cross-functional team entity.", tags: [] },
    ownerId: partial.ownerId ?? createId("user"),
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isTeam(value: unknown): value is Team {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).companyId === "string"
}