import type { DecisionPriorityScore } from "@/types"

type PriorityScorePanelProps = {
  score: DecisionPriorityScore | null
}

const scoreItems: Array<keyof Omit<DecisionPriorityScore, "decisionId">> = [
  "businessValue",
  "urgency",
  "risk",
  "confidence",
  "estimatedROI",
  "dependencies",
  "overallPriorityScore",
]

export function PriorityScorePanel({ score }: PriorityScorePanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Priority scoring">
      <p className="text-xs uppercase tracking-wide text-text-muted">Priority Scoring</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Transparent scoring model</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {scoreItems.map((item) => (
          <article key={item} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.replace(/[A-Z]/g, (value) => ` ${value.toLowerCase()}`)}</p>
            <p className="mt-2 text-2xl font-semibold text-brand-navy">{score?.[item] ?? 0}</p>
          </article>
        ))}
      </div>
    </section>
  )
}