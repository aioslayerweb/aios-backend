import type { BackupRecord, BackupType, DeploymentEnvironment } from "@/src/infrastructure/types"

export class BackupCatalog {
  private readonly backups = new Map<string, BackupRecord>()

  register(backup: BackupRecord): void {
    this.backups.set(backup.id, backup)
  }

  verify(backupId: string): BackupRecord | undefined {
    const backup = this.backups.get(backupId)
    if (!backup) {
      return undefined
    }
    const verified = { ...backup, verified: true }
    this.backups.set(backupId, verified)
    return verified
  }

  list(environment?: DeploymentEnvironment, type?: BackupType): BackupRecord[] {
    return Array.from(this.backups.values()).filter((backup) => {
      if (environment && backup.environment !== environment) {
        return false
      }
      if (type && backup.type !== type) {
        return false
      }
      return true
    })
  }
}
