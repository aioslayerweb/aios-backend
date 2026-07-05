"use client";

import { useAIOSRuntime } from "./AIOSRuntimeContext";

export default function DebugPanel() {
  const { activeWorkflow, activeTrace } = useAIOSRuntime();

  if (!activeTrace && !activeWorkflow) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
      <p className="text-sm font-semibold text-amber-300">Debug Trace</p>
      {activeTrace ? (
        <div className="mt-3 space-y-3 text-xs text-slate-300">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="mb-1 font-semibold text-white">Trace Summary</p>
            <p>Workflow ID: {activeTrace.workflow_id}</p>
            <p>Intent: {activeTrace.intent}</p>
            <p>Stages: {activeTrace.stages.length}</p>
            <p>Execution steps: {activeTrace.execution_steps.length}</p>
          </div>
          {activeTrace.stages.map((stage, index) => (
            <div key={`${stage.stage_name}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="font-semibold text-white">{stage.stage_name}</p>
              <p>Decision: {stage.selected_action}</p>
              <p>Reason: {stage.decision_reason}</p>
              <p>Confidence: {stage.confidence_score}</p>
            </div>
          ))}
          {activeTrace.execution_steps.map((step, index) => (
            <div key={`${step.step_id}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="font-semibold text-white">{step.step_id}</p>
              <p>Module: {step.module_target}</p>
              <p>Status: {step.status}</p>
              <p>Type: {step.type}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-400">No trace data available yet.</p>
      )}
    </div>
  );
}
