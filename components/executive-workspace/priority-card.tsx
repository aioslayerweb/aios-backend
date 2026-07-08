"use client"

import { Clock3 } from "lucide-react"
import type { PriorityActionItem } from "@/types"

type PriorityCardProps = {
  item: PriorityActionItem
  onDefer: (id: string) => void
}

export function PriorityCard({ item, onDefer }: PriorityCardProps) {
  const priorityTone =
    item.priority === "critical"
      ? "bg-rose-100 text-rose-700"
      : item.priority === "high"
        ? "bg-amber-100 text-amber-700"
        : "bg-sky-100 text-sky-700"

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
          <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityTone}`}>{item.priority}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1 rounded bg-surface-muted px-2 py-1">
          <Clock3 className="h-3 w-3" />
          {item.deadline}
        </span>
        <span className="rounded bg-surface-muted px-2 py-1">Owner {item.owner}</span>
        <span className="rounded bg-surface-muted px-2 py-1">Status {item.status}</span>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => onDefer(item.id)}
          className="rounded border border-border px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
        >
          Defer
        </button>
      </div>
    </article>
  )
}
