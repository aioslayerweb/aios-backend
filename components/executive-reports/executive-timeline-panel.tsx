type ExecutiveTimelinePanelProps = {
  timeline: Array<{ id: string; time: string; title: string; detail: string; kind: string }>
}

export function ExecutiveTimelinePanel({ timeline }: ExecutiveTimelinePanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Executive timeline">
      <p className="text-xs uppercase tracking-wide text-text-muted">Executive Timeline</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Chronological board summary</h2>
      <div className="mt-4 space-y-3">
        {timeline.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
              <span className="text-[11px] text-text-muted">{item.time}</span>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-text-muted">{item.kind}</p>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}