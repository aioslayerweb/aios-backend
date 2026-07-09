import type { ExtensionContribution, ExtensionPoint } from "@/src/sdk/types"

export class ExtensionRegistry {
  private readonly extensions = new Map<string, ExtensionContribution>()

  register(extension: ExtensionContribution): void {
    this.extensions.set(extension.id, extension)
  }

  list(point?: ExtensionPoint): ExtensionContribution[] {
    const all = Array.from(this.extensions.values())
    return point ? all.filter((extension) => extension.point === point) : all
  }

  listByPlugin(pluginId: string): ExtensionContribution[] {
    return this.list().filter((extension) => extension.pluginId === pluginId)
  }

  enable(id: string, enabled: boolean): ExtensionContribution | undefined {
    const existing = this.extensions.get(id)
    if (!existing) {
      return undefined
    }
    const updated = { ...existing, enabled }
    this.extensions.set(id, updated)
    return updated
  }
}
