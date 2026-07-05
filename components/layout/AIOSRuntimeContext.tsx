"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { interpretIntent } from "@/ai/interpreter";
import { planWorkflow } from "@/ai/planner";
import { optimizeWorkflow } from "@/ai/optimizer";
import { executeWorkflow } from "@/workflows/engine/runtime";
import { createTrace, appendStage, appendExecutionStep, finalizeTrace, type WorkflowTrace } from "@/workflows/engine/trace";

export type WorkflowStatus = "draft" | "running" | "paused" | "completed" | "failed";

export type WorkflowStepStatus = "pending" | "running" | "completed" | "failed";

export interface WorkflowStep {
  id: string;
  name: string;
  module: string;
  mode: "deterministic" | "ai" | "hybrid";
  action: "read" | "write" | "summarize";
  status: WorkflowStepStatus;
  result?: string;
  contract?: string;
}

export interface WorkflowExecution {
  id: string;
  intent: string;
  type: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  context: Record<string, unknown>;
  output: string;
  logs: string[];
}

interface AIOSRuntimeContextValue {
  activeWorkflow: WorkflowExecution | null;
  activeTrace: WorkflowTrace | null;
  lastCommand: string;
  isRunning: boolean;
  runIntent: (intent: string) => Promise<void>;
  resetWorkflow: () => void;
}

const AIOSRuntimeContext = createContext<AIOSRuntimeContextValue | null>(null);

export function AIOSRuntimeProvider({ children }: { children: ReactNode }) {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowExecution | null>(null);
  const [activeTrace, setActiveTrace] = useState<WorkflowTrace | null>(null);
  const [lastCommand, setLastCommand] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runIntent = async (intent: string) => {
    if (!intent.trim()) return;

    setLastCommand(intent);
    setIsRunning(true);

    const parsed = interpretIntent(intent);
    const planned = planWorkflow(parsed);
    const optimized = optimizeWorkflow(planned);

    const workflowId = `wf-${Date.now()}`;
    const trace = createTrace(workflowId, intent);
    appendStage(trace, {
      stage_name: "interpretation",
      input: intent,
      output: parsed,
      decision_reason: "Intent parsed into structured workflow target",
      selected_action: parsed.type,
      rejected_actions: ["direct-ui-execution"],
      confidence_score: parsed.confidence,
    });
    appendStage(trace, {
      stage_name: "planning",
      input: parsed,
      output: optimized,
      decision_reason: "Execution graph generated from module-aware plan",
      selected_action: optimized[0]?.name ?? "plan",
      rejected_actions: ["hallucinated-step"],
      confidence_score: parsed.confidence,
    });

    const workflow: WorkflowExecution = {
      id: workflowId,
      intent,
      type: parsed.type,
      status: "running",
      steps: optimized,
      context: {
        target: parsed.target,
        confidence: parsed.confidence,
      },
      output: "Workflow initialized",
      logs: [`Intent parsed: ${parsed.type}`],
    };

    setActiveWorkflow(workflow);
    setActiveTrace(trace);

    const result = await executeWorkflow(workflow, (nextWorkflow) => {
      setActiveWorkflow(nextWorkflow);
    }, trace, (nextTrace) => {
      setActiveTrace(nextTrace);
    });

    finalizeTrace(trace, result.output, result.status === "failed" ? [result.output] : []);
    setActiveTrace({ ...trace });
    setActiveWorkflow(result);
    setIsRunning(false);
  };

  const resetWorkflow = () => {
    setActiveWorkflow(null);
    setActiveTrace(null);
    setLastCommand("");
    setIsRunning(false);
  };

  const value = useMemo(
    () => ({ activeWorkflow, activeTrace, lastCommand, isRunning, runIntent, resetWorkflow }),
    [activeWorkflow, activeTrace, lastCommand, isRunning]
  );

  return <AIOSRuntimeContext.Provider value={value}>{children}</AIOSRuntimeContext.Provider>;
}

export function useAIOSRuntime() {
  const context = useContext(AIOSRuntimeContext);
  if (!context) {
    throw new Error("useAIOSRuntime must be used inside AIOSRuntimeProvider");
  }
  return context;
}
