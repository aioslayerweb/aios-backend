import type { LucideIcon } from "lucide-react";

export type WorkflowNodeType =
  | "ai-agent"
  | "human-approval"
  | "business-rule"
  | "decision"
  | "knowledge-lookup"
  | "memory-retrieval"
  | "policy"
  | "external-system"
  | "mcp-tool"
  | "notification"
  | "scheduler"
  | "condition"
  | "merge"
  | "split"
  | "loop"
  | "report";

export type WorkflowNodeModel = {
  id: string;
  title: string;
  type: WorkflowNodeType;
  description: string;
  x: number;
  y: number;
  status: "idle" | "running" | "attention" | "success";
  owner: string;
  decisionType?: string;
  businessImpact?: string;
  riskLevel?: string;
  policyApplied?: string;
  aiConfidence?: number;
  approvalRequired?: boolean;
  deadline?: string;
  executiveGoal?: string;
  reasoningAvailable?: boolean;
};

export type WorkflowEdgeModel = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

export type WorkflowMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type SidebarLink = {
  id: string;
  label: string;
  meta?: string;
  href: string;
};

export type ChipItem = {
  id: string;
  label: string;
};

export type RecommendationItem = {
  id: string;
  title: string;
  impact: string;
};

export type TimelineItem = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type ToolAction = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type WorkflowBuilderData = {
  leftLibrary: SidebarLink[];
  templates: SidebarLink[];
  favorites: SidebarLink[];
  recent: SidebarLink[];
  categories: SidebarLink[];
  teams: SidebarLink[];
  nodePalette: Array<{ type: WorkflowNodeType; label: string }>;
  nodes: WorkflowNodeModel[];
  edges: WorkflowEdgeModel[];
  intelligence: WorkflowMetric[];
  simulation: WorkflowMetric[];
  optimization: RecommendationItem[];
  organizationContext: ChipItem[];
  decisionIntelligence: WorkflowMetric[];
  businessOutcomes: WorkflowMetric[];
  analytics: WorkflowMetric[];
  recentExecutions: TimelineItem[];
  inspectorInputs: SidebarLink[];
  inspectorOutputs: SidebarLink[];
  permissions: SidebarLink[];
  knowledgeSources: SidebarLink[];
  memoryCollections: SidebarLink[];
  policies: SidebarLink[];
  runtimeSettings: SidebarLink[];
  connectedMcpTools: SidebarLink[];
  executionHistory: TimelineItem[];
  suggestedImprovements: SidebarLink[];
};
