export type SecurityWorkspaceKey =
  | "executive"
  | "sales"
  | "marketing"
  | "support"
  | "finance"
  | "operations"
  | "engineering"
  | "hr"
  | "legal"

export type SecurityPermissionKey =
  | "view-runtime"
  | "manage-runtime"
  | "execute-workflow"
  | "approve-decisions"
  | "view-reports"
  | "manage-knowledge"
  | "manage-memory"
  | "manage-integrations"
  | "manage-users"
  | "manage-billing"
  | "manage-ai-models"

export type OrganizationRecord = {
  id: string
  name: string
  branding: string
  subscription: string
  region: string
  environment: "production" | "staging" | "sandbox"
  status: "active" | "trial" | "paused"
  owner: string
}

export type WorkspaceRecord = {
  id: string
  organizationId: string
  name: string
  key: SecurityWorkspaceKey
  users: number
  agents: number
  workflows: number
  status: "active" | "provisioning" | "restricted"
}

export type UserRecord = {
  id: string
  organizationId: string
  name: string
  email: string
  department: SecurityWorkspaceKey
  roleId: string
  status: "active" | "invited" | "suspended"
  lastLogin: string
  assignedAgents: string[]
  assignedWorkflows: string[]
}

export type TeamRecord = {
  id: string
  name: string
  workspace: SecurityWorkspaceKey
  members: number
  lead: string
}

export type RoleRecord = {
  id: string
  name: "Owner" | "Administrator" | "Executive" | "Manager" | "Operator" | "Employee" | "Guest" | "Custom Role"
  description: string
  scope: "organization" | "workspace"
  permissions: SecurityPermissionKey[]
}

export type PermissionRecord = {
  id: string
  key: SecurityPermissionKey
  category: "runtime" | "workflow" | "decision" | "reports" | "knowledge" | "memory" | "integrations" | "users" | "billing" | "models"
  description: string
  assignedRoles: string[]
}

export type SecurityAuditLog = {
  id: string
  timestamp: number
  actor: string
  event: "login" | "permission-change" | "workflow-execution" | "decision-approval" | "knowledge-update" | "security-event"
  detail: string
  source: string
  result: "success" | "warning" | "failed"
}

export type SecurityPolicy = {
  id: string
  name: string
  category: "password" | "mfa" | "session-timeout" | "ip-restrictions" | "device-trust" | "data-retention"
  status: "active" | "review" | "draft"
  summary: string
  value: string
}

export type ApiKeyRecord = {
  id: string
  name: string
  scope: string[]
  status: "active" | "rotating" | "revoked"
  expiresAt: string
  usage: string
}

export type SessionRecord = {
  id: string
  user: string
  device: string
  location: string
  browser: string
  ip: string
  duration: string
  current: boolean
}

export type SecurityState = {
  organizations: OrganizationRecord[]
  workspaces: WorkspaceRecord[]
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