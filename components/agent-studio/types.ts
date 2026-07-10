export type AgentStatus = "active" | "idle" | "attention";

export type AgentStudioMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type AgentCardData = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  confidence: number;
  health: number;
  team: string;
  objective: string;
  avatarSeed: string;
};

export type AgentTemplate = {
  id: string;
  name: string;
  category: string;
  usageCount: string;
};

export type StudioActivity = {
  id: string;
  title: string;
  time: string;
  actor: string;
};

export type AgentCapability = {
  id: string;
  label: string;
};

export type AgentTimelineEvent = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
};

export type MCPTool = {
  id: string;
  name: string;
  status: "connected" | "degraded";
};

export type StudioSidebarLink = {
  id: string;
  label: string;
  meta?: string;
  href: string;
};

export type ConnectedSystem = {
  id: string;
  name: string;
  status: "online" | "warning";
};

export type OrganizationNotification = {
  id: string;
  title: string;
  detail: string;
  tone: "info" | "warning" | "critical";
};

export type UpcomingEvent = {
  id: string;
  title: string;
  schedule: string;
};

export type AgentCollaborationLink = {
  id: string;
  from: string;
  to: string;
  type: "delegation" | "knowledge" | "workflow" | "decision";
};

export type AgentStudioData = {
  metrics: AgentStudioMetric[];
  agents: AgentCardData[];
  templates: AgentTemplate[];
  activities: StudioActivity[];
  capabilities: AgentCapability[];
  knowledge: AgentCapability[];
  memoryCollections: AgentCapability[];
  mcpTools: MCPTool[];
  permissions: AgentCapability[];
  workflows: AgentCapability[];
  executionHistory: AgentTimelineEvent[];
  suggestedImprovements: AgentCapability[];
  leftNavigation: StudioSidebarLink[];
  categories: StudioSidebarLink[];
  favorites: StudioSidebarLink[];
  teams: StudioSidebarLink[];
  recentAgents: StudioSidebarLink[];
  rightConnectedSystems: ConnectedSystem[];
  notifications: OrganizationNotification[];
  upcomingEvents: UpcomingEvent[];
  quickInsights: AgentCapability[];
  collaboration: AgentCollaborationLink[];
};
