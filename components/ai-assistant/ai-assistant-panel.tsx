"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useAIAssistant, useAgentStatus, useAISuggestions, useCurrentContext, useExecutionTimeline, useNotifications } from "@/hooks"
import type { AIQuickAction } from "@/types"
import { drawerVariants, panelVariants, slideUpVariants, staggerContainer } from "@/theme"
import { Button } from "@/components/ui"
import { AISection } from "./ai-section"
import { AgentStatusCard } from "./agent-status-card"
import { AISuggestionCard } from "./ai-suggestion-card"
import { ContextCard } from "./context-card"
import { ExecutionTimeline } from "./execution-timeline"
import { MemoryCard } from "./memory-card"
import { PanelFooter } from "./panel-footer"
import { PanelHeader } from "./panel-header"
import { QuickActions } from "./quick-actions"
import { ResizableHandle } from "./resizable-handle"

type PanelMode = "desktop" | "tablet" | "mobile"

type AIAssistantPanelProps = {
  mode: PanelMode
  open: boolean
  onClose?: () => void
}

function Content() {
  const currentContext = useCurrentContext()
  const { suggestions } = useAISuggestions()
  const { agentStatuses, runningCount } = useAgentStatus()
  const executionTimeline = useExecutionTimeline()
  const { memoryEntries, quickActions, collapsed } = useAIAssistant()
  const { push } = useNotifications()

  const runAction = (action: AIQuickAction) => {
    push({
      tone: "info",
      title: `${action.label} queued`,
      description: "AI Prompt OS integration point is prepared.",
    })
  }

  if (collapsed) {
    return <div className="p-3 text-xs text-text-muted">AI</div>
  }

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3"
      >
        <AISection title="Current Context">
          <ContextCard label="Current Workspace" value={currentContext.workspace} />
          <ContextCard label="Current Customer" value={currentContext.customer} />
          <ContextCard label="Current Company" value={currentContext.company} />
          <ContextCard label="Current Task" value={currentContext.task} />
          <ContextCard label="Current Workflow" value={currentContext.workflow} />
        </AISection>

        <AISection title="AI Suggestions">
          {suggestions.map((item) => (
            <AISuggestionCard key={item.id} suggestion={item} />
          ))}
        </AISection>

        <AISection title="Running Agents">
          {agentStatuses.map((item) => (
            <AgentStatusCard key={item.id} agent={item} />
          ))}
        </AISection>

        <AISection title="Memory">
          {memoryEntries.map((item) => (
            <MemoryCard key={item.id} memory={item} />
          ))}
        </AISection>

        <AISection title="Execution Timeline">
          <ExecutionTimeline events={executionTimeline} />
        </AISection>

        <AISection title="Quick Actions">
          <QuickActions actions={quickActions} onRun={runAction} />
        </AISection>
      </motion.div>
      <PanelFooter runningAgents={runningCount} />
    </>
  )
}

function DesktopPanel() {
  const { width, collapsed, setCollapsed, resizeBy } = useAIAssistant()

  return (
    <motion.aside
      layout
      variants={panelVariants}
      initial="initial"
      animate="animate"
      className="relative hidden border-l border-border bg-surface-canvas xl:flex xl:flex-col"
      style={{ width: collapsed ? 72 : width }}
      aria-label="AI assistant panel"
    >
      <ResizableHandle onResizeBy={resizeBy} />
      <PanelHeader collapsed={collapsed} onToggleCollapsed={() => setCollapsed(!collapsed)} />
      <Content />
    </motion.aside>
  )
}

function TabletPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { collapsed, setCollapsed } = useAIAssistant()

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[var(--z-drawer)] bg-slate-900/40 xl:hidden" onClick={onClose}>
          <motion.aside
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="ml-auto flex h-full w-[420px] max-w-[88vw] flex-col border-l border-border bg-surface-canvas"
            onClick={(event) => event.stopPropagation()}
            aria-label="Tablet AI assistant slide-over panel"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <PanelHeader collapsed={collapsed} onToggleCollapsed={() => setCollapsed(!collapsed)} />
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close AI assistant panel">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Content />
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

function MobilePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { collapsed, setCollapsed, mobileExpanded, setMobileExpanded } = useAIAssistant()

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[var(--z-drawer)] bg-slate-900/40 xl:hidden" onClick={onClose}>
          <motion.section
            variants={slideUpVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={
              mobileExpanded
                ? "absolute inset-0 flex flex-col border border-border bg-surface-canvas"
                : "absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border border-border bg-surface-canvas"
            }
            onClick={(event) => event.stopPropagation()}
            aria-label="Mobile AI assistant bottom sheet"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <PanelHeader collapsed={collapsed} onToggleCollapsed={() => setCollapsed(!collapsed)} />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileExpanded(!mobileExpanded)}
                  aria-label={mobileExpanded ? "Collapse panel from fullscreen" : "Expand panel to fullscreen"}
                >
                  {mobileExpanded ? "Min" : "Full"}
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close AI assistant panel">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Content />
          </motion.section>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

export function AIAssistantPanel({ mode, open, onClose }: AIAssistantPanelProps) {
  if (mode === "desktop") {
    return <DesktopPanel />
  }

  if (!onClose) {
    throw new Error("AIAssistantPanel requires onClose for mobile and tablet modes")
  }

  if (mode === "tablet") {
    return <TabletPanel open={open} onClose={onClose} />
  }

  return <MobilePanel open={open} onClose={onClose} />
}
