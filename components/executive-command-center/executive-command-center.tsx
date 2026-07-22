"use client";

import { motion } from "framer-motion";
import { Layers3, Sparkles } from "lucide-react";
import { useState } from "react";
import { BusinessOperatingAssistantWorkspace } from "@/components/business-operating-assistant/business-operating-assistant-workspace";
import { ExecutiveCommandCenterLegacy } from "./executive-command-center-legacy";

export function ExecutiveCommandCenter({ baseHref = "/app" }: { baseHref?: string }) {
  const [mode, setMode] = useState<"assistant" | "legacy">("assistant");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 bg-white/70 p-2 backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">AIOS Interface Mode</p>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Flagship Business Operating Assistant</p>
        </div>
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-white/15 dark:bg-slate-900/60" role="tablist" aria-label="Assistant experience mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "assistant"}
            aria-controls="assistant-mode-panel"
            onClick={() => setMode("assistant")}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${mode === "assistant" ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-100" : "text-slate-600 dark:text-slate-300"}`}
          >
            <Sparkles className="h-4 w-4" />
            Assistant Workspace
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "legacy"}
            aria-controls="legacy-mode-panel"
            onClick={() => setMode("legacy")}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${mode === "legacy" ? "bg-blue-500/15 text-blue-700 dark:text-blue-100" : "text-slate-600 dark:text-slate-300"}`}
          >
            <Layers3 className="h-4 w-4" />
            Spatial Legacy
          </button>
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        id={mode === "assistant" ? "assistant-mode-panel" : "legacy-mode-panel"}
      >
        {mode === "assistant" ? (
          <BusinessOperatingAssistantWorkspace baseHref={baseHref} />
        ) : (
          <ExecutiveCommandCenterLegacy baseHref={baseHref} />
        )}
      </motion.div>
    </div>
  );
}
