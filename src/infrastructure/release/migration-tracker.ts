import type { DeploymentEnvironment, MigrationRecord } from "@/src/infrastructure/types"

export class MigrationTracker {
  private readonly migrations = new Map<string, MigrationRecord>()

  record(migration: MigrationRecord): void {
    this.migrations.set(migration.id, migration)
  }

  list(environment?: DeploymentEnvironment): MigrationRecord[] {
    const all = Array.from(this.migrations.values())
    return environment ? all.filter((migration) => migration.environment === environment) : all
  }

  latest(environment: DeploymentEnvironment): MigrationRecord | undefined {
    return this.list(environment).at(-1)
  }
}
