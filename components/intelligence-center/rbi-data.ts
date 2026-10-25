import { intelligenceAnomalies } from "./mock-data";
import type { BusinessIntelligence, IntelligenceKind } from "@/lib/rbi/intelligence-engine";
import type { RoleId } from "@/types/role-intelligence";

const roleByCategory: Record<string, RoleId[]> = {
  Revenue: ["ceo", "cfo", "cro", "sales-director"],
  Operations: ["ceo", "coo", "operations-director", "operations-manager"],
  Customers: ["ceo", "cro", "sales-director", "customer-success", "support-manager"],
  Infrastructure: ["cto", "system-administrator"],
  Agents: ["coo", "cto", "system-administrator"],
  Compliance: ["ceo", "cfo", "system-administrator"],
  Workflows: ["coo", "cfo", "operations-director", "finance-manager"],
  Memory: ["coo", "customer-success", "support-manager"],
  Knowledge: ["coo", "cfo", "cto"],
};

const kindByCategory: Record<string, IntelligenceKind> = {
  Revenue: "risk",
  Operations: "process",
  Customers: "risk",
  Infrastructure: "risk",
  Agents: "process",
  Compliance: "governance",
  Workflows: "process",
  Memory: "process",
  Knowledge: "governance",
};

const priorityValues = { critical: 95, high: 80, medium: 55, low: 30 } as const;

export function intelligenceRoleToRoleId(role: string): RoleId | undefined {
  const roleIds: Partial<Record<string, RoleId>> = {
    CEO: "ceo",
    CFO: "cfo",
    COO: "coo",
    Sales: "cro",
    Marketing: "cmo",
    HR: "chro",
    Operations: "coo",
    IT: "cto",
  };
  return roleIds[role];
}

export const syntheticRbiIntelligence: BusinessIntelligence[] = intelligenceAnomalies.map((anomaly) => ({
  id: `demo-rbi-${anomaly.id}`,
  duplicateKey: `demo-signal-${anomaly.category.toLowerCase()}-${anomaly.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  title: anomaly.title,
  summary: anomaly.detail,
  kind: kindByCategory[anomaly.category],
  entity: { type: "business_signal", id: anomaly.id },
  businessFunction: anomaly.category,
  relevantRoles: roleByCategory[anomaly.category],
  priority: anomaly.severity,
  confidence: anomaly.severity === "high" ? 78 : anomaly.severity === "medium" ? 68 : 55,
  evidence: [{
    id: `evidence-${anomaly.id}`,
    source: "Intelligence Center · synthetic anomaly sample",
    recordId: anomaly.id,
    statement: anomaly.detail,
    observedAt: anomaly.timestamp,
    kind: "observed",
  }],
  uncertainty: "This is a synthetic sample signal. Its source is dated; verify current conditions before making a decision.",
  nextAction: "Review the cited sample signal and verify whether the condition is still present.",
  approvalRequired: false,
  requiredPermissions: anomaly.category === "Revenue" ? ["view_dashboard", "view_reports"] : ["view_dashboard"],
  status: "new",
  createdAt: anomaly.timestamp,
  updatedAt: anomaly.timestamp,
  triage: {
    impact: priorityValues[anomaly.severity],
    urgency: anomaly.severity === "high" || anomaly.severity === "critical" ? 75 : 45,
    risk: anomaly.severity === "high" || anomaly.severity === "critical" ? 80 : 45,
    opportunity: 15,
  },
}));
