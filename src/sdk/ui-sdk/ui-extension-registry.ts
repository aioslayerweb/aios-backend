import type { UIExtensionDefinition, UIExtensionTarget } from "@/src/sdk/types"

export class UIExtensionRegistry {
  private readonly extensions = new Map<string, UIExtensionDefinition>()

  register(definition: UIExtensionDefinition): void {
    this.extensions.set(definition.id, definition)
  }

  list(target?: UIExtensionTarget): UIExtensionDefinition[] {
    const all = Array.from(this.extensions.values())
    return target ? all.filter((extension) => extension.target === target) : all
  }

  listEnabled(): UIExtensionDefinition[] {
    return this.list().filter((extension) => extension.enabled)
  }
}
