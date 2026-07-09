import type {
  ApiKeyRecord,
  DepartmentRecord,
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

  const departments: DepartmentRecord[] = [
    { id: "dep-1", organizationId: "org-1", workspaceId: "ws-1", name: "Executive", key: "executive", leadUserId: "user-1", status: "active" },
    { id: "dep-2", organizationId: "org-1", workspaceId: "ws-2", name: "Sales", key: "sales", leadUserId: "user-5", status: "active" },
    { id: "dep-3", organizationId: "org-1", workspaceId: "ws-4", name: "Finance", key: "finance", leadUserId: "user-3", status: "active" },
    { id: "dep-4", organizationId: "org-1", workspaceId: "ws-3", name: "Customer Success", key: "support", leadUserId: "user-2", status: "active" },
    { id: "dep-5", organizationId: "org-2", workspaceId: "ws-5", name: "Operations", key: "operations", leadUserId: "user-4", status: "planning" },
  ]

  const users: UserRecord[] = [
    { id: "user-1", organizationId: "org-1", workspaceId: "ws-1", departmentId: "dep-1", teamIds: ["team-1"], name: "Ava Chen", email: "ava@northwind.ai", department: "executive", roleId: "role-owner", status: "active", lastLogin: "4 min ago", assignedAgents: ["Executive Analyst", "Revenue Agent"], assignedWorkflows: ["Quarterly Board Pack", "Executive Outreach"], serviceAccount: false },
    { id: "user-2", organizationId: "org-1", workspaceId: "ws-3", departmentId: "dep-4", teamIds: ["team-3"], name: "Nina Park", email: "nina@northwind.ai", department: "support", roleId: "role-manager", status: "active", lastLogin: "19 min ago", assignedAgents: ["Retention Agent"], assignedWorkflows: ["Support Recovery Workflow"], serviceAccount: false },
    { id: "user-3", organizationId: "org-1", workspaceId: "ws-4", departmentId: "dep-3", teamIds: ["team-4"], name: "Marco Silva", email: "marco@northwind.ai", department: "finance", roleId: "role-admin", status: "active", lastLogin: "1 hr ago", assignedAgents: ["Finance Review Agent"], assignedWorkflows: ["Finance Approval Flow"], serviceAccount: false },
    { id: "user-4", organizationId: "org-2", workspaceId: "ws-5", departmentId: "dep-5", teamIds: ["team-5"], name: "Lena Ortiz", email: "lena@helios.ai", department: "operations", roleId: "role-operator", status: "invited", lastLogin: "Pending invite", assignedAgents: ["Operations Agent"], assignedWorkflows: ["Operational Readiness"], serviceAccount: false },
    { id: "user-5", organizationId: "org-1", workspaceId: "ws-2", departmentId: "dep-2", teamIds: ["team-2"], name: "Jon Mercer", email: "jon@northwind.ai", department: "sales", roleId: "role-executive", status: "active", lastLogin: "14 min ago", assignedAgents: ["Pipeline Agent"], assignedWorkflows: ["Forecast Cadence"], serviceAccount: false },
    { id: "user-svc-1", organizationId: "org-1", workspaceId: "ws-1", departmentId: "dep-1", teamIds: [], name: "Board Report Service", email: "board-service@northwind.ai", department: "executive", roleId: "role-service-account", status: "active", lastLogin: "service", assignedAgents: ["Board Briefing Agent"], assignedWorkflows: ["Board Export"], serviceAccount: true },
  ]

  const teams: TeamRecord[] = [
    { id: "team-1", organizationId: "org-1", workspaceId: "ws-1", departmentId: "dep-1", name: "Executive Leadership", members: 8, lead: "Ava Chen" },
    { id: "team-2", organizationId: "org-1", workspaceId: "ws-2", departmentId: "dep-2", name: "Revenue Ops", members: 14, lead: "Jon Mercer" },
    { id: "team-3", organizationId: "org-1", workspaceId: "ws-3", departmentId: "dep-4", name: "Support Control", members: 12, lead: "Nina Park" },
    { id: "team-4", organizationId: "org-1", workspaceId: "ws-4", departmentId: "dep-3", name: "Finance Governance", members: 7, lead: "Marco Silva" },
    { id: "team-5", organizationId: "org-2", workspaceId: "ws-5", departmentId: "dep-5", name: "Operations Cell", members: 6, lead: "Lena Ortiz" },
  ]

  const roles: RoleRecord[] = [
    { id: "role-owner", name: "Owner", description: "Full organization authority across tenancy, security, and billing.", scope: "organization", permissions: ["view_dashboard", "manage_agents", "manage_memory", "manage_users", "manage_roles", "manage_workspaces", "manage_organizations", "manage_workflows", "manage_integrations", "view_audit_logs", "manage_api_keys", "export_data", "manage_policies", "manage_sessions", "manage_departments", "manage_teams", "view_runtime", "manage_runtime", "approve_decisions", "view_reports", "manage_knowledge", "manage_billing", "manage_ai_models", "execute_workflow"] },
    { id: "role-admin", name: "Administrator", description: "Enterprise administration for users, workspaces, integrations, and policies.", scope: "organization", permissions: ["view_dashboard", "manage_agents", "manage_memory", "manage_users", "manage_roles", "manage_workspaces", "manage_workflows", "manage_integrations", "view_audit_logs", "manage_api_keys", "export_data", "manage_policies", "manage_sessions", "manage_departments", "manage_teams", "view_runtime", "manage_runtime", "approve_decisions", "view_reports", "manage_knowledge", "manage_ai_models", "execute_workflow"] },
    { id: "role-executive", name: "Executive", description: "Strategic decisions, executive summaries, and risk oversight.", scope: "workspace", permissions: ["view_dashboard", "view_runtime", "approve_decisions", "view_reports", "manage_knowledge", "view_audit_logs", "export_data"] },
    { id: "role-manager", name: "Manager", description: "Department leadership with execution and team oversight.", scope: "department", permissions: ["view_dashboard", "manage_agents", "manage_memory", "manage_users", "manage_workflows", "view_audit_logs", "export_data", "manage_sessions", "manage_teams", "view_runtime", "approve_decisions", "view_reports", "manage_knowledge", "execute_workflow"] },
    { id: "role-operator", name: "Operator", description: "Runs approved workflows and operational queues.", scope: "team", permissions: ["view_dashboard", "manage_agents", "manage_memory", "manage_workflows", "view_runtime", "view_reports", "execute_workflow"] },
    { id: "role-employee", name: "Employee", description: "Standard workspace access for assigned workflows and insights.", scope: "team", permissions: ["view_dashboard", "view_runtime", "view_reports"] },
    { id: "role-guest", name: "Guest", description: "Limited read-only visibility into shared dashboards.", scope: "workspace", permissions: ["view_dashboard", "view_reports"] },
    { id: "role-service-account", name: "Service Account", description: "Non-human automation identity with scoped API access.", scope: "workspace", permissions: ["view_runtime", "manage_workflows", "manage_memory", "manage_integrations", "manage_api_keys", "execute_workflow"] },
  ]

  const permissions: PermissionRecord[] = [
    { id: "perm-1", key: "view_dashboard", category: "dashboard", description: "View executive and operational dashboards.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager", "Operator", "Employee", "Guest"] },
    { id: "perm-2", key: "manage_agents", category: "agents", description: "Create and operate autonomous agent execution.", assignedRoles: ["Owner", "Administrator", "Manager", "Operator"] },
    { id: "perm-3", key: "manage_memory", category: "memory", description: "Manage enterprise memory and retention controls.", assignedRoles: ["Owner", "Administrator", "Manager", "Operator", "Service Account"] },
    { id: "perm-4", key: "manage_users", category: "users", description: "Invite users and assign access scope.", assignedRoles: ["Owner", "Administrator", "Manager"] },
    { id: "perm-5", key: "manage_roles", category: "roles", description: "Manage role definitions and assignments.", assignedRoles: ["Owner", "Administrator"] },
    { id: "perm-6", key: "manage_workflows", category: "workflows", description: "Create and schedule enterprise workflows.", assignedRoles: ["Owner", "Administrator", "Manager", "Operator", "Service Account"] },
    { id: "perm-7", key: "manage_integrations", category: "integrations", description: "Connect and govern platform integrations.", assignedRoles: ["Owner", "Administrator", "Service Account"] },
    { id: "perm-8", key: "view_audit_logs", category: "audit", description: "Read audit events and security evidence.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager"] },
    { id: "perm-9", key: "manage_api_keys", category: "api-keys", description: "Issue, rotate, and revoke API keys.", assignedRoles: ["Owner", "Administrator", "Service Account"] },
    { id: "perm-10", key: "export_data", category: "export", description: "Export governed tenant data.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager"] },
    { id: "perm-11", key: "manage_policies", category: "policy", description: "Update security and compliance policies.", assignedRoles: ["Owner", "Administrator"] },
    { id: "perm-12", key: "manage_sessions", category: "sessions", description: "Revoke and manage active sessions.", assignedRoles: ["Owner", "Administrator", "Manager"] },
    { id: "perm-13", key: "manage_departments", category: "departments", description: "Manage department structure and ownership.", assignedRoles: ["Owner", "Administrator", "Manager"] },
    { id: "perm-14", key: "manage_teams", category: "teams", description: "Manage team structures and membership.", assignedRoles: ["Owner", "Administrator", "Manager"] },
    { id: "perm-15", key: "manage_organizations", category: "organizations", description: "Govern organization-level settings and controls.", assignedRoles: ["Owner"] },
    { id: "perm-16", key: "manage_workspaces", category: "workspaces", description: "Create and configure workspace boundaries.", assignedRoles: ["Owner", "Administrator"] },
    { id: "perm-17", key: "view_runtime", category: "runtime", description: "View runtime status and system health.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager", "Operator", "Employee", "Service Account"] },
    { id: "perm-18", key: "manage_runtime", category: "runtime", description: "Control runtime execution settings.", assignedRoles: ["Owner", "Administrator"] },
    { id: "perm-19", key: "approve_decisions", category: "decisions", description: "Approve strategic recommendations.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager"] },
    { id: "perm-20", key: "view_reports", category: "reports", description: "View reports and briefings.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager", "Employee", "Guest"] },
    { id: "perm-21", key: "manage_knowledge", category: "knowledge", description: "Manage knowledge graph context and updates.", assignedRoles: ["Owner", "Administrator", "Executive", "Manager"] },
    { id: "perm-22", key: "manage_billing", category: "billing", description: "Manage subscriptions and billing controls.", assignedRoles: ["Owner"] },
    { id: "perm-23", key: "manage_ai_models", category: "models", description: "Govern model access and policy alignment.", assignedRoles: ["Owner", "Administrator"] },
    { id: "perm-24", key: "execute_workflow", category: "workflows", description: "Execute approved automation workflows.", assignedRoles: ["Owner", "Administrator", "Manager", "Operator", "Service Account"] },
  ]

  const auditLogs: SecurityAuditLog[] = [
    { id: "audit-1", organizationId: "org-1", workspaceId: "ws-1", userId: "user-1", timestamp: Date.now() - 1000 * 60 * 61, resource: "session", action: "user_login", metadata: { method: "passwordless", mfa: true }, actor: "Ava Chen", event: "user_login", detail: "Owner authenticated through Supabase session bridge.", source: "Supabase Authentication", result: "success" },
    { id: "audit-2", organizationId: "org-1", workspaceId: "ws-4", userId: "user-3", timestamp: Date.now() - 1000 * 60 * 46, resource: "role", action: "role_changed", metadata: { roleId: "role-manager", permission: "approve_decisions" }, actor: "Marco Silva", event: "role_changed", detail: "Finance Governance role updated to allow decision approvals.", source: "RBAC", result: "warning" },
    { id: "audit-3", organizationId: "org-1", workspaceId: "ws-3", userId: "user-2", timestamp: Date.now() - 1000 * 60 * 31, resource: "workflow", action: "workflow_executed", metadata: { workflowId: "support-recovery" }, actor: "Retention Agent", event: "workflow_executed", detail: "Support Recovery Workflow executed under Support workspace policy.", source: "Workflow Builder", result: "success" },
    { id: "audit-4", organizationId: "org-1", workspaceId: "ws-1", userId: "user-1", timestamp: Date.now() - 1000 * 60 * 22, resource: "decision", action: "settings_changed", metadata: { decisionId: "exec-escalation" }, actor: "Ava Chen", event: "settings_changed", detail: "Executive escalation decision approved for Northwind Health.", source: "Decision Engine", result: "success" },
    { id: "audit-5", organizationId: "org-1", workspaceId: "ws-1", userId: "user-1", timestamp: Date.now() - 1000 * 60 * 12, resource: "knowledge", action: "knowledge_modified", metadata: { nodes: 42 }, actor: "Knowledge Operations", event: "knowledge_modified", detail: "Scoped knowledge refresh published for compliance-reviewed references.", source: "Knowledge Graph", result: "success" },
    { id: "audit-6", organizationId: "org-1", workspaceId: "ws-1", userId: "user-svc-1", timestamp: Date.now() - 1000 * 60 * 4, resource: "api_key", action: "api_key_created", metadata: { keyId: "key-2", status: "rotating" }, actor: "Security System", event: "api_key_created", detail: "One API key flagged for scheduled rotation after scope review.", source: "Enterprise Security", result: "warning" },
  ]

  const policies: SecurityPolicy[] = [
    { id: "policy-1", organizationId: "org-1", workspaceId: "ws-1", name: "Password Policy", category: "password", scope: "organization", status: "active", summary: "Require strong passwords and periodic rotation for enterprise admins.", value: "14 chars / 90 days" },
    { id: "policy-2", organizationId: "org-1", workspaceId: "ws-1", name: "MFA", category: "mfa", scope: "organization", status: "active", summary: "MFA required for privileged roles and decision approvals.", value: "Required for Owner/Admin/Executive" },
    { id: "policy-3", organizationId: "org-1", workspaceId: "ws-1", name: "Session Timeout", category: "session-timeout", scope: "workspace", status: "review", summary: "Shorter session duration for high-risk workspaces.", value: "30 minutes idle" },
    { id: "policy-4", organizationId: "org-1", workspaceId: "ws-4", name: "IP Restrictions", category: "ip-restrictions", scope: "workspace", status: "draft", summary: "Geo-aware restrictions for regulated tenants.", value: "Allow-list ready" },
    { id: "policy-5", organizationId: "org-1", workspaceId: "ws-1", name: "Device Trust", category: "device-trust", scope: "organization", status: "active", summary: "Trusted devices flagged for executive and finance workspaces.", value: "Managed devices preferred" },
    { id: "policy-6", organizationId: "org-1", workspaceId: "ws-1", name: "Data Retention", category: "data-retention", scope: "organization", status: "active", summary: "Retention architecture for audit, memory, and workflow evidence.", value: "365 days default" },
    { id: "policy-7", organizationId: "org-1", workspaceId: "ws-1", name: "Enterprise SSO", category: "sso", scope: "organization", status: "draft", summary: "SSO foundation prepared for Entra ID, Okta, and Google Workspace.", value: "OIDC/SAML staged" },
    { id: "policy-8", organizationId: "org-1", workspaceId: "ws-1", name: "SCIM Provisioning", category: "scim", scope: "organization", status: "draft", summary: "SCIM user lifecycle sync contracts staged for enterprise rollout.", value: "Endpoint pending" },
  ]

  const apiKeys: ApiKeyRecord[] = [
    { id: "key-1", organizationId: "org-1", workspaceId: "ws-2", userId: "user-5", name: "Northwind Integration Key", keyType: "workspace", scopes: ["manage_integrations", "view_runtime"], scope: ["manage_integrations", "view_runtime"], status: "active", expiresAt: "2026-10-01", usage: "12.4k calls / 30d", lastRotatedAt: "2026-06-01" },
    { id: "key-2", organizationId: "org-1", workspaceId: "ws-1", userId: "user-svc-1", name: "Board Reporting Export", keyType: "service", scopes: ["view_reports", "export_data"], scope: ["view_reports", "export_data"], status: "rotating", expiresAt: "2026-08-15", usage: "1.1k calls / 30d", lastRotatedAt: "2026-07-01" },
    { id: "key-3", organizationId: "org-1", workspaceId: "ws-3", userId: "user-2", name: "Workflow Dispatch Key", keyType: "workspace", scopes: ["execute_workflow", "manage_memory"], scope: ["execute_workflow", "manage_memory"], status: "active", expiresAt: "2026-12-31", usage: "8.7k calls / 30d", lastRotatedAt: "2026-05-20" },
    { id: "key-4", organizationId: "org-1", userId: "user-1", name: "Legacy Sandbox Key", keyType: "personal", scopes: ["view_runtime"], scope: ["view_runtime"], status: "revoked", expiresAt: "revoked", usage: "revoked", revokedAt: "2026-06-26", revocationReason: "Scope consolidation" },
  ]

  const sessions: SessionRecord[] = [
    { id: "session-1", organizationId: "org-1", workspaceId: "ws-1", userId: "user-1", user: "Ava Chen", device: "MacBook Pro", location: "San Francisco, US", browser: "Chrome 127", ip: "34.221.18.20", duration: "1h 12m", current: true, status: "active" },
    { id: "session-2", organizationId: "org-1", workspaceId: "ws-4", userId: "user-3", user: "Marco Silva", device: "Windows Laptop", location: "New York, US", browser: "Edge 126", ip: "18.114.77.11", duration: "48m", current: false, status: "active" },
    { id: "session-3", organizationId: "org-1", workspaceId: "ws-3", userId: "user-2", user: "Nina Park", device: "iPad", location: "Austin, US", browser: "Safari 17", ip: "52.10.44.90", duration: "22m", current: false, status: "active" },
  ]

  return {
    organizations,
    workspaces,
    departments,
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

export function filterByQuery<T extends object>(items: T[], query: string, keys: Array<keyof T>) {
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