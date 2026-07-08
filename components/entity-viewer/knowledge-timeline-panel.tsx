import type { KnowledgeTimelineEvent } from "@/types"

type KnowledgeTimelinePanelProps = {
  timeline: KnowledgeTimelineEvent[]
}

export function KnowledgeTimelinePanel({ timeline }: KnowledgeTimelinePanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Knowledge timeline">
      <p className="text-xs uppercase tracking-wide text-text-muted">Timeline View</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Chronological evolution</h2>
      <div className="mt-4 space-y-3">
        {timeline.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
              <span className="text-[11px] capitalize text-text-muted">{item.type}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{item.detail}</p>
            <p className="mt-2 text-[11px] text-text-muted">{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          </article>
        ))}
      </div>
    </section>
  )
}