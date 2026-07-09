import type { DeploymentEnvironment, ReleaseRecord, ReleaseStrategy } from "@/src/infrastructure/types"

export class ReleaseManager {
  private readonly releases = new Map<string, ReleaseRecord>()

  planRelease(record: ReleaseRecord): void {
    this.releases.set(record.id, record)
  }

  markDeployed(id: string): ReleaseRecord | undefined {
    const release = this.releases.get(id)
    if (!release) {
      return undefined
    }
    const deployed: ReleaseRecord = { ...release, status: "deployed" }
    this.releases.set(id, deployed)
    return deployed
  }

  rollback(id: string): ReleaseRecord | undefined {
    const release = this.releases.get(id)
    if (!release) {
      return undefined
    }
    const rolledBack: ReleaseRecord = { ...release, status: "rolled-back" }
    this.releases.set(id, rolledBack)
    return rolledBack
  }

  list(environment?: DeploymentEnvironment): ReleaseRecord[] {
    const all = Array.from(this.releases.values())
    return environment ? all.filter((release) => release.environment === environment) : all
  }

  listByStrategy(strategy: ReleaseStrategy): ReleaseRecord[] {
    return Array.from(this.releases.values()).filter((release) => release.strategy === strategy)
  }
}
