import { Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, EventId, PersonId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Event extends Entity<EventId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly description: string
  readonly companyId: CompanyId
  readonly ownerId: PersonId
  readonly occurredAt: string
  readonly relatedEntityIds: ReadonlyArray<string>
  readonly status: Status
  readonly metadata: DomainMetadata
}

export function createEvent(partial: Partial<Event> = {}): Event {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("event"),
    title: partial.title ?? "Business event",
    description: partial.description ?? "A notable event in the enterprise lifecycle.",
    companyId: partial.companyId ?? createId("company"),
    ownerId: partial.ownerId ?? createId("person"),
    occurredAt: partial.occurredAt ?? now,
    relatedEntityIds: partial.relatedEntityIds ?? [],
    status: partial.status ?? Status.Active,
    metadata: partial.metadata ?? { namespace: "event", displayName: "Event", description: "A logged enterprise event.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isEvent(value: unknown): value is Event {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).occurredAt === "string"
}