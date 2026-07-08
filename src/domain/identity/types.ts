import type { AuditableEntity, Entity, SearchableEntity, SoftDelete, TaggableEntity, Timestamped } from "@/src/domain/common/base"
import { PermissionLevel, Status } from "@/src/domain/common/enums"
import type { EmailAddress, Language, Phone, Timezone } from "@/src/domain/common/value-objects"
import type { PermissionId, RoleId, TeamId, UserId, WorkspaceId } from "@/src/domain/types/ids"

/** Permission grants access to specific resources and actions. */
export interface Permission extends Entity<PermissionId>, Timestamped {
  readonly key: string
  readonly resource: string
  readonly action: string
  readonly level: PermissionLevel
  readonly description?: string
}

/** Role aggregates permission grants for identity assignment. */
export interface Role extends Entity<RoleId>, Timestamped {
  readonly name: string
  readonly description?: string
  readonly permissionIds: ReadonlyArray<PermissionId>
  readonly status: Status
}

/** Team groups users for execution and ownership boundaries. */
export interface Team extends Entity<TeamId>, Timestamped, TaggableEntity {
  readonly name: string
  readonly workspaceId: WorkspaceId
  readonly memberIds: ReadonlyArray<UserId>
  readonly leadId?: UserId
}

/** User is the primary human identity in AIOS. */
export interface User
  extends Entity<UserId>,
    Timestamped,
    SoftDelete,
    AuditableEntity,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly firstName: string
  readonly lastName: string
  readonly displayName: string
  readonly email: EmailAddress
  readonly phone?: Phone
  readonly roleIds: ReadonlyArray<RoleId>
  readonly teamIds: ReadonlyArray<TeamId>
  readonly language: Language
  readonly timezone: Timezone
  readonly status: Status
}
