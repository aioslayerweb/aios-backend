import { getBrowserSupabaseClient } from "@/lib/supabase"
import type { ExecutiveBriefing, MemoryUpdate } from "@/types"
import { fetchRuntimeTimeline, mapRuntimeEventToMemoryUpdate } from "./runtime-events"
import type { RuntimeBusinessMetrics } from "./runtime-types"

function toCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export async function fetchRuntimeMemoryUpdates(limit = 24) {
  const client = getBrowserSupabaseClient()
  if (client) {
    try {
      const { data } = await client
        .from("aios_events")
        .select("id, type, timestamp, context_id, payload, created_at")
        .order("timestamp", { ascending: false })
        .limit(limit)

      if (Array.isArray(data) && data.length > 0) {
        return data.map((row): MemoryUpdate => ({
          id: String(row.id),
          title: typeof row.type === "string" ? row.type.replace(/_/g, " ") : "Runtime memory",
          summary:
            typeof row.payload === "object" && row.payload !== null && "resultSummary" in row.payload
              ? String((row.payload as Record<string, unknown>).resultSummary ?? "")
              : typeof row.type === "string"
                ? `Stored from ${row.type.toLowerCase()}`
                : "Runtime memory updated",
          timestamp: typeof row.timestamp === "number" ? row.timestamp : Date.now(),
          lane:
            typeof row.type === "string" && row.type === "EXECUTION_COMPLETE"
              ? "long-term"
              : typeof row.type === "string" && row.type === "EXECUTION_ERROR"
                ? "working"
                : "session",
        }))
      }
    } catch {
      // Fall through to backend timeline mapping.
    }
  }

  const timeline = await fetchRuntimeTimeline()
  return timeline.slice(0, limit).map(mapRuntimeEventToMemoryUpdate)
}

export async function fetchRuntimeBusinessMetrics(): Promise<RuntimeBusinessMetrics> {
  const client = getBrowserSupabaseClient()
  const kpis: RuntimeBusinessMetrics["kpis"] = []
  let briefing: ExecutiveBriefing | null = null
  let insightCount = 0

  if (client) {
    try {
      const [{ data: kpiData }, { data: insightData }] = await Promise.all([
        client.from("kpi_metrics").select("id, metric_name, value, change_percent, period").order("created_at", { ascending: true }),
        client.from("ai_insights").select("id, title, body, action_label, action_type, priority, is_active").eq("is_active", true).order("created_at", { ascending: false }),
      ])

      if (Array.isArray(kpiData)) {
        for (const item of kpiData) {
          kpis.push({
            id: String(item.id),
            label: String(item.metric_name ?? "Metric"),
            value: typeof item.value === "number" ? toCurrency(item.value) : String(item.value ?? "0"),
            delta: typeof item.change_percent === "number" ? `${item.change_percent > 0 ? "+" : ""}${item.change_percent}%` : "0%",
            trend: typeof item.change_percent === "number" && item.change_percent < 0 ? "down" : "up",
          })
        }
      }

      if (Array.isArray(insightData)) {
        insightCount = insightData.length
        briefing = {
          headline: `${insightData.length} live insight${insightData.length === 1 ? "" : "s"} available from the backend.`,
          overview: insightData[0]?.body ? String(insightData[0].body) : "Backend intelligence is available.",
          highlights: insightData.slice(0, 3).map((item) => String(item.title)),
        }
      }
    } catch {
      // Fall back to event-derived metrics below.
    }
  }

  if (kpis.length === 0) {
    const timeline = await fetchRuntimeTimeline()
    const executionCount = timeline.filter((item) => item.type === "EXECUTION_COMPLETE" || item.type === "EXECUTION_ERROR").length
    const errorCount = timeline.filter((item) => item.type === "EXECUTION_ERROR").length
    kpis.push(
      { id: "runtime-events", label: "Runtime Events", value: String(timeline.length), delta: `${timeline.length > 0 ? "+" : ""}${timeline.length}`, trend: "up" },
      { id: "runtime-executions", label: "Execution Summaries", value: String(executionCount), delta: `${executionCount > 0 ? "+" : ""}${executionCount}`, trend: executionCount > 0 ? "up" : "flat" },
      { id: "runtime-errors", label: "Execution Errors", value: String(errorCount), delta: errorCount > 0 ? `+${errorCount}` : "0", trend: errorCount > 0 ? "down" : "flat" }
    )
    briefing = {
      headline: `${timeline.length} backend runtime event${timeline.length === 1 ? "" : "s"} loaded from AIOS replay.`,
      overview: "The runtime backend is now feeding UI state directly from persisted events.",
      highlights: [
        `${executionCount} execution summaries detected`,
        `${errorCount} execution errors tracked`,
        "Replay and timeline data are sourced from the backend store",
      ],
    }
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
