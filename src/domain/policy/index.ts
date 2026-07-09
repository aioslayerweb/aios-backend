import { PolicyStatus } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, PersonId, PolicyId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Policy extends Entity<PolicyId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly status: PolicyStatus
  readonly scopeEntityIds: ReadonlyArray<string>
  readonly reviewerIds: ReadonlyArray<PersonId>
  readonly metadata: DomainMetadata
}

export function createPolicy(partial: Partial<Policy> = {}): Policy {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("policy"),
    title: partial.title ?? "Enterprise policy",
    summary: partial.summary ?? "A governance policy for the operating model.",
    companyId: partial.companyId ?? createId("company"),
    status: partial.status ?? PolicyStatus.Active,
    scopeEntityIds: partial.scopeEntityIds ?? [],
    reviewerIds: partial.reviewerIds ?? [],
    metadata: partial.metadata ?? { namespace: "policy", displayName: "Policy", description: "A governance policy.", tags: [] },
    ownerId: partial.ownerId ?? createId("person"),
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isPolicy(value: unknown): value is Policy {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).title === "string"
}