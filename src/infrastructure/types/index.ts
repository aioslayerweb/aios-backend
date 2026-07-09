export type DeploymentEnvironment = "development" | "testing" | "staging" | "production"

export type DeploymentTopology =
  | "container"
  | "kubernetes"
  | "serverless"
  | "edge"
  | "hybrid"

export type DeploymentTarget = {
  id: string
  name: string
  environment: DeploymentEnvironment
  topology: DeploymentTopology
  region: string
  active: boolean
}

export type RuntimeConfiguration = {
  environment: DeploymentEnvironment
  featureFlags: Record<string, boolean>
  modelConfig: {
    routingStrategy: "latency" | "quality" | "balanced"
    defaultProvider: string
    fallbackProviders: string[]
  }
  mcpConfig: {
    gatewayEnabled: boolean
    registryEnabled: boolean
    healthCheckIntervalSec: number
  }
  workflowConfig: {
    maxConcurrentWorkflows: number
    defaultRetryCount: number
  }
  organizationConfig: {
    enforceTenantIsolation: boolean
    defaultPolicySet: string
  }
}

export type ConfigVersion = {
  version: string
  createdAt: string
  createdBy: string
  environment: DeploymentEnvironment
  notes: string
}

export type ConfigValidationResult = {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export type SecretKind =
  | "api-key"
  | "oauth-client"
  | "jwt-secret"
  | "encryption-key"
  | "database-credential"
  | "integration-secret"
  | "model-provider-key"
  | "mcp-credential"

export type SecretReference = {
  id: string
  kind: SecretKind
  name: string
  environment: DeploymentEnvironment
  rotatedAt?: string
  expiresAt?: string
}

export type CiPipelineStage =
  | "lint"
  | "typecheck"
  | "test"
  | "build"
  | "release-validation"
  | "preview-deploy"
  | "production-deploy"
  | "rollback"

export type CiPipelineDefinition = {
  id: string
  name: string
  environment: DeploymentEnvironment
  stages: CiPipelineStage[]
  requiredApprovals: number
}

export type ReleaseStrategy = "standard" | "canary" | "blue-green"

export type ReleaseRecord = {
  id: string
  version: string
  strategy: ReleaseStrategy
  environment: DeploymentEnvironment
  createdAt: string
  status: "planned" | "deployed" | "rolled-back"
  notes: string
}

export type MigrationRecord = {
  id: string
  environment: DeploymentEnvironment
  version: string
  executedAt: string
  rollbackVersion?: string
  status: "applied" | "rolled-back" | "failed"
}

export type BackupType =
  | "memory"
  | "knowledge"
  | "configuration"
  | "workflow"
  | "audit-log"
  | "database-snapshot"

export type BackupRecord = {
  id: string
  type: BackupType
  environment: DeploymentEnvironment
  createdAt: string
  checksum: string
  verified: boolean
}

export type RecoveryProcedure = {
  id: string
  environment: DeploymentEnvironment
  title: string
  steps: string[]
  verificationChecks: string[]
}

export type SecurityOperationType =
  | "dependency-audit"
  | "secret-detection"
  | "config-validation"
  | "policy-validation"
  | "vulnerability-scan"
  | "compliance-check"

export type SecurityOperationRecord = {
  id: string
  type: SecurityOperationType
  environment: DeploymentEnvironment
  executedAt: string
  status: "passed" | "warning" | "failed"
  findings: string[]
}

export type AlertSeverity = "critical" | "warning" | "info"

export type MonitoringMetric =
  | "availability"
  | "latency"
  | "error-rate"
  | "queue-health"
  | "runtime-health"
  | "database-health"
  | "mcp-connectivity"
  | "agent-health"
  | "workflow-execution"
  | "cost-model-usage"
  | "cost-infrastructure-usage"
  | "cost-storage"
  | "cost-memory"
  | "cost-database"
  | "cost-mcp-traffic"
  | "cost-workflow-execution"
  | "cost-agent-execution"

export type MonitoringPoint = {
  metric: MonitoringMetric
  environment: DeploymentEnvironment
  timestamp: string
  value: number
  unit: string
  labels?: Record<string, string>
}

export type AlertDefinition = {
  id: string
  name: string
  severity: AlertSeverity
  metric: MonitoringMetric
  threshold: string
  runbook: string
}

export type InfrastructureAdapterKind =
  | "cloud-provider"
  | "storage"
  | "messaging"
  | "caching"
  | "secrets"
  | "logging"
  | "monitoring"

export type InfrastructureAdapter = {
  id: string
  name: string
  kind: InfrastructureAdapterKind
  provider: string
  enabled: boolean
}

export type InfrastructureState = {
  deployments: DeploymentTarget[]
  runtimeConfigurations: RuntimeConfiguration[]
  configVersions: ConfigVersion[]
  secrets: SecretReference[]
  pipelines: CiPipelineDefinition[]
  releases: ReleaseRecord[]
  migrations: MigrationRecord[]
  backups: BackupRecord[]
  recoveryProcedures: RecoveryProcedure[]
  securityOperations: SecurityOperationRecord[]
  monitoring: MonitoringPoint[]
  alerts: AlertDefinition[]
  adapters: InfrastructureAdapter[]
}
