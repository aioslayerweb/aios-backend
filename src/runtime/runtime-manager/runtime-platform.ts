import { CacheManager } from "@/src/runtime/cache/cache-manager"
import { EventBus } from "@/src/runtime/event-bus/event-bus"
import { HealthMonitor } from "@/src/runtime/health/health-monitor"
import { MetricsRegistry } from "@/src/runtime/metrics/metrics-registry"
import { ObservabilityCenter } from "@/src/runtime/observability/observability-center"
import { PerformanceMonitor } from "@/src/runtime/performance/performance-monitor"
import { QueueOrchestrator } from "@/src/runtime/queues/queue-orchestrator"
import { RuntimeManager } from "@/src/runtime/runtime-manager/runtime-manager"
import { RuntimeScheduler } from "@/src/runtime/scheduler/scheduler"
import type {
  CachePolicy,
  DashboardSnapshot,
  RuntimeEventEnvelope,
  RuntimeJob,
  RuntimeManagerState,
  RuntimePlatformState,
  RuntimeResourceSnapshot,
  RuntimeScalabilityProfile,
} from "@/src/runtime/types"
import { createRuntimeId, nowIso } from "@/src/runtime/utils/runtime-id"
import { WorkerPool } from "@/src/runtime/workers/worker-pool"

export class RuntimePlatform {
  readonly manager = new RuntimeManager()
  readonly eventBus = new EventBus()
  readonly queues = new QueueOrchestrator()
  readonly workers = new WorkerPool(32)
  readonly cache = new CacheManager()
  readonly metrics = new MetricsRegistry()
  readonly health = new HealthMonitor()
  readonly observability = new ObservabilityCenter()
  readonly scheduler = new RuntimeScheduler()
  readonly performance = new PerformanceMonitor()

  constructor() {
    this.initializeCachePolicies()
    this.manager.start()
  }

  registerDefaultTenant(tenantId: string): void {
    const now = nowIso()

    const lifecycleComponentTypes: RuntimeManagerState["components"] = [
      {
        id: createRuntimeId("component-app"),
        kind: "application",
        tenantId,
        name: "AIOS Application Runtime",
        status: "running",
        startedAt: now,
      },
      {
        id: createRuntimeId("component-agent"),
        kind: "agent",
        tenantId,
        name: "Agent Lifecycle Controller",
        status: "running",
        startedAt: now,
      },
      {
        id: createRuntimeId("component-workflow"),
        kind: "workflow",
        tenantId,
        name: "Workflow Lifecycle Controller",
        status: "running",
        startedAt: now,
      },
      {
        id: createRuntimeId("component-memory"),
        kind: "memory-sync",
        tenantId,
        name: "Memory Synchronizer",
        status: "running",
        startedAt: now,
      },
      {
        id: createRuntimeId("component-mcp"),
        kind: "mcp-connection",
        tenantId,
        name: "MCP Connection Supervisor",
        status: "running",
        startedAt: now,
      },
      {
        id: createRuntimeId("component-scheduler"),
        kind: "scheduler",
        tenantId,
        name: "Runtime Scheduler",
        status: "running",
        startedAt: now,
      },
    ]

    lifecycleComponentTypes.forEach((component) => this.manager.registerComponent(component))

    const seedEvent: RuntimeEventEnvelope<{ status: string }> = {
      id: createRuntimeId("event-runtime-started"),
      type: "runtime.started",
      domain: "system",
      tenantId,
      timestamp: now,
      correlationId: createRuntimeId("corr"),
      payload: {
        status: "running",
      },
    }
    this.eventBus.publish(seedEvent)

    const resourceSnapshot: RuntimeResourceSnapshot = {
      tenantId,
      timestamp: now,
      cpuPercent: 28,
      memoryPercent: 42,
      networkMbps: 120,
      storagePercent: 34,
      activeSessions: 75,
      concurrentAgents: 18,
      concurrentWorkflows: 23,
      openMcpConnections: 12,
      databaseConnections: 16,
    }
    this.performance.recordResource(resourceSnapshot)

    const profile: RuntimeScalabilityProfile = {
      tenantId,
      statelessServices: true,
      workerPoolSize: 32,
      queueWorkerCount: 24,
      supportsHorizontalScale: true,
      kubernetesReady: true,
      edgeReady: true,
      microservicesReady: true,
    }
    this.performance.updateScalabilityProfile(profile)

    this.health.updateCheck({
      id: createRuntimeId("health-runtime"),
      name: "Runtime Core",
      tenantId,
      status: "healthy",
      checkedAt: now,
      latencyMs: 31,
      detail: "Runtime manager healthy",
    })

    this.metrics.increment("system-throughput", tenantId, 2450, "events/min")
    this.metrics.increment("queue-depth", tenantId, 38, "jobs")
    this.metrics.increment("cache-hit-ratio", tenantId, 93.2, "percent")
    this.metrics.increment("model-latency", tenantId, 780, "ms")
    this.metrics.increment("mcp-latency", tenantId, 240, "ms")
  }

  enqueueJob(job: RuntimeJob): RuntimeJob {
    return this.queues.enqueue(job)
  }

  scheduleJob(job: RuntimeJob): RuntimeJob {
    return this.scheduler.schedule(job)
  }

  tickScheduler(now = nowIso()): RuntimeJob[] {
    const ready = this.scheduler.releaseReady(now)
    ready.forEach((job) => {
      this.queues.enqueue(job)
    })
    return ready
  }

  startWorkerJob(job: RuntimeJob): boolean {
    return this.workers.start(job)
  }

  toState(tenantId: string): RuntimePlatformState {
    const dashboards = this.buildDashboards(tenantId)

    return {
      manager: this.manager.getState(),
      queues: this.queues.snapshot(tenantId),
      cache: this.cache.snapshot(tenantId),
      health: this.health.listByTenant(tenantId),
      metrics: this.metrics.latestByTenant(tenantId),
      events: this.eventBus.listRecent(200).filter((event) => event.tenantId === tenantId),
      liveEvents: this.eventBus
        .listRecent(80)
        .filter((event) => event.tenantId === tenantId)
        .map((event) => ({
          id: event.id,
          channel: this.mapEventDomainToChannel(event.domain),
          tenantId,
          eventType: event.type,
          payload: typeof event.payload === "object" && event.payload ? event.payload : {},
          timestamp: event.timestamp,
          correlationId: event.correlationId,
        })),
      resources: this.performance.latestResources(tenantId),
      dashboards,
      observability: this.observability.snapshot(),
      circuits: [
        {
          id: createRuntimeId("circuit-mcp"),
          tenantId,
          dependency: "mcp-gateway",
          state: "closed",
          failureCount: 0,
        },
      ],
      scalabilityProfiles: this.performance.listProfiles().filter((profile) => profile.tenantId === tenantId),
    }
  }

  private initializeCachePolicies(): void {
    const policies: CachePolicy[] = [
      { namespace: "memory", ttlMs: 60_000 },
      { namespace: "distributed", ttlMs: 120_000 },
      { namespace: "model-response", ttlMs: 180_000 },
      { namespace: "knowledge", ttlMs: 300_000 },
      { namespace: "workflow", ttlMs: 120_000 },
      { namespace: "mcp", ttlMs: 120_000 },
      { namespace: "configuration", ttlMs: 3_600_000 },
      { namespace: "prompt", ttlMs: 600_000 },
    ]

    policies.forEach((policy) => this.cache.registerPolicy(policy))
  }

  private buildDashboards(tenantId: string): DashboardSnapshot[] {
    const health = this.health.evaluate(tenantId)
    const queueTotal = this.queues.snapshot(tenantId).reduce((sum, entry) => sum + entry.depth, 0)

    return [
      {
        dashboard: "runtime",
        tenantId,
        generatedAt: nowIso(),
        widgets: [
          { id: "runtime-lifecycle", title: "Lifecycle", value: this.manager.getState().lifecycle },
          { id: "runtime-components", title: "Managed Components", value: String(this.manager.listComponents(tenantId).length) },
        ],
      },
      {
        dashboard: "queue",
        tenantId,
        generatedAt: nowIso(),
        widgets: [
          { id: "queue-depth", title: "Queue Depth", value: String(queueTotal), trend: "steady" },
        ],
      },
      {
        dashboard: "health",
        tenantId,
        generatedAt: nowIso(),
        widgets: [{ id: "health-overall", title: "Overall Health", value: health }],
      },
      {
        dashboard: "performance",
        tenantId,
        generatedAt: nowIso(),
        widgets: [
          { id: "perf-workers", title: "Worker Usage", value: `${this.workers.usage().active}/${this.workers.usage().max}` },
        ],
      },
      {
        dashboard: "infrastructure",
        tenantId,
        generatedAt: nowIso(),
        widgets: [
          { id: "infra-scale", title: "Horizontal Scaling", value: "enabled" },
        ],
      },
      {
        dashboard: "mcp-health",
        tenantId,
        generatedAt: nowIso(),
        widgets: [
          { id: "mcp-connections", title: "Open MCP Connections", value: "12" },
        ],
      },
      {
        dashboard: "memory",
        tenantId,
        generatedAt: nowIso(),
        widgets: [
          { id: "memory-cache-keys", title: "Memory Cache Keys", value: String(this.cache.snapshot(tenantId).find((entry) => entry.namespace === "memory")?.keys ?? 0) },
        ],
      },
      {
        dashboard: "workflow",
        tenantId,
        generatedAt: nowIso(),
        widgets: [
          {
            id: "workflow-concurrency",
            title: "Concurrent Workflows",
            value: String(this.performance.latestResources(tenantId, 1)[0]?.concurrentWorkflows ?? 0),
          },
        ],
      },
    ]
  }

  private mapEventDomainToChannel(domain: RuntimeEventEnvelope["domain"]) {
    switch (domain) {
      case "agent":
        return "agent-stream" as const
      case "workflow":
        return "workflow-progress" as const
      case "memory":
        return "memory-updates" as const
      case "notification":
        return "notifications" as const
      case "replay":
        return "activity-feed" as const
      default:
        return "runtime-status" as const
    }
  }
}
