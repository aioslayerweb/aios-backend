import type { WorkspaceMetric } from "@/components/workspace";

export type IntelligenceRole = "CEO" | "CFO" | "COO" | "Sales" | "Marketing" | "HR" | "Operations" | "Compliance" | "IT";

export type IntelligenceKpi = WorkspaceMetric;

export type IntelligenceRibbonItem = {
  id: string;
  label: string;
  value: string;
  status: string;
  trend: string;
  tone: "default" | "success" | "warning" | "critical";
};

export type IntelligenceSignal = {
  id: string;
  label: string;
  source: string;
  value: string;
  trend: string;
  detail: string;
};

export type IntelligenceCardRecord = {
  id: string;
  title: string;
  executiveSummary: string;
  aiAnalysis: string;
  businessImpact: string;
  priority: "low" | "medium" | "high" | "critical";
  confidence: number;
  supportingEvidence: string[];
  predictedOutcome: string;
  recommendedAction: string;
  status: "draft" | "review" | "recommended" | "validated";
  sourceChips: string[];
  sourceTooltip: string;
};

export type IntelligenceTimelineEvent = {
  id: string;
  stage: "signals" | "analysis" | "insight" | "recommendation" | "decision" | "outcome";
  timestamp: string;
  confidence: number;
  businessArea: string;
  detail: string;
};

export type IntelligenceGraphNodeType =
  | "department"
  | "agent"
  | "knowledge"
  | "memory"
  | "customer"
  | "workflow"
  | "mcp"
  | "goal"
  | "revenue"
  | "risk";

export type IntelligenceGraphNode = {
  id: string;
  label: string;
  type: IntelligenceGraphNodeType;
  x: number;
  y: number;
  radius: number;
  detail: string;
};

export type IntelligenceGraphEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  strength: number;
  animated: boolean;
};

export type IntelligenceInsight = {
  id: string;
  title: string;
  detail: string;
  confidence: number;
  impact: string;
};

export type IntelligenceRecommendation = {
  id: string;
  recommendation: string;
  reasoning: string;
  evidence: string[];
  expectedROI: string;
  implementationEffort: string;
  confidence: number;
  priority: "low" | "medium" | "high" | "critical";
  sourceChips: string[];
};

export type IntelligenceScenario = {
  id: string;
  label: "Current" | "Optimistic" | "Expected" | "Conservative" | "Worst Case";
  revenue: string;
  profit: string;
  growth: string;
  risk: string;
  customerSatisfaction: string;
};

export type IntelligenceAnomaly = {
  id: string;
  category: "Revenue" | "Operations" | "Customers" | "Infrastructure" | "Agents" | "Compliance" | "Workflows" | "Memory" | "Knowledge";
  title: string;
  detail: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
};

export type IntelligenceExecutiveBrief = {
  todaySummary: string;
  weeklyTrends: string[];
  topOpportunities: string[];
  strategicRisks: string[];
  priorityActions: string[];
  forecast: string;
  recommendedDecisions: string[];
};

export type IntelligenceRoleView = {
  role: IntelligenceRole;
  headline: string;
  priorities: string[];
  focusAreas: string[];
};

export type IntelligenceWorkspaceSection = {
  title: string;
  items: Array<{ id: string; label: string; href: string; meta?: string }>;
};
