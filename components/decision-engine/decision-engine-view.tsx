"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { Activity, BrainCircuit, Network, ShieldCheck, Workflow } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import {
  useBusinessSignals,
  useConfidenceAnalysis,
  useDecisionEngine,
  useDecisionQueue,
  useDecisionReasoning,
  useDecisionTimeline,
  useRecommendedActions,
} from "@/hooks"
import { BusinessSignalsPanel } from "@/components/business-signals/business-signals-panel"
import { ConfidenceAnalysisPanel } from "@/components/confidence/confidence-analysis-panel"
import { DecisionQueuePanel } from "@/components/decision-center/decision-queue-panel"
import { PriorityScorePanel } from "@/components/priority-score/priority-score-panel"
import { RecommendedActionsPanel } from "@/components/recommendations/recommended-actions-panel"
import { Button, StatusIndicator } from "@/components/ui"
import { DecisionReasoningPanel } from "./decision-reasoning-panel"
import { OutcomeTrackingPanel } from "./outcome-tracking-panel"

const DecisionTimelinePanel = dynamic(
  () => import("@/components/decision-timeline/decision-timeline-panel").then((mod) => mod.DecisionTimelinePanel),
  {
    ssr: false,
    loading: () => (
      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs text-text-muted">Loading decision timeline...</p>
      </section>
    ),
  }
)

export function DecisionEngineView() {
  const reduceMotion = useReducedMotion()
  const { queue, selectedDecision, summary, liveMode, setLiveMode, selectedOutcomes } = useDecisionEngine()
  const { queue: filteredQueue, selectedDecisionId, setSelectedDecisionId, query, updateQuery } = useDecisionQueue()
  const { signals } = useBusinessSignals()
  const { reasoning, score } = useDecisionReasoning()
  const { actions, approveAction, rejectAction, executeAction } = useRecommendedActions()
  const { confidence } = useConfidenceAnalysis()
  const { timeline } = useDecisionTimeline()

  const headerMeta = useMemo(
    () => [`${queue.length} queued decisions`, `${signals.length} active signals`, `${actions.length} recommended actions`],
    [actions.length, queue.length, signals.length]
  )

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="overflow-hidden rounded-[28px] border border-[var(--color-semantic-info)] bg-white shadow-[0_24px_80px_rgba(28,130,242,0.10)]"
        aria-label="Decision engine header"
      >
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(28,130,242,0.16),_transparent_38%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#eef6ff_100%)] p-6 md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-primary">Decision Center</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy md:text-[2.2rem]">AIOS Autonomous Decision Engine</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                AIOS continuously evaluates business signals, scores priorities, explains reasoning, and recommends the next best action with transparent evidence.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--color-semantic-info-soft)] px-3 py-1 text-xs font-medium text-[var(--color-semantic-info-text)] ring-1 ring-sky-100">Runtime Engine linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Persistent Memory linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Planning + Orchestrator linked</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:max-w-[480px]">
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Pending decisions</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{queue.length}</p>
                <p className="mt-1 text-xs text-text-secondary">Executive-grade decisions across revenue, support, workflow, and knowledge.</p>
              </article>
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Selected confidence</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{confidence?.score ?? 0}%</p>
                <p className="mt-1 text-xs text-text-secondary">Transparent recommendation confidence for the active decision.</p>
              </article>
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Engine mode</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <StatusIndicator tone={liveMode ? "success" : "neutral"} label={liveMode ? "Live evaluation" : "Paused"} />
                  <Button variant="secondary" size="sm" onClick={() => setLiveMode(!liveMode)} aria-pressed={liveMode}>{liveMode ? "Pause" : "Resume"}</Button>
                </div>
              </article>
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Selected owner</p>
                <p className="mt-2 text-sm font-semibold text-brand-navy">{selectedDecision?.owner ?? "No owner selected"}</p>
                <p className="mt-1 text-xs text-text-secondary">{selectedDecision?.estimatedROI ?? "Select a decision to inspect ROI."}</p>
              </article>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Decision engine controls">
        <div className="flex flex-wrap items-start gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Autonomous Evaluation Layer</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-navy">Decision-making brain for AIOS</h2>
            <p className="mt-1 text-sm text-text-secondary">{summary}</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span className="rounded border border-border px-1.5 py-0.5"><Activity className="mr-1 inline h-3 w-3" />Signals live</span>
            <span className="rounded border border-border px-1.5 py-0.5"><BrainCircuit className="mr-1 inline h-3 w-3" />Reasoning transparent</span>
            <span className="rounded border border-border px-1.5 py-0.5"><ShieldCheck className="mr-1 inline h-3 w-3" />Approval ready</span>
            <span className="rounded border border-border px-1.5 py-0.5"><Workflow className="mr-1 inline h-3 w-3" />Workflow linked</span>
            <span className="rounded border border-border px-1.5 py-0.5"><Network className="mr-1 inline h-3 w-3" />Orchestrator linked</span>
          </div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <input
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search decisions, departments, rationale, or impact"
              className="w-full bg-transparent text-sm text-text-primary outline-none"
              aria-label="Search decision queue"
            />
          </label>
          <div className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-sm text-text-secondary">
            {selectedDecision?.title ?? "Select a decision"}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-text-muted">
          {headerMeta.map((item) => <span key={item} className="rounded border border-border px-1.5 py-0.5">{item}</span>)}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside className="space-y-4" aria-label="Decision queue and confidence">
          <DecisionQueuePanel decisions={filteredQueue} selectedDecisionId={selectedDecisionId} onSelectDecision={setSelectedDecisionId} />
          <ConfidenceAnalysisPanel confidence={confidence} />
        </aside>

        <main className="space-y-4" aria-label="Decision center main workspace">
          <BusinessSignalsPanel signals={signals} />
          <PriorityScorePanel score={score} />
          <DecisionReasoningPanel reasoning={reasoning} />
          <RecommendedActionsPanel actions={actions} onApprove={approveAction} onReject={rejectAction} onExecute={executeAction} />
          <DecisionTimelinePanel timeline={timeline} />
        </main>

        <aside className="space-y-4" aria-label="Decision center outcomes">
          <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Selected decision overview">
            <p className="text-xs uppercase tracking-wide text-text-muted">Selected Decision</p>
            <h2 className="mt-1 text-lg font-semibold text-brand-navy">{selectedDecision?.title ?? "No decision selected"}</h2>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{selectedDecision?.businessImpact ?? "Select a decision to inspect impact."}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Department</p><p className="mt-1 text-xs text-brand-navy">{selectedDecision?.department ?? "n/a"}</p></div>
              <div className="rounded-xl bg-slate-50 p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Dependencies</p><p className="mt-1 text-xs text-brand-navy">{selectedDecision?.dependencies.length ?? 0}</p></div>
            </div>
          </section>
          <OutcomeTrackingPanel outcomes={selectedOutcomes} />
        </aside>
      </div>
    </div>
  )
}