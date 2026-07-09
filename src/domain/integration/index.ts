import { Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, IntegrationId, PersonId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Integration extends Entity<IntegrationId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly name: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly status: Status
  readonly connectedEntityIds: ReadonlyArray<string>
  readonly metadata: DomainMetadata
}

export function createIntegration(partial: Partial<Integration> = {}): Integration {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("integration"),
    name: partial.name ?? "Enterprise integration",
    summary: partial.summary ?? "A connected system in the AIOS platform.",
    companyId: partial.companyId ?? createId("company"),
    status: partial.status ?? Status.Active,
    connectedEntityIds: partial.connectedEntityIds ?? [],
    metadata: partial.metadata ?? { namespace: "integration", displayName: "Integration", description: "A connected external or internal system.", tags: [] },
    ownerId: partial.ownerId ?? createId("person"),
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isIntegration(value: unknown): value is Integration {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).name === "string"
}