import { Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, RelationshipDefinition, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, CustomerId, DepartmentId, GoalId, IntegrationId, OpportunityId, PersonId, ProjectId, ReportId, TeamId, UserId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Company extends Entity<CompanyId>, TimestampedEntity, VersionedEntity, OwnedEntity<UserId>, AuditableEntity {
  readonly name: string
  readonly legalName: string
  readonly domain: string
  readonly status: Status
  readonly metadata: DomainMetadata
  readonly departmentIds: ReadonlyArray<DepartmentId>
  readonly teamIds: ReadonlyArray<TeamId>
  readonly personIds: ReadonlyArray<PersonId>
  readonly goalIds: ReadonlyArray<GoalId>
  readonly projectIds: ReadonlyArray<ProjectId>
  readonly customerIds: ReadonlyArray<CustomerId>
  readonly opportunityIds: ReadonlyArray<OpportunityId>
  readonly integrationIds: ReadonlyArray<IntegrationId>
  readonly reportIds: ReadonlyArray<ReportId>
}

export const companyRelationships: ReadonlyArray<RelationshipDefinition<CompanyId>> = [
  { fromId: "company" as CompanyId, toId: "department" as CompanyId, relationship: "owns-departments", direction: "one-way" },
  { fromId: "company" as CompanyId, toId: "team" as CompanyId, relationship: "owns-teams", direction: "one-way" },
]

export function createCompany(partial: Partial<Company> = {}): Company {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("company"),
    name: partial.name ?? "AIOS Holdings",
    legalName: partial.legalName ?? "AIOS Holdings Inc.",
    domain: partial.domain ?? "aios.example",
    status: partial.status ?? Status.Active,
    metadata: partial.metadata ?? { namespace: "company", displayName: "Company", description: "Top-level enterprise boundary.", tags: [] },
    departmentIds: partial.departmentIds ?? [],
    teamIds: partial.teamIds ?? [],
    personIds: partial.personIds ?? [],
    goalIds: partial.goalIds ?? [],
    projectIds: partial.projectIds ?? [],
    customerIds: partial.customerIds ?? [],
    opportunityIds: partial.opportunityIds ?? [],
    integrationIds: partial.integrationIds ?? [],
    reportIds: partial.reportIds ?? [],
    ownerId: partial.ownerId ?? createId("user"),
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isCompany(value: unknown): value is Company {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).domain === "string"
}