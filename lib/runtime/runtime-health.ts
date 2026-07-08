import type { RuntimeHealth } from "@/types"
import { createInitialHealth } from "@/utils/runtime-live"
import type { RuntimeBackendEvent } from "./runtime-types"

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function deriveRuntimeHealth(events: RuntimeBackendEvent[], memoryCount: number, runningAgents: number, pendingTasks: number): RuntimeHealth {
  const base = createInitialHealth()
  const errorCount = events.filter((event) => event.type === "EXECUTION_ERROR").length
  const completionCount = events.filter((event) => event.type === "EXECUTION_COMPLETE").length
  const stepCount = events.filter((event) => event.type === "EXECUTION_STEP").length

  return {
    cpu: clamp(base.cpu + runningAgents * 2 - errorCount, 18, 92),
    memory: clamp(base.memory + memoryCount * 2, 22, 96),
    aiConfidence: clamp(base.aiConfidence + completionCount - errorCount, 70, 99),
    executionSpeed: clamp(base.executionSpeed + completionCount * 2 - errorCount * 3, 60, 99),
    queueHealth: clamp(base.queueHealth + stepCount - pendingTasks, 50, 99),
    database: clamp(base.database - errorCount + completionCount, 70, 99),
    supabase: clamp(base.supabase - errorCount + memoryCount, 68, 99),
    vectorSearch: clamp(base.vectorSearch + memoryCount, 65, 99),
    knowledgeIndex: clamp(base.knowledgeIndex + memoryCount, 60, 99),
    connection: clamp(base.connection - errorCount * 2 + completionCount, 70, 99),
    latencyMs: clamp(base.latencyMs - completionCount * 4 + errorCount * 10, 70, 480),
  }
}
