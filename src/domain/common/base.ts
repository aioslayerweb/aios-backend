import type {
  ActivityId,
  AttachmentId,
  CommentId,
  LabelId,
  TagId,
  UserId,
} from "@/src/domain/types/ids"

/** Base identity contract for all aggregate roots and entities. */
export interface Entity<Id extends string = string> {
  readonly id: Id
}

/** Timestamp contract for creation and update lifecycle. */
export interface TimestampedEntity {
  readonly createdAt: string
  readonly updatedAt: string
}

/** Backward-compatible alias for legacy code paths. */
export type Timestamped = TimestampedEntity

/** Ownership contract used for multi-tenant and access-aware entities. */
export interface OwnedEntity<OwnerId extends string = UserId> {
  readonly ownerId: OwnerId
}

/** Soft deletion contract preserving historical records. */
export interface SoftDelete {
  readonly isDeleted: boolean
  readonly deletedAt?: string
}

/** Optimistic versioning contract for concurrent state updates. */
export interface VersionedEntity {
  readonly version: number
}

/** Auditing metadata for traceability and compliance. */
export interface AuditableEntity {
  readonly createdBy: UserId
  readonly updatedBy: UserId
}

/** Simple entity reference used to express relationships without duplication. */
export interface EntityReference<Id extends string = string> {
  readonly id: Id
  readonly type: string
  readonly label: string
}

/** Explicit relationship definition between two domain entities. */
export interface RelationshipDefinition<FromId extends string = string, ToId extends string = string> {
  readonly fromId: FromId
  readonly toId: ToId
  readonly relationship: string
  readonly direction: "one-way" | "two-way"
  readonly weight?: number
}

/** Lightweight metadata block used by domain aggregates and value objects. */
export interface DomainMetadata {
  readonly namespace: string
  readonly displayName: string
  readonly description?: string
  readonly tags: ReadonlyArray<string>
}

/** Search metadata for indexing and query acceleration. */
export interface SearchableEntity {
  readonly searchText: string
  readonly searchKeywords: ReadonlyArray<string>
}

/** Tagging contract to attach reusable taxonomies to entities. */
export interface TaggableEntity {
  readonly tagIds: ReadonlyArray<TagId>
  readonly labelIds: ReadonlyArray<LabelId>
}

/** Reusable attachment model for files linked across modules. */
export interface Attachment extends Entity<AttachmentId>, Timestamped {
  readonly fileName: string
  readonly mimeType: string
  readonly sizeBytes: number
  readonly storagePath: string
  readonly uploadedBy: UserId
}

/** Reusable semantic tag model across domain entities. */
export interface Tag extends Entity<TagId>, Timestamped {
  readonly name: string
  readonly color: string
  readonly description?: string
}

/** Comment model for collaboration context on any entity. */
export interface Comment extends Entity<CommentId>, Timestamped {
  readonly body: string
  readonly authorId: UserId
  readonly targetEntityId: string
}

/** Label model for lightweight categorization and grouping. */
export interface Label extends Entity<LabelId>, Timestamped {
  readonly name: string
  readonly color: string
}

/** Activity model emitted by domain entities into timeline/event history. */
export interface Activity extends Entity<ActivityId>, Timestamped {
  readonly actorId: UserId | string
  readonly type: string
  readonly targetEntityId: string
  readonly summary: string
}
