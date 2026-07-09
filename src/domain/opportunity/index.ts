import { OpportunityStage, Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, CustomerId, OpportunityId, PersonId, WorkspaceId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Opportunity extends Entity<OpportunityId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly workspaceId?: WorkspaceId
  readonly ownerId: PersonId
  readonly customerId: CustomerId
  readonly stage: OpportunityStage
  readonly status: Status
  readonly metadata: DomainMetadata
}

export function createOpportunity(partial: Partial<Opportunity> = {}): Opportunity {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("opportunity"),
    title: partial.title ?? "Revenue opportunity",
    summary: partial.summary ?? "A revenue-bearing business opportunity.",
    companyId: partial.companyId ?? createId("company"),
    workspaceId: partial.workspaceId,
    ownerId: partial.ownerId ?? createId("person"),
    customerId: partial.customerId ?? createId("customer"),
    stage: partial.stage ?? OpportunityStage.Discovery,
    status: partial.status ?? Status.Active,
    metadata: partial.metadata ?? { namespace: "opportunity", displayName: "Opportunity", description: "A sales opportunity.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isOpportunity(value: unknown): value is Opportunity {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).stage === "string"
}