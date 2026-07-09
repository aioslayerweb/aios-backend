import type { DeploymentEnvironment, SecretReference } from "@/src/infrastructure/types"

export class SecretCatalog {
  private readonly secrets = new Map<string, SecretReference>()

  register(reference: SecretReference): void {
    this.secrets.set(this.composeKey(reference.environment, reference.id), reference)
  }

  rotate(environment: DeploymentEnvironment, id: string): SecretReference | undefined {
    const key = this.composeKey(environment, id)
    const secret = this.secrets.get(key)
    if (!secret) {
      return undefined
    }
    const rotated: SecretReference = {
      ...secret,
      rotatedAt: new Date().toISOString(),
    }
    this.secrets.set(key, rotated)
    return rotated
  }

  list(environment?: DeploymentEnvironment): SecretReference[] {
    const all = Array.from(this.secrets.values())
    return environment ? all.filter((secret) => secret.environment === environment) : all
  }

  private composeKey(environment: DeploymentEnvironment, id: string): string {
    return `${environment}:${id}`
  }
}
