"use client"

import { Play, Square } from "lucide-react"
import { useWorkflowExecution } from "@/hooks"

export function WorkflowExecutionPreview() {
  const { execution, completion, runExecutionPreview, stopExecutionPreview } = useWorkflowExecution()

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Execution preview">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-brand-navy">Execution Preview</p>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={runExecutionPreview}
            className="rounded border border-border px-2 py-1 text-[11px] text-text-secondary"
            aria-label="Run workflow preview"
          >
            <Play className="mr-1 inline h-3 w-3" />Run
          </button>
          <button
            type="button"
            onClick={stopExecutionPreview}
            className="rounded border border-border px-2 py-1 text-[11px] text-text-secondary"
            aria-label="Stop workflow preview"
          >
            <Square className="mr-1 inline h-3 w-3" />Stop
          </button>
        </div>
      </div>

      <div className="mt-2 rounded border border-border bg-surface-muted p-2">
        <div className="flex items-center justify-between text-[11px] text-text-muted">
          <span>Estimated duration</span>
          <span>{execution.estimatedDurationSeconds}s</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-brand-primary" style={{ width: `${completion}%` }} />
        </div>
      </div>

      <div className="mt-2 max-h-52 space-y-1 overflow-y-auto">
        {execution.steps.map((step) => (
          <article
            key={step.id}
            className={step.status === "running" ? "rounded border border-blue-300 bg-blue-50 p-2" : step.status === "completed" ? "rounded border border-emerald-300 bg-emerald-50 p-2" : "rounded border border-border bg-surface-muted p-2"}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-text-primary">{step.nodeTitle}</p>
              <p className="text-[11px] capitalize text-text-muted">{step.status}</p>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">Agents: {step.assignedAgents.join(", ")}</p>
          </article>
        ))}
      </div>

      <div className="mt-2 max-h-24 space-y-1 overflow-y-auto rounded border border-border bg-surface-muted p-2">
        {execution.timeline.map((entry) => (
          <p key={entry.id} className="text-[11px] text-text-secondary">
            {new Date(entry.timestamp).toLocaleTimeString()} - {entry.label}
          </p>
        ))}
      </div>
    </section>
  )
}
