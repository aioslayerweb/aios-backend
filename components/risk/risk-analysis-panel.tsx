import { RiskLevel } from "@/src/domain/common/enums"
import type { GovernanceRiskItem } from "@/types"

type RiskAnalysisPanelProps = {
  selectedRisk: GovernanceRiskItem | null
  risk: GovernanceRiskItem[]
}

function riskTone(value: GovernanceRiskItem["overallRisk"]) {
  switch (value) {
    case "critical":
      return "bg-rose-50 text-rose-700"
    case "high":
      return "bg-amber-50 text-amber-700"
    case "medium":
      return "bg-sky-50 text-sky-700"
    case "low":
      return "bg-emerald-50 text-emerald-700"
  }
}

export function RiskAnalysisPanel({ selectedRisk, risk }: RiskAnalysisPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Risk analysis">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Risk Analysis</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Business, operational, compliance risk</h2>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${riskTone(selectedRisk?.overallRisk ?? RiskLevel.Low)}`}>{selectedRisk?.overallRisk ?? RiskLevel.Low}</span>
      </div>
      {selectedRisk ? (
        <div className="mt-4 space-y-3">
          <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-sm font-semibold text-brand-navy">{selectedRisk.title}</p>
            <p className="mt-1 text-[11px] text-text-muted">Confidence {selectedRisk.confidence}% · Trend {selectedRisk.trend}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Business</p><p className="mt-1 text-sm font-semibold text-brand-navy">{selectedRisk.businessRisk}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Operational</p><p className="mt-1 text-sm font-semibold text-brand-navy">{selectedRisk.operationalRisk}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Compliance</p><p className="mt-1 text-sm font-semibold text-brand-navy">{selectedRisk.complianceRisk}</p></div>
              <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Confidence</p><p className="mt-1 text-sm font-semibold text-brand-navy">{selectedRisk.confidence}%</p></div>
            </div>
          </article>
          <div className="grid gap-3 sm:grid-cols-2">
            {risk.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
                <p className="mt-1 text-[11px] text-text-muted">{item.overallRisk} risk · trend {item.trend}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}