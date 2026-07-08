"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useReducedMotion } from "framer-motion"
import { useWorkflowBuilder } from "@/hooks"
import { WorkflowCanvasSurface } from "@/components/workflow-canvas/workflow-canvas-surface"
import { WorkflowHistoryCard } from "@/components/workflows/workflow-history-card"
import { WorkflowExecutionPreview } from "./workflow-execution-preview"
import { WorkflowSidebar } from "./workflow-sidebar"

const WorkflowInspectorPanel = dynamic(
  () => import("@/components/workflow-inspector/workflow-inspector-panel").then((mod) => mod.WorkflowInspectorPanel),
  {
    ssr: false,
    loading: () => (
      <aside className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs text-text-muted">Loading inspector...</p>
      </aside>
    ),
  }
)

export function WorkflowBuilderView() {
  const { selectedWorkflow, execution, runExecutionPreview } = useWorkflowBuilder()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault()
        runExecutionPreview()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [runExecutionPreview])

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Workflow Builder header">
        <p className="text-xs uppercase tracking-wide text-text-muted">Visual Orchestration Layer</p>
        <h1 className="text-xl font-semibold text-brand-navy">AIOS Workflow Builder</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Design autonomous business workflows that become executable by the AIOS runtime engine.
        </p>
        <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-text-muted">
          <span className="rounded border border-border px-1.5 py-0.5">Canvas: Pan + Zoom + Snap</span>
          <span className="rounded border border-border px-1.5 py-0.5">Execution preview: {execution.running ? "Running" : "Idle"}</span>
          <span className="rounded border border-border px-1.5 py-0.5">Ctrl/⌘ + Enter to run preview</span>
          {selectedWorkflow ? <span className="rounded border border-border px-1.5 py-0.5">Workflow: {selectedWorkflow.name}</span> : null}
          {reduceMotion ? <span className="rounded border border-border px-1.5 py-0.5">Reduced motion</span> : null}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <WorkflowSidebar />

        <main className="space-y-3" aria-label="Workflow canvas and execution preview">
          <WorkflowCanvasSurface />
          <WorkflowExecutionPreview />
        </main>

        <div className="space-y-3" aria-label="Workflow inspector and history">
          <WorkflowInspectorPanel />
          <WorkflowHistoryCard />
        </div>
      </div>
    </div>
  )
}
