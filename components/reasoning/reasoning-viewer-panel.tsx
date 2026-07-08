import type { GovernanceReasoningItem } from "@/types"

type ReasoningViewerPanelProps = {
  reasoning: GovernanceReasoningItem | null
}

export function ReasoningViewerPanel({ reasoning }: ReasoningViewerPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Reasoning viewer">
      <p className="text-xs uppercase tracking-wide text-text-muted">Reasoning Viewer</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">User-facing explanation only</h2>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Final recommendation</p>
          <p className="mt-2 text-xs leading-5 text-text-secondary">{reasoning?.finalRecommendation ?? "Select a decision to inspect explainability."}</p>
          <p className="mt-2 text-[11px] text-text-muted">{reasoning?.explanation ?? ""}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Business objectives</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {(reasoning?.businessObjectives ?? []).map((item) => <p key={item}>{item}</p>)}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Signals considered</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(reasoning?.signalsConsidered ?? []).map((item) => <span key={item} className="rounded-full border border-border bg-white px-2 py-1 text-[11px] text-text-muted">{item}</span>)}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Policies evaluated</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(reasoning?.policiesEvaluated ?? []).map((item) => <span key={item} className="rounded-full border border-sky-100 bg-sky-50 px-2 py-1 text-[11px] text-sky-700">{item}</span>)}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Supporting evidence</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {(reasoning?.supportingEvidence ?? []).map((item) => <p key={item}>{item}</p>)}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-sm font-semibold text-brand-navy">Knowledge references + alternatives</p>
          <div className="mt-2 space-y-1.5 text-xs text-text-secondary">
            {(reasoning?.knowledgeReferences ?? []).map((item) => <p key={item}>Reference: {item}</p>)}
            {(reasoning?.alternativeActions ?? []).map((item) => <p key={item}>Alternative: {item}</p>)}
          </div>
        </article>
      </div>
    </section>
  )
}