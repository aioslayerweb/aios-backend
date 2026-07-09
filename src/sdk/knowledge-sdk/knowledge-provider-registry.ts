import type { KnowledgeProviderDefinition } from "@/src/sdk/types"

export class KnowledgeProviderRegistry {
  private readonly providers = new Map<string, KnowledgeProviderDefinition>()

  register(definition: KnowledgeProviderDefinition): void {
    this.providers.set(definition.id, definition)
  }

  list(): KnowledgeProviderDefinition[] {
    return Array.from(this.providers.values())
  }
}
