import type { RuntimeResourceSnapshot, RuntimeScalabilityProfile } from "@/src/runtime/types"

export class PerformanceMonitor {
  private readonly resources: RuntimeResourceSnapshot[] = []
  private readonly profiles = new Map<string, RuntimeScalabilityProfile>()

  recordResource(snapshot: RuntimeResourceSnapshot): void {
    this.resources.push(snapshot)
  }

  updateScalabilityProfile(profile: RuntimeScalabilityProfile): void {
    this.profiles.set(profile.tenantId, profile)
  }

  latestResources(tenantId: string, limit = 200): RuntimeResourceSnapshot[] {
    return this.resources.filter((snapshot) => snapshot.tenantId === tenantId).slice(-Math.max(1, limit))
  }

  getProfile(tenantId: string): RuntimeScalabilityProfile | undefined {
    return this.profiles.get(tenantId)
  }

  listProfiles(): RuntimeScalabilityProfile[] {
    return Array.from(this.profiles.values())
  }
}
