import type { PermissionKey } from "@/src/domain/security";
import type { RoleId } from "@/types/role-intelligence";

export type IntelligenceStatus = "new" | "acknowledged" | "in_progress" | "resolved" | "dismissed" | "awaiting_approval";
export type IntelligenceKind = "risk" | "opportunity" | "process" | "governance";

export type IntelligenceEvidence = {
  id: string;
  source: string;
  recordId: string;
  statement: string;
  observedAt?: string;
  kind: "observed" | "calculated" | "inferred";
};

export type BusinessIntelligence = {
  id: string;
  duplicateKey: string;
  title: string;
  summary: string;
  kind: IntelligenceKind;
  entity: { type: string; id: string };
  businessFunction: string;
  relevantRoles: RoleId[];
  priority: "low" | "medium" | "high" | "critical";
  confidence: number;
  evidence: IntelligenceEvidence[];
  uncertainty: string;
  nextAction: string;
  approvalRequired: boolean;
  requiredPermissions: PermissionKey[];
  status: IntelligenceStatus;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
  triage: {
    impact: number;
    urgency: number;
    risk: number;
    opportunity: number;
  };
  financialEstimate?: {
    amountEuro: number;
    period: string;
    assumptions: string[];
  };
};

export type IntelligenceScoreBreakdown = {
  impact: number;
  urgency: number;
  risk: number;
  opportunity: number;
  confidence: number;
  freshness: number;
  roleRelevance: number;
  statusAdjustment: number;
};

export type RankedIntelligence = BusinessIntelligence & {
  score: number;
  scoreBreakdown: IntelligenceScoreBreakdown;
  evidenceNeedsVerification: boolean;
};

export type IntelligenceRankingOptions = {
  roleId: RoleId;
  grantedPermissions: ReadonlySet<PermissionKey>;
  asOf: number;
  maxEvidenceAgeDays?: number;
};

export const intelligenceScoreWeights = {
  impact: 20,
  urgency: 15,
  risk: 15,
  opportunity: 10,
  confidence: 10,
  freshness: 10,
  roleRelevance: 20,
} as const;

const validStatuses = new Set<string>(["new", "acknowledged", "in_progress", "resolved", "dismissed", "awaiting_approval"]);
const validKinds = new Set<string>(["risk", "opportunity", "process", "governance"]);
const validPriorities = new Set<string>(["low", "medium", "high", "critical"]);
const validRoles = new Set<string>([
  "ceo", "coo", "cfo", "cto", "cmo", "cro", "chro", "sales-director", "sales-manager",
  "account-executive", "marketing-director", "marketing-manager", "operations-director",
  "operations-manager", "customer-success", "support-manager", "finance-manager",
  "project-manager", "team-lead", "individual-contributor", "system-administrator", "custom-role",
]);
const validPermissions = new Set<string>([
  "view_dashboard", "manage_agents", "manage_memory", "manage_users", "manage_roles",
  "manage_workflows", "manage_integrations", "view_audit_logs", "manage_api_keys",
  "export_data", "manage_policies", "manage_sessions", "manage_departments", "manage_teams",
  "manage_organizations", "manage_workspaces", "view_runtime", "manage_runtime",
  "approve_decisions", "view_reports", "manage_knowledge", "manage_billing",
  "manage_ai_models", "execute_workflow",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function isEvidence(value: unknown): value is IntelligenceEvidence {
  return isRecord(value)
    && isNonEmptyString(value.id)
    && isNonEmptyString(value.source)
    && isNonEmptyString(value.recordId)
    && isNonEmptyString(value.statement)
    && (value.observedAt === undefined || (isNonEmptyString(value.observedAt) && Number.isFinite(Date.parse(value.observedAt))))
    && ["observed", "calculated", "inferred"].includes(String(value.kind));
}

function isBusinessIntelligence(value: unknown): value is BusinessIntelligence {
  if (!isRecord(value)) return false;
  const item = value;
  const triage = item.triage;
  const entity = item.entity;
  const evidence = item.evidence;
  const financialEstimate = item.financialEstimate;

  return isNonEmptyString(item.id)
    && isNonEmptyString(item.duplicateKey)
    && isNonEmptyString(item.title)
    && isNonEmptyString(item.summary)
    && typeof item.kind === "string"
    && validKinds.has(item.kind)
    && typeof item.priority === "string"
    && validPriorities.has(item.priority)
    && isRecord(entity)
    && isNonEmptyString(entity.type)
    && isNonEmptyString(entity.id)
    && isNonEmptyString(item.businessFunction)
    && isNonEmptyString(item.uncertainty)
    && isNonEmptyString(item.nextAction)
    && isScore(item.confidence)
    && Array.isArray(item.relevantRoles)
    && item.relevantRoles.every((role) => typeof role === "string" && validRoles.has(role))
    && Array.isArray(item.requiredPermissions)
    && item.requiredPermissions.every((permission) => typeof permission === "string" && validPermissions.has(permission))
    && Array.isArray(evidence)
    && evidence.every(isEvidence)
    && isRecord(triage)
    && isScore(triage.impact)
    && isScore(triage.urgency)
    && isScore(triage.risk)
    && isScore(triage.opportunity)
    && typeof item.status === "string"
    && validStatuses.has(item.status)
    && typeof item.approvalRequired === "boolean"
    && (item.owner === undefined || isNonEmptyString(item.owner))
    && (item.createdAt === undefined || (isNonEmptyString(item.createdAt) && Number.isFinite(Date.parse(item.createdAt))))
    && (item.updatedAt === undefined || (isNonEmptyString(item.updatedAt) && Number.isFinite(Date.parse(item.updatedAt))))
    && (financialEstimate === undefined || (
      isRecord(financialEstimate)
      && typeof financialEstimate.amountEuro === "number"
      && Number.isFinite(financialEstimate.amountEuro)
      && isNonEmptyString(financialEstimate.period)
      && Array.isArray(financialEstimate.assumptions)
      && financialEstimate.assumptions.every(isNonEmptyString)
    ));
}

export function validateBusinessIntelligence(value: unknown): BusinessIntelligence {
  if (!isBusinessIntelligence(value)) {
    throw new TypeError("Intelligence item does not match the supported schema.");
  }
  return value;
}

function scoreFreshness(item: BusinessIntelligence, asOf: number, maxEvidenceAgeDays: number): { score: number; stale: boolean } {
  const timestamps = item.evidence
    .map((entry) => entry.observedAt ? Date.parse(entry.observedAt) : Number.NaN)
    .filter(Number.isFinite);
  if (timestamps.length === 0 || !Number.isFinite(asOf) || asOf <= 0) return { score: 0, stale: true };

  const ageDays = Math.max(0, (asOf - Math.max(...timestamps)) / 86_400_000);
  const score = Math.round(Math.max(0, 100 * (1 - ageDays / maxEvidenceAgeDays)));
  return { score, stale: ageDays > maxEvidenceAgeDays };
}

function hasRequiredPermissions(item: BusinessIntelligence, granted: ReadonlySet<PermissionKey>): boolean {
  return item.requiredPermissions.every((permission) => granted.has(permission));
}

function calculateScore(item: BusinessIntelligence, roleId: RoleId, freshness: number): { score: number; breakdown: IntelligenceScoreBreakdown } {
  const evidenceConfidence = item.evidence.length > 0 ? item.confidence : Math.min(item.confidence, 20);
  const breakdown: IntelligenceScoreBreakdown = {
    impact: item.triage.impact,
    urgency: item.triage.urgency,
    risk: item.triage.risk,
    opportunity: item.triage.opportunity,
    confidence: evidenceConfidence,
    freshness,
    roleRelevance: item.relevantRoles.includes(roleId) ? 100 : 25,
    statusAdjustment: item.status === "acknowledged" ? -20
      : item.status === "in_progress" ? -10
        : item.status === "awaiting_approval" ? 5 : 0,
  };
  const weighted = (
    breakdown.impact * intelligenceScoreWeights.impact
    + breakdown.urgency * intelligenceScoreWeights.urgency
    + breakdown.risk * intelligenceScoreWeights.risk
    + breakdown.opportunity * intelligenceScoreWeights.opportunity
    + breakdown.confidence * intelligenceScoreWeights.confidence
    + breakdown.freshness * intelligenceScoreWeights.freshness
    + breakdown.roleRelevance * intelligenceScoreWeights.roleRelevance
  ) / 100;
  return { score: Math.max(0, Math.min(100, Math.round(weighted + breakdown.statusAdjustment))), breakdown };
}

export function rankIntelligence(
  input: readonly BusinessIntelligence[],
  options: IntelligenceRankingOptions,
): RankedIntelligence[] {
  const maxEvidenceAgeDays = options.maxEvidenceAgeDays ?? 30;
  if (!Number.isFinite(options.asOf) || options.asOf <= 0) throw new RangeError("A positive as-of timestamp is required.");
  if (!Number.isFinite(maxEvidenceAgeDays) || maxEvidenceAgeDays <= 0) throw new RangeError("Maximum evidence age must be positive.");

  const authorized = input.map(validateBusinessIntelligence)
    .filter((item) => hasRequiredPermissions(item, options.grantedPermissions))
    .filter((item) => item.status !== "dismissed" && item.status !== "resolved");
  const ranked = authorized.map((item) => {
    const freshness = scoreFreshness(item, options.asOf, maxEvidenceAgeDays);
    const score = calculateScore(item, options.roleId, freshness.score);
    return {
      ...item,
      score: score.score,
      scoreBreakdown: score.breakdown,
      evidenceNeedsVerification: freshness.stale || item.evidence.length === 0,
    };
  });

  const uniqueByIssue = new Map<string, RankedIntelligence>();
  for (const item of ranked) {
    const existing = uniqueByIssue.get(item.duplicateKey);
    if (!existing || item.score > existing.score || (item.score === existing.score && item.id.localeCompare(existing.id) < 0)) {
      uniqueByIssue.set(item.duplicateKey, item);
    }
  }
  return Array.from(uniqueByIssue.values()).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
