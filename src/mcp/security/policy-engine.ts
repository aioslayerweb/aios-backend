import type { MCPPolicyDecision, MCPPolicyRule, MCPProviderId } from "@/src/mcp/types"
import type { RoleRecord, SecurityPermissionKey } from "@/types"

export function createDefaultMCPPolicyRules(): MCPPolicyRule[] {
  return [
    {
      id: "mcp-policy-legal-external-ai",
      name: "Legal external AI guardrail",
      description: "Legal cannot execute external AI tools.",
      enabled: true,
      conditions: {
        disallowDepartments: ["legal"],
        requireApprovalForProviders: ["custom"],
      },
      effect: "deny",
    },
    {
      id: "mcp-policy-finance-erp-approval",
      name: "Finance ERP mutation approval",
      description: "Finance requires approval for ERP mutations.",
      enabled: true,
      conditions: {
        requireApprovalForProviders: ["sap"],
        allowRoles: ["Owner", "Administrator", "Manager", "Executive"],
      },
      effect: "require-approval",
    },
    {
      id: "mcp-policy-exec-board-access",
      name: "Executive board report access",
      description: "Executives can access board reports.",
      enabled: true,
      conditions: {
        allowRoles: ["Owner", "Administrator", "Executive"],
        allowPermissions: ["view_reports", "export_data"],
      },
      effect: "allow",
    },
    {
      id: "mcp-policy-dev-github",
      name: "Engineering GitHub access",
      description: "Developers may use GitHub tools.",
      enabled: true,
      conditions: {
        allowRoles: ["Owner", "Administrator", "Manager", "Operator", "Employee"],
      },
      effect: "allow",
    },
    {
      id: "mcp-policy-marketing-social",
      name: "Marketing integration access",
      description: "Marketing may use social and commerce integrations.",
      enabled: true,
      conditions: {
        allowRoles: ["Owner", "Administrator", "Manager", "Employee"],
      },
      effect: "allow",
    },
  ]
}

export function evaluateMCPPolicies(input: {
  requestId: string
  role: RoleRecord | null
  permissions: SecurityPermissionKey[]
  department: string
  provider: MCPProviderId
  rules: MCPPolicyRule[]
}): MCPPolicyDecision {
  const enabled = input.rules.filter((rule) => rule.enabled)
  const matched: MCPPolicyRule[] = []

  for (const rule of enabled) {
    const disallowMatch = rule.conditions.disallowDepartments?.includes(input.department as never) ?? false
    const providerApprovalMatch = rule.conditions.requireApprovalForProviders?.includes(input.provider) ?? false
    const roleMatch = rule.conditions.allowRoles ? Boolean(input.role && rule.conditions.allowRoles.includes(input.role.name)) : true
    const permissionMatch = rule.conditions.allowPermissions
      ? rule.conditions.allowPermissions.every((permission) => input.permissions.includes(permission))
      : true

    if (disallowMatch || providerApprovalMatch || (roleMatch && permissionMatch)) {
      matched.push(rule)
    }
  }

  const deny = matched.find((rule) => rule.effect === "deny")
  if (deny) {
    return {
      requestId: input.requestId,
      effect: "deny",
      matchedRuleIds: [deny.id],
      reason: deny.description,
    }
  }

  const approval = matched.find((rule) => rule.effect === "require-approval")
  if (approval) {
    return {
      requestId: input.requestId,
      effect: "require-approval",
      matchedRuleIds: [approval.id],
      reason: approval.description,
    }
  }

  const allow = matched.filter((rule) => rule.effect === "allow").map((rule) => rule.id)
  return {
    requestId: input.requestId,
    effect: "allow",
    matchedRuleIds: allow,
    reason: allow.length > 0 ? "Policy checks passed" : "No blocking policy matched",
  }
}
