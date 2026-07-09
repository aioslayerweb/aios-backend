import type {
  ConfigValidationResult,
  ConfigVersion,
  DeploymentEnvironment,
  RuntimeConfiguration,
} from "@/src/infrastructure/types"

export class ConfigRegistry {
  private readonly runtimeConfigs = new Map<DeploymentEnvironment, RuntimeConfiguration>()
  private readonly versions: ConfigVersion[] = []

  setRuntimeConfig(config: RuntimeConfiguration): void {
    this.runtimeConfigs.set(config.environment, config)
  }

  getRuntimeConfig(environment: DeploymentEnvironment): RuntimeConfiguration | undefined {
    return this.runtimeConfigs.get(environment)
  }

  addVersion(version: ConfigVersion): void {
    this.versions.push(version)
  }

  listVersions(environment?: DeploymentEnvironment): ConfigVersion[] {
    return environment ? this.versions.filter((version) => version.environment === environment) : this.versions
  }

  validate(config: RuntimeConfiguration): ConfigValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (config.workflowConfig.maxConcurrentWorkflows <= 0) {
      errors.push("maxConcurrentWorkflows must be greater than 0")
    }
    if (config.workflowConfig.defaultRetryCount < 0) {
      errors.push("defaultRetryCount must be non-negative")
    }
    if (!config.modelConfig.defaultProvider) {
      errors.push("defaultProvider is required")
    }
    if (!config.organizationConfig.defaultPolicySet) {
      warnings.push("defaultPolicySet is empty")
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }
}
