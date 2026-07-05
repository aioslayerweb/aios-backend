export interface WorkflowBlueprint {
  id: string;
  name: string;
  mode: "Analytical" | "Operational" | "Strategic";
  description: string;
}

export const workflowBlueprints: WorkflowBlueprint[] = [
  {
    id: "intent-interpretation",
    name: "Intent Interpretation",
    mode: "Analytical",
    description: "Translate user intent into structured workflow steps.",
  },
  {
    id: "planning",
    name: "Execution Planning",
    mode: "Operational",
    description: "Select deterministic actions and AI-assisted steps.",
  },
  {
    id: "validation",
    name: "Validation & Guardrails",
    mode: "Strategic",
    description: "Enforce permissions, contracts, and rollback safety.",
  },
];
