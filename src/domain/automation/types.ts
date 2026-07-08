import type { Entity, OwnedEntity, SearchableEntity, TaggableEntity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { AutomationStatus, RuntimeStatus } from "@/src/domain/common/enums"
import type { AgentId, AutomationExecutionId, AutomationId, UserId, WorkflowId, WorkflowStepId, WorkspaceId } from "@/src/domain/types/ids"

/** Workflow step defines a single executable unit in a workflow graph. */
export interface WorkflowStep extends Entity<WorkflowStepId>, Timestamped {
  readonly workflowId: WorkflowId
  readonly name: string
  readonly action: string
  readonly dependsOnStepIds: ReadonlyArray<WorkflowStepId>
  readonly timeoutMs?: number
}

/** Workflow defines ordered and/or dependency-based execution plans. */
export interface Workflow extends Entity<WorkflowId>, Timestamped, OwnedEntity<UserId>, VersionedEntity, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description?: string
  readonly stepIds: ReadonlyArray<WorkflowStepId>
  readonly status: AutomationStatus
}

/** Automation defines trigger-based execution behavior using workflows. */
export interface Automation
  extends Entity<AutomationId>,
    Timestamped,
    OwnedEntity<UserId>,
    VersionedEntity,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description?: string
  readonly workflowId: WorkflowId
  readonly trigger: string
  readonly status: AutomationStatus
  readonly agentId?: AgentId
}

/** Automation execution captures runtime instances for automations. */
export interface AutomationExecution extends Entity<AutomationExecutionId>, Timestamped, OwnedEntity<UserId> {
  readonly workspaceId: WorkspaceId
  readonly automationId: AutomationId
  readonly workflowId: WorkflowId
  readonly status: RuntimeStatus
  readonly startedAt: string
  readonly completedAt?: string
  readonly logs: ReadonlyArray<string>
}
