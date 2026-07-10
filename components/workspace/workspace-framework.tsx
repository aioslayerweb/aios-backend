"use client";

import { memo, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { Badge, Button, Card, CardContent, Input } from "@/components/ui";
import { cn } from "@/utils";
import { workspaceMotion } from "./workspace-motion";
import type {
  WorkspaceAction,
  WorkspaceBreadcrumb,
  WorkspaceCard as WorkspaceCardProps,
  WorkspaceMetric,
  WorkspaceSection as WorkspaceSectionProps,
  WorkspaceStatus,
} from "./types";

export function WorkspaceShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-4 px-4 py-4 md:px-6 lg:px-8", className)}>{children}</div>;
}

export function WorkspaceGrid({
  children,
  className,
  columns,
  autoFitMin,
}: {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  autoFitMin?: string;
}) {
  const columnClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 xl:grid-cols-2"
        : columns === 3
          ? "grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
          : columns === 4
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            : autoFitMin
              ? `grid-cols-[repeat(auto-fit,minmax(${autoFitMin},1fr))]`
              : "grid-cols-1";

  const style: CSSProperties | undefined = autoFitMin
    ? { gridTemplateColumns: `repeat(auto-fit, minmax(${autoFitMin}, 1fr))` }
    : undefined;

  return (
    <div className={cn("grid gap-4", columnClass, className)} style={style}>
      {children}
    </div>
  );
}

export function WorkspaceContent({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("space-y-4", className)}>{children}</main>;
}

export function WorkspaceSidebar({ children, className, ariaLabel }: { children: ReactNode; className?: string; ariaLabel?: string }) {
  return (
    <motion.aside initial="hidden" animate="show" variants={workspaceMotion.panel} className={cn("space-y-3", className)} aria-label={ariaLabel}>
      {children}
    </motion.aside>
  );
}

export function WorkspaceRightPanel({ children, className, ariaLabel }: { children: ReactNode; className?: string; ariaLabel?: string }) {
  return (
    <motion.aside initial="hidden" animate="show" variants={workspaceMotion.panel} className={cn("space-y-3", className)} aria-label={ariaLabel}>
      {children}
    </motion.aside>
  );
}

export function WorkspaceHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  search,
  status,
  organizationSelector,
  notifications,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: WorkspaceBreadcrumb[];
  actions?: WorkspaceAction[];
  search?: { placeholder: string; onSearch?: (value: string) => void };
  status?: WorkspaceStatus[];
  organizationSelector?: ReactNode;
  notifications?: ReactNode;
}) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {breadcrumbs ? <PageBreadcrumbs items={breadcrumbs} /> : null}
            <h1 className="mt-1 text-2xl font-semibold text-brand-navy">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-text-secondary">{subtitle}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {status?.map((item) => (
              <StatusBadge key={item.id} label={item.label} tone={item.tone} />
            ))}
            {organizationSelector}
            {notifications}
            {actions?.map((action) => {
              const buttonVariant = action.tone === "primary" ? "primary" : action.tone === "ghost" ? "ghost" : "secondary";
              return (
                <Button key={action.id} variant={buttonVariant} size="sm" onClick={action.onClick}>
                  {action.icon}
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>

        {search ? (
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <Search className="h-4 w-4 text-text-muted" />
            <Input
              className="h-auto border-0 bg-transparent p-0 shadow-none"
              placeholder={search.placeholder}
              aria-label={search.placeholder}
              onChange={(event) => search.onSearch?.(event.target.value)}
            />
          </label>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function WorkspaceSection({ id, title, subtitle, actionLabel, children }: WorkspaceSectionProps) {
  return (
    <section id={id} className="space-y-2" aria-label={title}>
      <SectionTitle title={title} subtitle={subtitle} actionLabel={actionLabel} />
      {children}
    </section>
  );
}

export function WorkspaceCard({ children }: WorkspaceCardProps) {
  return <Card className="overflow-hidden border-border bg-white shadow-sm">{children}</Card>;
}

export function MetricCard({ metric }: { metric: WorkspaceMetric }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <p className="text-[11px] uppercase tracking-wide text-text-muted">{metric.label}</p>
      <p className="mt-1 text-lg font-semibold text-brand-navy">{metric.value}</p>
      {metric.detail ? <p className="text-xs text-text-secondary">{metric.detail}</p> : null}
    </article>
  );
}

export function InfoCard({ title, detail, children }: { title: string; detail?: string; children?: ReactNode }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <p className="text-sm font-semibold text-brand-navy">{title}</p>
      {detail ? <p className="mt-1 text-xs text-text-secondary">{detail}</p> : null}
      {children}
    </article>
  );
}

export function InsightCard({ title, detail, children }: { title: string; detail?: string; children?: ReactNode }) {
  return <InfoCard title={title} detail={detail}>{children}</InfoCard>;
}

export function ActionBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function QuickActions({ actions }: { actions: WorkspaceAction[] }) {
  return (
    <ActionBar>
      {actions.map((action) => (
        <Button key={action.id} variant={action.tone === "primary" ? "primary" : "secondary"} size="sm" onClick={action.onClick}>
          {action.icon}
          {action.label}
        </Button>
      ))}
    </ActionBar>
  );
}

export function CommandBar({ placeholder, actions }: { placeholder: string; actions?: WorkspaceAction[] }) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="space-y-3 p-3">
        <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <Input className="h-auto border-0 bg-transparent p-0 shadow-none" placeholder={placeholder} aria-label={placeholder} />
        </label>
        {actions ? <QuickActions actions={actions} /> : null}
      </CardContent>
    </Card>
  );
}

export function PageBreadcrumbs({ items }: { items: WorkspaceBreadcrumb[] }) {
  return <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">{items.map((item) => item.label).join(" / ")}</span>;
}

export function NotificationCenter({ unreadCount }: { unreadCount: number }) {
  return <Badge tone={unreadCount > 0 ? "warning" : "success"}>{unreadCount} notifications</Badge>;
}

export function StatusBadge({ label, tone }: { label: string; tone: WorkspaceStatus["tone"] }) {
  const toneClass: Record<WorkspaceStatus["tone"], string> = {
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    critical: "bg-rose-50 text-rose-700",
    running: "bg-sky-50 text-sky-700",
    paused: "bg-slate-100 text-slate-700",
    completed: "bg-emerald-50 text-emerald-700",
    healthy: "bg-emerald-50 text-emerald-700",
    offline: "bg-slate-100 text-slate-700",
  };

  return <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", toneClass[tone])}>{label}</span>;
}

export function HealthBadge({ label }: { label: string }) {
  return <StatusBadge label={label} tone="healthy" />;
}

export function ConfidenceBadge({ label }: { label: string }) {
  return <Badge tone="info">{label}</Badge>;
}

export function SectionTitle({ title, subtitle, actionLabel }: { title: string; subtitle?: string; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">{title}</h2>
        {subtitle ? <p className="mt-1 text-lg font-semibold text-brand-navy">{subtitle}</p> : null}
      </div>
      {actionLabel ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-subtle px-2.5 py-1 text-[11px] font-semibold text-brand-navy">
          <Sparkles size={12} />
          {actionLabel}
        </span>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <InfoCard title={title} detail={description} />;
}

export function LoadingState({ label = "Loading workspace..." }: { label?: string }) {
  return <Card className="border-border bg-white p-4 text-sm text-text-muted shadow-sm">{label}</Card>;
}

export function ErrorState({ title, description }: { title: string; description: string }) {
  return <InfoCard title={title} detail={description} />;
}

export function WorkspaceFooter({ children }: { children: ReactNode }) {
  return <footer className="border-t border-border bg-white px-4 py-4 text-sm text-text-secondary">{children}</footer>;
}

export const WorkspaceShellCard = memo(function WorkspaceShellCard({ children }: { children: ReactNode }) {
  return <Card className="overflow-hidden border-border bg-white shadow-sm">{children}</Card>;
});

export function WorkspaceSummaryCard({ title, detail }: { title: string; detail: string }) {
  return <InfoCard title={title} detail={detail} />;
}

export function WorkspaceMiniStatus({ label }: { label: string }) {
  return <span className="rounded-full border border-border bg-surface-canvas px-2 py-0.5 text-[11px] text-text-secondary">{label}</span>;
}
