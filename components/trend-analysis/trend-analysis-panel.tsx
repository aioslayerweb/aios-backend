"use client"

import type { ExecutiveTrendSeries } from "@/types"
import { cn } from "@/utils"

type TrendAnalysisPanelProps = {
  series: ExecutiveTrendSeries[]
  selectedTrend: ExecutiveTrendSeries | null
  selectedTrendId: string
  onSelectTrend: (id: string) => void
}

export function TrendAnalysisPanel({ series, selectedTrend, selectedTrendId, onSelectTrend }: TrendAnalysisPanelProps) {
  const maxValue = Math.max(1, ...(selectedTrend?.points.map((point) => point.value) ?? [1]))

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Trend analysis">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Trend Analysis</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">30 days, 90 days, 12 months</h2>
          <p className="mt-1 text-sm text-text-secondary">Growth, decline, anomalies, and predictive direction are summarized here.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Trend horizons">
          {series.map((item) => {
            const active = item.id === selectedTrendId
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectTrend(item.id)}
                className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", active ? "bg-brand-primary text-white" : "border border-border bg-white text-text-secondary hover:bg-surface-muted")}
              >
                {item.horizon}
              </button>
            )
          })}
        </div>
      </div>

      {selectedTrend ? (
        <div className="mt-4 space-y-3">
          <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{selectedTrend.title}</p>
                <p className="mt-1 text-xs text-text-secondary">{selectedTrend.summary}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{selectedTrend.status}</span>
            </div>
            <div className="mt-4 flex items-end gap-2 rounded-xl bg-white p-3">
              {selectedTrend.points.map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full items-end">
                    <div className="w-full rounded-t-lg bg-[linear-gradient(180deg,#1c82f2_0%,#6db6ff_100%)]" style={{ height: `${Math.max(12, (point.value / maxValue) * 100)}%` }} />
                  </div>
                  <p className="text-[11px] text-text-muted">{point.label}</p>
                  <p className="text-xs font-semibold text-brand-navy">{point.value}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}
    </section>
  )
}