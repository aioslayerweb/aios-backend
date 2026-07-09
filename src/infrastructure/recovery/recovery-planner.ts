import type { DeploymentEnvironment, RecoveryProcedure } from "@/src/infrastructure/types"

export class RecoveryPlanner {
  private readonly procedures = new Map<string, RecoveryProcedure>()

  register(procedure: RecoveryProcedure): void {
    this.procedures.set(procedure.id, procedure)
  }

  list(environment?: DeploymentEnvironment): RecoveryProcedure[] {
    const all = Array.from(this.procedures.values())
    return environment ? all.filter((procedure) => procedure.environment === environment) : all
  }

  findById(id: string): RecoveryProcedure | undefined {
    return this.procedures.get(id)
  }
}
