import type { WorkspaceMetric } from "@/components/workspace";

export type DecisionStatus = "pending" | "recommended" | "approved" | "rejected" | "review" | "executed";

export type DecisionCategory =
  | "strategic"
  | "operational"
  | "financial"
  | "compliance"
  | "security"
  | "customer"
  | "hr";

export type DecisionRisk = "low" | "medium" | "high" | "critical";

export type ApprovalStepStatus = "completed" | "in-progress" | "waiting";

export type DecisionRecord = {
  id: string;
  title: string;
  executiveSummary: string;
  recommendation: string;
  aiRecommendation: string;
  reasoning: string;
  supportingEvidence: string[];
  signals: string[];
  dependencies: string[];
  tradeoffs: string[];
  alternatives: string[];
  confidence: number;
  businessImpact: string;
  financialImpact: string;
  risk: DecisionRisk;
  urgency: "low" | "medium" | "high";
  strategicAlignment: number;
  timeSensitivity: number;
  affectedDepartments: string[];
  linkedMemory: string[];
  linkedKnowledge: string[];
  linkedWorkflow: string[];
  linkedAgent: string[];
  estimatedROI: string;
  approvalStatus: DecisionStatus;
  category: DecisionCategory;
  compliance: string;
  stakeholders: string[];
  createdAt: string;
  updatedAt: string;
};

export type DecisionRibbonItem = {
  id: string;
  label: string;
  value: string;
  status: string;
  trend: string;
  tone: "success" | "warning" | "critical" | "default";
};

export type DecisionInsight = {
  id: string;
  title: string;
  detail: string;
  confidence: number;
  impact: string;
};

export type DecisionTimelineEvent = {
  id: string;
  stage: "created" | "reviewed" | "recommended" | "approved" | "executed" | "measured";
  title: string;
  detail: string;
  timestamp: string;
};

export type DecisionGraphNodeType =
  | "decision"
  | "memory"
  | "knowledge"
  | "workflow"
  | "agent"
  | "department"
  | "policy"
  | "goal"
  | "executive"
  | "risk";

export type DecisionGraphNode = {
  id: string;
  label: string;
  type: DecisionGraphNodeType;
  x: number;
  y: number;
  radius: number;
};

export type DecisionGraphEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  animated: boolean;
};

export type DecisionScenario = {
  id: string;
  label: "Approve" | "Reject" | "Delay" | "Delegate" | "Automate";
  revenue: string;
  cost: string;
  risk: string;
  customerSatisfaction: string;
  operationalEfficiency: string;
  strategicAlignment: string;
};

export type DecisionRoleView = "CEO" | "CFO" | "COO" | "HR" | "Sales" | "IT" | "Compliance";

export type RoleIntelligenceItem = {
  id: string;
  role: DecisionRoleView;
  priorities: string[];
  focusMetrics: string[];
};

export type ApprovalStep = {
  id: string;
  label: string;
  owner: string;
  status: ApprovalStepStatus;
};

export type DecisionFilter = {
  id: string;
  label: string;
};

export type DecisionSidebarSection = {
  title: string;
  items: Array<{ id: string; label: string; href: string; meta?: string }>;
};

export type DecisionMetrics = WorkspaceMetric[];
