import type { InfrastructureAdapter, InfrastructureAdapterKind } from "@/src/infrastructure/types"

export class InfrastructureAdapterRegistry {
  private readonly adapters = new Map<string, InfrastructureAdapter>()

  register(adapter: InfrastructureAdapter): void {
    this.adapters.set(adapter.id, adapter)
  }

  list(kind?: InfrastructureAdapterKind): InfrastructureAdapter[] {
    const all = Array.from(this.adapters.values())
    return kind ? all.filter((adapter) => adapter.kind === kind) : all
  }

  enable(id: string, enabled: boolean): InfrastructureAdapter | undefined {
    const adapter = this.adapters.get(id)
    if (!adapter) {
      return undefined
    }
    const next = { ...adapter, enabled }
    this.adapters.set(id, next)
    return next
  }
}
