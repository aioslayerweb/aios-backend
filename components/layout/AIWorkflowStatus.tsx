"use client";

import { useAIOSRuntime } from "./AIOSRuntimeContext";

export default function AIWorkflowStatus() {
  const { activeWorkflow, lastCommand, isRunning } = useAIOSRuntime();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-sm font-semibold text-white">Workflow Runtime</p>
      <p className="mt-2 text-sm text-slate-400">
        {isRunning ? "Execution in progress" : activeWorkflow ? "Execution complete" : "Awaiting command"}
      </p>
      {lastCommand ? <p className="mt-2 text-xs text-slate-500">Last command: {lastCommand}</p> : null}
      {activeWorkflow ? (
        <div className="mt-4 space-y-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
            <div className="mb-1 font-medium text-white">{activeWorkflow.intent}</div>
            <div className="text-xs text-slate-500">Status: {activeWorkflow.status}</div>
          </div>
          {activeWorkflow.steps.map((step) => (
            <div key={step.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>{step.name}</span>
                <span className="text-xs uppercase tracking-wide text-cyan-300">{step.status}</span>
              </div>
              {step.result ? <p className="mt-1 text-xs text-slate-500">{step.result}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
