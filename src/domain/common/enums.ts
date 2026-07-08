/** Priority level for business entities and execution orchestration. */
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

/** Generic lifecycle status used by domain entities where no specific status exists. */
export enum Status {
  Draft = "draft",
  Active = "active",
  Inactive = "inactive",
  Archived = "archived",
}

/** Task lifecycle states. */
export enum TaskStatus {
  Backlog = "backlog",
  Todo = "todo",
  InProgress = "in_progress",
  Blocked = "blocked",
  Completed = "completed",
  Cancelled = "cancelled",
}

/** Lead qualification state in CRM. */
export enum LeadStatus {
  New = "new",
  Qualified = "qualified",
  Nurturing = "nurturing",
  Disqualified = "disqualified",
  Converted = "converted",
}

/** Opportunity progression stage in revenue pipeline. */
export enum OpportunityStage {
  Discovery = "discovery",
  Qualification = "qualification",
  Proposal = "proposal",
  Negotiation = "negotiation",
  Won = "won",
  Lost = "lost",
}

/** Decision governance state for executive approvals. */
export enum DecisionStatus {
  Proposed = "proposed",
  UnderReview = "under_review",
  Approved = "approved",
  Rejected = "rejected",
  Executed = "executed",
}

/** Automation runtime state. */
export enum AutomationStatus {
  Draft = "draft",
  Enabled = "enabled",
  Disabled = "disabled",
  Running = "running",
  Failed = "failed",
}

/** Runtime health status used for sessions and agent execution. */
export enum RuntimeStatus {
  Idle = "idle",
  Connecting = "connecting",
  Running = "running",
  Degraded = "degraded",
  Error = "error",
  Completed = "completed",
}

/** Notification type used by user and system communications. */
export enum NotificationType {
  System = "system",
  Insight = "insight",
  Alert = "alert",
  Recommendation = "recommendation",
  Task = "task",
  Workflow = "workflow",
}

/** Activity type emitted by any domain producer to timeline/history. */
export enum ActivityType {
  Created = "created",
  Updated = "updated",
  Deleted = "deleted",
  Decision = "decision",
  Execution = "execution",
  Warning = "warning",
  Error = "error",
}

/** Permission access granularity for identity and RBAC. */
export enum PermissionLevel {
  None = "none",
  Read = "read",
  Write = "write",
  Admin = "admin",
}

/** Risk severity classification for executive and operations domains. */
export enum RiskLevel {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

/** Sentiment score band for communications and customer intelligence. */
export enum Sentiment {
  Negative = "negative",
  Neutral = "neutral",
  Positive = "positive",
}
