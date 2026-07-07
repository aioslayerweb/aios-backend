import type {
  RuntimeColorToken,
  RuntimeModuleStatus,
  RuntimeStatusLevel,
} from "@/types"

export const runtimeDomainOrder = [
  "ai-runtime",
  "memory",
  "agents",
  "knowledge",
  "automation",
  "notifications",
  "search",
  "supabase",
  "sync",
  "background-jobs",
  "api",
  "overall-system",
] as const

const severityWeight: Record<RuntimeStatusLevel, number> = {
  healthy: 0,
  active: 1,
  synchronizing: 2,
  warning: 3,
  degraded: 4,
  offline: 5,
  error: 6,
  unknown: 2,
}

const levelMeta: Record<
  RuntimeStatusLevel,
  {
    label: string
    colorToken: RuntimeColorToken
  }
> = {
  healthy: { label: "Healthy", colorToken: "semantic-success" },
  active: { label: "Active", colorToken: "semantic-info" },
  warning: { label: "Warning", colorToken: "semantic-warning" },
  offline: { label: "Offline", colorToken: "text-muted" },
  degraded: { label: "Degraded", colorToken: "semantic-warning" },
  error: { label: "Error", colorToken: "semantic-error" },
  synchronizing: { label: "Synchronizing", colorToken: "semantic-info" },
  unknown: { label: "Unknown", colorToken: "text-muted" },
}

export const mockRuntimeModules: RuntimeModuleStatus[] = [
  {
    key: "ai-runtime",
    name: "AI Runtime",
    status: "healthy",
    label: "Healthy",
    icon: "bot",
    colorToken: "semantic-success",
    description: "Core AI execution engine is available and responsive.",
    timestamp: Date.now() - 25_000,
  },
  {
    key: "memory",
    name: "Memory",
    status: "synchronizing",
    label: "Synchronizing",
    icon: "database",
    colorToken: "semantic-info",
    description: "Memory index synchronization is in progress.",
    timestamp: Date.now() - 9_000,
  },
  {
    key: "agents",
    name: "Agents",
    status: "active",
    label: "4 Active",
    icon: "cpu",
    colorToken: "semantic-info",
    description: "Agent tasks are executing normally.",
    timestamp: Date.now() - 6_000,
  },
  {
    key: "knowledge",
    name: "Knowledge",
    status: "healthy",
    label: "Healthy",
    icon: "brain",
    colorToken: "semantic-success",
    description: "Knowledge graph services are stable.",
    timestamp: Date.now() - 42_000,
  },
  {
    key: "automation",
    name: "Automation",
    status: "active",
    label: "Idle",
    icon: "workflow",
    colorToken: "semantic-info",
    description: "Automation orchestrator ready for execution.",
    timestamp: Date.now() - 15_000,
  },
  {
    key: "notifications",
    name: "Notifications",
    status: "healthy",
    label: "Healthy",
    icon: "bell",
    colorToken: "semantic-success",
    description: "Notification pipeline is operational.",
    timestamp: Date.now() - 21_000,
  },
  {
    key: "search",
    name: "Search",
    status: "healthy",
    label: "Healthy",
    icon: "search",
    colorToken: "semantic-success",
    description: "Global search index is available.",
    timestamp: Date.now() - 19_000,
  },
  {
    key: "supabase",
    name: "Supabase Connection",
    status: "healthy",
    label: "Connected",
    icon: "plug",
    colorToken: "semantic-success",
    description: "Supabase connection is healthy.",
    timestamp: Date.now() - 12_000,
  },
  {
    key: "sync",
    name: "Synchronization",
    status: "synchronizing",
    label: "Synchronizing",
    icon: "refresh",
    colorToken: "semantic-info",
    description: "Cross-module synchronization is running.",
    timestamp: Date.now() - 4_000,
  },
  {
    key: "background-jobs",
    name: "Background Jobs",
    status: "active",
    label: "2 Running",
    icon: "clock",
    colorToken: "semantic-info",
    description: "Background workers are processing queue tasks.",
    timestamp: Date.now() - 8_000,
  },
  {
    key: "api",
    name: "API Connectivity",
    status: "healthy",
    label: "Healthy",
    icon: "cloud",
    colorToken: "semantic-success",
    description: "Application APIs are reachable.",
    timestamp: Date.now() - 16_000,
  },
  {
    key: "overall-system",
    name: "Overall System Health",
    status: "healthy",
    label: "Healthy",
    icon: "shield",
    colorToken: "semantic-success",
    description: "AIOS platform health is nominal.",
    timestamp: Date.now() - 5_000,
  },
]

export function statusMeta(level: RuntimeStatusLevel): {
  label: string
  colorToken: RuntimeColorToken
} {
  return levelMeta[level]
}

export function deriveOverallHealth(modules: RuntimeModuleStatus[]): RuntimeStatusLevel {
  const worst = modules.reduce<RuntimeStatusLevel>((current, moduleStatus) => {
    return severityWeight[moduleStatus.status] > severityWeight[current]
      ? moduleStatus.status
      : current
  }, "healthy")

  if (worst === "error" || worst === "offline") {
    return "degraded"
  }

  return worst
}

export function formatRuntimeElapsed(timestamp: number): string {
  const elapsed = Math.max(0, Date.now() - timestamp)
  const seconds = Math.floor(elapsed / 1000)

  if (seconds < 60) {
    return `${seconds}s ago`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function runtimePulseKey(status: RuntimeStatusLevel): string {
  switch (status) {
    case "active":
    case "synchronizing":
      return "pulse-active"
    case "warning":
    case "degraded":
      return "pulse-warning"
    case "error":
      return "pulse-error"
    default:
      return "pulse-none"
  }
}
