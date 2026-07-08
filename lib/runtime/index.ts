import type { ActivityItem, ExecutiveTimelineItem, RuntimeLiveState } from "@/types"
import { createInitialMemoryUpdates } from "@/utils/runtime-live"
import { fetchRuntimeMemoryUpdates, fetchRuntimeBusinessMetrics } from "./runtime-memory"
import { fetchRuntimeEvents, fetchRuntimeTimeline, mapRuntimeEventToActivity, mapRuntimeEventToMemoryUpdate, mapRuntimeEventToRuntimeEvent } from "./runtime-events"
import { deriveRuntimeAgents, deriveExecutionQueue } from "./runtime-agents"
import { deriveRuntimeHealth } from "./runtime-health"
import { deriveWorkflowCounts } from "./runtime-workflows"
import type { RuntimeBackendEvent, RuntimeLiveSnapshot, RuntimeSource } from "./runtime-types"
import { fetchRuntimeReplay, fetchRuntimeDebug } from "./runtime-replay"

function buildExecutiveTimeline(events: RuntimeBackendEvent[]): ExecutiveTimelineItem[] {
  return events.slice(0, 8).map((event, index) => ({
    id: `${event.contextId}-${event.id}-${index}`,
    time: new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    title: typeof event.payload.label === "string" ? String(event.payload.label) : `Runtime event ${index + 1}`,
    kind:
      event.type === "EXECUTION_ERROR"
        ? "ai"
        : event.type === "EXECUTION_COMPLETE"
          ? "automation"
          : event.type === "EXECUTION_START"
            ? "task"
            : event.type === "STATE_TRANSITION"
              ? "approval"
              : "communication",
    owner: typeof event.payload.module === "string" ? String(event.payload.module) : event.contextId,
    status:
      event.type === "EXECUTION_COMPLETE"
        ? "completed"
        : event.type === "EXECUTION_START"
          ? "active"
          : "upcoming",
  }))
}

export async function loadRuntimeLiveSnapshot(): Promise<RuntimeLiveSnapshot> {
  const [timelineEvents, rawEvents, memoryUpdates, businessMetrics] = await Promise.all([
    fetchRuntimeTimeline(),
    fetchRuntimeEvents(),
    fetchRuntimeMemoryUpdates(),
    fetchRuntimeBusinessMetrics(),
  ])

  const source: RuntimeSource =
    timelineEvents.length > 0 || rawEvents.length > 0
      ? "backend"
      : memoryUpdates.length > 0
        ? "supabase"
        : "fallback"

  const normalizedEvents = (timelineEvents.length > 0 ? timelineEvents : rawEvents).map(mapRuntimeEventToRuntimeEvent)
  const backendEvents = timelineEvents.length > 0 ? timelineEvents : rawEvents
  const agents = deriveRuntimeAgents(backendEvents)
  const executions = deriveExecutionQueue(backendEvents)
  const fallbackMemory = createInitialMemoryUpdates()
  const normalizedMemory = memoryUpdates.length > 0 ? memoryUpdates : fallbackMemory
  const runningAgents = agents.filter((agent) => agent.status === "running").length
  const pendingTasks = executions.filter((execution) => execution.status === "queued" || execution.status === "waiting" || execution.status === "retrying").length
  const queueDepth = backendEvents.length
  const health = deriveRuntimeHealth(backendEvents, normalizedMemory.length, runningAgents, pendingTasks)
  const activities: ActivityItem[] = backendEvents.slice(0, 24).map(mapRuntimeEventToActivity)
  const workflowCounts = deriveWorkflowCounts(backendEvents)

  return {
    source,
    fetchedAt: Date.now(),
    events: normalizedEvents,
    rawEvents: backendEvents,
    agents,
    executions,
    memoryUpdates: normalizedMemory,
    health,
    runningAgents,
    pendingTasks,
    queueDepth,
    activities,
    businessMetrics: {
      ...businessMetrics,
      workflowCount: workflowCounts.running + workflowCounts.completed + workflowCounts.paused + workflowCounts.queued,
      agentCount: runningAgents,
      memoryCount: normalizedMemory.length,
    },
    timeline: buildExecutiveTimeline(backendEvents),
  }
}

export async function loadRuntimeReplayContext(contextId: string): Promise<RuntimeBackendEvent[]> {
  const events = await fetchRuntimeReplay(contextId)
  if (events.length > 0) {
    return events
  }

  return fetchRuntimeTimeline()
}

export { fetchRuntimeDebug }
export { fetchRuntimeBusinessMetrics, fetchRuntimeMemoryUpdates }
export { mapRuntimeEventToActivity, mapRuntimeEventToMemoryUpdate, mapRuntimeEventToRuntimeEvent }
export type { RuntimeLiveState }
