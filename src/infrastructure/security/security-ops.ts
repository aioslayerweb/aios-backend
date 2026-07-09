import type { DeploymentEnvironment, SecurityOperationRecord, SecurityOperationType } from "@/src/infrastructure/types"

export class SecurityOpsCenter {
  private readonly operations = new Map<string, SecurityOperationRecord>()

  record(operation: SecurityOperationRecord): void {
    this.operations.set(operation.id, operation)
  }

  list(environment?: DeploymentEnvironment): SecurityOperationRecord[] {
    const all = Array.from(this.operations.values())
    return environment ? all.filter((operation) => operation.environment === environment) : all
  }

  latestByType(type: SecurityOperationType, environment?: DeploymentEnvironment): SecurityOperationRecord | undefined {
    const filtered = this.list(environment).filter((operation) => operation.type === type)
    return filtered.at(-1)
  }
}
