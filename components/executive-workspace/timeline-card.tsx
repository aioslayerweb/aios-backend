import type { ExecutiveTimelineItem } from "@/types"

type TimelineCardProps = {
  item: ExecutiveTimelineItem
}

export function TimelineCard({ item }: TimelineCardProps) {
  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="min-w-[58px] rounded bg-brand-subtle px-2 py-1 text-xs font-semibold text-brand-navy">{item.time}</span>
        <div>
          <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
          <p className="mt-1 text-xs text-text-muted">
            {item.kind} • {item.owner} • {item.status}
          </p>
        </div>
      </div>
    </article>
  )
}
