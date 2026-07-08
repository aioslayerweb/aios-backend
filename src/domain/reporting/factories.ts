import { Priority, Status } from "@/src/domain/common/enums"
import type { Dashboard, KPI, Report } from "@/src/domain/reporting/types"
import { createId } from "@/src/domain/utils/id"

/** Creates a KPI entity. */
export function createKPI(partial: Partial<KPI> = {}): KPI {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("kpi"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    name: partial.name ?? "Net Revenue Retention",
    value: partial.value ?? 112,
    target: partial.target ?? 115,
    trend: partial.trend ?? { value: 3.4 },
    period:
      partial.period ?? {
        startAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endAt: now,
      },
    searchText: partial.searchText ?? "net revenue retention",
    searchKeywords: partial.searchKeywords ?? ["nrr", "retention", "kpi"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a report aggregate. */
export function createReport(partial: Partial<Report> = {}): Report {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("report"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    title: partial.title ?? "Executive Weekly Operating Brief",
    summary: partial.summary ?? "Revenue strength remains high with churn risk concentrated in two accounts.",
    status: partial.status ?? Status.Active,
    priority: partial.priority ?? Priority.High,
    kpiIds: partial.kpiIds ?? [],
    publishedAt: partial.publishedAt,
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "executive weekly operating brief",
    searchKeywords: partial.searchKeywords ?? ["report", "executive", "weekly"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a dashboard entity. */
export function createDashboard(partial: Partial<Dashboard> = {}): Dashboard {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("dashboard"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    name: partial.name ?? "Executive Control Tower",
    description: partial.description ?? "High-level strategic dashboard for enterprise operations.",
    reportIds: partial.reportIds ?? [],
    status: partial.status ?? Status.Active,
    searchText: partial.searchText ?? "executive control tower",
    searchKeywords: partial.searchKeywords ?? ["dashboard", "executive", "control"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
