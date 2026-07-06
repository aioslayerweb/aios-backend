import type { AISuggestion } from "@/types"
import { Badge } from "@/components/ui"

type AISuggestionCardProps = {
  suggestion: AISuggestion
}

function toneByPriority(priority: AISuggestion["priority"]): "info" | "warning" | "error" {
  if (priority === "high") {
    return "error"
  }
  if (priority === "medium") {
    return "warning"
  }

  return "info"
}

export function AISuggestionCard({ suggestion }: AISuggestionCardProps) {
  return (
    <article className="rounded-md border border-border bg-surface-muted p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-text-primary">{suggestion.title}</p>
        <Badge tone={toneByPriority(suggestion.priority)}>{suggestion.priority}</Badge>
      </div>
      <p className="mt-1 text-xs text-text-secondary">{suggestion.summary}</p>
      <p className="mt-2 text-[11px] uppercase tracking-wide text-text-muted">{suggestion.type}</p>
    </article>
  )
}
