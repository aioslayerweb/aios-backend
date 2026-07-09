import type { APIVersion, SDKModuleName, StablePublicAPI } from "@/src/sdk/types"

export class PublicAPIRegistry {
  private readonly apis = new Map<string, StablePublicAPI>()

  register(api: StablePublicAPI): void {
    this.apis.set(api.id, api)
  }

  list(module?: SDKModuleName): StablePublicAPI[] {
    const all = Array.from(this.apis.values())
    return module ? all.filter((api) => api.module === module) : all
  }

  listActive(module?: SDKModuleName): StablePublicAPI[] {
    return this.list(module).filter((api) => !api.deprecated)
  }

  deprecate(id: string): StablePublicAPI | undefined {
    const existing = this.apis.get(id)
    if (!existing) {
      return undefined
    }
    const deprecated = { ...existing, deprecated: true }
    this.apis.set(id, deprecated)
    return deprecated
  }

  bumpVersion(id: string, version: APIVersion): StablePublicAPI | undefined {
    const existing = this.apis.get(id)
    if (!existing) {
      return undefined
    }
    const updated = { ...existing, version }
    this.apis.set(id, updated)
    return updated
  }
}
