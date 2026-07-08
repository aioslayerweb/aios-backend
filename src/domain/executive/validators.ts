import type {
  AuditEntry,
  Decision,
  ExecutiveActivity,
  Goal,
  Insight,
  Notification,
  Recommendation,
  Risk,
} from "@/src/domain/executive/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for Insight entities. */
export function isInsight(value: unknown): value is Insight {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.evidence)
}

/** Type guard for Goal entities. */
export function isGoal(value: unknown): value is Goal {
  return isRecord(value) && typeof value.id === "string" && isRecord(value.period)
}

/** Type guard for Decision entities. */
export function isDecision(value: unknown): value is Decision {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.recommendationIds)
}

/** Type guard for Recommendation entities. */
export function isRecommendation(value: unknown): value is Recommendation {
  return isRecord(value) && typeof value.id === "string" && typeof value.rationale === "string"
}

/** Type guard for Risk entities. */
export function isRisk(value: unknown): value is Risk {
  return isRecord(value) && typeof value.id === "string" && isRecord(value.probability)
}

/** Type guard for Notification entities. */
export function isNotification(value: unknown): value is Notification {
  return isRecord(value) && typeof value.id === "string" && typeof value.message === "string"
}

/** Type guard for AuditEntry entities. */
export function isAuditEntry(value: unknown): value is AuditEntry {
  return isRecord(value) && typeof value.id === "string" && typeof value.action === "string"
}

/** Type guard for ExecutiveActivity entities. */
export function isExecutiveActivity(value: unknown): value is ExecutiveActivity {
  return isRecord(value) && typeof value.id === "string" && typeof value.summary === "string"
}
