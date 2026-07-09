"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useReleaseManagement() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    releases: state.releases,
    migrations: state.migrations,
    listReleases: platform.release.list.bind(platform.release),
    rollbackRelease: platform.release.rollback.bind(platform.release),
    listMigrations: platform.migration.list.bind(platform.migration),
    refresh,
  }
}
