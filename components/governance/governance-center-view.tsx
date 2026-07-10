"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { Activity, LockKeyhole, ShieldCheck, Scale, ScrollText } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import {
  useAuditTrail,
  useCompliance,
  useDecisionHistory,
  useGovernance,
  usePolicies,
  useReasoning,
  useRiskAnalysis,
} from "@/hooks"
import { ApprovalCenterPanel } from "@/components/approvals/approval-center-panel"
import { AuditTrailPanel } from "@/components/audit/audit-trail-panel"
import { ComplianceCenterPanel } from "@/components/compliance/compliance-center-panel"
import { PolicyEnginePanel } from "@/components/policies/policy-engine-panel"
import { ReasoningViewerPanel } from "@/components/reasoning/reasoning-viewer-panel"
import { RiskAnalysisPanel } from "@/components/risk/risk-analysis-panel"
import { Button, StatusIndicator } from "@/components/ui"
import { DecisionExplorerPanel } from "./decision-explorer-panel"

const EvidenceTimelinePanel = dynamic(
  () => import("@/components/audit/evidence-timeline-panel").then((mod) => mod.EvidenceTimelinePanel),
  {
    ssr: false,
    loading: () => (
      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs text-text-muted">Loading evidence timeline...</p>
      </section>
    ),
  }
)

export function GovernanceCenterView() {
  const reduceMotion = useReducedMotion()
  const { summary, liveMode, setLiveMode, selectedApprovals, selectedDecision, setSelectedDecisionId, applyApprovalAction } = useGovernance()
  const { decisions, selectedDecisionId, query, updateQuery } = useDecisionHistory()
  const { reasoning, evidence } = useReasoning()
  const { policies } = usePolicies()
  const { compliance, complianceView, setComplianceView } = useCompliance()
  const { auditTrail } = useAuditTrail()
  const { selectedRisk, risk } = useRiskAnalysis()

  const headerMeta = useMemo(
    () => [`${summary.pendingApprovals} pending approvals`, `${summary.activePolicies} active policies`, `${summary.highRiskDecisions} high-risk decisions`],
    [summary.activePolicies, summary.highRiskDecisions, summary.pendingApprovals]
  )

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="overflow-hidden rounded-[28px] border border-[var(--color-semantic-info)] bg-white shadow-[0_24px_80px_rgba(28,130,242,0.10)]"
        aria-label="Governance dashboard header"
      >
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(28,130,242,0.16),_transparent_38%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#eef6ff_100%)] p-6 md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-primary">Governance Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy md:text-[2.2rem]">AIOS Explainability & Governance Center</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                Transparent, auditable views across recommendations, approvals, evidence, policies, and risk so executives, auditors, and compliance teams can always answer why, when, who, and based on what.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--color-semantic-info-soft)] px-3 py-1 text-xs font-medium text-[var(--color-semantic-info-text)] ring-1 ring-sky-100">Decision Engine linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Runtime + Replay linked</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Memory + Prompt OS linked</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px] xl:max-w-[480px]">
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Explainability coverage</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{summary.explainabilityCoverage}%</p>
                <p className="mt-1 text-xs text-text-secondary">Decision records with user-facing reasoning attached.</p>
              </article>
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Compliance attention</p>
                <p className="mt-2 text-3xl font-semibold text-brand-navy">{summary.complianceAttention}</p>
                <p className="mt-1 text-xs text-text-secondary">Framework views currently needing additional control work.</p>
              </article>
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Live governance</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <StatusIndicator tone={liveMode ? "success" : "neutral"} label={liveMode ? "Monitoring" : "Paused"} />
                  <Button variant="secondary" size="sm" onClick={() => setLiveMode(!liveMode)} aria-pressed={liveMode}>{liveMode ? "Pause" : "Resume"}</Button>
                </div>
              </article>
              <article className="rounded-2xl border border-[var(--color-semantic-info)] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-text-muted">Confidence posture</p>
                <p className="mt-2 text-sm font-semibold capitalize text-brand-navy">{summary.confidenceLevel}</p>
                <p className="mt-1 text-xs text-text-secondary">Portfolio-level confidence across governed decisions.</p>
              </article>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Governance controls">
        <div className="flex flex-wrap items-start gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Enterprise Explainability Layer</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-navy">Every AI action stays inspectable</h2>
            <p className="mt-1 text-sm text-text-secondary">Users can inspect decisions, reasoning, evidence, approvals, policies, compliance posture, and risk without exposing chain-of-thought.</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span className="rounded border border-border px-1.5 py-0.5"><Activity className="mr-1 inline h-3 w-3" />Evidence live</span>
            <span className="rounded border border-border px-1.5 py-0.5"><ShieldCheck className="mr-1 inline h-3 w-3" />Auditable</span>
            <span className="rounded border border-border px-1.5 py-0.5"><LockKeyhole className="mr-1 inline h-3 w-3" />Compliance ready</span>
            <span className="rounded border border-border px-1.5 py-0.5"><Scale className="mr-1 inline h-3 w-3" />Policy aware</span>
            <span className="rounded border border-border px-1.5 py-0.5"><ScrollText className="mr-1 inline h-3 w-3" />Immutable history</span>
          </div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <input
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search decisions, workflows, agents, or governance records"
              className="w-full bg-transparent text-sm text-text-primary outline-none"
              aria-label="Search governance decisions"
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
        <aside className="space-y-4" aria-label="Governance left column">
          <DecisionExplorerPanel decisions={decisions} selectedDecisionId={selectedDecisionId} onSelectDecision={setSelectedDecisionId} />
          <ApprovalCenterPanel approvals={selectedApprovals} onAction={applyApprovalAction} />
        </aside>

        <main className="space-y-4" aria-label="Governance main content">
          <ReasoningViewerPanel reasoning={reasoning} />
          <EvidenceTimelinePanel evidence={evidence} />
          <PolicyEnginePanel policies={policies} />
          <ComplianceCenterPanel compliance={compliance} complianceView={complianceView} onChangeView={setComplianceView} />
        </main>

        <aside className="space-y-4" aria-label="Governance right column">
          <AuditTrailPanel auditTrail={auditTrail} />
          <RiskAnalysisPanel selectedRisk={selectedRisk} risk={risk} />
        </aside>
      </div>
    </div>
  )
}