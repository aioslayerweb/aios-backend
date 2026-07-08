"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { usePromptExecution, usePromptOS, usePromptSuggestions, usePromptTemplates } from "@/hooks"
import { ExecutionPlanPanel } from "@/components/execution-plan/execution-plan-panel"
import { PromptEditor } from "@/components/prompt-editor/prompt-editor"
import { ReasoningPanel } from "@/components/reasoning/reasoning-panel"
import { ResultsPanel } from "@/components/results/results-panel"
import { TemplateGallery } from "@/components/templates/template-gallery"
import { AssignedAgentsPanel } from "./assigned-agents-panel"
import { ExecutionTimelinePanel } from "./execution-timeline-panel"
import { FollowUpPanel } from "./follow-up-panel"
import { MemoryStoragePanel } from "./memory-storage-panel"

const PromptHistoryPanel = dynamic(
  () => import("./prompt-history-panel").then((mod) => mod.PromptHistoryPanel),
  {
    ssr: false,
    loading: () => (
      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs text-text-muted">Loading prompt history...</p>
      </section>
    ),
  }
)

export function PromptOSView() {
  const { prompt, setPrompt, runPrompt, interpretation, result, memoryUpdates, status } = usePromptOS()
  const { plan, reasoning, agents, timeline, progress } = usePromptExecution()
  const { templates, useTemplate } = usePromptTemplates()
  const { suggestions, applyFollowUp } = usePromptSuggestions()

  const statusLabel = useMemo(() => status.replace("-", " "), [status])

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Prompt OS header">
        <p className="text-xs uppercase tracking-wide text-text-muted">Natural Language Operating Layer</p>
        <h1 className="text-xl font-semibold text-brand-navy">AIOS Prompt OS</h1>
        <p className="mt-1 text-sm text-text-secondary">Issue objectives. AIOS plans, reasons, delegates, executes, and reports outcomes.</p>
        <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-text-muted">
          <span className="rounded border border-border px-1.5 py-0.5 capitalize">Status {statusLabel}</span>
          <span className="rounded border border-border px-1.5 py-0.5">Progress {progress}%</span>
          {interpretation ? <span className="rounded border border-border px-1.5 py-0.5">Intent confidence {interpretation.confidence}%</span> : null}
        </div>
      </section>

      <PromptEditor value={prompt} onChange={setPrompt} onRun={runPrompt} />

      {interpretation ? (
        <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Prompt understanding">
          <p className="text-sm font-semibold text-brand-navy">Prompt Understanding</p>
          <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <article className="rounded border border-border bg-surface-muted p-2">
              <p className="text-[11px] uppercase tracking-wide text-text-muted">Intent</p>
              <p className="mt-1 text-xs text-text-primary">{interpretation.intent}</p>
            </article>
            <article className="rounded border border-border bg-surface-muted p-2">
              <p className="text-[11px] uppercase tracking-wide text-text-muted">Domain</p>
              <p className="mt-1 text-xs capitalize text-text-primary">{interpretation.domain}</p>
            </article>
            <article className="rounded border border-border bg-surface-muted p-2">
              <p className="text-[11px] uppercase tracking-wide text-text-muted">Priority</p>
              <p className="mt-1 text-xs capitalize text-text-primary">{interpretation.priority}</p>
            </article>
            <article className="rounded border border-border bg-surface-muted p-2">
              <p className="text-[11px] uppercase tracking-wide text-text-muted">Confidence</p>
              <p className="mt-1 text-xs text-text-primary">{interpretation.confidence}%</p>
            </article>
            <article className="rounded border border-border bg-surface-muted p-2">
              <p className="text-[11px] uppercase tracking-wide text-text-muted">Estimated Time</p>
              <p className="mt-1 text-xs text-text-primary">{interpretation.estimatedMinutes} min</p>
            </article>
            <article className="rounded border border-border bg-surface-muted p-2">
              <p className="text-[11px] uppercase tracking-wide text-text-muted">Suggested Agents</p>
              <p className="mt-1 text-xs text-text-primary">{interpretation.suggestedAgents.join(", ")}</p>
            </article>
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          <ExecutionPlanPanel plan={plan} />
          <ReasoningPanel reasoning={reasoning} />
          <AssignedAgentsPanel agents={agents} />
          <ExecutionTimelinePanel timeline={timeline} />
          <ResultsPanel result={result} />
          <MemoryStoragePanel memoryUpdates={memoryUpdates} />
          <FollowUpPanel suggestions={suggestions} onApply={applyFollowUp} />
          <TemplateGallery templates={templates} onUseTemplate={useTemplate} />
        </div>

        <PromptHistoryPanel />
      </div>
    </div>
  )
}
