import type { BusinessHealthItem } from "@/types"

type BusinessHealthScoreboardProps = {
  health: BusinessHealthItem[]
  businessScore: number
}

export function BusinessHealthScoreboard({ health, businessScore }: BusinessHealthScoreboardProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Business health">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Business Health</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Cross-functional health score</h2>
        </div>
        <span className="rounded-full bg-brand-subtle px-3 py-1 text-sm font-semibold text-brand-navy">Score {businessScore}</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {health.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
            <p className="mt-2 text-2xl font-semibold text-brand-navy">{item.score}</p>
            <p className="mt-1 text-xs text-text-secondary">{item.subtitle}</p>
            <p className="mt-1 text-[11px] text-text-muted">{item.delta}</p>
          </article>
        ))}
      </div>
    </section>
  )
}