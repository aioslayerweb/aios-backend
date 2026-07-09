import type { SecurityState } from "@/types"
import type { AuthenticatedIdentity, AuthenticationMethod, RoleContextValue, TenantProfile } from "@/types/security-foundation"
import { resolvePermissions } from "@/utils/authorization"

function pickCurrentUser(state: SecurityState) {
  return state.users.find((item) => item.status === "active") ?? state.users[0] ?? null
}

function pickCurrentSession(state: SecurityState) {
  return state.sessions.find((item) => item.current) ?? state.sessions[0] ?? null
}

export function createAuthenticatedIdentity(state: SecurityState, authenticationMethod: AuthenticationMethod = "passwordless"): AuthenticatedIdentity {
  const user = pickCurrentUser(state)
  const session = pickCurrentSession(state)

  return {
    user,
    session,
    isAuthenticated: Boolean(user),
    authenticationMethod,
    authenticatedAt: session ? Date.now() : Date.now(),
    mfaEnabled: true,
    serviceAccount: false,
    externalUser: user?.roleId === "role-guest",
  }
}

export function createTenantProfile(state: SecurityState): TenantProfile {
  const organization = state.organizations.find((item) => item.id === state.selectedOrganizationId) ?? state.organizations[0] ?? null
  const workspace = state.workspaces.find((item) => item.id === state.selectedWorkspaceId) ?? state.workspaces[0] ?? null
  const departments = state.departments.filter((item) => item.workspaceId === workspace?.id)
  const activeDepartment = departments[0] ?? null

  return {
    tenantId: organization?.id ?? "tenant-default",
    organization,
    workspace,
    activeDepartment,
    environment: organization?.environment === "production" ? "production" : organization?.environment === "staging" ? "staging" : "sandbox",
    businessUnits: organization ? [organization.subscription, organization.region] : [],
    departments,
    teams: state.teams,
    settings: {
      branding: organization?.branding ?? "AIOS",
      domains: organization ? [`${organization.name.toLowerCase().replace(/\s+/g, "-")}.aios.example`] : ["aios.example"],
      languages: ["en-US"],
      regions: organization ? [organization.region] : [],
      businessHours: organization?.environment === "production" ? "09:00-17:00" : "Flexible",
      aiPreferences: {
        preferredModel: "gpt-5.4-mini",
        autonomyLevel: "guided",
        memoryMode: "working",
      },
      notificationSettings: {
        email: true,
        inApp: true,
        webhook: false,
      },
      securityPolicies: state.policies.map((item) => item.name),
      passwordPolicy: {
        minLength: 14,
        requireSymbols: true,
        requireNumbers: true,
        maxAgeDays: 90,
      },
      mfa: {
        required: true,
        gracePeriodHours: 24,
      },
      sso: {
        enabled: false,
        provider: "none",
        allowJitProvisioning: true,
      },
      oidc: {
        enabled: false,
      },
      saml: {
        enabled: false,
      },
      sessionTimeoutMinutes: 30,
      ipAllowList: [],
      trustedDevicesEnabled: true,
      scim: {
        enabled: false,
      },
    },
  }
}

export function createRoleContextValue(state: SecurityState, auth: AuthenticatedIdentity, tenant: TenantProfile): RoleContextValue {
  const role = state.roles.find((item) => item.id === state.users.find((user) => user.id === auth.user?.id)?.roleId) ?? state.roles[0] ?? null
  const resolvedPermissionKeys = resolvePermissions(role, state.permissions)
  const permissions = state.permissions.filter((permission) => resolvedPermissionKeys.includes(permission.key))
  const workspace = tenant.workspace ?? state.workspaces[0] ?? null
  const organization = tenant.organization ?? state.organizations[0] ?? null

  return {
    authenticatedIdentity: auth,
    tenant,
    organization,
    workspace,
    role,
    permissions,
    responsibilities: role ? [role.description, workspace ? `Workspace: ${workspace.name}` : "No workspace selected"] : [],
    language: tenant.settings.languages[0] ?? "en-US",
    timeZone: organization?.region === "EU-West" ? "Europe/Dublin" : "America/Los_Angeles",
    preferences: {
      compactMode: false,
      reducedMotion: false,
      notificationsEnabled: true,
    },
    decisionAuthority: role?.description ?? "Standard approval scope",
    apiKeys: state.apiKeys,
    sessions: state.sessions,
    policies: state.policies,
  }
}