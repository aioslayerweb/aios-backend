import type { ExtensionSecurityProfile } from "@/src/sdk/types"

export function validateExtensionSecurity(profile: ExtensionSecurityProfile): { valid: boolean; reasons: string[] } {
  const reasons: string[] = []

  if (!profile.sandboxed) {
    reasons.push("Extension must run in a sandbox")
  }
  if (!profile.permissionValidated) {
    reasons.push("Extension permissions are not validated")
  }
  if (!profile.rbacCompliant) {
    reasons.push("RBAC compliance is required")
  }
  if (!profile.roleIntelligenceCompliant) {
    reasons.push("Role-Based Intelligence compliance is required")
  }
  if (!profile.tenantIsolationVerified) {
    reasons.push("Tenant isolation must be verified")
  }
  if (!profile.policyEnforced) {
    reasons.push("Policy enforcement is required")
  }
  if (!profile.auditLoggingEnabled) {
    reasons.push("Audit logging must be enabled")
  }
  if (!profile.digitallySigned) {
    reasons.push("Digital signature is required")
  }

  return {
    valid: reasons.length === 0,
    reasons,
  }
}
