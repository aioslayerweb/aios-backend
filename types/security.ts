import type {
  ApiKeyRecord,
  DepartmentRecord,
  OrganizationRecord,
  PermissionRecord,
  RoleRecord,
  SecurityAuditLog,
  SecurityPolicy,
  SessionRecord,
  TeamRecord,
  UserRecord,
  WorkspaceRecord,
} from "./enterprise-security"

export type {
  ApiKeyRecord,
  DepartmentRecord,
  EnterpriseSecuritySettings,
  OrganizationRecord,
  RoleRecord,
  PermissionRecord,
  SecurityAuditLog,
  SecurityPermissionCategory,
  SecurityPermissionKey,
  SecurityPolicy,
  SecurityWorkspaceKey,
  SessionRecord,
  TeamRecord,
  TenantEnvironmentType,
  TenantScopedResource,
  TenantScopePath,
  UserRecord,
  WorkspaceRecord,
} from "./enterprise-security"

export type SecurityState = {
  organizations: OrganizationRecord[]
  workspaces: WorkspaceRecord[]
  departments: DepartmentRecord[]
  users: UserRecord[]
  teams: TeamRecord[]
  roles: RoleRecord[]
  permissions: PermissionRecord[]
  auditLogs: SecurityAuditLog[]
  policies: SecurityPolicy[]
  apiKeys: ApiKeyRecord[]
  sessions: SessionRecord[]
  selectedOrganizationId: string
  selectedWorkspaceId: string
  query: string
  liveMode: boolean
}
