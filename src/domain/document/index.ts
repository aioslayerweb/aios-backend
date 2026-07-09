import { Status } from "@/src/domain/common/enums"
import type { AuditableEntity, DomainMetadata, Entity, OwnedEntity, TimestampedEntity, VersionedEntity } from "@/src/domain/common/base"
import type { CompanyId, DocumentId, KnowledgeId, PersonId, ProjectId, WorkspaceId } from "@/src/domain/types/ids"
import { createId } from "@/src/domain/utils/id"

export interface Document extends Entity<DocumentId>, TimestampedEntity, VersionedEntity, OwnedEntity<PersonId>, AuditableEntity {
  readonly title: string
  readonly summary: string
  readonly companyId: CompanyId
  readonly workspaceId?: WorkspaceId
  readonly ownerId: PersonId
  readonly status: Status
  readonly projectId?: ProjectId
  readonly knowledgeId?: KnowledgeId
  readonly metadata: DomainMetadata
}

export function createDocument(partial: Partial<Document> = {}): Document {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("document"),
    title: partial.title ?? "Business document",
    summary: partial.summary ?? "A document linked to business work.",
    companyId: partial.companyId ?? createId("company"),
    workspaceId: partial.workspaceId,
    ownerId: partial.ownerId ?? createId("person"),
    status: partial.status ?? Status.Active,
    projectId: partial.projectId,
    knowledgeId: partial.knowledgeId,
    metadata: partial.metadata ?? { namespace: "document", displayName: "Document", description: "A managed document.", tags: [] },
    version: partial.version ?? 1,
    createdBy: partial.createdBy ?? createId("user"),
    updatedBy: partial.updatedBy ?? createId("user"),
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

export function isDocument(value: unknown): value is Document {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).title === "string"
}