import {
  Bell,
  Bot,
  Brain,
  Cloud,
  Clock3,
  Cpu,
  Database,
  Plug,
  RefreshCcw,
  Search,
  Shield,
  Workflow,
} from "lucide-react"
import type { RuntimeModuleStatus } from "@/types"
import { cn } from "@/utils"
import { runtimePulseKey } from "@/utils/runtime-status"

type RuntimeStatusIndicatorProps = {
  module: RuntimeModuleStatus
  compact?: boolean
}

const iconMap = {
  bot: Bot,
  database: Database,
  cpu: Cpu,
  brain: Brain,
  workflow: Workflow,
  bell: Bell,
  search: Search,
  plug: Plug,
  refresh: RefreshCcw,
  clock: Clock3,
  cloud: Cloud,
  shield: Shield,
} as const

function colorClass(token: RuntimeModuleStatus["colorToken"]): string {
  switch (token) {
    case "semantic-success":
      return "bg-semantic-success"
    case "semantic-info":
      return "bg-semantic-info"
    case "semantic-warning":
      return "bg-semantic-warning"
    case "semantic-error":
      return "bg-semantic-error"
    default:
      return "bg-text-muted"
  }
}

export function RuntimeStatusIndicator({ module, compact = false }: RuntimeStatusIndicatorProps) {
  const Icon = iconMap[module.icon as keyof typeof iconMap] ?? Shield

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border bg-surface-canvas px-2 py-1 text-xs text-text-secondary",
        compact && "px-1.5 py-0.5"
      )}
      aria-label={`${module.name} ${module.label}`}
    >
      <span
        className={cn(
          "inline-flex h-4 w-4 items-center justify-center rounded",
          colorClass(module.colorToken)
        )}
      >
        <Icon className="h-2.5 w-2.5 text-white" aria-hidden />
      </span>
      <span className={cn("font-medium", compact && "sr-only")}>{module.name}</span>
      <span className={cn("h-2 w-2 rounded-full", colorClass(module.colorToken), runtimePulseKey(module.status))} aria-hidden />
      <span>{module.label}</span>
    </span>
  )
}
