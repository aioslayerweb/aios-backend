import { Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, GoalId, PersonId, ReportId, WorkflowId, WorkspaceId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Report extends Entity<ReportId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly workspaceId?: WorkspaceId
  readonly status: Status
  readonly entityIds: ReadonlyArray<string>
  readonly goalIds: ReadonlyArray<GoalId>
  readonly workflowIds: ReadonlyArray<WorkflowId>
  readonly metadata: DomainMetadata
}

export function createReport(partial: Partial<Report> = {}): Report {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("report"),
    title: partial.title ?? "Executive report",
    summary: partial.summary ?? "A report that summarises enterprise performance.",
    companyId: partial.companyId ?? createId("company"),
    workspaceId: partial.workspaceId,
    status: partial.status ?? Status.Active,
    entityIds: partial.entityIds ?? [],
    goalIds: partial.goalIds ?? [],
    workflowIds: partial.workflowIds ?? [],
    metadata: partial.metadata ?? { namespace: "report", displayName: "Report", description: "A structured report artifact.", tags: [] },
    ownerId: partial.ownerId ?? createId("person"),
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isReport(value: unknown): value is Report {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).title === "string"
}