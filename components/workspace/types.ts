import type { ReactNode } from "react";

export type WorkspaceBreadcrumb = {
  label: string;
  href?: string;
};

export type WorkspaceAction = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  tone?: "primary" | "secondary" | "ghost";
};

export type WorkspaceMetric = {
  id: string;
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "success" | "warning" | "critical";
};

export type WorkspaceStatus = {
  id: string;
  label: string;
  tone: "success" | "warning" | "critical" | "running" | "paused" | "completed" | "healthy" | "offline";
};

export type WorkspaceSection = {
  id: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  children: ReactNode;
};

export type WorkspaceCard = {
  id?: string;
  title?: string;
  children: ReactNode;
};
