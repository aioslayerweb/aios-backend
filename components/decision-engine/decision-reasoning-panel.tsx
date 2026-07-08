import type { DecisionReasoning } from "@/types"

type DecisionReasoningPanelProps = {
  reasoning: DecisionReasoning | null
}

export function DecisionReasoningPanel({ reasoning }: DecisionReasoningPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Decision reasoning">
      <p className="text-xs uppercase tracking-wide text-text-muted">Decision Reasoning</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Transparent recommendation logic</h2>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Business rationale</p>
          <p className="mt-2 text-xs leading-5 text-text-secondary">{reasoning?.businessRationale ?? "Select a decision to inspect reasoning."}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Confidence explanation</p>
          <p className="mt-2 text-xs leading-5 text-text-secondary">{reasoning?.confidenceExplanation ?? "Confidence explanation unavailable."}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Evidence</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {(reasoning?.evidence ?? []).map((item) => <p key={item}>{item}</p>)}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Signals considered</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(reasoning?.signalsConsidered ?? []).map((item) => (
              <span key={item} className="rounded-full border border-border bg-white px-2 py-1 text-[11px] text-text-muted">{item}</span>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Potential risks</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {(reasoning?.potentialRisks ?? []).map((item) => <p key={item}>{item}</p>)}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Alternative options</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {(reasoning?.alternativeOptions ?? []).map((item) => <p key={item}>{item}</p>)}
          </div>
        </article>
      </div>
    </section>
  )
}