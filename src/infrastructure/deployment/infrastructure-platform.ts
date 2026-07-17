import { BackupCatalog } from "@/src/infrastructure/backup/backup-catalog"
import { CiOrchestrator } from "@/src/infrastructure/ci/ci-orchestrator"
import { validateRelease } from "@/src/infrastructure/ci/release-validation"
import { ConfigRegistry } from "@/src/infrastructure/config/config-registry"
import { DeploymentPlanner } from "@/src/infrastructure/deployment/deployment-planner"
import { InfrastructureAdapterRegistry } from "@/src/infrastructure/deployment/infrastructure-adapter-registry"
import { CostTracker } from "@/src/infrastructure/metrics/cost-tracker"
import { MonitoringCenter } from "@/src/infrastructure/monitoring/monitoring-center"
import { RecoveryPlanner } from "@/src/infrastructure/recovery/recovery-planner"
import { ReleaseManager } from "@/src/infrastructure/release/release-manager"
import { bumpPatch } from "@/src/infrastructure/release/semver"
import { MigrationTracker } from "@/src/infrastructure/release/migration-tracker"
import { SecurityOpsCenter } from "@/src/infrastructure/security/security-ops"
import { SecretCatalog } from "@/src/infrastructure/secrets/secret-catalog"
import type {
  BackupRecord,
  CiPipelineDefinition,
  DeploymentEnvironment,
  InfrastructureState,
  MonitoringPoint,
  RuntimeConfiguration,
} from "@/src/infrastructure/types"
import { createInfrastructureId, isoNow } from "@/src/infrastructure/utils/ids"

const environments: DeploymentEnvironment[] = ["development", "testing", "staging", "production"]

export class InfrastructurePlatform {
  readonly deployment = new DeploymentPlanner()
  readonly config = new ConfigRegistry()
  readonly secrets = new SecretCatalog()
  readonly ci = new CiOrchestrator()
  readonly release = new ReleaseManager()
  readonly migration = new MigrationTracker()
  readonly backup = new BackupCatalog()
  readonly recovery = new RecoveryPlanner()
  readonly security = new SecurityOpsCenter()
  readonly monitoring = new MonitoringCenter()
  readonly costs = new CostTracker()
  readonly adapters = new InfrastructureAdapterRegistry()

  constructor() {
    this.seedEnvironments()
  }

  private seedEnvironments(): void {
    for (const environment of environments) {
      const targetBaseId = createInfrastructureId(`deploy-${environment}`)
      this.deployment.registerTarget({
        id: `${targetBaseId}-container`,
        name: `${environment}-container-cluster`,
        environment,
        topology: "container",
        region: "global",
        active: true,
      })
      this.deployment.registerTarget({
        id: `${targetBaseId}-kubernetes`,
        name: `${environment}-kubernetes-cluster`,
        environment,
        topology: "kubernetes",
        region: "global",
        active: environment !== "development",
      })
      this.deployment.registerTarget({
        id: `${targetBaseId}-serverless`,
        name: `${environment}-serverless-functions`,
        environment,
        topology: "serverless",
        region: "global",
        active: true,
      })
      this.deployment.registerTarget({
        id: `${targetBaseId}-edge`,
        name: `${environment}-edge-gateway`,
        environment,
        topology: "edge",
        region: "global",
        active: environment === "production" || environment === "staging",
      })
      this.deployment.registerTarget({
        id: `${targetBaseId}-hybrid`,
        name: `${environment}-hybrid-runtime`,
        environment,
        topology: "hybrid",
        region: "global",
        active: environment === "production",
      })

      const runtimeConfig: RuntimeConfiguration = {
        environment,
        featureFlags: {
          canaryReleaseEnabled: environment !== "development",
          blueGreenEnabled: environment === "production",
          edgeExecutionEnabled: environment === "staging" || environment === "production",
        },
        modelConfig: {
          routingStrategy: "balanced",
          defaultProvider: "openai",
          fallbackProviders: ["anthropic"],
        },
        mcpConfig: {
          gatewayEnabled: true,
          registryEnabled: true,
          healthCheckIntervalSec: 30,
        },
        workflowConfig: {
          maxConcurrentWorkflows: environment === "production" ? 500 : 80,
          defaultRetryCount: 3,
        },
        organizationConfig: {
          enforceTenantIsolation: true,
          defaultPolicySet: "enterprise-baseline",
        },
      }

      this.config.setRuntimeConfig(runtimeConfig)
      this.config.addVersion({
        version: `${environment}-v1`,
        createdAt: isoNow(),
        createdBy: "system",
        environment,
        notes: "Initial environment runtime configuration",
      })

      this.secrets.register({
        id: createInfrastructureId(`secret-api-${environment}`),
        kind: "api-key",
        name: `AIOS_API_KEY_${environment.toUpperCase()}`,
        environment,
      })
      this.secrets.register({
        id: createInfrastructureId(`secret-db-${environment}`),
        kind: "database-credential",
        name: `AIOS_DB_CREDENTIAL_${environment.toUpperCase()}`,
        environment,
      })
      this.secrets.register({
        id: createInfrastructureId(`secret-model-${environment}`),
        kind: "model-provider-key",
        name: `AIOS_MODEL_PROVIDER_KEY_${environment.toUpperCase()}`,
        environment,
      })
      this.secrets.register({
        id: createInfrastructureId(`secret-mcp-${environment}`),
        kind: "mcp-credential",
        name: `AIOS_MCP_CREDENTIAL_${environment.toUpperCase()}`,
        environment,
      })

      const pipeline: CiPipelineDefinition = {
        id: createInfrastructureId(`pipeline-${environment}`),
        name: `aios-${environment}-pipeline`,
        environment,
        stages: [
          "lint",
          "typecheck",
          "test",
          "build",
          "release-validation",
          "preview-deploy",
          "production-deploy",
          "rollback",
        ],
        requiredApprovals: environment === "production" ? 1 : 0,
      }
      this.ci.registerPipeline(pipeline)

      const releaseVersion = environment === "production" ? "1.0.0" : bumpPatch("1.0.0")
      this.release.planRelease({
        id: createInfrastructureId(`release-${environment}`),
        version: releaseVersion,
        strategy: environment === "production" ? "blue-green" : "standard",
        environment,
        createdAt: isoNow(),
        status: "planned",
        notes: `Initial ${environment} release baseline`,
      })

      this.migration.record({
        id: createInfrastructureId(`migration-${environment}`),
        environment,
        version: `${environment}-schema-v1`,
        executedAt: isoNow(),
        rollbackVersion: `${environment}-schema-v0`,
        status: "applied",
      })

      const backups: BackupRecord[] = [
        {
          id: createInfrastructureId(`backup-memory-${environment}`),
          type: "memory",
          environment,
          createdAt: isoNow(),
          checksum: "checksum-memory",
          verified: true,
        },
        {
          id: createInfrastructureId(`backup-knowledge-${environment}`),
          type: "knowledge",
          environment,
          createdAt: isoNow(),
          checksum: "checksum-knowledge",
          verified: true,
        },
        {
          id: createInfrastructureId(`backup-db-${environment}`),
          type: "database-snapshot",
          environment,
          createdAt: isoNow(),
          checksum: "checksum-db",
          verified: true,
        },
      ]
      backups.forEach((backup) => this.backup.register(backup))

      this.recovery.register({
        id: createInfrastructureId(`recovery-${environment}`),
        environment,
        title: `${environment} disaster recovery runbook`,
        steps: [
          "Validate incident severity and blast radius",
          "Restore latest verified backups",
          "Replay migration and configuration history",
          "Resume runtime workloads in controlled order",
        ],
        verificationChecks: [
          "Health endpoints stable",
          "Queue depth normalized",
          "MCP connectivity restored",
          "Workflow success ratio recovered",
        ],
      })

      this.security.record({
        id: createInfrastructureId(`security-audit-${environment}`),
        type: "dependency-audit",
        environment,
        executedAt: isoNow(),
        status: "passed",
        findings: [],
      })
      this.security.record({
        id: createInfrastructureId(`security-secrets-${environment}`),
        type: "secret-detection",
        environment,
        executedAt: isoNow(),
        status: "passed",
        findings: [],
      })

      const monitoringPoints: MonitoringPoint[] = [
        { metric: "availability", environment, timestamp: isoNow(), value: 99.95, unit: "percent" },
        { metric: "latency", environment, timestamp: isoNow(), value: 240, unit: "ms" },
        { metric: "error-rate", environment, timestamp: isoNow(), value: 0.15, unit: "percent" },
        { metric: "queue-health", environment, timestamp: isoNow(), value: 98, unit: "percent" },
        { metric: "runtime-health", environment, timestamp: isoNow(), value: 97, unit: "percent" },
        { metric: "database-health", environment, timestamp: isoNow(), value: 99, unit: "percent" },
        { metric: "mcp-connectivity", environment, timestamp: isoNow(), value: 96, unit: "percent" },
        { metric: "agent-health", environment, timestamp: isoNow(), value: 95, unit: "percent" },
        { metric: "workflow-execution", environment, timestamp: isoNow(), value: 94, unit: "percent" },
        { metric: "cost-model-usage", environment, timestamp: isoNow(), value: 2500, unit: "eur" },
        { metric: "cost-infrastructure-usage", environment, timestamp: isoNow(), value: 1800, unit: "eur" },
        { metric: "cost-storage", environment, timestamp: isoNow(), value: 430, unit: "eur" },
        { metric: "cost-memory", environment, timestamp: isoNow(), value: 220, unit: "eur" },
        { metric: "cost-database", environment, timestamp: isoNow(), value: 610, unit: "eur" },
        { metric: "cost-mcp-traffic", environment, timestamp: isoNow(), value: 310, unit: "eur" },
        { metric: "cost-workflow-execution", environment, timestamp: isoNow(), value: 520, unit: "eur" },
        { metric: "cost-agent-execution", environment, timestamp: isoNow(), value: 780, unit: "eur" },
      ]
      monitoringPoints.forEach((point) => {
        this.monitoring.record(point)
        this.costs.record(point)
      })

      this.monitoring.registerAlert({
        id: createInfrastructureId(`alert-critical-${environment}`),
        name: `${environment} availability critical`,
        severity: "critical",
        metric: "availability",
        threshold: "< 99.0%",
        runbook: "operations/runbooks/availability-critical.md",
      })
      this.monitoring.registerAlert({
        id: createInfrastructureId(`alert-warning-${environment}`),
        name: `${environment} latency warning`,
        severity: "warning",
        metric: "latency",
        threshold: "> 500ms",
        runbook: "operations/runbooks/latency-warning.md",
      })

      this.adapters.register({
        id: createInfrastructureId(`adapter-cloud-${environment}`),
        name: `${environment}-cloud-adapter`,
        kind: "cloud-provider",
        provider: "abstract-cloud",
        enabled: true,
      })
      this.adapters.register({
        id: createInfrastructureId(`adapter-storage-${environment}`),
        name: `${environment}-storage-adapter`,
        kind: "storage",
        provider: "abstract-storage",
        enabled: true,
      })
      this.adapters.register({
        id: createInfrastructureId(`adapter-messaging-${environment}`),
        name: `${environment}-messaging-adapter`,
        kind: "messaging",
        provider: "abstract-messaging",
        enabled: true,
      })
      this.adapters.register({
        id: createInfrastructureId(`adapter-caching-${environment}`),
        name: `${environment}-caching-adapter`,
        kind: "caching",
        provider: "abstract-caching",
        enabled: true,
      })
      this.adapters.register({
        id: createInfrastructureId(`adapter-secrets-${environment}`),
        name: `${environment}-secrets-adapter`,
        kind: "secrets",
        provider: "abstract-secrets",
        enabled: true,
      })
      this.adapters.register({
        id: createInfrastructureId(`adapter-logging-${environment}`),
        name: `${environment}-logging-adapter`,
        kind: "logging",
        provider: "abstract-logging",
        enabled: true,
      })
      this.adapters.register({
        id: createInfrastructureId(`adapter-monitoring-${environment}`),
        name: `${environment}-monitoring-adapter`,
        kind: "monitoring",
        provider: "abstract-monitoring",
        enabled: true,
      })

      const validation = validateRelease({
        environment,
        pipeline,
        checks: {
          lintPassed: true,
          typecheckPassed: true,
          buildPassed: true,
          testsPassed: true,
        },
      })

      if (validation.approved) {
        const release = this.release.list(environment)[0]
        if (release) {
          this.release.markDeployed(release.id)
        }
      }
    }
  }

  snapshot(): InfrastructureState {
    return {
      deployments: this.deployment.listTargets(),
      runtimeConfigurations: environments
        .map((environment) => this.config.getRuntimeConfig(environment))
        .filter((value): value is RuntimeConfiguration => Boolean(value)),
      configVersions: this.config.listVersions(),
      secrets: this.secrets.list(),
      pipelines: this.ci.listPipelines(),
      releases: this.release.list(),
      migrations: this.migration.list(),
      backups: this.backup.list(),
      recoveryProcedures: this.recovery.list(),
      securityOperations: this.security.list(),
      monitoring: this.monitoring.list(),
      alerts: this.monitoring.listAlerts(),
      adapters: this.adapters.list(),
    }
  }
}
