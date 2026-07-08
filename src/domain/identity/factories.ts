import { DEFAULT_LANGUAGE, DEFAULT_TIMEZONE } from "@/src/domain/common/constants"
import { PermissionLevel, Status } from "@/src/domain/common/enums"
import type { Permission, Role, Team, User } from "@/src/domain/identity/types"
import { createId } from "@/src/domain/utils/id"

/** Creates a permission with safe enterprise defaults. */
export function createPermission(partial: Partial<Permission> = {}): Permission {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("permission"),
    key: partial.key ?? "default.read",
    resource: partial.resource ?? "entity",
    action: partial.action ?? "read",
    level: partial.level ?? PermissionLevel.Read,
    description: partial.description,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a role with default status and no permissions. */
export function createRole(partial: Partial<Role> = {}): Role {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("role"),
    name: partial.name ?? "Contributor",
    description: partial.description,
    permissionIds: partial.permissionIds ?? [],
    status: partial.status ?? Status.Active,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a team with optional lead and members. */
export function createTeam(partial: Partial<Team> = {}): Team {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("team"),
    name: partial.name ?? "Operations Team",
    workspaceId: partial.workspaceId ?? createId("workspace"),
    memberIds: partial.memberIds ?? [],
    leadId: partial.leadId,
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a user identity record with enterprise defaults. */
export function createUser(partial: Partial<User> = {}): User {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("user"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    firstName: partial.firstName ?? "Alex",
    lastName: partial.lastName ?? "Morgan",
    displayName: partial.displayName ?? "Alex Morgan",
    email: partial.email ?? { value: "alex.morgan@aios.example", verified: true },
    phone: partial.phone,
    roleIds: partial.roleIds ?? [],
    teamIds: partial.teamIds ?? [],
    language: partial.language ?? { code: DEFAULT_LANGUAGE, label: "English (US)" },
    timezone: partial.timezone ?? { id: DEFAULT_TIMEZONE, offsetMinutes: 0 },
    status: partial.status ?? Status.Active,
    isDeleted: partial.isDeleted ?? false,
    deletedAt: partial.deletedAt,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    searchText: partial.searchText ?? "alex morgan aios",
    searchKeywords: partial.searchKeywords ?? ["alex", "morgan", "executive"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
