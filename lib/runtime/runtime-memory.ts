import type { ExecutiveBriefing } from "@/types"
import type { RuntimeRequestOptions } from "./runtime-client"
import { fetchRuntimeTimeline, mapRuntimeEventToMemoryUpdate } from "./runtime-events"
import type { RuntimeBusinessMetrics } from "./runtime-types"

export async function fetchRuntimeMemoryUpdates(
  limit = 24,
  options: RuntimeRequestOptions = {},
) {
  const timeline = await fetchRuntimeTimeline(options)
  return timeline.slice(0, limit).map(mapRuntimeEventToMemoryUpdate)
}

export async function fetchRuntimeBusinessMetrics(
  options: RuntimeRequestOptions = {},
): Promise<RuntimeBusinessMetrics> {
  const kpis: RuntimeBusinessMetrics["kpis"] = []
  const insightCount = 0

  const timeline = await fetchRuntimeTimeline(options)
  const executionCount = timeline.filter((item) => item.type === "EXECUTION_COMPLETE" || item.type === "EXECUTION_ERROR").length
  const errorCount = timeline.filter((item) => item.type === "EXECUTION_ERROR").length
  kpis.push(
    { id: "runtime-events", label: "Runtime Events", value: String(timeline.length), delta: `${timeline.length > 0 ? "+" : ""}${timeline.length}`, trend: "up" },
    { id: "runtime-executions", label: "Execution Summaries", value: String(executionCount), delta: `${executionCount > 0 ? "+" : ""}${executionCount}`, trend: executionCount > 0 ? "up" : "flat" },
    { id: "runtime-errors", label: "Execution Errors", value: String(errorCount), delta: errorCount > 0 ? `+${errorCount}` : "0", trend: errorCount > 0 ? "down" : "flat" }
  )
  const briefing: ExecutiveBriefing = {
    headline: `${timeline.length} backend runtime event${timeline.length === 1 ? "" : "s"} loaded from AIOS replay.`,
    overview: "The runtime backend is now feeding UI state directly from persisted events.",
    highlights: [
      `${executionCount} execution summaries detected`,
      `${errorCount} execution errors tracked`,
      "Replay and timeline data are sourced from the backend store",
    ],
  }

  return {
    kpis,
    briefing,
    activityCount: kpis.reduce((sum, item) => sum + (Number.parseInt(item.value.replace(/\D/g, ""), 10) || 0), 0),
    insightCount,
    memoryCount: 0,
    workflowCount: 0,
    agentCount: 0,
  }
}
