import type { Entity, OwnedEntity, SearchableEntity, TaggableEntity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { Priority, RuntimeStatus, Status } from "@/src/domain/common/enums"
import type {
  ConversationId,
  MemoryEntryId,
  MemoryId,
  MemorySnapshotId,
  UserId,
  WorkspaceId,
} from "@/src/domain/types/ids"

/** Memory aggregate representing long-lived business memory space. */
export interface Memory extends Entity<MemoryId>, Timestamped, OwnedEntity<UserId>, VersionedEntity, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description?: string
  readonly status: Status
  readonly entryIds: ReadonlyArray<MemoryEntryId>
}

/** Memory entry captures a single contextual memory unit. */
export interface MemoryEntry
  extends Entity<MemoryEntryId>,
    Timestamped,
    OwnedEntity<UserId>,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly memoryId: MemoryId
  readonly title: string
  readonly summary: string
  readonly content: string
  readonly priority: Priority
  readonly sourceConversationId?: ConversationId
}

/** Memory snapshot preserves memory state at a point in time. */
export interface MemorySnapshot extends Entity<MemorySnapshotId>, Timestamped, OwnedEntity<UserId> {
  readonly workspaceId: WorkspaceId
  readonly memoryId: MemoryId
  readonly runtimeStatus: RuntimeStatus
  readonly entryCount: number
  readonly hash: string
}
