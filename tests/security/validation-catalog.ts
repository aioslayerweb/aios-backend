import type { SecurityValidationDefinition } from "@/tests/shared"

export const securityValidationCatalog: SecurityValidationDefinition[] = [
  {
    id: "sec-rbac-01",
    type: "rbac",
    description: "Verify role permissions across organization, workspace, department, and team scopes.",
    expectedControl: "Access allowed only for explicit permissions.",
  },
  {
    id: "sec-tenant-01",
    type: "tenant-isolation",
    description: "Ensure tenant boundaries prevent cross-tenant data and action access.",
    expectedControl: "Cross-tenant reads and writes denied.",
  },
  {
    id: "sec-policy-01",
    type: "policy-enforcement",
    description: "Validate policy engine checks are enforced in privileged operations.",
    expectedControl: "Policy denial blocks action and emits audit event.",
  },
  {
    id: "sec-escalation-01",
    type: "permission-escalation",
    description: "Detect and block privilege escalation attempts in UI/service flows.",
    expectedControl: "Escalation attempts are denied and recorded.",
  },
  {
    id: "sec-secret-01",
    type: "secret-handling",
    description: "Ensure sensitive values are redacted and excluded from logs and traces.",
    expectedControl: "Secret fields never appear in logs.",
  },
  {
    id: "sec-audit-01",
    type: "audit-logging",
    description: "Verify immutable audit trail entries for security and admin actions.",
    expectedControl: "All required actions produce complete audit records.",
  },
  {
    id: "sec-session-01",
    type: "session-validation",
    description: "Validate session expiration, revocation, and invalid token handling.",
    expectedControl: "Invalid sessions are rejected consistently.",
  },
]
