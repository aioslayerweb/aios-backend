import type { Entity, OwnedEntity, SearchableEntity, TaggableEntity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { Priority, Status } from "@/src/domain/common/enums"
import type { KnowledgeArticleId, KnowledgeCollectionId, UserId, WorkspaceId } from "@/src/domain/types/ids"

/** Document entity shared across business modules and knowledge workflows. */
export interface Document extends Entity<string>, Timestamped, OwnedEntity<UserId>, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly title: string
  readonly content: string
  readonly mimeType: string
  readonly status: Status
}

/** Knowledge article represents curated organizational intelligence. */
export interface KnowledgeArticle
  extends Entity<KnowledgeArticleId>,
    Timestamped,
    OwnedEntity<UserId>,
    VersionedEntity,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly collectionId?: KnowledgeCollectionId
  readonly title: string
  readonly summary: string
  readonly body: string
  readonly priority: Priority
  readonly status: Status
}

/** Knowledge collection groups articles by domain and purpose. */
export interface KnowledgeCollection
  extends Entity<KnowledgeCollectionId>,
    Timestamped,
    OwnedEntity<UserId>,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description?: string
  readonly articleIds: ReadonlyArray<KnowledgeArticleId>
}
