/** Priority level for business entities and execution orchestration. */
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

/** Shared role classification across the enterprise domain model. */
export enum Role {
  Owner = "owner",
  Administrator = "administrator",
  Executive = "executive",
  Manager = "manager",
  Operator = "operator",
  Employee = "employee",
  Guest = "guest",
  Custom = "custom",
}

/** Shared department classification. */
export enum DepartmentType {
  Executive = "executive",
  Revenue = "revenue",
  Marketing = "marketing",
  Operations = "operations",
  Finance = "finance",
  Support = "support",
  People = "people",
  Technology = "technology",
  Custom = "custom",
}

/** Shared agent classification. */
export enum AgentType {
  Reasoning = "reasoning",
  Planner = "planner",
  Executor = "executor",
  Observer = "observer",
  Analyzer = "analyzer",
  Coordinator = "coordinator",
  Custom = "custom",
}

/** Workflow lifecycle status. */
export enum WorkflowStatus {
  Draft = "draft",
  Ready = "ready",
  Running = "running",
  Monitoring = "monitoring",
  Learning = "learning",
  Completed = "completed",
  Archived = "archived",
}

/** Policy lifecycle status. */
export enum PolicyStatus {
  Draft = "draft",
  Review = "review",
  Active = "active",
  Disabled = "disabled",
  Archived = "archived",
}

/** Goal lifecycle status. */
export enum GoalStatus {
  Draft = "draft",
  Active = "active",
  AtRisk = "at_risk",
  Blocked = "blocked",
  Completed = "completed",
  Archived = "archived",
}

/** Knowledge lifecycle classification. */
export enum KnowledgeType {
  Article = "article",
  Insight = "insight",
  Procedure = "procedure",
  Decision = "decision",
  Reference = "reference",
  Model = "model",
  Custom = "custom",
}

/** Memory lifecycle classification. */
export enum MemoryType {
  Working = "working",
  Session = "session",
  LongTerm = "long_term",
  Knowledge = "knowledge",
  Decision = "decision",
  Custom = "custom",
}

/** Notification severity classification. */
export enum NotificationSeverity {
  Info = "info",
  Success = "success",
  Warning = "warning",
  Error = "error",
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
