import { Role, Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, DepartmentId, PersonId, TeamId, UserId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Person extends Entity<PersonId>, TimestampedEntity, VersionedEntity, OwnedEntity<UserId>, AuditableEntity {
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly role: Role
  readonly companyId: CompanyId
  readonly departmentId?: DepartmentId
  readonly teamId?: TeamId
  readonly status: Status
  readonly metadata: DomainMetadata
}

export function createPerson(partial: Partial<Person> = {}): Person {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("person"),
    firstName: partial.firstName ?? "Ava",
    lastName: partial.lastName ?? "Chen",
    email: partial.email ?? "ava@aios.example",
    role: partial.role ?? Role.Executive,
    companyId: partial.companyId ?? createId("company"),
    departmentId: partial.departmentId,
    teamId: partial.teamId,
    status: partial.status ?? Status.Active,
    metadata: partial.metadata ?? { namespace: "person", displayName: "Person", description: "A person within the company.", tags: [] },
    ownerId: partial.ownerId ?? createId("user"),
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isPerson(value: unknown): value is Person {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).email === "string"
}