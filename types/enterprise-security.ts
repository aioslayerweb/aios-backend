import type {
  APIKey,
  AuditEvent,
  Department,
  Organization,
  Permission,
  PermissionCategory,
  PermissionKey,
  Policy,
  Role,
  SecuritySettings,
  Session,
  Team,
  TenantEnvironment,
  TenantPath,
  TenantResource,
  User,
  Workspace,
  WorkspaceDomainKey,
} from "@/src/domain/security"

export type SecurityWorkspaceKey = WorkspaceDomainKey
export type SecurityPermissionKey = PermissionKey
export type SecurityPermissionCategory = PermissionCategory

export type OrganizationRecord = Organization
export type WorkspaceRecord = Workspace
export type DepartmentRecord = Department
export type TeamRecord = Team
export type UserRecord = User
export type RoleRecord = Role
export type PermissionRecord = Permission
export type SecurityAuditLog = AuditEvent
export type SecurityPolicy = Policy
export type ApiKeyRecord = APIKey
export type SessionRecord = Session

export type TenantScopePath = TenantPath
export type TenantScopedResource = TenantResource
export type EnterpriseSecuritySettings = SecuritySettings
export type TenantEnvironmentType = TenantEnvironment
