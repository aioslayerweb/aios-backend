"use client"

import type { ExecutiveBoardReportTemplate } from "@/types"
import { cn } from "@/utils"

type BoardReportGeneratorPanelProps = {
  reports: ExecutiveBoardReportTemplate[]
  selectedReport: ExecutiveBoardReportTemplate | null
  selectedReportId: string
  onSelectReport: (id: string) => void
}

export function BoardReportGeneratorPanel({ reports, selectedReport, selectedReportId, onSelectReport }: BoardReportGeneratorPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Board report generator">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Board Report Generator</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Presentation-ready report architecture</h2>
          <p className="mt-1 text-sm text-text-secondary">Weekly, monthly, quarterly, and annual board packs are defined here for future PDF, PowerPoint, scheduling, and delivery workflows.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Board report templates">
          {reports.map((report) => {
            const active = report.id === selectedReportId
            return (
              <button
                key={report.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectReport(report.id)}
                className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", active ? "bg-brand-primary text-white" : "border border-border bg-white text-text-secondary hover:bg-surface-muted")}
              >
                {report.cadence}
              </button>
            )
          })}
        </div>
      </div>

      {selectedReport ? (
        <article className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-navy">{selectedReport.name}</p>
              <p className="mt-1 text-xs leading-5 text-text-secondary">{selectedReport.summary}</p>
            </div>
            <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{selectedReport.status}</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {selectedReport.sections.map((section) => (
              <div key={section} className="rounded-xl bg-white p-3 text-xs text-brand-navy">
                {section}
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </section>
  )
}