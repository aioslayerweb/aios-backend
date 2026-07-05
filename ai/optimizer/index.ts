import type { WorkflowStep } from "@/components/layout/AIOSRuntimeContext";

export function optimizeWorkflow(steps: WorkflowStep[]): WorkflowStep[] {
  return steps.map((step, index) => ({
    ...step,
    id: `${step.id}-${index}`,
    status: "pending",
  }));
}
