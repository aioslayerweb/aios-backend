import type { MemoryEntry } from "@/types"
import { Pin } from "lucide-react"
import { formatRelativeTime } from "@/utils/ai-assistant"

type MemoryCardProps = {
  memory: MemoryEntry
}

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <article className="rounded-md border border-border bg-surface-muted p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-text-primary">{memory.title}</p>
        {memory.pinned ? <Pin className="h-3.5 w-3.5 text-brand-primary" aria-label="Pinned memory" /> : null}
      </div>
      <p className="mt-1 text-xs text-text-secondary">{memory.summary}</p>
      <p className="mt-2 text-[11px] text-text-muted">{formatRelativeTime(memory.timestamp)}</p>
    </article>
  )
}
