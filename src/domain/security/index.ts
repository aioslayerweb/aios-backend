import type { Entity } from "@/src/domain/common/base"

export type WorkspaceDomainKey =
  | "executive"
  | "sales"
  | "marketing"
  | "support"
  | "finance"
  | "operations"
  | "engineering"
  | "hr"
  | "legal"

export type TenantEnvironment = "development" | "staging" | "production" | "sandbox"

export type PermissionKey =
  | "view_dashboard"
  | "manage_agents"
  | "manage_memory"
  | "manage_users"
  | "manage_roles"
  | "manage_workflows"
  | "manage_integrations"
  | "view_audit_logs"
  | "manage_api_keys"
  | "export_data"
  | "manage_policies"
  | "manage_sessions"
  | "manage_departments"
  | "manage_teams"
  | "manage_organizations"
  | "manage_workspaces"
  | "view_runtime"
  | "manage_runtime"
  | "approve_decisions"
  | "view_reports"
  | "manage_knowledge"
  | "manage_billing"
  | "manage_ai_models"
  | "execute_workflow"

export type EnterpriseRoleName =
  | "Owner"
  | "Administrator"
  | "Executive"
  | "Manager"
  | "Operator"
  | "Employee"
  | "Guest"
  | "Service Account"
  | "Custom Role"

export type PermissionCategory =
  | "dashboard"
  | "agents"
  | "memory"
  | "users"
  | "roles"
  | "workflows"
  | "integrations"
  | "audit"
  | "api-keys"
  | "export"
  | "policy"
  | "sessions"
  | "departments"
  | "teams"
  | "organizations"
  | "workspaces"
  | "runtime"
  | "decisions"
  | "reports"
  | "knowledge"
  | "billing"
  | "models"

export type AuditAction =
  | "user_login"
  | "role_changed"
  | "workflow_executed"
  | "agent_created"
  | "knowledge_modified"
  | "memory_exported"
  | "policy_updated"
  | "settings_changed"
  | "api_key_created"
  | "session_revoked"

export type PolicyScope = "organization" | "workspace" | "department" | "team"

export type ApiKeyType = "personal" | "workspace" | "service"

export type SessionStatus = "active" | "expired" | "revoked"

export type PolicyCategory =
  | "password"
  | "mfa"
  | "session-timeout"
  | "ip-restrictions"
  | "device-trust"
  | "data-retention"
  | "sso"
  | "oidc"
  | "saml"
  | "scim"

export interface Organization extends Entity<string> {
  readonly name: string
  readonly branding: string
  readonly subscription: string
  readonly region: string
  readonly environment: TenantEnvironment
  readonly status: "active" | "trial" | "paused"
  readonly owner: string
}

export interface Workspace extends Entity<string> {
  readonly organizationId: string
  readonly name: string
  readonly key: WorkspaceDomainKey
  readonly users: number
  readonly agents: number
  readonly workflows: number
  readonly status: "active" | "provisioning" | "restricted"
}

export interface Department extends Entity<string> {
  readonly organizationId: string
  readonly workspaceId: string
  readonly name: string
  readonly key: WorkspaceDomainKey
  readonly leadUserId?: string
  readonly status: "active" | "planning" | "restricted"
}

export interface Team extends Entity<string> {
  readonly organizationId: string
  readonly workspaceId: string
  readonly departmentId: string
  readonly name: string
  readonly members: number
  readonly lead: string
}

export interface User extends Entity<string> {
  readonly organizationId: string
  readonly workspaceId: string
  readonly departmentId: string
  readonly teamIds: ReadonlyArray<string>
  readonly name: string
  readonly email: string
  readonly department: WorkspaceDomainKey
  readonly roleId: string
  readonly status: "active" | "invited" | "suspended"
  readonly lastLogin: string
  readonly assignedAgents: ReadonlyArray<string>
  readonly assignedWorkflows: ReadonlyArray<string>
  readonly serviceAccount: boolean
}

export interface Role extends Entity<string> {
  readonly name: EnterpriseRoleName
  readonly description: string
  readonly scope: "organization" | "workspace" | "department" | "team"
  readonly permissions: ReadonlyArray<PermissionKey>
}

export interface Permission extends Entity<string> {
  readonly key: PermissionKey
  readonly category: PermissionCategory
  readonly description: string
  readonly assignedRoles: ReadonlyArray<EnterpriseRoleName>
}

export interface Policy extends Entity<string> {
  readonly organizationId: string
  readonly workspaceId?: string
  readonly category: PolicyCategory
  readonly scope: PolicyScope
  readonly name: string
  readonly status: "active" | "review" | "draft"
  readonly summary: string
  readonly value: string
}

export interface Session extends Entity<string> {
  readonly organizationId: string
  readonly workspaceId: string
  readonly userId: string
  readonly user: string
  readonly device: string
  readonly location: string
  readonly browser: string
  readonly ip: string
  readonly duration: string
  readonly current: boolean
  readonly status: SessionStatus
}

export interface APIKey extends Entity<string> {
  readonly organizationId: string
  readonly workspaceId?: string
  readonly userId?: string
  readonly name: string
  readonly keyType: ApiKeyType
  readonly scopes: ReadonlyArray<PermissionKey>
  readonly scope: ReadonlyArray<PermissionKey>
  readonly status: "active" | "rotating" | "revoked"
  readonly expiresAt: string
  readonly usage: string
  readonly lastRotatedAt?: string
  readonly revokedAt?: string
  readonly revocationReason?: string
}

export interface AuditEvent extends Entity<string> {
  readonly organizationId: string
  readonly workspaceId: string
  readonly userId: string
  readonly timestamp: number
  readonly resource: string
  readonly action: AuditAction
  readonly metadata: Record<string, unknown>
  readonly actor: string
  readonly event: string
  readonly detail: string
  readonly source: string
  readonly result: "success" | "warning" | "failed"
}

export interface SecuritySettings {
  readonly passwordPolicy: {
    readonly minLength: number
    readonly requireSymbols: boolean
    readonly requireNumbers: boolean
    readonly maxAgeDays: number
  }
  readonly mfa: {
    readonly required: boolean
    readonly gracePeriodHours: number
  }
  readonly sso: {
    readonly enabled: boolean
    readonly provider: "none" | "oidc" | "saml"
    readonly allowJitProvisioning: boolean
  }
  readonly oidc: {
    readonly enabled: boolean
    readonly issuerUrl?: string
    readonly clientId?: string
  }
  readonly saml: {
    readonly enabled: boolean
    readonly metadataUrl?: string
    readonly entityId?: string
  }
  readonly sessionTimeoutMinutes: number
  readonly ipAllowList: ReadonlyArray<string>
  readonly trustedDevicesEnabled: boolean
  readonly scim: {
    readonly enabled: boolean
    readonly endpoint?: string
  }
}

export interface TenantPath {
  readonly organizationId: string
  readonly workspaceId: string
  readonly departmentId?: string
  readonly teamId?: string
  readonly userId?: string
}

export interface TenantResource {
  readonly id: string
  readonly resourceType: "memory" | "agent" | "knowledge" | "event" | "workflow" | "policy" | "file" | "integration"
  readonly tenantPath: TenantPath
  readonly name: string
}
