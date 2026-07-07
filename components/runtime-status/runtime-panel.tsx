"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useBreakpoint, useRuntimeStatus } from "@/hooks"
import { drawerVariants, modalVariants, slideUpVariants } from "@/theme"
import { Button } from "@/components/ui"
import { ConnectionStatus } from "./connection-status"
import { RuntimeHealthCard } from "./runtime-health-card"
import { RuntimeModuleCard } from "./runtime-module-card"
import { RuntimeSummary } from "./runtime-summary"
import { AgentRuntimeStatus } from "./agent-runtime-status"
import { MemoryRuntimeStatus } from "./memory-runtime-status"

type RuntimePanelProps = {
  open: boolean
  onClose: () => void
}

export function RuntimePanel({ open, onClose }: RuntimePanelProps) {
  const { isMobile, isTablet } = useBreakpoint()
  const { modules, lastUpdated } = useRuntimeStatus()

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[var(--z-drawer)] bg-slate-900/35" onClick={onClose}>
          {isMobile ? (
            <motion.section
              variants={slideUpVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute bottom-0 left-0 right-0 max-h-[84vh] overflow-y-auto rounded-t-2xl border border-border bg-surface-app"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Runtime status panel"
            >
              <PanelContent modules={modules} lastUpdated={lastUpdated} onClose={onClose} />
            </motion.section>
          ) : isTablet ? (
            <motion.aside
              variants={drawerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="ml-auto h-full w-[560px] max-w-[96vw] overflow-y-auto border-l border-border bg-surface-app"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Runtime status panel"
            >
              <PanelContent modules={modules} lastUpdated={lastUpdated} onClose={onClose} />
            </motion.aside>
          ) : (
            <motion.section
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute bottom-16 right-4 h-[70vh] w-[760px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border bg-surface-app shadow-lg"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Runtime status panel"
            >
              <PanelContent modules={modules} lastUpdated={lastUpdated} onClose={onClose} />
            </motion.section>
          )}
        </div>
      ) : null}
    </AnimatePresence>
  )
}

function PanelContent({
  modules,
  lastUpdated,
  onClose,
}: {
  modules: ReturnType<typeof useRuntimeStatus>["modules"]
  lastUpdated: number
  onClose: () => void
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface-canvas px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-brand-navy">Runtime Status Panel</p>
          <p className="text-xs text-text-muted">Operational visibility across AIOS modules</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close runtime status panel">
          <X className="h-4 w-4" />
        </Button>
      </header>

      <div className="grid gap-3 p-4 lg:grid-cols-2">
        <RuntimeHealthCard lastUpdated={lastUpdated} />
        <RuntimeSummary modules={modules} />
        <ConnectionStatus />
        <AgentRuntimeStatus />
        <MemoryRuntimeStatus />
        {modules
          .filter((moduleStatus) => moduleStatus.key !== "agents" && moduleStatus.key !== "memory")
          .map((moduleStatus) => (
            <RuntimeModuleCard key={moduleStatus.key} module={moduleStatus} />
          ))}
      </div>
    </div>
  )
}
