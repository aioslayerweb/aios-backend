import { AgentType, Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { AgentCapabilityId, AgentId, CompanyId, DepartmentId, GoalId, PersonId, TeamId, UserId, WorkflowId, WorkspaceId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Agent extends Entity<AgentId>, TimestampedEntity, VersionedEntity, OwnedEntity<UserId>, AuditableEntity {
  readonly name: string
  readonly description: string
  readonly companyId: CompanyId
  readonly workspaceId?: WorkspaceId
  readonly ownerId: UserId
  readonly type: AgentType
  readonly departmentId?: DepartmentId
  readonly teamId?: TeamId
  readonly leadPersonId?: PersonId
  readonly capabilityIds: ReadonlyArray<AgentCapabilityId>
  readonly goalIds: ReadonlyArray<GoalId>
  readonly workflowIds: ReadonlyArray<WorkflowId>
  readonly status: Status
  readonly metadata: DomainMetadata
}

export function createAgent(partial: Partial<Agent> = {}): Agent {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("agent"),
    name: partial.name ?? "Strategy Agent",
    description: partial.description ?? "Interprets business signals and recommends next actions.",
    companyId: partial.companyId ?? createId("company"),
    workspaceId: partial.workspaceId,
    ownerId: partial.ownerId ?? createId("user"),
    type: partial.type ?? AgentType.Analyzer,
    departmentId: partial.departmentId,
    teamId: partial.teamId,
    leadPersonId: partial.leadPersonId,
    capabilityIds: partial.capabilityIds ?? [],
    goalIds: partial.goalIds ?? [],
    workflowIds: partial.workflowIds ?? [],
    status: partial.status ?? Status.Active,
    metadata: partial.metadata ?? { namespace: "agent", displayName: "Agent", description: "An autonomous platform participant.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isAgent(value: unknown): value is Agent {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).type === "string"
}
