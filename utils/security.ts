import type {
  ApiKeyRecord,
  OrganizationRecord,
  PermissionRecord,
  RoleRecord,
  SecurityAuditLog,
  SecurityPolicy,
  SecurityState,
  SessionRecord,
  TeamRecord,
  UserRecord,
  WorkspaceRecord,
} from "@/types"

export function createSecurityDefaults(): SecurityState {
  const organizations: OrganizationRecord[] = [
    { id: "org-1", name: "Northwind Health", branding: "Northwind Blue", subscription: "Enterprise Plus", region: "US-East", environment: "production", status: "active", owner: "Ava Chen" },
    { id: "org-2", name: "Helios Commerce", branding: "Helios Gold", subscription: "Enterprise", region: "EU-West", environment: "staging", status: "trial", owner: "Nina Park" },
  ]

  const workspaces: WorkspaceRecord[] = [
    { id: "ws-1", organizationId: "org-1", name: "Executive Workspace", key: "executive", users: 18, agents: 9, workflows: 14, status: "active" },
    { id: "ws-2", organizationId: "org-1", name: "Sales Workspace", key: "sales", users: 42, agents: 7, workflows: 11, status: "active" },
    { id: "ws-3", organizationId: "org-1", name: "Support Workspace", key: "support", users: 34, agents: 6, workflows: 13, status: "restricted" },
    { id: "ws-4", organizationId: "org-1", name: "Finance Workspace", key: "finance", users: 16, agents: 4, workflows: 8, status: "active" },
    { id: "ws-5", organizationId: "org-2", name: "Operations Workspace", key: "operations", users: 22, agents: 5, workflows: 9, status: "provisioning" },
  ]

  const users: UserRecord[] = [
    { id: "user-1", organizationId: "org-1", name: "Ava Chen", email: "ava@northwind.ai", department: "executive", roleId: "role-owner", status: "active", lastLogin: "4 min ago", assignedAgents: ["Executive Analyst", "Revenue Agent"], assignedWorkflows: ["Quarterly Board Pack", "Executive Outreach"] },
    { id: "user-2", organizationId: "org-1", name: "Nina Park", email: "nina@northwind.ai", department: "support", roleId: "role-manager", status: "active", lastLogin: "19 min ago", assignedAgents: ["Retention Agent"], assignedWorkflows: ["Support Recovery Workflow"] },
    { id: "user-3", organizationId: "org-1", name: "Marco Silva", email: "marco@northwind.ai", department: "finance", roleId: "role-admin", status: "active", lastLogin: "1 hr ago", assignedAgents: ["Finance Review Agent"], assignedWorkflows: ["Finance Approval Flow"] },
    { id: "user-4", organizationId: "org-2", name: "Lena Ortiz", email: "lena@helios.ai", department: "operations", roleId: "role-operator", status: "invited", lastLogin: "Pending invite", assignedAgents: ["Operations Agent"], assignedWorkflows: ["Operational Readiness"] },
  ]

  const teams: TeamRecord[] = [
    { id: "team-1", name: "Executive Leadership", workspace: "executive", members: 8, lead: "Ava Chen" },
    { id: "team-2", name: "Revenue Ops", workspace: "sales", members: 14, lead: "Jon Mercer" },
    { id: "team-3", name: "Support Control", workspace: "support", members: 12, lead: "Nina Park" },
    { id: "team-4", name: "Finance Governance", workspace: "finance", members: 7, lead: "Marco Silva" },
  ]

  const roles: RoleRecord[] = [
    { id: "role-owner", name: "Owner", description: "Full organization authority across tenants and billing.", scope: "organization", permissions: ["view-runtime", "manage-runtime", "execute-workflow", "approve-decisions", "view-reports", "manage-knowledge", "manage-memory", "manage-integrations", "manage-users", "manage-billing", "manage-ai-models"] },
    { id: "role-admin", name: "Administrator", description: "Enterprise administration for users, workspaces, integrations, and policies.", scope: "organization", permissions: ["view-runtime", "manage-runtime", "execute-workflow", "approve-decisions", "view-reports", "manage-knowledge", "manage-memory", "manage-integrations", "manage-users", "manage-ai-models"] },
    { id: "role-exec", name: "Executive", description: "Board, decisions, and reporting access with approval authority.", scope: "workspace", permissions: ["view-runtime", "approve-decisions", "view-reports", "manage-knowledge"] },
    { id: "role-manager", name: "Manager", description: "Department management for workflows, teams, and reporting visibility.", scope: "workspace", permissions: ["view-runtime", "execute-workflow", "approve-decisions", "view-reports", "manage-knowledge", "manage-memory"] },
    { id: "role-operator", name: "Operator", description: "Runs workflows and operational tasks under controlled permissions.", scope: "workspace", permissions: ["view-runtime", "execute-workflow", "manage-memory"] },
    { id: "role-employee", name: "Employee", description: "Default employee access to workspace context and assigned tools.", scope: "workspace", permissions: ["view-runtime", "view-reports"] },
    { id: "role-guest", name: "Guest", description: "Read-only guest visibility into a constrained workspace.", scope: "workspace", permissions: ["view-reports"] },
    { id: "role-custom", name: "Custom Role", description: "Fine-tuned workspace role for regulated operations teams.", scope: "workspace", permissions: ["view-runtime", "execute-workflow", "approve-decisions", "manage-knowledge"] },
  ]

  const permissions: PermissionRecord[] = [
    { id: "perm-1", key: "view-runtime", category: "runtime", description: "View runtime status, throughput, and health.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager", "Operator", "Employee"] },
    { id: "perm-2", key: "manage-runtime", category: "runtime", description: "Manage runtime configuration and control execution settings.", assignedRoles: ["Owner", "Administrator"] },
    { id: "perm-3", key: "execute-workflow", category: "workflow", description: "Run or schedule workflows and automations.", assignedRoles: ["Owner", "Administrator", "Manager", "Operator", "Custom Role"] },
    { id: "perm-4", key: "approve-decisions", category: "decision", description: "Approve AI recommendations and enterprise decisions.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager", "Custom Role"] },
    { id: "perm-5", key: "view-reports", category: "reports", description: "View executive and operational reports.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager", "Employee", "Guest"] },
    { id: "perm-6", key: "manage-knowledge", category: "knowledge", description: "Manage knowledge, graph context, and policy references.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager", "Custom Role"] },
    { id: "perm-7", key: "manage-memory", category: "memory", description: "Manage enterprise memory retention and sync controls.", assignedRoles: ["Owner", "Administrator", "Manager", "Operator"] },
    { id: "perm-8", key: "manage-integrations", category: "integrations", description: "Connect, pause, and govern enterprise integrations.", assignedRoles: ["Owner", "Administrator"] },
    { id: "perm-9", key: "manage-users", category: "users", description: "Invite users, assign roles, and manage tenant access.", assignedRoles: ["Owner", "Administrator"] },
    { id: "perm-10", key: "manage-billing", category: "billing", description: "Manage subscriptions, billing, and tenant plans.", assignedRoles: ["Owner"] },
    { id: "perm-11", key: "manage-ai-models", category: "models", description: "Govern model access, prompts, and AI configurations.", assignedRoles: ["Owner", "Administrator"] },
  ]

  const auditLogs: SecurityAuditLog[] = [
    { id: "audit-1", timestamp: Date.now() - 1000 * 60 * 61, actor: "Ava Chen", event: "login", detail: "Owner authenticated through Supabase session bridge.", source: "Supabase Authentication", result: "success" },
    { id: "audit-2", timestamp: Date.now() - 1000 * 60 * 46, actor: "Marco Silva", event: "permission-change", detail: "Finance Governance role updated to allow decision approvals.", source: "RBAC", result: "warning" },
    { id: "audit-3", timestamp: Date.now() - 1000 * 60 * 31, actor: "Retention Agent", event: "workflow-execution", detail: "Support Recovery Workflow executed under Support workspace policy.", source: "Workflow Builder", result: "success" },
    { id: "audit-4", timestamp: Date.now() - 1000 * 60 * 22, actor: "Ava Chen", event: "decision-approval", detail: "Executive escalation decision approved for Northwind Health.", source: "Decision Engine", result: "success" },
    { id: "audit-5", timestamp: Date.now() - 1000 * 60 * 12, actor: "Knowledge Operations", event: "knowledge-update", detail: "Scoped knowledge refresh published for compliance-reviewed references.", source: "Knowledge Graph", result: "success" },
    { id: "audit-6", timestamp: Date.now() - 1000 * 60 * 4, actor: "Security System", event: "security-event", detail: "One API key flagged for scheduled rotation after scope review.", source: "Enterprise Security", result: "warning" },
  ]

  const policies: SecurityPolicy[] = [
    { id: "policy-1", name: "Password Policy", category: "password", status: "active", summary: "Require strong passwords and periodic rotation for enterprise admins.", value: "14 chars / 90 days" },
    { id: "policy-2", name: "MFA", category: "mfa", status: "active", summary: "MFA required for privileged roles and decision approvals.", value: "Required for Owner/Admin/Executive" },
    { id: "policy-3", name: "Session Timeout", category: "session-timeout", status: "review", summary: "Shorter session duration for high-risk workspaces.", value: "30 minutes idle" },
    { id: "policy-4", name: "IP Restrictions", category: "ip-restrictions", status: "draft", summary: "Geo-aware restrictions for regulated tenants.", value: "Allow-list ready" },
    { id: "policy-5", name: "Device Trust", category: "device-trust", status: "active", summary: "Trusted devices flagged for executive and finance workspaces.", value: "Managed devices preferred" },
    { id: "policy-6", name: "Data Retention", category: "data-retention", status: "active", summary: "Retention architecture for audit, memory, and workflow evidence.", value: "365 days default" },
  ]

  const apiKeys: ApiKeyRecord[] = [
    { id: "key-1", name: "Northwind Integration Key", scope: ["manage-integrations", "view-runtime"], status: "active", expiresAt: "2026-10-01", usage: "12.4k calls / 30d" },
    { id: "key-2", name: "Board Reporting Export", scope: ["view-reports"], status: "rotating", expiresAt: "2026-08-15", usage: "1.1k calls / 30d" },
    { id: "key-3", name: "Workflow Dispatch Key", scope: ["execute-workflow", "manage-memory"], status: "active", expiresAt: "2026-12-31", usage: "8.7k calls / 30d" },
    { id: "key-4", name: "Legacy Sandbox Key", scope: ["view-runtime"], status: "revoked", expiresAt: "revoked", usage: "revoked" },
  ]

  const sessions: SessionRecord[] = [
    { id: "session-1", user: "Ava Chen", device: "MacBook Pro", location: "San Francisco, US", browser: "Chrome 127", ip: "34.221.18.20", duration: "1h 12m", current: true },
    { id: "session-2", user: "Marco Silva", device: "Windows Laptop", location: "New York, US", browser: "Edge 126", ip: "18.114.77.11", duration: "48m", current: false },
    { id: "session-3", user: "Nina Park", device: "iPad", location: "Austin, US", browser: "Safari 17", ip: "52.10.44.90", duration: "22m", current: false },
  ]

  return {
    organizations,
    workspaces,
    users,
    teams,
    roles,
    permissions,
    auditLogs,
    policies,
    apiKeys,
    sessions,
    selectedOrganizationId: organizations[0]?.id ?? "",
    selectedWorkspaceId: workspaces[0]?.id ?? "",
    query: "",
    liveMode: true,
  }
}

export function filterByQuery<T extends { [key: string]: unknown }>(items: T[], query: string, keys: Array<keyof T>) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return items
  }

  return items.filter((item) => keys.some((key) => String(item[key] ?? "").toLowerCase().includes(normalized)))
}

export function selectOrganization(organizations: OrganizationRecord[], organizationId: string) {
  return organizations.find((item) => item.id === organizationId) ?? organizations[0] ?? null
}

export function selectWorkspace(workspaces: WorkspaceRecord[], workspaceId: string) {
  return workspaces.find((item) => item.id === workspaceId) ?? workspaces[0] ?? null
}