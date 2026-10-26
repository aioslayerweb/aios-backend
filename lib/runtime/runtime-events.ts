import type {
  ActivityActor,
  ActivityItem,
  ActivityMetadata,
  ActivityPriority,
  RuntimeEvent,
  MemoryUpdate,
} from "@/types"
import { runtimeFetchJson, type RuntimeRequestOptions } from "./runtime-client"
import type {
  RuntimeBackendEvent,
  RuntimeDebugResponse,
  RuntimeEventResponse,
  RuntimeReplayResponse,
  RuntimeTimelineResponse,
} from "./runtime-types"

function payloadText(payload: Record<string, unknown>, keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = payload[key]
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }

  return fallback
}

function moduleLabel(event: RuntimeBackendEvent): string {
  const moduleName = typeof event.payload.module === "string" ? event.payload.module : event.contextId
  return moduleName
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (value) => value.toUpperCase())
}

function inferActivityCategory(event: RuntimeBackendEvent): ActivityItem["category"] {
  const moduleName = typeof event.payload.module === "string" ? event.payload.module.toLowerCase() : event.contextId.toLowerCase()

  if (moduleName.includes("memory")) {
    return "memory"
  }

  if (moduleName.includes("workflow") || moduleName.includes("automation")) {
    return "automations"
  }

  if (moduleName.includes("agent")) {
    return "agents"
  }

  if (moduleName.includes("knowledge")) {
    return "knowledge"
  }

  return "ai-runtime"
}

function inferSource(category: ActivityItem["category"], moduleName: string): ActivityItem["source"] {
  if (category === "memory") {
    return { key: "memory", label: moduleName, workspace: "Knowledge" }
  }

  if (category === "agents") {
    return { key: "agents", label: moduleName, workspace: "Orchestrator" }
  }

  if (category === "automations") {
    return { key: "automations", label: moduleName, workspace: "Workflows" }
  }

  if (category === "knowledge") {
    return { key: "knowledge", label: moduleName, workspace: "Knowledge" }
  }

  return { key: "ai-runtime", label: moduleName, workspace: "Executive" }
}

function inferMetadata(event: RuntimeBackendEvent, title: string, status: ActivityMetadata["status"]): ActivityMetadata {
  const category = inferActivityCategory(event)
  const moduleName = moduleLabel(event)
  return {
    eventType:
      event.type === "EXECUTION_ERROR"
        ? "Error"
        : event.type === "EXECUTION_COMPLETE"
          ? "Automation Executed"
          : event.type === "EXECUTION_START"
            ? "Agent Started"
            : event.type === "EXECUTION_STEP"
              ? "Task Created"
              : "Priority Changed",
    workspace:
      category === "memory"
        ? "Knowledge"
        : category === "agents"
          ? "Orchestrator"
          : category === "automations"
            ? "Workflows"
            : "Executive",
    status,
    relatedObjects: [{ type: "runtime-event", id: event.id, label: title }],
    tags: [event.type.toLowerCase(), category, moduleName.toLowerCase()],
    details: typeof event.payload.reason === "string" ? event.payload.reason : undefined,
    replayToken: event.contextId,
  }
}

function inferPriority(event: RuntimeBackendEvent): ActivityPriority {
  if (event.type === "EXECUTION_ERROR") {
    return "critical"
  }

  if (event.type === "EXECUTION_COMPLETE") {
    return "medium"
  }

  return event.type === "STATE_TRANSITION" ? "high" : "medium"
}

export function mapRuntimeEventToActivity(event: RuntimeBackendEvent): ActivityItem {
  const category = inferActivityCategory(event)
  const title =
    event.type === "EXECUTION_START"
      ? `${moduleLabel(event)} execution started`
      : event.type === "EXECUTION_STEP"
        ? `${payloadText(event.payload, ["label", "stepId"], "Execution step")}`
        : event.type === "EXECUTION_COMPLETE"
          ? `${moduleLabel(event)} execution completed`
          : event.type === "EXECUTION_ERROR"
            ? `${moduleLabel(event)} execution failed`
            : `${moduleLabel(event)} state transition`

  const summary =
    event.type === "EXECUTION_START"
      ? `Execution started in ${payloadText(event.payload, ["source"], "system")}.`
      : event.type === "EXECUTION_STEP"
        ? `Step ${payloadText(event.payload, ["label"], "updated")} moved to ${payloadText(event.payload, ["status"], "running")}.`
        : event.type === "EXECUTION_COMPLETE"
          ? `Execution completed ${payloadText(event.payload, ["success"], "successfully")}.`
          : event.type === "EXECUTION_ERROR"
            ? payloadText(event.payload, ["errorMessage"], "An execution error was recorded.")
            : `${payloadText(event.payload, ["from"], "Previous state")} -> ${payloadText(event.payload, ["to"], "Next state")}`

  const status: ActivityMetadata["status"] =
    event.type === "EXECUTION_ERROR"
      ? "error"
      : event.type === "EXECUTION_COMPLETE"
        ? "completed"
        : event.type === "EXECUTION_START"
          ? "running"
          : event.type === "EXECUTION_STEP"
            ? "running"
            : "info"

  const actor: ActivityActor = {
    id: `runtime-${event.contextId}`,
    name: moduleLabel(event),
    kind: event.type === "EXECUTION_ERROR" ? "service" : "system",
  }

  return {
    id: event.id,
    title,
    summary,
    timestamp: event.timestamp,
    category,
    source: inferSource(category, moduleLabel(event)),
    actor,
    priority: inferPriority(event),
    pinned: event.type === "EXECUTION_ERROR",
    unread: true,
    metadata: inferMetadata(event, title, status),
  }
}

export function mapRuntimeEventToMemoryUpdate(event: RuntimeBackendEvent): MemoryUpdate {
  return {
    id: event.id,
    title: `${moduleLabel(event)} memory event`,
    summary:
      event.type === "EXECUTION_COMPLETE"
        ? payloadText(event.payload, ["resultSummary"], "Execution result stored.")
        : event.type === "EXECUTION_ERROR"
          ? payloadText(event.payload, ["errorMessage"], "Error stored in memory.")
          : payloadText(event.payload, ["reason", "label", "module"], "Runtime memory updated."),
    timestamp: event.timestamp,
    lane:
      event.type === "EXECUTION_ERROR"
        ? "working"
        : event.type === "EXECUTION_COMPLETE"
          ? "long-term"
          : event.type === "STATE_TRANSITION"
            ? "session"
            : "knowledge",
  }
}

export function mapRuntimeEventToRuntimeEvent(event: RuntimeBackendEvent): RuntimeEvent {
  const kind =
    event.type === "EXECUTION_START"
      ? "agent-executing"
      : event.type === "EXECUTION_STEP"
        ? "priority-changed"
        : event.type === "EXECUTION_COMPLETE"
          ? "task-completed"
          : event.type === "EXECUTION_ERROR"
            ? "execution-failed"
            : "decision-made"

  return {
    id: event.id,
    kind,
    title:
      event.type === "EXECUTION_ERROR"
        ? `Error in ${moduleLabel(event)}`
        : event.type === "EXECUTION_COMPLETE"
          ? `${moduleLabel(event)} completed`
          : `${moduleLabel(event)} updated`,
    summary:
      event.type === "EXECUTION_ERROR"
        ? payloadText(event.payload, ["errorMessage"], "An execution error was recorded.")
        : event.type === "EXECUTION_COMPLETE"
          ? payloadText(event.payload, ["resultSummary"], "Execution completed.")
          : event.type === "STATE_TRANSITION"
            ? `${payloadText(event.payload, ["from"], "Previous state")} -> ${payloadText(event.payload, ["to"], "Next state")}`
            : payloadText(event.payload, ["label", "reason", "module"], "Runtime event received."),
    timestamp: event.timestamp,
    priority:
      event.type === "EXECUTION_ERROR"
        ? "critical"
        : event.type === "EXECUTION_COMPLETE"
          ? "medium"
          : event.type === "EXECUTION_START"
            ? "medium"
            : "high",
    category: inferActivityCategory(event),
  }
}

export async function fetchRuntimeEvents(options: RuntimeRequestOptions = {}): Promise<RuntimeBackendEvent[]> {
  const response = await runtimeFetchJson<RuntimeEventResponse>("/aios/events", {
    ...options,
    retries: 1,
  })

  if (!Array.isArray(response.events)) {
    throw new Error("Runtime API returned an invalid events response.")
  }

  return response.events
}

export async function fetchRuntimeTimeline(options: RuntimeRequestOptions = {}): Promise<RuntimeBackendEvent[]> {
  const response = await runtimeFetchJson<RuntimeTimelineResponse>("/aios/timeline", {
    ...options,
    retries: 1,
  })

  if (!Array.isArray(response.timeline)) {
    throw new Error("Runtime API returned an invalid timeline response.")
  }

  return response.timeline
}

export async function fetchRuntimeReplay(contextId: string, options: RuntimeRequestOptions = {}): Promise<RuntimeBackendEvent[]> {
  const response = await runtimeFetchJson<RuntimeReplayResponse>(`/aios/replay/${encodeURIComponent(contextId)}`, {
    ...options,
    retries: 1,
  })

  if (!Array.isArray(response.timeline)) {
    throw new Error("Runtime API returned an invalid replay response.")
  }

  return response.timeline
}

export async function fetchRuntimeDebug(contextId: string, options: RuntimeRequestOptions = {}): Promise<RuntimeDebugResponse> {
  const response = await runtimeFetchJson<RuntimeDebugResponse>(`/aios/debug/${encodeURIComponent(contextId)}`, {
    ...options,
    retries: 1,
  })

  if (!Array.isArray(response.events) || typeof response.summary !== "object" || response.summary === null) {
    throw new Error("Runtime API returned an invalid debug response.")
  }

  return response
}

export function pollRuntimeTimeline(
  onUpdate: (events: RuntimeBackendEvent[]) => void,
  onError: (error: unknown) => void,
  intervalMs = 3500,
): () => void {
  let disposed = false
  const controller = new AbortController()

  const tick = async () => {
    try {
      const events = await fetchRuntimeTimeline({ signal: controller.signal })
      if (!disposed) {
        onUpdate(events)
      }
    } catch (error) {
      if (!disposed && !controller.signal.aborted) {
        onError(error)
      }
    }
  }

  void tick()
  const timer = globalThis.setInterval(() => {
    void tick()
  }, intervalMs)

  return () => {
    disposed = true
    globalThis.clearInterval(timer)
    controller.abort()
  }
}
