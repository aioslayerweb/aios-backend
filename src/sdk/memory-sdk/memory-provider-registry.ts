import type { MemoryProviderDefinition } from "@/src/sdk/types"

export class MemoryProviderRegistry {
  private readonly providers = new Map<string, MemoryProviderDefinition>()

  register(definition: MemoryProviderDefinition): void {
    this.providers.set(definition.id, definition)
  }

  list(): MemoryProviderDefinition[] {
    return Array.from(this.providers.values())
  }
}
