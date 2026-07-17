type CompletionProgressProps = {
  score: number
}

export function CompletionProgress({ score }: CompletionProgressProps) {
  const bounded = Math.max(0, Math.min(100, score))
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Blueprint Completion</p>
        <p className="text-sm font-semibold text-slate-800">{bounded}%</p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#1c82f2,#58a7ff)]" style={{ width: `${bounded}%` }} />
      </div>
    </div>
  )
}
