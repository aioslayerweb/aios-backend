import type { Entity, OwnedEntity, SearchableEntity, TaggableEntity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { Priority, Status } from "@/src/domain/common/enums"
import type { DateRange, Percentage } from "@/src/domain/common/value-objects"
import type { DashboardId, KPIId, ReportId, UserId, WorkspaceId } from "@/src/domain/types/ids"

/** KPI captures measurable business performance signal. */
export interface KPI extends Entity<KPIId>, Timestamped, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly value: number
  readonly target?: number
  readonly trend?: Percentage
  readonly period: DateRange
}

/** Report summarizes business state for stakeholders. */
export interface Report
  extends Entity<ReportId>,
    Timestamped,
    OwnedEntity<UserId>,
    VersionedEntity,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly title: string
  readonly summary: string
  readonly status: Status
  readonly priority: Priority
  readonly kpiIds: ReadonlyArray<KPIId>
  readonly publishedAt?: string
}

/** Dashboard defines interactive compositions of KPIs and reports. */
export interface Dashboard extends Entity<DashboardId>, Timestamped, OwnedEntity<UserId>, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description?: string
  readonly reportIds: ReadonlyArray<ReportId>
  readonly status: Status
}
