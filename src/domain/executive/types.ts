import type { Activity, Entity, OwnedEntity, SearchableEntity, TaggableEntity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { DecisionStatus, NotificationType, Priority, RiskLevel, Status } from "@/src/domain/common/enums"
import type { DateRange, Money, Percentage } from "@/src/domain/common/value-objects"
import type {
  ActivityId,
  AuditEntryId,
  DecisionId,
  GoalId,
  InsightId,
  KPIId,
  NotificationId,
  RecommendationId,
  RiskId,
  UserId,
  WorkspaceId,
} from "@/src/domain/types/ids"

/** Insight captures interpreted business understanding from signals. */
export interface Insight extends Entity<InsightId>, Timestamped, OwnedEntity<UserId>, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly title: string
  readonly observation: string
  readonly evidence: ReadonlyArray<string>
  readonly confidence: Percentage
  readonly status: Status
}

/** Goal represents a strategic target with measurable period and owner. */
export interface Goal extends Entity<GoalId>, Timestamped, OwnedEntity<UserId>, VersionedEntity, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly title: string
  readonly description?: string
  readonly targetValue?: Money | number
  readonly period: DateRange
  readonly status: Status
}

/** Decision records executive choices and governance state. */
export interface Decision
  extends Entity<DecisionId>,
    Timestamped,
    OwnedEntity<UserId>,
    VersionedEntity,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly title: string
  readonly context: string
  readonly status: DecisionStatus
  readonly recommendationIds: ReadonlyArray<RecommendationId>
  readonly riskIds: ReadonlyArray<RiskId>
}

/** Recommendation suggests AI-backed next action. */
export interface Recommendation
  extends Entity<RecommendationId>,
    Timestamped,
    OwnedEntity<UserId>,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly title: string
  readonly rationale: string
  readonly expectedOutcome: string
  readonly priority: Priority
  readonly relatedDecisionId?: DecisionId
}

/** Risk tracks threats and uncertainty around execution outcomes. */
export interface Risk extends Entity<RiskId>, Timestamped, OwnedEntity<UserId>, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly title: string
  readonly level: RiskLevel
  readonly probability: Percentage
  readonly impact: Percentage
  readonly mitigationPlan?: string
}

/** Notification entity for user-visible enterprise updates. */
export interface Notification extends Entity<NotificationId>, Timestamped, OwnedEntity<UserId> {
  readonly workspaceId: WorkspaceId
  readonly type: NotificationType
  readonly title: string
  readonly message: string
  readonly read: boolean
  readonly relatedActivityId?: ActivityId
}

/** Audit entry provides immutable compliance history. */
export interface AuditEntry extends Entity<AuditEntryId>, Timestamped {
  readonly workspaceId: WorkspaceId
  readonly actorId: UserId | string
  readonly action: string
  readonly targetEntityId: string
  readonly metadata: Record<string, unknown>
}

/** Executive activity extends common activity with relationship anchors. */
export interface ExecutiveActivity extends Activity {
  readonly workspaceId: WorkspaceId
  readonly relatedDecisionId?: DecisionId
  readonly relatedKpiId?: KPIId
}
