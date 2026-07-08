import type { Entity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { Status } from "@/src/domain/common/enums"
import type { OrganizationId, WorkspaceId } from "@/src/domain/types/ids"

/** Workspace is an operational container for teams, data, and execution contexts. */
export interface Workspace extends Entity<WorkspaceId>, Timestamped, VersionedEntity {
  readonly organizationId: OrganizationId
  readonly name: string
  readonly slug: string
  readonly status: Status
  readonly description?: string
}
