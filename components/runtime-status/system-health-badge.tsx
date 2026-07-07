import type { RuntimeStatusLevel } from "@/types"
import { Badge } from "@/components/ui"

type SystemHealthBadgeProps = {
  health: RuntimeStatusLevel
}

function toneByHealth(health: RuntimeStatusLevel): "success" | "warning" | "error" | "info" {
  if (health === "healthy") {
    return "success"
  }
  if (health === "active" || health === "synchronizing") {
    return "info"
  }
  if (health === "warning" || health === "degraded" || health === "unknown") {
    return "warning"
  }

  return "error"
}

export function SystemHealthBadge({ health }: SystemHealthBadgeProps) {
  return <Badge tone={toneByHealth(health)}>{health.toUpperCase()}</Badge>
}
