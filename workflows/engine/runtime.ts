import type { WorkflowExecution, WorkflowStep } from "@/components/layout/AIOSRuntimeContext";
import { appendExecutionStep, type WorkflowTrace } from "./trace";

const contractRegistry: Record<string, string> = {
  "customers:read": "customers",
  "actions:write": "actions",
  "knowledge:read": "knowledge",
  "executive:write": "executive",
};

function enforceContract(step: WorkflowStep) {
  if (!step.contract) {
    return { allowed: false, reason: "Missing contract" };
  }

  const owningModule = contractRegistry[step.contract];
  if (!owningModule) {
    return { allowed: false, reason: "Unknown contract" };
  }

  return { allowed: true, owner: owningModule };
}

export async function executeWorkflow(
  workflow: WorkflowExecution,
  onUpdate: (workflow: WorkflowExecution) => void,
  trace: WorkflowTrace,
  onTraceUpdate: (trace: WorkflowTrace) => void
): Promise<WorkflowExecution> {
  const updated = {
    ...workflow,
    logs: [...workflow.logs, "Workflow execution started"],
  };
  onUpdate(updated);

  for (let index = 0; index < updated.steps.length; index += 1) {
    const step = updated.steps[index];
    const stepLog = `Executing step ${index + 1}: ${step.name}`;
    updated.logs.push(stepLog);
    appendExecutionStep(trace, {
      step_id: step.id,
      type: step.mode,
      module_target: step.module,
      input_data: { intent: workflow.intent, action: step.action },
      output_data: null,
      execution_time: 0,
      status: "running",
    });
    onTraceUpdate({ ...trace });
    onUpdate({
      ...updated,
      steps: updated.steps.map((item, itemIndex) =>
        itemIndex === index ? { ...item, status: "running" } : item
      ),
    });

    const contractCheck = enforceContract(step);
    if (!contractCheck.allowed) {
      const failed = {
        ...updated,
        status: "failed" as const,
        output: `Blocked: ${contractCheck.reason}`,
        logs: [...updated.logs, `Blocked step ${index + 1}: ${contractCheck.reason}`],
        steps: updated.steps.map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, status: "failed" as const, result: contractCheck.reason }
            : item
        ),
      };
      appendExecutionStep(trace, {
        step_id: step.id,
        type: step.mode,
        module_target: step.module,
        input_data: { intent: workflow.intent, action: step.action },
        output_data: contractCheck.reason,
        execution_time: 0,
        status: "failed",
      });
      onTraceUpdate({ ...trace });
      onUpdate(failed);
      return failed;
    }

    await new Promise((resolve) => setTimeout(resolve, 120));

    const completed = {
      ...updated,
      steps: updated.steps.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              status: "completed" as const,
              result: `${contractCheck.owner} accepted ${step.action}`,
            }
          : item
      ),
    };
    completed.logs.push(`Completed step ${index + 1}`);
    onUpdate(completed);
  }

  const completedWorkflow = {
    ...updated,
    status: "completed" as const,
    output: `Workflow completed with ${updated.steps.length} step(s)`,
    logs: [...updated.logs, "Workflow completed"],
  };
  onUpdate(completedWorkflow);
  return completedWorkflow;
}
