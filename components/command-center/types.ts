import type { LucideIcon } from "lucide-react";

export type CommandSuggestion = {
  id: string;
  label: string;
  category: "priority" | "workflow" | "risk" | "agent" | "knowledge";
};

export type CommandChip = {
  id: string;
  label: string;
  tone: "neutral" | "info" | "success" | "warning";
};

export type WorkspaceLink = {
  id: string;
  label: string;
  href: string;
  meta?: string;
};

export type CardMetric = {
  id: string;
  label: string;
  value: string;
  trend?: string;
  tone?: "neutral" | "good" | "warn" | "critical";
};

export type PriorityItem = {
  id: string;
  title: string;
  owner: string;
  due: string;
  score: number;
};

export type DecisionItem = {
  id: string;
  title: string;
  impact: string;
  confidence: number;
  status: "pending" | "approved" | "blocked";
};

export type WorkflowItem = {
  id: string;
  name: string;
  stage: string;
  owner: string;
  progress: number;
};

export type AgentItem = {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle" | "attention";
  tasks: number;
};

export type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: "info" | "warning" | "critical";
};

export type MeetingItem = {
  id: string;
  title: string;
  time: string;
  audience: string;
};

export type ConnectedSystem = {
  id: string;
  name: string;
  state: "connected" | "degraded";
  icon: LucideIcon;
};

export type CommandCenterData = {
  suggestions: CommandSuggestion[];
  chips: CommandChip[];
  leftNavigation: WorkspaceLink[];
  favorites: WorkspaceLink[];
  recentWorkspaces: WorkspaceLink[];
  agentShortcuts: WorkspaceLink[];
  quickActions: WorkspaceLink[];
  metrics: CardMetric[];
  priorities: PriorityItem[];
  decisions: DecisionItem[];
  workflows: WorkflowItem[];
  recommendations: WorkspaceLink[];
  recentActivity: WorkspaceLink[];
  memorySummary: WorkspaceLink[];
  knowledgeSummary: WorkspaceLink[];
  agents: AgentItem[];
  notifications: NotificationItem[];
  meetings: MeetingItem[];
  connectedSystems: ConnectedSystem[];
  enterpriseInsights: WorkspaceLink[];
};
