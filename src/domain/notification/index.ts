import { NotificationSeverity, Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, NotificationId, PersonId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Notification extends Entity<NotificationId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly severity: NotificationSeverity
  readonly status: Status
  readonly targetEntityIds: ReadonlyArray<string>
  readonly metadata: DomainMetadata
}

export function createNotification(partial: Partial<Notification> = {}): Notification {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("notification"),
    title: partial.title ?? "Platform notification",
    summary: partial.summary ?? "A platform-level notification.",
    companyId: partial.companyId ?? createId("company"),
    severity: partial.severity ?? NotificationSeverity.Info,
    status: partial.status ?? Status.Active,
    targetEntityIds: partial.targetEntityIds ?? [],
    metadata: partial.metadata ?? { namespace: "notification", displayName: "Notification", description: "A user-facing notification.", tags: [] },
    ownerId: partial.ownerId ?? createId("person"),
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isNotification(value: unknown): value is Notification {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).severity === "string"
}