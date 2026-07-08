import type { WorkflowExecutionStep } from "@/types"
import { createInitialExecutions } from "@/utils/runtime-live"
import type { RuntimeBackendEvent } from "./runtime-types"

export type RuntimeWorkflowCounts = {
  running: number
  completed: number
  paused: number
  queued: number
}

export function deriveWorkflowCounts(events: RuntimeBackendEvent[]): RuntimeWorkflowCounts {
  const running = events.filter((event) => event.type === "EXECUTION_START" || event.type === "EXECUTION_STEP").length
  const completed = events.filter((event) => event.type === "EXECUTION_COMPLETE").length
  const paused = events.filter((event) => event.type === "STATE_TRANSITION" && typeof event.payload.to === "string" && String(event.payload.to).toLowerCase().includes("pause")).length
  const queued = Math.max(0, createInitialExecutions().length - completed)

  return {
    running,
    completed,
    paused,
    queued,
  }
}

export function deriveWorkflowExecutionSteps(events: RuntimeBackendEvent[]): WorkflowExecutionStep[] {
  const executionEvents = events.filter((event) => event.type === "EXECUTION_START" || event.type === "EXECUTION_STEP" || event.type === "EXECUTION_COMPLETE" || event.type === "EXECUTION_ERROR")

  return executionEvents.slice(0, 8).map((event, index) => ({
    id: `${event.contextId}-${event.id}-${index}`,
    nodeId: typeof event.payload.stepId === "string" ? event.payload.stepId : `runtime-step-${index}`,
    nodeTitle: typeof event.payload.label === "string" ? event.payload.label : event.contextId,
    status:
      event.type === "EXECUTION_COMPLETE"
        ? "completed"
        : event.type === "EXECUTION_ERROR"
          ? "pending"
          : "running",
    assignedAgents: [],
    estimatedSeconds: 30 + index * 12,
  }))
}
