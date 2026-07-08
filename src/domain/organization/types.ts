import type { Entity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { Status } from "@/src/domain/common/enums"
import type { Address, BusinessHours, Language, Timezone } from "@/src/domain/common/value-objects"
import type { OrganizationId, UserId, WorkspaceId } from "@/src/domain/types/ids"

/** Department represents an organizational function within a workspace. */
export interface Department extends Entity<string>, Timestamped {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description?: string
  readonly leadId?: UserId
}

/** Organization is the top-level tenant boundary in AIOS. */
export interface Organization extends Entity<OrganizationId>, Timestamped, VersionedEntity {
  readonly name: string
  readonly legalName: string
  readonly domain: string
  readonly status: Status
  readonly headquarters: Address
  readonly businessHours: BusinessHours
  readonly primaryLanguage: Language
  readonly timezone: Timezone
  readonly workspaceIds: ReadonlyArray<WorkspaceId>
}
