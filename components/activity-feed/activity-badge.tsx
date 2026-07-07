import { Pin, Star } from "lucide-react"
import type { ActivityPriority, ActivityStatus } from "@/types"
import { Badge } from "@/components/ui"

type ActivityBadgeProps =
  | {
      kind: "priority"
      value: ActivityPriority
    }
  | {
      kind: "status"
      value: ActivityStatus
    }
  | {
      kind: "pinned" | "unread"
      value: boolean
    }

function toTitle(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function ActivityBadge(props: ActivityBadgeProps) {
  if (props.kind === "priority") {
    const tone =
      props.value === "critical"
        ? "error"
        : props.value === "high"
          ? "warning"
          : props.value === "medium"
            ? "info"
            : "default"

    return <Badge tone={tone}>{toTitle(props.value)}</Badge>
  }

  if (props.kind === "status") {
    const tone =
      props.value === "error"
        ? "error"
        : props.value === "warning"
          ? "warning"
          : props.value === "success" || props.value === "completed"
            ? "success"
            : "info"

    return <Badge tone={tone}>{toTitle(props.value)}</Badge>
  }

  if (props.kind === "pinned") {
    if (!props.value) {
      return null
    }

    return (
      <Badge tone="info" className="inline-flex items-center gap-1">
        <Pin className="h-3 w-3" />
        Pinned
      </Badge>
    )
  }

  if (!props.value) {
    return null
  }

  return (
    <Badge tone="warning" className="inline-flex items-center gap-1">
      <Star className="h-3 w-3" />
      Unread
    </Badge>
  )
}
