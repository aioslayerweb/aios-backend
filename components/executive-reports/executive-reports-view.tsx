"use client"

import { BarChart3, BrainCircuit, FileText, ShieldCheck, Sparkles } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useBoardReports, useBusinessHealth, useExecutiveReports, useExecutiveTimeline, useRiskDashboard, useStrategicKPIs, useTrendAnalysis } from "@/hooks"
import { BoardReportGeneratorPanel } from "@/components/board-report/board-report-generator-panel"
import { BusinessHealthScoreboard } from "@/components/business-health/business-health-scoreboard"
import { ExecutiveOverviewPanel } from "@/components/executive-summary/executive-overview-panel"
import { StrategicKPIGrid } from "@/components/kpi-grid/strategic-kpi-grid"
import { ExecutiveRiskDashboard } from "@/components/risk-dashboard/executive-risk-dashboard"
import { TrendAnalysisPanel } from "@/components/trend-analysis/trend-analysis-panel"
import { AIRecommendationsPanel } from "./ai-recommendations-panel"
import { DepartmentPerformancePanel } from "./department-performance-panel"
import { ExecutiveTimelinePanel } from "./executive-timeline-panel"
import { OperationalSummaryPanel } from "./operational-summary-panel"
import { StatusIndicator } from "@/components/ui"

export function ExecutiveReportsView() {
  const reduceMotion = useReducedMotion()
  const { overview, operationalSummary, recommendations, departmentPerformance, liveMode, setLiveMode } = useExecutiveReports()
  const { health, businessScore } = useBusinessHealth()
  const { strategicKPIs } = useStrategicKPIs()
  const { riskCategories } = useRiskDashboard()
  const { timeline } = useExecutiveTimeline()
  const { trendSeries, selectedTrend, selectedTrendId, setSelectedTrendId } = useTrendAnalysis()
  const { boardReports, selectedReport, selectedReportId, setSelectedReportId } = useBoardReports()

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_rgba(28,130,242,0.10)]"
        aria-label="Executive reports header"
      >
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(28,130,242,0.16),_transparent_38%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#eef6ff_100%)] p-6 md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-primary">Executive Intelligence Center</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy md:text-[2.2rem]">AIOS Executive Reports & Board Intelligence</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                Board-ready intelligence that explains what happened, why it happened, what changed, where the risks and opportunities are, and what leadership should do next.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">Executive Intelligence linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Knowledge Graph linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Decision + Governance linked</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:max-w-[500px]">
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Board report templates</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{boardReports.length}</p>
                <p className="mt-1 text-xs text-text-secondary">Weekly to annual reporting architecture is ready.</p>
              </article>
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Strategic KPI coverage</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{strategicKPIs.length}</p>
                <p className="mt-1 text-xs text-text-secondary">Board-level performance indicators under active tracking.</p>
              </article>
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Reporting mode</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <StatusIndicator tone={liveMode ? "success" : "neutral"} label={liveMode ? "Live reporting" : "Paused"} />
                  <button type="button" onClick={() => setLiveMode(!liveMode)} className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-muted">{liveMode ? "Pause" : "Resume"}</button>
                </div>
              </article>
              <article className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Selected trend</p>
                <p className="mt-2 text-sm font-semibold text-brand-navy">{selectedTrend?.title ?? "No trend selected"}</p>
                <p className="mt-1 text-xs text-text-secondary">{selectedTrend?.summary ?? "Select a trend horizon to inspect."}</p>
              </article>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Executive reports overview">
        <div className="flex flex-wrap items-start gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Board Intelligence Layer</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-navy">Replace hours of manual reporting with intelligent synthesis</h2>
            <p className="mt-1 text-sm text-text-secondary">This center composes runtime, memory, governance, graph, workflow, and integration signals into board-grade narrative structure.</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span className="rounded border border-border px-1.5 py-0.5"><Sparkles className="mr-1 inline h-3 w-3" />AI recommendations</span>
            <span className="rounded border border-border px-1.5 py-0.5"><BarChart3 className="mr-1 inline h-3 w-3" />Trend analysis</span>
            <span className="rounded border border-border px-1.5 py-0.5"><ShieldCheck className="mr-1 inline h-3 w-3" />Risk aware</span>
            <span className="rounded border border-border px-1.5 py-0.5"><BrainCircuit className="mr-1 inline h-3 w-3" />Decision linked</span>
            <span className="rounded border border-border px-1.5 py-0.5"><FileText className="mr-1 inline h-3 w-3" />Board pack ready</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-4" aria-label="Executive reporting main content">
          <ExecutiveOverviewPanel overview={overview} />
          <StrategicKPIGrid kpis={strategicKPIs} />
          <BusinessHealthScoreboard health={health} businessScore={businessScore} />
          <OperationalSummaryPanel summary={operationalSummary} />
          <AIRecommendationsPanel recommendations={recommendations} />
          <ExecutiveRiskDashboard riskCategories={riskCategories} />
          <DepartmentPerformancePanel departments={departmentPerformance} />
          <TrendAnalysisPanel series={trendSeries} selectedTrend={selectedTrend} selectedTrendId={selectedTrendId} onSelectTrend={setSelectedTrendId} />
          <ExecutiveTimelinePanel timeline={timeline} />
        </main>

        <aside className="space-y-4" aria-label="Board report side rail">
          <BoardReportGeneratorPanel reports={boardReports} selectedReport={selectedReport} selectedReportId={selectedReportId} onSelectReport={setSelectedReportId} />
        </aside>
      </div>
    </div>
  )
}