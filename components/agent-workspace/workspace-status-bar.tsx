"use client"

import type { AgentWorkspaceMetrics } from "@/types"

type WorkspaceStatusBarProps = {
  metrics: AgentWorkspaceMetrics
}

export function WorkspaceStatusBar({ metrics }: WorkspaceStatusBarProps) {
  return (
    <footer className="sticky bottom-0 z-10 rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Agent workspace status bar">
      <div className="grid gap-2 text-xs text-text-secondary sm:grid-cols-2 xl:grid-cols-7">
        <span className="rounded border border-border px-2 py-1">Running Agents {metrics.runningAgents}</span>
        <span className="rounded border border-border px-2 py-1">Queued Tasks {metrics.queuedTasks}</span>
        <span className="rounded border border-border px-2 py-1">Average Confidence {metrics.averageConfidence}%</span>
        <span className="rounded border border-border px-2 py-1">Runtime Health {metrics.runtimeHealth}%</span>
        <span className="rounded border border-border px-2 py-1">Events/sec {metrics.eventsPerSecond}</span>
        <span className="rounded border border-border px-2 py-1">Memory Size {metrics.memorySizeMb} MB</span>
        <span className="rounded border border-border px-2 py-1">Latency {metrics.latencyMs} ms</span>
      </div>
    </footer>
  )
}
