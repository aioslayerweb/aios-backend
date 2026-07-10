"use client";

import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from "@/components/ui";
import {
  ActionBar,
  EmptyState,
  InfoCard,
  MetricCard,
  PageBreadcrumbs,
  StatusBadge,
  WorkspaceRightPanel,
  WorkspaceSidebar,
} from "@/components/workspace";
import { cn } from "@/utils";
import type { WorkspaceAction, WorkspaceBreadcrumb } from "@/components/workspace";
import type {
  AIWorkforceMetric,
  AnalyticsSeries,
  BusinessUnitRecord,
  DepartmentRecord,
  EmployeeRecord,
  InsightItem,
  OrgActivityEvent,
  OrgChartNode,
  OrgSidebarSection,
  OrganizationOverviewMetric,
  PermissionLink,
  PermissionNode,
  RaciProcess,
} from "./types";

const panelMotion = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
  },
};

function statusTone(status: DepartmentRecord["status"]) {
  if (status === "active") return "success" as const;
  if (status === "attention") return "warning" as const;
  if (status === "growing") return "running" as const;
  return "paused" as const;
}

function employeeTone(status: EmployeeRecord["status"]) {
  if (status === "available") return "success" as const;
  if (status === "busy") return "warning" as const;
  return "offline" as const;
}

function insightTone(tone: InsightItem["tone"]) {
  if (tone === "critical") return "critical" as const;
  if (tone === "warning") return "warning" as const;
  if (tone === "success") return "success" as const;
  return "running" as const;
}

export function OrganizationHeader({
  breadcrumbs,
  actions,
  searchValue,
  onSearch,
}: {
  breadcrumbs: WorkspaceBreadcrumb[];
  actions: WorkspaceAction[];
  searchValue: string;
  onSearch: (value: string) => void;
}) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <PageBreadcrumbs items={breadcrumbs} />
            <h1 className="mt-1 text-2xl font-semibold text-brand-navy">Organization Center</h1>
            <p className="mt-1 text-sm text-text-secondary">Manage people, teams, AI agents, departments and enterprise structure.</p>
          </div>
          <ActionBar>
            {actions.map((action) => (
              <Button key={action.id} variant={action.tone === "primary" ? "primary" : action.tone === "ghost" ? "ghost" : "secondary"} size="sm" onClick={action.onClick}>
                {action.icon}
                {action.label}
              </Button>
            ))}
          </ActionBar>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <Input value={searchValue} onChange={(event) => onSearch(event.target.value)} className="h-auto border-0 bg-transparent p-0 shadow-none" placeholder="Search employee, department, manager, AI agent, location, team, skill, business unit" aria-label="Organization global search" />
        </label>
      </CardContent>
    </Card>
  );
}

export function OrganizationLeftRail({ sections }: { sections: OrgSidebarSection[] }) {
  return (
    <WorkspaceSidebar ariaLabel="Organization center left sidebar">
      {sections.map((section) => (
        <Card key={section.title} className="border-border bg-white">
          <CardHeader className="py-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{section.title}</h3>
          </CardHeader>
          <CardContent className="space-y-1.5 p-3">
            {section.items.map((item) => (
              <Link key={item.id} href={item.href} className="flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2 text-sm hover:border-brand-primary/35">
                <span className="font-medium text-brand-navy">{item.label}</span>
                <span className="text-[11px] text-text-muted">{item.meta}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      ))}
    </WorkspaceSidebar>
  );
}

export function OrganizationOverview({ metrics }: { metrics: OrganizationOverviewMetric[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}

export function OrganizationChart({ nodes }: { nodes: OrgChartNode[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const rootNode = nodes.find((node) => node.type === "ceo");

  const children = useMemo(() => {
    const map = new Map<string, OrgChartNode[]>();
    nodes.forEach((node) => {
      if (!node.reportsTo) return;
      const list = map.get(node.reportsTo) ?? [];
      list.push(node);
      map.set(node.reportsTo, list);
    });
    return map;
  }, [nodes]);

  if (!rootNode) {
    return <EmptyState title="No Organization" description="No organization chart data is available." />;
  }

  const renderNode = (node: OrgChartNode, depth: number) => {
    const hasChildren = (children.get(node.id)?.length ?? 0) > 0;
    const isExpanded = expanded[node.id] ?? depth < 2;

    return (
      <div key={node.id} className="space-y-2">
        <motion.article variants={panelMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-brand-navy">{node.label}</p>
              <p className="mt-1 text-xs text-text-secondary">{node.role}</p>
            </div>
            {hasChildren ? (
              <button type="button" onClick={() => setExpanded((state) => ({ ...state, [node.id]: !isExpanded }))} className="rounded-full border border-border bg-white p-1 text-text-secondary" aria-label={isExpanded ? "Collapse" : "Expand"}>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {node.agents.map((agent) => (
              <Badge key={agent} tone="info">{agent}</Badge>
            ))}
          </div>
        </motion.article>

        {hasChildren && isExpanded ? (
          <div className="ml-4 border-l border-dashed border-slate-300 pl-4">
            {(children.get(node.id) ?? []).map((child) => renderNode(child, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Interactive Organization Chart</h3>
            <p className="text-xs text-text-secondary">Zoomable hierarchy with AI agent assignments</p>
          </div>
          <Badge tone="info">Expandable</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4">{renderNode(rootNode, 0)}</CardContent>
    </Card>
  );
}

export function DepartmentsGrid({ departments }: { departments: DepartmentRecord[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Departments</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {departments.map((dept) => (
          <article key={dept.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{dept.name}</p>
                <p className="mt-1 text-xs text-text-secondary">Head: {dept.head}</p>
              </div>
              <StatusBadge label={dept.status} tone={statusTone(dept.status)} />
            </div>
            <div className="mt-2 grid gap-1 text-[11px] text-text-muted sm:grid-cols-2">
              <span>Employees: {dept.employees}</span>
              <span>Agents: {dept.agents}</span>
              <span>Performance: {dept.performanceScore}</span>
              <span>Health: {dept.healthScore}</span>
              <span>Budget: {dept.budget}</span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function BusinessUnitsGrid({ units }: { units: BusinessUnitRecord[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Business Units</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {units.map((unit) => (
          <article key={unit.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-sm font-semibold text-brand-navy">{unit.name}</p>
            <p className="mt-1 text-xs text-text-secondary">{unit.region}</p>
            <div className="mt-2 grid gap-1 text-[11px] text-text-muted">
              <span>Revenue: {unit.revenue}</span>
              <span>Employees: {unit.employees}</span>
              <span>Agents: {unit.agents}</span>
              <span>Processes: {unit.processes}</span>
              <span>Risk: {unit.risk}</span>
              <span>Growth: {unit.growth}</span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

function EmployeeCard({ employee }: { employee: EmployeeRecord }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-subtle text-xs font-semibold text-brand-navy">{employee.avatarSeed}</span>
          <div>
            <p className="text-sm font-semibold text-brand-navy">{employee.name}</p>
            <p className="text-xs text-text-secondary">{employee.role}</p>
          </div>
        </div>
        <StatusBadge label={employee.status} tone={employeeTone(employee.status)} />
      </div>

      <div className="mt-2 grid gap-1 text-[11px] text-text-muted sm:grid-cols-2">
        <span>Department: {employee.department}</span>
        <span>Reports to: {employee.reportsTo}</span>
        <span>Country: {employee.country}</span>
        <span>Office: {employee.office}</span>
        <span>Workload: {employee.workload}%</span>
        <span>Availability: {employee.availability}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {employee.assignedAgents.map((agent) => (
          <Badge key={agent} tone="info">{agent}</Badge>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {employee.skills.map((skill) => (
          <Badge key={skill} tone="default">{skill}</Badge>
        ))}
      </div>
    </article>
  );
}

export const PeopleDirectory = memo(function PeopleDirectory({ employees, query, onQuery }: { employees: EmployeeRecord[]; query: string; onQuery: (value: string) => void; }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">People Directory</h3>
            <p className="text-xs text-text-secondary">Search and filter people by role, department, country, and skills</p>
          </div>
          <span className="text-xs text-text-muted">{employees.length} people</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <Input value={query} onChange={(event) => onQuery(event.target.value)} className="h-auto border-0 bg-transparent p-0 shadow-none" placeholder="Search people directory" aria-label="Search people" />
          <Filter className="h-4 w-4 text-text-muted" />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {[
            "Department",
            "Country",
            "Office",
            "Role",
            "Manager",
            "Status",
            "AI Agent",
            "Business Unit",
          ].map((item) => (
            <Badge key={item} tone="default">{item}</Badge>
          ))}
        </div>

        <div className="max-h-[720px] space-y-2 overflow-y-auto pr-1">
          {employees.length > 0 ? employees.map((employee) => <EmployeeCard key={employee.id} employee={employee} />) : <EmptyState title="No Employees" description="No employees match the active query." />}
        </div>
      </CardContent>
    </Card>
  );
});

export function AIWorkforcePanel({ metrics }: { metrics: AIWorkforceMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-brand-navy">AI Workforce</h3>
          <Badge tone="info">Human + AI</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-[11px] uppercase tracking-wide text-text-muted">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold text-brand-navy">{metric.value}</p>
            <p className="text-xs text-text-secondary">{metric.detail}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function ResponsibilityMatrix({ rows }: { rows: RaciProcess[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Responsibility Matrix</h3>
      </CardHeader>
      <CardContent className="overflow-x-auto p-4">
        <table className="w-full min-w-[760px] border-collapse text-left text-xs">
          <thead>
            <tr className="text-text-muted">
              <th className="border-b border-border px-2 py-2">Process</th>
              <th className="border-b border-border px-2 py-2">Responsible</th>
              <th className="border-b border-border px-2 py-2">Accountable</th>
              <th className="border-b border-border px-2 py-2">Consulted</th>
              <th className="border-b border-border px-2 py-2">Informed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="text-text-secondary">
                <td className="border-b border-border px-2 py-2 font-medium text-brand-navy">{row.process}</td>
                <td className="border-b border-border px-2 py-2">{row.responsible}</td>
                <td className="border-b border-border px-2 py-2">{row.accountable}</td>
                <td className="border-b border-border px-2 py-2">{row.consulted}</td>
                <td className="border-b border-border px-2 py-2">{row.informed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function permissionTone(group: PermissionNode["group"]) {
  if (group === "compliance") return "border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-soft)] text-[var(--color-semantic-success-text)]";
  if (group === "access") return "border-indigo-300 bg-indigo-50 text-indigo-700";
  if (group === "capability") return "border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] text-[var(--color-semantic-info-text)]";
  if (group === "group") return "border-[var(--color-semantic-warning)] bg-[var(--color-semantic-warning-soft)] text-[var(--color-semantic-warning-text)]";
  return "border-slate-300 bg-white text-slate-700";
}

export function PermissionsOverview({ nodes, links }: { nodes: PermissionNode[]; links: PermissionLink[] }) {
  const lookup = new Map(nodes.map((node) => [node.id, node]));

  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-brand-navy">Permissions Overview</h3>
          <ShieldCheck className="h-4 w-4 text-brand-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative h-[360px] overflow-hidden rounded-2xl border border-border bg-[radial-gradient(circle_at_top_left,rgba(28,130,242,0.1),transparent_40%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]">
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            {links.map((link) => {
              const from = lookup.get(link.from);
              const to = lookup.get(link.to);
              if (!from || !to) return null;
              const x1 = from.x + 70;
              const y1 = from.y + 16;
              const x2 = to.x;
              const y2 = to.y + 16;
              const midpoint = (x1 + x2) / 2;
              return (
                <g key={link.id}>
                  <path d={`M ${x1} ${y1} C ${midpoint} ${y1}, ${midpoint} ${y2}, ${x2} ${y2}`} fill="none" stroke="#cbd5e1" strokeWidth="1.6" />
                  <text x={midpoint} y={(y1 + y2) / 2 - 4} textAnchor="middle" fontSize="10" fill="#64748b">{link.label}</text>
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <motion.div key={node.id} whileHover={{ y: -2 }} className={cn("absolute rounded-xl border px-3 py-2 text-xs font-semibold shadow-sm", permissionTone(node.group))} style={{ left: node.x, top: node.y }}>
              <p>{node.label}</p>
              <p className="mt-1 text-[10px] font-normal uppercase">{node.group}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function OrganizationAnalytics({ rows }: { rows: AnalyticsSeries[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Organization Analytics</h3>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl border border-border bg-surface-canvas p-3">
            <p className="text-[11px] uppercase tracking-wide text-text-muted">{row.label}</p>
            <p className="mt-1 text-lg font-semibold text-brand-navy">{row.value}</p>
            <p className={cn("text-xs", row.trend.startsWith("-") ? "text-rose-600" : "text-emerald-600")}>{row.trend}</p>
            <p className="mt-1 text-[11px] text-text-secondary">{row.detail}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

function timelineIcon(type: OrgActivityEvent["type"]) {
  if (type === "hiring") return <Users className="h-3.5 w-3.5" />;
  if (type === "agent") return <Bot className="h-3.5 w-3.5" />;
  return <User className="h-3.5 w-3.5" />;
}

export function OrganizationActivityTimeline({ events }: { events: OrgActivityEvent[] }) {
  return (
    <Card className="border-border bg-white">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold text-brand-navy">Activity Timeline</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {events.map((event) => (
          <motion.article key={event.id} variants={panelMotion} className="rounded-xl border border-border bg-surface-canvas p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
                {timelineIcon(event.type)}
                {event.title}
              </p>
              <span className="text-xs text-text-muted">{new Date(event.timestamp).toLocaleString()}</span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{event.detail}</p>
          </motion.article>
        ))}
      </CardContent>
    </Card>
  );
}

export function RightInsightPanel({ insights }: { insights: InsightItem[] }) {
  return (
    <WorkspaceRightPanel ariaLabel="Organization right insight panel">
      <Card className="border-border bg-white">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-brand-navy">Right Insight Panel</h3>
            <Sparkles className="h-4 w-4 text-brand-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          {insights.map((insight) => (
            <article key={insight.id} className="rounded-xl border border-border bg-surface-canvas p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-brand-navy">{insight.title}</p>
                <StatusBadge label={insight.tone} tone={insightTone(insight.tone)} />
              </div>
              <p className="mt-1 text-xs text-text-secondary">{insight.detail}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </WorkspaceRightPanel>
  );
}

export function OrganizationSummaryStrip({ metrics }: { metrics: OrganizationOverviewMetric[] }) {
  return (
    <Card className="border-border bg-white">
      <CardContent className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.slice(0, 4).map((metric) => (
          <InfoCard key={metric.id} title={metric.label} detail={metric.value} />
        ))}
      </CardContent>
    </Card>
  );
}
