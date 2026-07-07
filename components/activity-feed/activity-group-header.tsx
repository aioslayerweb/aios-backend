import { ChevronDown } from "lucide-react"
import type { ActivityGroup } from "@/types"
import { cn } from "@/utils"

type ActivityGroupHeaderProps = {
  group: ActivityGroup
  expanded: boolean
  onToggle: () => void
}

export function ActivityGroupHeader({ group, expanded, onToggle }: ActivityGroupHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="sticky top-0 z-[1] flex w-full items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2 text-left hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      aria-expanded={expanded}
      aria-label={`Toggle ${group.label} activity group`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-brand-navy">{group.label}</span>
        <span className="rounded-full bg-brand-subtle px-2 py-0.5 text-xs text-brand-navy">{group.count}</span>
      </div>
      <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform", expanded && "rotate-180")} />
    </button>
  )
}
