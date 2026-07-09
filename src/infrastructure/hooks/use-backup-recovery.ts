"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useBackupRecovery() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    backups: state.backups,
    recoveryProcedures: state.recoveryProcedures,
    listBackups: platform.backup.list.bind(platform.backup),
    verifyBackup: platform.backup.verify.bind(platform.backup),
    listRecoveryProcedures: platform.recovery.list.bind(platform.recovery),
    refresh,
  }
}
