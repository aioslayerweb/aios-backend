import { Priority, Status } from "@/src/domain/common/enums"
import type { Document, KnowledgeArticle, KnowledgeCollection } from "@/src/domain/knowledge/types"
import { createId } from "@/src/domain/utils/id"

/** Creates a document entity. */
export function createDocument(partial: Partial<Document> = {}): Document {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("document"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    title: partial.title ?? "Executive Market Brief",
    content: partial.content ?? "Market conditions indicate strong expansion potential.",
    mimeType: partial.mimeType ?? "text/markdown",
    status: partial.status ?? Status.Active,
    searchText: partial.searchText ?? "executive market brief",
    searchKeywords: partial.searchKeywords ?? ["market", "brief", "executive"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a knowledge article entity. */
export function createKnowledgeArticle(partial: Partial<KnowledgeArticle> = {}): KnowledgeArticle {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("knowledge_article"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    collectionId: partial.collectionId,
    title: partial.title ?? "Retention Risk Signals",
    summary: partial.summary ?? "Patterns indicating renewal risk in enterprise accounts.",
    body: partial.body ?? "Signals include sentiment decline, response delays, and adoption drop.",
    priority: partial.priority ?? Priority.High,
    status: partial.status ?? Status.Active,
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "retention risk signals renewal",
    searchKeywords: partial.searchKeywords ?? ["retention", "risk", "renewal"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a knowledge collection aggregate. */
export function createKnowledgeCollection(partial: Partial<KnowledgeCollection> = {}): KnowledgeCollection {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("knowledge_collection"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    name: partial.name ?? "Revenue Intelligence",
    description: partial.description ?? "Knowledge assets for revenue decisions and execution.",
    articleIds: partial.articleIds ?? [],
    searchText: partial.searchText ?? "revenue intelligence collection",
    searchKeywords: partial.searchKeywords ?? ["revenue", "knowledge"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
