import type { DecisionOutcome } from "@/types"

type OutcomeTrackingPanelProps = {
  outcomes: DecisionOutcome[]
}

export function OutcomeTrackingPanel({ outcomes }: OutcomeTrackingPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Outcome tracking">
      <p className="text-xs uppercase tracking-wide text-text-muted">Outcome Tracking</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Accepted, rejected, and learned</h2>

      <div className="mt-4 space-y-3">
        {outcomes.map((outcome) => (
          <article key={outcome.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{outcome.title}</p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">{outcome.businessOutcome}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{outcome.status}</span>
            </div>
            <p className="mt-2 text-[11px] text-text-muted">Execution result: {outcome.executionResult}</p>
            <p className="mt-1 text-[11px] text-text-secondary">Learning: {outcome.learningOpportunity}</p>
          </article>
        ))}
      </div>
    </section>
  )
}