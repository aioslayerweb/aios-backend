import type { ExecutionEvent } from "@/types"
import { cn } from "@/utils"

type ExecutionTimelineProps = {
  events: ExecutionEvent[]
}

function toneClass(status: ExecutionEvent["status"]): string {
  switch (status) {
    case "complete":
      return "bg-semantic-success"
    case "running":
      return "bg-semantic-warning"
    case "failed":
      return "bg-semantic-error"
    default:
      return "bg-text-muted"
  }
}

export function ExecutionTimeline({ events }: ExecutionTimelineProps) {
  return (
    <ol className="space-y-2">
      {events.map((event) => (
        <li key={event.id} className="flex items-start gap-2">
          <span className={cn("mt-1.5 h-2 w-2 rounded-full", toneClass(event.status))} aria-hidden />
          <div>
            <p className="text-sm text-text-primary">{event.label}</p>
            <p className="text-[11px] uppercase tracking-wide text-text-muted">{event.status}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
