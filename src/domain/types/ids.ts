/** Nominal type helper to model strongly typed identifiers. */
export type Brand<T, Name extends string> = T & { readonly __brand: Name }

/** Organization identifier. */
export type OrganizationId = Brand<string, "OrganizationId">
/** Workspace identifier. */
export type WorkspaceId = Brand<string, "WorkspaceId">
/** Department identifier. */
export type DepartmentId = Brand<string, "DepartmentId">
/** Team identifier. */
export type TeamId = Brand<string, "TeamId">
/** Role identifier. */
export type RoleId = Brand<string, "RoleId">
/** Permission identifier. */
export type PermissionId = Brand<string, "PermissionId">
/** User identifier. */
export type UserId = Brand<string, "UserId">
/** Person identifier. */
export type PersonId = Brand<string, "PersonId">
/** Customer identifier. */
export type CustomerId = Brand<string, "CustomerId">
/** Company identifier. */
export type CompanyId = Brand<string, "CompanyId">
/** Contact identifier. */
export type ContactId = Brand<string, "ContactId">
/** Lead identifier. */
export type LeadId = Brand<string, "LeadId">
/** Opportunity identifier. */
export type OpportunityId = Brand<string, "OpportunityId">
/** Deal identifier. */
export type DealId = Brand<string, "DealId">
/** Pipeline identifier. */
export type PipelineId = Brand<string, "PipelineId">
/** Task identifier. */
export type TaskId = Brand<string, "TaskId">
/** Project identifier. */
export type ProjectId = Brand<string, "ProjectId">
/** Calendar event identifier. */
export type CalendarEventId = Brand<string, "CalendarEventId">
/** Event identifier. */
export type EventId = Brand<string, "EventId">
/** Conversation identifier. */
export type ConversationId = Brand<string, "ConversationId">
/** Email identifier. */
export type EmailId = Brand<string, "EmailId">
/** Meeting identifier. */
export type MeetingId = Brand<string, "MeetingId">
/** Document identifier. */
export type DocumentId = Brand<string, "DocumentId">
/** Knowledge article identifier. */
export type KnowledgeArticleId = Brand<string, "KnowledgeArticleId">
/** Knowledge collection identifier. */
export type KnowledgeCollectionId = Brand<string, "KnowledgeCollectionId">
/** Knowledge item identifier. */
export type KnowledgeId = Brand<string, "KnowledgeId">
/** Memory aggregate identifier. */
export type MemoryId = Brand<string, "MemoryId">
/** Memory entry identifier. */
export type MemoryEntryId = Brand<string, "MemoryEntryId">
/** Memory snapshot identifier. */
export type MemorySnapshotId = Brand<string, "MemorySnapshotId">
/** Insight identifier. */
export type InsightId = Brand<string, "InsightId">
/** KPI identifier. */
export type KPIId = Brand<string, "KPIId">
/** Goal identifier. */
export type GoalId = Brand<string, "GoalId">
/** Policy identifier. */
export type PolicyId = Brand<string, "PolicyId">
/** Decision identifier. */
export type DecisionId = Brand<string, "DecisionId">
/** Recommendation identifier. */
export type RecommendationId = Brand<string, "RecommendationId">
/** Risk identifier. */
export type RiskId = Brand<string, "RiskId">
/** Report identifier. */
export type ReportId = Brand<string, "ReportId">
/** Dashboard identifier. */
export type DashboardId = Brand<string, "DashboardId">
/** Notification identifier. */
export type NotificationId = Brand<string, "NotificationId">
/** Activity identifier. */
export type ActivityId = Brand<string, "ActivityId">
/** Audit entry identifier. */
export type AuditEntryId = Brand<string, "AuditEntryId">
/** Workflow identifier. */
export type WorkflowId = Brand<string, "WorkflowId">
/** Workflow step identifier. */
export type WorkflowStepId = Brand<string, "WorkflowStepId">
/** Automation identifier. */
export type AutomationId = Brand<string, "AutomationId">
/** Automation execution identifier. */
export type AutomationExecutionId = Brand<string, "AutomationExecutionId">
/** Agent identifier. */
export type AgentId = Brand<string, "AgentId">
/** Integration identifier. */
export type IntegrationId = Brand<string, "IntegrationId">
/** Agent capability identifier. */
export type AgentCapabilityId = Brand<string, "AgentCapabilityId">
/** Agent execution identifier. */
export type AgentExecutionId = Brand<string, "AgentExecutionId">
/** Prompt template identifier. */
export type PromptTemplateId = Brand<string, "PromptTemplateId">
/** AI model identifier. */
export type AIModelId = Brand<string, "AIModelId">
/** Runtime session identifier. */
export type RuntimeSessionId = Brand<string, "RuntimeSessionId">
/** Execution context identifier. */
export type ExecutionContextId = Brand<string, "ExecutionContextId">
/** Attachment identifier. */
export type AttachmentId = Brand<string, "AttachmentId">
/** Tag identifier. */
export type TagId = Brand<string, "TagId">
/** Comment identifier. */
export type CommentId = Brand<string, "CommentId">
/** Label identifier. */
export type LabelId = Brand<string, "LabelId">
