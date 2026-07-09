import type { ApiKeyRecord, DepartmentRecord, EnterpriseSecuritySettings, OrganizationRecord, PermissionRecord, RoleRecord, SecurityPolicy, SessionRecord, TeamRecord, UserRecord, WorkspaceRecord } from "@/types"

export type AuthenticationMethod =
  | "email"
  | "magic-link"
  | "oauth"
  | "oidc"
  | "saml"
  | "azure-ad"
  | "google-workspace"
  | "okta"
  | "auth0"
  | "passwordless"

export type TenantEnvironment = "development" | "staging" | "production" | "sandbox"

export type AuthenticatedIdentity = {
  user: UserRecord | null
  session: SessionRecord | null
  isAuthenticated: boolean
  authenticationMethod: AuthenticationMethod
  authenticatedAt: number
  mfaEnabled: boolean
  serviceAccount: boolean
  externalUser: boolean
}

export type TenantSecuritySettings = EnterpriseSecuritySettings & {
  branding: string
  domains: string[]
  languages: string[]
  regions: string[]
  businessHours: string
  aiPreferences: {
    preferredModel: string
    autonomyLevel: "supervised" | "guided" | "autonomous"
    memoryMode: "session" | "working" | "long-term"
  }
  notificationSettings: {
    email: boolean
    inApp: boolean
    webhook: boolean
  }
  securityPolicies: string[]
}

export type TenantProfile = {
  tenantId: string
  organization: OrganizationRecord | null
  workspace: WorkspaceRecord | null
  activeDepartment: DepartmentRecord | null
  environment: TenantEnvironment
  businessUnits: string[]
  departments: DepartmentRecord[]
  teams: TeamRecord[]
  settings: TenantSecuritySettings
}

export type RoleContextValue = {
  authenticatedIdentity: AuthenticatedIdentity
  tenant: TenantProfile
  organization: OrganizationRecord | null
  workspace: WorkspaceRecord | null
  role: RoleRecord | null
  permissions: PermissionRecord[]
  responsibilities: string[]
  language: string
  timeZone: string
  preferences: {
    compactMode: boolean
    reducedMotion: boolean
    notificationsEnabled: boolean
  }
  decisionAuthority: string
  apiKeys: ApiKeyRecord[]
  sessions: SessionRecord[]
  policies: SecurityPolicy[]
}