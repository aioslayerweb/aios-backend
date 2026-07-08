import { DecisionStatus, NotificationType, Priority, RiskLevel, Status } from "@/src/domain/common/enums"
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
import { createId } from "@/src/domain/utils/id"

/** Creates an insight entity. */
export function createInsight(partial: Partial<Insight> = {}): Insight {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("insight"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    title: partial.title ?? "Buying Intent Rising",
    observation: partial.observation ?? "Engagement velocity increased 27% in 48 hours.",
    evidence: partial.evidence ?? ["Email reply time", "Demo depth", "Website revisit"],
    confidence: partial.confidence ?? { value: 92 },
    status: partial.status ?? Status.Active,
    searchText: partial.searchText ?? "buying intent rising",
    searchKeywords: partial.searchKeywords ?? ["insight", "intent", "pipeline"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a goal entity. */
export function createGoal(partial: Partial<Goal> = {}): Goal {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("goal"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    title: partial.title ?? "Improve Net Revenue Retention",
    description: partial.description ?? "Lift NRR above target by improving expansion motion.",
    targetValue: partial.targetValue ?? { amount: 115, currency: "PERCENT" },
    period:
      partial.period ?? {
        startAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
    status: partial.status ?? Status.Active,
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "improve net revenue retention",
    searchKeywords: partial.searchKeywords ?? ["goal", "nrr", "revenue"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a decision entity. */
export function createDecision(partial: Partial<Decision> = {}): Decision {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("decision"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    title: partial.title ?? "Expand Enterprise Sales Coverage",
    context: partial.context ?? "Pipeline quality indicates demand supports strategic expansion.",
    status: partial.status ?? DecisionStatus.Proposed,
    recommendationIds: partial.recommendationIds ?? [],
    riskIds: partial.riskIds ?? [],
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "expand enterprise sales coverage",
    searchKeywords: partial.searchKeywords ?? ["decision", "sales", "expansion"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a recommendation entity. */
export function createRecommendation(partial: Partial<Recommendation> = {}): Recommendation {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("recommendation"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    title: partial.title ?? "Assign strategic account pod",
    rationale: partial.rationale ?? "Top 5 accounts show expansion probability above threshold.",
    expectedOutcome: partial.expectedOutcome ?? "Increase qualified expansion opportunities by 20%.",
    priority: partial.priority ?? Priority.High,
    relatedDecisionId: partial.relatedDecisionId,
    searchText: partial.searchText ?? "assign strategic account pod",
    searchKeywords: partial.searchKeywords ?? ["recommendation", "accounts", "expansion"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a risk entity. */
export function createRisk(partial: Partial<Risk> = {}): Risk {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("risk"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    title: partial.title ?? "Insufficient onboarding capacity",
    level: partial.level ?? RiskLevel.Medium,
    probability: partial.probability ?? { value: 44 },
    impact: partial.impact ?? { value: 68 },
    mitigationPlan: partial.mitigationPlan ?? "Provision implementation specialists in advance.",
    searchText: partial.searchText ?? "insufficient onboarding capacity",
    searchKeywords: partial.searchKeywords ?? ["risk", "onboarding", "capacity"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a notification entity. */
export function createNotification(partial: Partial<Notification> = {}): Notification {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("notification"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    type: partial.type ?? NotificationType.Insight,
    title: partial.title ?? "High-value opportunity detected",
    message: partial.message ?? "AIOS detected elevated buying intent in strategic account.",
    read: partial.read ?? false,
    relatedActivityId: partial.relatedActivityId,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an audit entry entity. */
export function createAuditEntry(partial: Partial<AuditEntry> = {}): AuditEntry {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("audit_entry"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    actorId: partial.actorId ?? createId("user"),
    action: partial.action ?? "decision.updated",
    targetEntityId: partial.targetEntityId ?? createId("decision"),
    metadata: partial.metadata ?? {},
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an executive activity entity. */
export function createExecutiveActivity(partial: Partial<ExecutiveActivity> = {}): ExecutiveActivity {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("activity"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    actorId: partial.actorId ?? createId("user"),
    type: partial.type ?? "decision",
    targetEntityId: partial.targetEntityId ?? createId("decision"),
    summary: partial.summary ?? "Decision proposal submitted for executive review.",
    relatedDecisionId: partial.relatedDecisionId,
    relatedKpiId: partial.relatedKpiId,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
