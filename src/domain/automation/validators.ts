import type { Automation, AutomationExecution, Workflow, WorkflowStep } from "@/src/domain/automation/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for WorkflowStep entities. */
export function isWorkflowStep(value: unknown): value is WorkflowStep {
  return isRecord(value) && typeof value.id === "string" && typeof value.action === "string"
}

/** Type guard for Workflow entities. */
export function isWorkflow(value: unknown): value is Workflow {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.stepIds)
}

/** Type guard for Automation entities. */
export function isAutomation(value: unknown): value is Automation {
  return isRecord(value) && typeof value.id === "string" && typeof value.trigger === "string"
}

/** Type guard for AutomationExecution entities. */
export function isAutomationExecution(value: unknown): value is AutomationExecution {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.logs)
}
