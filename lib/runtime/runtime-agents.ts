import type { ExecutionQueueItem, LiveAgent } from "@/types"
import { createInitialAgents, createInitialExecutions } from "@/utils/runtime-live"
import type { RuntimeBackendEvent } from "./runtime-types"

function normalizeModuleName(event: RuntimeBackendEvent): string {
  const moduleName = typeof event.payload.module === "string" ? event.payload.module : event.contextId
  return moduleName.toLowerCase()
}

function titleCase(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (item) => item.toUpperCase())
}

function findAgentName(moduleName: string): string {
  if (moduleName.includes("memory")) {
    return "Memory Agent"
  }

  if (moduleName.includes("workflow")) {
    return "Workflow Agent"
  }

  if (moduleName.includes("orchestrator")) {
    return "Planner Agent"
  }

  if (moduleName.includes("executive")) {
    return "Executive Agent"
  }

  if (moduleName.includes("knowledge")) {
    return "Knowledge Agent"
  }

  if (moduleName.includes("sales")) {
    return "Sales Agent"
  }

  return `${titleCase(moduleName)} Agent`
}

function statusFromEvent(event: RuntimeBackendEvent): LiveAgent["status"] {
  if (event.type === "EXECUTION_ERROR") {
    return "failed"
  }

  if (event.type === "EXECUTION_COMPLETE") {
    return "complete"
  }

  return event.type === "STATE_TRANSITION" ? "idle" : "running"
}

export function deriveRuntimeAgents(events: RuntimeBackendEvent[]): LiveAgent[] {
  if (events.length === 0) {
    return createInitialAgents()
  }

  const fallback = createInitialAgents()
  const grouped = new Map<string, RuntimeBackendEvent[]>()

  for (const event of events) {
    const key = normalizeModuleName(event)
    const current = grouped.get(key) ?? []
    current.push(event)
    grouped.set(key, current)
  }

  return fallback.map((agent, index) => {
    const moduleKey = Array.from(grouped.keys())[index] ?? agent.name.toLowerCase().replace(/\s+/g, "-")
    const agentEvents = grouped.get(moduleKey) ?? []
    const latest = agentEvents[agentEvents.length - 1]
    if (!latest) {
      return agent
    }

    const completed = agentEvents.filter((item) => item.type === "EXECUTION_COMPLETE").length
    const failed = agentEvents.filter((item) => item.type === "EXECUTION_ERROR").length
    const active = agentEvents.filter((item) => item.type === "EXECUTION_START" || item.type === "EXECUTION_STEP").length

    return {
      ...agent,
      name: findAgentName(moduleKey),
      status: statusFromEvent(latest),
      currentTask:
        latest.type === "EXECUTION_COMPLETE"
          ? typeof latest.payload.resultSummary === "string"
            ? latest.payload.resultSummary
            : "Execution completed"
          : latest.type === "EXECUTION_ERROR"
            ? typeof latest.payload.errorMessage === "string"
              ? latest.payload.errorMessage
              : "Execution failed"
            : typeof latest.payload.label === "string"
              ? latest.payload.label
              : agent.currentTask,
      confidence: Math.max(70, Math.min(99, agent.confidence + completed - failed + active)),
      reasoningStage:
        latest.type === "EXECUTION_START"
          ? "Runtime ingest"
          : latest.type === "EXECUTION_STEP"
            ? "Reasoning"
            : latest.type === "EXECUTION_COMPLETE"
              ? "Completed"
              : latest.type === "EXECUTION_ERROR"
                ? "Recovery"
                : "State transition",
      progress: latest.type === "EXECUTION_COMPLETE" ? 100 : Math.min(100, agent.progress + active * 8),
      etaSeconds:
        latest.type === "EXECUTION_COMPLETE"
          ? 0
          : Math.max(30, agent.etaSeconds - active * 20),
      recentActions: Array.from(new Set([latest.type, ...agent.recentActions])).slice(0, 4),
    }
  })
}

function executionStatusFromEvents(events: RuntimeBackendEvent[]): ExecutionQueueItem["status"] {
  if (events.some((event) => event.type === "EXECUTION_ERROR")) {
    return "failed"
  }

  if (events.some((event) => event.type === "EXECUTION_COMPLETE")) {
    return "completed"
  }

  if (events.some((event) => event.type === "EXECUTION_STEP")) {
    return "running"
  }

  if (events.some((event) => event.type === "STATE_TRANSITION")) {
    return "waiting"
  }

  return "queued"
}

export function deriveExecutionQueue(events: RuntimeBackendEvent[]): ExecutionQueueItem[] {
  if (events.length === 0) {
    return createInitialExecutions()
  }

  const fallback = createInitialExecutions()
  const grouped = new Map<string, RuntimeBackendEvent[]>()

  for (const event of events) {
    const key = normalizeModuleName(event)
    const current = grouped.get(key) ?? []
    current.push(event)
    grouped.set(key, current)
  }

  return fallback.map((item, index) => {
    const key = Array.from(grouped.keys())[index] ?? item.label.toLowerCase().replace(/\s+/g, "-")
    const groupedEvents = grouped.get(key) ?? []
    const latest = groupedEvents[groupedEvents.length - 1]
    if (!latest) {
      return item
    }

    return {
      ...item,
      label:
        typeof latest.payload.module === "string"
          ? titleCase(latest.payload.module)
          : latest.type === "EXECUTION_COMPLETE"
            ? item.label
            : item.label,
      status: executionStatusFromEvents(groupedEvents),
      updatedAt: latest.timestamp,
    }
  })
}
