import type { Dashboard, KPI, Report } from "@/src/domain/reporting/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for KPI entities. */
export function isKPI(value: unknown): value is KPI {
  return isRecord(value) && typeof value.id === "string" && typeof value.value === "number"
}

/** Type guard for Report entities. */
export function isReport(value: unknown): value is Report {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.kpiIds)
}

/** Type guard for Dashboard entities. */
export function isDashboard(value: unknown): value is Dashboard {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.reportIds)
}
