"use client";

import { useAIOSRuntime } from "./AIOSRuntimeContext";

export default function AIExecutionSummary() {
  const { activeWorkflow } = useAIOSRuntime();

  if (!activeWorkflow) {
    return null;
  }

  const confidence = Math.max(0.55, Math.min(0.98, 0.7 + activeWorkflow.steps.length * 0.06));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-sm font-semibold text-white">AI Reasoning Summary</p>
      <p className="mt-2 text-sm text-slate-400">Confidence score: {confidence.toFixed(2)}</p>
      <p className="mt-2 text-sm text-slate-400">{activeWorkflow.output}</p>
      <div className="mt-3 space-y-2">
        {activeWorkflow.logs.map((log, index) => (
          <div key={`${log}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-xs text-slate-500">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
