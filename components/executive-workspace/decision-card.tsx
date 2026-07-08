import type { DecisionCenterItem } from "@/types"

type DecisionCardProps = {
  item: DecisionCenterItem
  onApprove: (id: string) => void
}

export function DecisionCard({ item, onApprove }: DecisionCardProps) {
  const riskTone =
    item.riskLevel === "critical"
      ? "bg-rose-100 text-rose-700"
      : item.riskLevel === "high"
        ? "bg-amber-100 text-amber-700"
        : "bg-sky-100 text-sky-700"

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
          <p className="mt-1 text-xs text-text-muted">Owner {item.owner}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${riskTone}`}>Risk {item.riskLevel}</span>
      </div>

      <p className="mt-3 text-sm text-text-secondary">{item.recommendedAction}</p>
      <p className="mt-2 rounded-lg bg-surface-muted px-3 py-2 text-xs text-text-secondary">{item.aiExplanation}</p>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onApprove(item.id)}
          className="rounded border border-brand-primary/40 bg-brand-subtle px-2 py-1 text-xs font-semibold text-brand-navy hover:bg-brand-subtle/70"
        >
          Approve
        </button>
        <button
          type="button"
          className="rounded border border-border px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
        >
          Request Review
        </button>
      </div>
    </article>
  )
}
