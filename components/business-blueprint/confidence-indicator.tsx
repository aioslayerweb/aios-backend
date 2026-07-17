type ConfidenceIndicatorProps = {
  score: number
  source: string
  lastUpdated: string
  verifiedBy?: string
}

function confidenceTone(score: number): "high" | "medium" | "low" {
  if (score >= 80) {
    return "high"
  }
  if (score >= 60) {
    return "medium"
  }
  return "low"
}

const toneStyle = {
  high: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-rose-100 text-rose-700 border-rose-200",
} as const

export function ConfidenceIndicator({ score, source, lastUpdated, verifiedBy }: ConfidenceIndicatorProps) {
  const tone = confidenceTone(score)
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</p>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${toneStyle[tone]}`}>
          {score}%
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-700">Source: {source}</p>
      <p className="mt-1 text-xs text-slate-500">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
      {verifiedBy ? <p className="mt-1 text-xs text-slate-500">Verified by: {verifiedBy}</p> : null}
    </div>
  )
}
