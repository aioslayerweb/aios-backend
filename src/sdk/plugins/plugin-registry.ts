import type { PluginManifest, PluginScope } from "@/src/sdk/types"

export class PluginRegistry {
  private readonly plugins = new Map<string, PluginManifest>()

  register(manifest: PluginManifest): void {
    this.plugins.set(manifest.id, manifest)
  }

  list(scope?: PluginScope): PluginManifest[] {
    const all = Array.from(this.plugins.values())
    return scope ? all.filter((plugin) => plugin.scopes.includes(scope)) : all
  }

  findById(id: string): PluginManifest | undefined {
    return this.plugins.get(id)
  }

  listSignedOnly(): PluginManifest[] {
    return this.list().filter((plugin) => plugin.signed)
  }
}
