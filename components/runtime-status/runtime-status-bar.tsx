"use client"

import { motion } from "framer-motion"
import { ChevronUp, LoaderCircle } from "lucide-react"
import { useRuntime, useRuntimeModules, useRuntimeStatus, useSystemHealth } from "@/hooks"
import { formatRuntimeElapsed } from "@/utils/runtime-status"
import { RuntimePanel } from "./runtime-panel"
import { RuntimeStatusIndicator } from "./runtime-status-indicator"
import { SystemHealthBadge } from "./system-health-badge"

export function RuntimeStatusBar() {
  const { modules, expanded, setExpanded, lastUpdated, websocketState } = useRuntimeStatus()
  const { overallHealth } = useSystemHealth()
  const { activeModules } = useRuntimeModules()
  const { runningAgents, pendingTasks } = useRuntime()

  const compactModules = modules.slice(0, 5)

  return (
    <>
      <footer className="border-t border-border bg-surface-canvas px-4 py-2 md:px-6 lg:px-8" aria-label="Runtime status bar">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            aria-label="Toggle runtime status panel"
            aria-expanded={expanded}
          >
            <SystemHealthBadge health={overallHealth} />
            <span>Runtime</span>
            <ChevronUp className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : "rotate-0"}`} />
          </button>

          <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-text-muted">
            <LoaderCircle className={websocketState.mode === "connecting" ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            Realtime {websocketState.enabled ? websocketState.mode : "idle"}
          </span>

          <span className="text-xs text-text-muted">Updated {formatRuntimeElapsed(lastUpdated)}</span>

          <div className="ml-auto hidden items-center gap-1 xl:flex">
            {compactModules.map((moduleStatus) => (
              <motion.div key={moduleStatus.key} layout>
                <RuntimeStatusIndicator module={moduleStatus} compact />
              </motion.div>
            ))}
          </div>

          <span className="rounded-md border border-border px-2 py-1 text-xs text-text-secondary">
            {activeModules.length} active modules
          </span>
          <span className="rounded-md border border-border px-2 py-1 text-xs text-text-secondary">
            {runningAgents} agents · {pendingTasks} pending
          </span>
        </div>
      </footer>

      <RuntimePanel open={expanded} onClose={() => setExpanded(false)} />
    </>
  )
}
