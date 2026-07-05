export interface WorkflowTraceStage {
  stage_name: string;
  input: unknown;
  output: unknown;
  decision_reason: string;
  selected_action: string;
  rejected_actions: string[];
  confidence_score: number;
}

export interface WorkflowTraceExecutionStep {
  step_id: string;
  type: "deterministic" | "ai" | "hybrid";
  module_target: string;
  input_data: unknown;
  output_data: unknown;
  execution_time: number;
  status: "pending" | "running" | "completed" | "failed";
}

export interface WorkflowTrace {
  workflow_id: string;
  intent: string;
  timestamp: string;
  stages: WorkflowTraceStage[];
  execution_steps: WorkflowTraceExecutionStep[];
  final_output: string;
  errors: string[];
}

export function createTrace(workflowId: string, intent: string): WorkflowTrace {
  return {
    workflow_id: workflowId,
    intent,
    timestamp: new Date().toISOString(),
    stages: [],
    execution_steps: [],
    final_output: "",
    errors: [],
  };
}

export function appendStage(trace: WorkflowTrace, stage: WorkflowTraceStage) {
  trace.stages.push(stage);
}

export function appendExecutionStep(trace: WorkflowTrace, step: WorkflowTraceExecutionStep) {
  trace.execution_steps.push(step);
}

export function finalizeTrace(trace: WorkflowTrace, output: string, errors: string[] = []) {
  trace.final_output = output;
  trace.errors = errors;
}
