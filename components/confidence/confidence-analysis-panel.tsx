import type { ConfidenceAnalysis } from "@/types"

type ConfidenceAnalysisPanelProps = {
  confidence: ConfidenceAnalysis | null
}

function labelClass(level: ConfidenceAnalysis["level"]) {
  switch (level) {
    case "high":
      return "bg-[var(--color-semantic-success-soft)] text-[var(--color-semantic-success-text)]"
    case "medium":
      return "bg-[var(--color-semantic-warning-soft)] text-[var(--color-semantic-warning-text)]"
    case "low":
      return "bg-[var(--color-semantic-error-soft)] text-[var(--color-semantic-error-text)]"
  }
}

export function ConfidenceAnalysisPanel({ confidence }: ConfidenceAnalysisPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Confidence analysis">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Confidence Analysis</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Why AIOS is confident</h2>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${labelClass(confidence?.level ?? "low")}`}>
          {confidence?.level ?? "low"}
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-brand-navy">{confidence?.score ?? 0}%</p>
      <p className="mt-2 text-xs leading-5 text-text-secondary">{confidence?.explanation ?? "Select a decision to inspect confidence analysis."}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(confidence?.drivers ?? []).map((driver) => (
          <span key={driver} className="rounded-full border border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] px-2 py-1 text-[11px] text-[var(--color-semantic-info-text)]">
            {driver}
          </span>
        ))}
      </div>
    </section>
  )
}