import type { WorkflowStep } from "@/components/layout/AIOSRuntimeContext";
import type { ParsedIntent } from "@/ai/interpreter";

export function planWorkflow(intent: ParsedIntent): WorkflowStep[] {
  if (intent.type === "risk-analysis") {
    return [
      {
        id: "step-1",
        name: "Assess customer churn signals",
        module: "customers",
        mode: "ai",
        action: "summarize",
        status: "pending",
        contract: "customers:read",
      },
      {
        id: "step-2",
        name: "Route mitigation workflow",
        module: "actions",
        mode: "deterministic",
        action: "write",
        status: "pending",
        contract: "actions:write",
      },
    ];
  }

  return [
    {
      id: "step-1",
      name: "Collect contextual evidence",
      module: "knowledge",
      mode: "hybrid",
      action: "read",
      status: "pending",
      contract: "knowledge:read",
    },
    {
      id: "step-2",
      name: "Publish executive summary",
      module: "executive",
      mode: "deterministic",
      action: "write",
      status: "pending",
      contract: "executive:write",
    },
  ];
}
