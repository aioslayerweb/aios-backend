import { Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, CustomerId, OpportunityId, PersonId, ProjectId, WorkspaceId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Customer extends Entity<CustomerId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly name: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly workspaceId?: WorkspaceId
  readonly ownerId: PersonId
  readonly accountManagerId?: PersonId
  readonly status: Status
  readonly opportunityIds: ReadonlyArray<OpportunityId>
  readonly projectIds: ReadonlyArray<ProjectId>
  readonly metadata: DomainMetadata
}

export function createCustomer(partial: Partial<Customer> = {}): Customer {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("customer"),
    name: partial.name ?? "Strategic customer",
    summary: partial.summary ?? "A customer account in the enterprise model.",
    companyId: partial.companyId ?? createId("company"),
    workspaceId: partial.workspaceId,
    ownerId: partial.ownerId ?? createId("person"),
    accountManagerId: partial.accountManagerId,
    status: partial.status ?? Status.Active,
    opportunityIds: partial.opportunityIds ?? [],
    projectIds: partial.projectIds ?? [],
    metadata: partial.metadata ?? { namespace: "customer", displayName: "Customer", description: "A customer account.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isCustomer(value: unknown): value is Customer {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).name === "string"
}