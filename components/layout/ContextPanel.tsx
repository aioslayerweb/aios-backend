import { Activity, ArrowRight, Sparkles } from "lucide-react";
import { workflowBlueprints } from "@/workflows/definitions";
import CommandPalette from "./CommandPalette";
import AIWorkflowStatus from "./AIWorkflowStatus";
import AIExecutionSummary from "./AIExecutionSummary";

export default function ContextPanel() {
  return (
    <aside className="border-t border-slate-800 bg-slate-900/80 p-4 lg:min-h-screen lg:border-l lg:border-t-0 lg:p-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-300">
          <Sparkles size={16} />
          AI Context Layer
        </div>
        <p className="text-sm text-slate-300">
          All user intents are routed through the AIOS workflow engine before execution.
        </p>
      </div>

      <div className="mt-4">
        <CommandPalette />
      </div>

      <div className="mt-4">
        <AIWorkflowStatus />
      </div>

      <div className="mt-4">
        <AIExecutionSummary />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Activity size={16} />
          Active Workflows
        </div>
        <div className="space-y-2">
          {workflowBlueprints.slice(0, 3).map((workflow) => (
            <div key={workflow.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-300">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-white">{workflow.name}</span>
                <span className="text-xs uppercase tracking-wide text-cyan-300">{workflow.mode}</span>
              </div>
              <p className="text-xs text-slate-500">{workflow.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <p className="mb-3 text-sm font-semibold text-white">Execution Guardrails</p>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-center gap-2"><ArrowRight size={14} /> No direct data mutation</li>
          <li className="flex items-center gap-2"><ArrowRight size={14} /> Deterministic-first execution</li>
          <li className="flex items-center gap-2"><ArrowRight size={14} /> Permission hard blocks</li>
        </ul>
      </div>
    </aside>
  );
}
