import type { Document, KnowledgeArticle, KnowledgeCollection } from "@/src/domain/knowledge/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for Document entities. */
export function isDocument(value: unknown): value is Document {
  return isRecord(value) && typeof value.id === "string" && typeof value.content === "string"
}

/** Type guard for KnowledgeArticle entities. */
export function isKnowledgeArticle(value: unknown): value is KnowledgeArticle {
  return isRecord(value) && typeof value.id === "string" && typeof value.summary === "string"
}

/** Type guard for KnowledgeCollection entities. */
export function isKnowledgeCollection(value: unknown): value is KnowledgeCollection {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.articleIds)
}
