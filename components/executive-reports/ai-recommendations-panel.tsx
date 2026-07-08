import type { ExecutiveRecommendation } from "@/types"

type AIRecommendationsPanelProps = {
  recommendations: ExecutiveRecommendation[]
}

export function AIRecommendationsPanel({ recommendations }: AIRecommendationsPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="AI recommendations">
      <p className="text-xs uppercase tracking-wide text-text-muted">AI Recommendations</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">What should happen next</h2>
      <div className="mt-4 space-y-3">
        {recommendations.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">{item.description}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] text-text-muted">{item.confidence}%</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Impact</p><p className="mt-1 text-xs text-brand-navy">{item.businessImpact}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Risk</p><p className="mt-1 text-xs text-brand-navy">{item.risk}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">ROI</p><p className="mt-1 text-xs text-brand-navy">{item.estimatedROI}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Next step</p><p className="mt-1 text-xs text-brand-navy">{item.nextStep}</p></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}