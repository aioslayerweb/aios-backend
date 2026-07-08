import { AutomationStatus, RuntimeStatus } from "@/src/domain/common/enums"
import type { Automation, AutomationExecution, Workflow, WorkflowStep } from "@/src/domain/automation/types"
import { createId } from "@/src/domain/utils/id"

/** Creates a workflow step entity. */
export function createWorkflowStep(partial: Partial<WorkflowStep> = {}): WorkflowStep {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("workflow_step"),
    workflowId: partial.workflowId ?? createId("workflow"),
    name: partial.name ?? "Fetch CRM context",
    action: partial.action ?? "crm.fetch_context",
    dependsOnStepIds: partial.dependsOnStepIds ?? [],
    timeoutMs: partial.timeoutMs,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a workflow aggregate. */
export function createWorkflow(partial: Partial<Workflow> = {}): Workflow {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("workflow"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    name: partial.name ?? "Opportunity Qualification Workflow",
    description: partial.description ?? "Qualifies opportunities and routes executive recommendations.",
    stepIds: partial.stepIds ?? [],
    status: partial.status ?? AutomationStatus.Enabled,
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "opportunity qualification workflow",
    searchKeywords: partial.searchKeywords ?? ["workflow", "opportunity", "qualification"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an automation aggregate. */
export function createAutomation(partial: Partial<Automation> = {}): Automation {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("automation"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    name: partial.name ?? "Priority Escalation Automation",
    description: partial.description ?? "Escalates high-risk accounts to executive review.",
    workflowId: partial.workflowId ?? createId("workflow"),
    trigger: partial.trigger ?? "risk.score_above_threshold",
    status: partial.status ?? AutomationStatus.Enabled,
    agentId: partial.agentId,
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "priority escalation automation",
    searchKeywords: partial.searchKeywords ?? ["automation", "priority", "risk"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an automation execution instance. */
export function createAutomationExecution(partial: Partial<AutomationExecution> = {}): AutomationExecution {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("automation_execution"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    automationId: partial.automationId ?? createId("automation"),
    workflowId: partial.workflowId ?? createId("workflow"),
    status: partial.status ?? RuntimeStatus.Running,
    startedAt: partial.startedAt ?? now,
    completedAt: partial.completedAt,
    logs: partial.logs ?? ["Execution started"],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
