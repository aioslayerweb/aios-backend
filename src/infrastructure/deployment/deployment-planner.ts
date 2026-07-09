import type { DeploymentEnvironment, DeploymentTarget, DeploymentTopology } from "@/src/infrastructure/types"

export class DeploymentPlanner {
  private readonly targets = new Map<string, DeploymentTarget>()

  registerTarget(target: DeploymentTarget): void {
    this.targets.set(target.id, target)
  }

  listTargets(environment?: DeploymentEnvironment): DeploymentTarget[] {
    const allTargets = Array.from(this.targets.values())
    return environment ? allTargets.filter((target) => target.environment === environment) : allTargets
  }

  listByTopology(topology: DeploymentTopology): DeploymentTarget[] {
    return Array.from(this.targets.values()).filter((target) => target.topology === topology)
  }

  activateTarget(id: string, active: boolean): DeploymentTarget | undefined {
    const target = this.targets.get(id)
    if (!target) {
      return undefined
    }
    const updated = { ...target, active }
    this.targets.set(id, updated)
    return updated
  }
}
