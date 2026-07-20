"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle2,
  Clock3,
  GitBranch,
  KeyRound,
  Network,
  Radar,
  Scale,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import { cn } from "@/utils";

export type NextGenDomain =
  | "blueprint"
  | "qbi"
  | "runtime"
  | "developer"
  | "organization"
  | "users"
  | "teams"
  | "roles"
  | "permissions"
  | "audit"
  | "api-keys"
  | "mcp"
  | "sales"
  | "finance"
  | "operations"
  | "hr"
  | "customer";

type WidgetCard = {
  id: string;
  title: string;
  metric: string;
  summary: string;
  tone: "blue" | "emerald" | "amber";
  icon: React.ComponentType<{ className?: string }>;
  /** 8 relative values 0–100 representing historical trend */
  trend: number[];
};

const sparkBarColor: Record<WidgetCard["tone"], string> = {
  blue: "bg-blue-400/70",
  emerald: "bg-emerald-400/70",
  amber: "bg-amber-400/70",
};

const MiniSparkline = memo(function MiniSparkline({ values, tone }: { values: number[]; tone: WidgetCard["tone"] }) {
  const shouldReduceMotion = useReducedMotion();
  const max = Math.max(...values, 1);
  return (
    <div className="mt-3 flex h-8 items-end gap-0.5" aria-hidden="true">
      {values.map((v, i) => (
        <motion.span
          key={i}
          className={cn("flex-1 rounded-sm", sparkBarColor[tone])}
          style={{ height: `${Math.max(8, (v / max) * 100)}%`, originY: "100%" }}
          initial={{ scaleY: shouldReduceMotion ? 1 : 0 }}
          animate={{ scaleY: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
        />
      ))}
    </div>
  );
});

const toneClass: Record<WidgetCard["tone"], string> = {
  blue: "from-blue-50 to-cyan-50 border-blue-200 text-blue-700",
  emerald: "from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700",
  amber: "from-amber-50 to-orange-50 border-amber-200 text-amber-700",
};

const widgetCatalog: Record<NextGenDomain, WidgetCard[]> = {
  blueprint: [
    { id: "bp-1", title: "Business DNA Coverage", metric: "97%", summary: "Capabilities, goals, ecosystem, and memory linkages are synchronized.", tone: "blue", icon: Network, trend: [72, 78, 81, 84, 88, 91, 95, 97] },
    { id: "bp-2", title: "AI Readiness Index", metric: "89/100", summary: "Operating model readiness improved after process and policy mapping.", tone: "emerald", icon: Bot, trend: [60, 65, 68, 72, 76, 80, 85, 89] },
    { id: "bp-3", title: "Blueprint Approval", metric: "14 Pending", summary: "Executive stakeholders requiring approval before lock-in.", tone: "amber", icon: CheckCircle2, trend: [22, 20, 19, 18, 17, 16, 15, 14] },
    { id: "bp-4", title: "Strategic Priorities", metric: "10 Active", summary: "Priorities mapped to departmental OKRs and confidence trajectories.", tone: "blue", icon: Radar, trend: [6, 6, 7, 8, 9, 9, 10, 10] },
  ],
  qbi: [
    { id: "qbi-1", title: "Monte Carlo Runs", metric: "10,000", summary: "Scenario lattice refreshed for revenue, margin, and churn outcomes.", tone: "blue", icon: BarChart3, trend: [6000, 7200, 7800, 8400, 8800, 9200, 9600, 10000] },
    { id: "qbi-2", title: "Most Likely Revenue", metric: "EUR 37.6M", summary: "P50 projection driven by current pipeline velocity and risk posture.", tone: "emerald", icon: Radar, trend: [29, 31, 32, 33, 34, 35, 36, 37.6] },
    { id: "qbi-3", title: "Probability Drift", metric: "2.1%", summary: "Week-over-week drift remained within optimization thresholds.", tone: "amber", icon: Activity, trend: [4.2, 3.8, 3.4, 3.1, 2.9, 2.6, 2.3, 2.1] },
    { id: "qbi-4", title: "Optimization Confidence", metric: "94%", summary: "Recommended strategy remains growth-maximization with guarded risk.", tone: "blue", icon: GitBranch, trend: [78, 82, 84, 86, 89, 91, 92, 94] },
  ],
  runtime: [
    { id: "rt-1", title: "Runtime Uptime", metric: "99.96%", summary: "Execution engine reliability across orchestration clusters.", tone: "emerald", icon: Activity, trend: [99.7, 99.8, 99.82, 99.85, 99.88, 99.9, 99.93, 99.96] },
    { id: "rt-2", title: "Queue Throughput", metric: "1,284/min", summary: "Autonomous tasks processed with stable latency profile.", tone: "blue", icon: Workflow, trend: [940, 980, 1040, 1100, 1150, 1200, 1250, 1284] },
    { id: "rt-3", title: "Incident Risk", metric: "Low", summary: "No critical incidents in the last 7 execution windows.", tone: "amber", icon: ShieldCheck, trend: [72, 60, 52, 44, 36, 28, 20, 12] },
    { id: "rt-4", title: "Recovery Readiness", metric: "92%", summary: "Failover and replay pathways validated in current environment.", tone: "blue", icon: Clock3, trend: [74, 78, 80, 82, 85, 88, 90, 92] },
  ],
  developer: [
    { id: "dev-1", title: "API Request Volume", metric: "2.8M", summary: "Monthly requests across public and internal platform endpoints.", tone: "blue", icon: BarChart3, trend: [1.2, 1.5, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8] },
    { id: "dev-2", title: "SDK Adoption", metric: "64 Teams", summary: "Developer teams actively shipping against AIOS SDK contracts.", tone: "emerald", icon: BookOpen, trend: [20, 28, 34, 40, 48, 54, 60, 64] },
    { id: "dev-3", title: "Error Budget", metric: "81%", summary: "Remaining budget after current release train and canary cycles.", tone: "amber", icon: Activity, trend: [100, 98, 96, 93, 90, 87, 84, 81] },
    { id: "dev-4", title: "Token Governance", metric: "128 Keys", summary: "Token and rate-limit posture across all integrated services.", tone: "blue", icon: KeyRound, trend: [60, 72, 84, 96, 104, 112, 120, 128] },
  ],
  organization: [
    { id: "org-1", title: "Business Units", metric: "10", summary: "Cross-functional entities aligned to enterprise capabilities.", tone: "blue", icon: Network, trend: [6, 7, 7, 8, 8, 9, 9, 10] },
    { id: "org-2", title: "Ownership Clarity", metric: "95%", summary: "Entity-to-owner mapping completeness across operating model.", tone: "emerald", icon: Users, trend: [72, 78, 81, 84, 88, 90, 92, 95] },
    { id: "org-3", title: "Ecosystem Risk", metric: "Medium", summary: "Dependency concentration in two external supplier clusters.", tone: "amber", icon: ShieldCheck, trend: [80, 75, 70, 65, 62, 60, 58, 55] },
    { id: "org-4", title: "Decision Velocity", metric: "+18%", summary: "Faster approvals after ownership and role boundary updates.", tone: "blue", icon: CheckCircle2, trend: [4, 6, 8, 10, 12, 14, 16, 18] },
  ],
  users: [
    { id: "usr-1", title: "Active Executive Users", metric: "142", summary: "Leadership users with current workspace engagement this week.", tone: "blue", icon: Users, trend: [100, 108, 114, 120, 128, 132, 138, 142] },
    { id: "usr-2", title: "Operator Coverage", metric: "98%", summary: "Teams with assigned operator profiles and backup ownership.", tone: "emerald", icon: Bot, trend: [82, 86, 88, 90, 93, 95, 96, 98] },
    { id: "usr-3", title: "Access Drift", metric: "11 Flags", summary: "Role mismatch events requiring governance review.", tone: "amber", icon: ShieldCheck, trend: [24, 22, 20, 18, 16, 14, 13, 11] },
    { id: "usr-4", title: "Identity Confidence", metric: "96%", summary: "Context confidence score for user profile-to-role mapping.", tone: "blue", icon: KeyRound, trend: [80, 84, 86, 88, 90, 92, 94, 96] },
  ],
  teams: [
    { id: "team-1", title: "Cross-Team Workflows", metric: "36", summary: "Workflows spanning multiple departments and operators.", tone: "blue", icon: Workflow, trend: [18, 20, 24, 26, 28, 30, 34, 36] },
    { id: "team-2", title: "Capacity Utilization", metric: "84%", summary: "Balanced utilization across strategic delivery teams.", tone: "emerald", icon: Activity, trend: [66, 70, 72, 74, 76, 79, 82, 84] },
    { id: "team-3", title: "Escalation Load", metric: "7 Open", summary: "Escalations pending decision center triage.", tone: "amber", icon: Clock3, trend: [18, 16, 14, 12, 11, 10, 8, 7] },
    { id: "team-4", title: "Delivery Confidence", metric: "91%", summary: "Team-level confidence on current execution plans.", tone: "blue", icon: CheckCircle2, trend: [72, 76, 79, 81, 84, 86, 89, 91] },
  ],
  roles: [
    { id: "role-1", title: "Role Matrix", metric: "10 Core", summary: "Executive and operator role definitions validated.", tone: "blue", icon: Scale, trend: [6, 6, 7, 8, 8, 9, 9, 10] },
    { id: "role-2", title: "Scope Precision", metric: "93%", summary: "Role-to-action boundary precision across workflows.", tone: "emerald", icon: ShieldCheck, trend: [74, 78, 82, 84, 86, 88, 91, 93] },
    { id: "role-3", title: "Conflict Alerts", metric: "5", summary: "Conflicting role policies flagged for remediation.", tone: "amber", icon: Activity, trend: [14, 12, 11, 10, 9, 7, 6, 5] },
    { id: "role-4", title: "Coverage", metric: "99%", summary: "Entities with accountable role assignment.", tone: "blue", icon: Users, trend: [88, 91, 92, 94, 96, 97, 98, 99] },
  ],
  permissions: [
    { id: "perm-1", title: "Policy Rules", metric: "240", summary: "Permission rules governing users, operators, and systems.", tone: "blue", icon: ShieldCheck, trend: [160, 180, 196, 208, 216, 224, 232, 240] },
    { id: "perm-2", title: "Least Privilege Score", metric: "88/100", summary: "Current score after quarterly policy hardening.", tone: "emerald", icon: KeyRound, trend: [64, 68, 72, 75, 78, 82, 85, 88] },
    { id: "perm-3", title: "Violation Attempts", metric: "14", summary: "Blocked attempts exceeding policy scope this week.", tone: "amber", icon: Activity, trend: [32, 28, 24, 22, 20, 18, 16, 14] },
    { id: "perm-4", title: "Policy Confidence", metric: "94%", summary: "Confidence from behavior-model policy verification.", tone: "blue", icon: CheckCircle2, trend: [76, 80, 83, 86, 88, 90, 92, 94] },
  ],
  audit: [
    { id: "audit-1", title: "Audit Events", metric: "12,420", summary: "Trace events captured for decisions and autonomous actions.", tone: "blue", icon: BookOpen, trend: [6400, 7800, 8800, 9600, 10400, 11000, 11800, 12420] },
    { id: "audit-2", title: "Trace Completeness", metric: "99.2%", summary: "Event lineage completeness across critical workflows.", tone: "emerald", icon: CheckCircle2, trend: [94, 95.2, 96, 96.8, 97.4, 98, 98.6, 99.2] },
    { id: "audit-3", title: "Pending Reviews", metric: "18", summary: "Audit entries requiring governance signoff.", tone: "amber", icon: Clock3, trend: [40, 36, 32, 28, 26, 24, 21, 18] },
    { id: "audit-4", title: "Control Effectiveness", metric: "92%", summary: "Effectiveness across mapped policy controls.", tone: "blue", icon: ShieldCheck, trend: [74, 78, 81, 84, 86, 88, 90, 92] },
  ],
  "api-keys": [
    { id: "key-1", title: "Managed Keys", metric: "128", summary: "Active API credentials across platform integrations.", tone: "blue", icon: KeyRound, trend: [64, 76, 88, 96, 104, 112, 120, 128] },
    { id: "key-2", title: "Rotation Compliance", metric: "96%", summary: "Keys rotated within policy-defined timelines.", tone: "emerald", icon: CheckCircle2, trend: [72, 78, 82, 86, 88, 91, 94, 96] },
    { id: "key-3", title: "Expiring Soon", metric: "9", summary: "Credentials requiring proactive rotation in 7 days.", tone: "amber", icon: Clock3, trend: [22, 20, 18, 16, 14, 13, 11, 9] },
    { id: "key-4", title: "Key Risk Score", metric: "Low", summary: "Current key posture after scope and token hardening.", tone: "blue", icon: ShieldCheck, trend: [72, 64, 58, 50, 42, 36, 28, 18] },
  ],
  mcp: [
    { id: "mcp-1", title: "Connected Servers", metric: "22", summary: "MCP servers online with policy-compliant registration.", tone: "blue", icon: Network, trend: [10, 12, 14, 16, 17, 18, 20, 22] },
    { id: "mcp-2", title: "Tool Reliability", metric: "97%", summary: "Invocation success ratio across active tool contracts.", tone: "emerald", icon: Workflow, trend: [88, 90, 91, 93, 94, 95, 96, 97] },
    { id: "mcp-3", title: "Gateway Alerts", metric: "6", summary: "Routing and protocol anomalies pending triage.", tone: "amber", icon: Activity, trend: [18, 16, 14, 12, 10, 9, 7, 6] },
    { id: "mcp-4", title: "Registry Freshness", metric: "94%", summary: "Catalog freshness score for MCP packages and prompts.", tone: "blue", icon: GitBranch, trend: [76, 80, 83, 86, 88, 90, 92, 94] },
  ],
  sales: [
    { id: "sal-1", title: "Pipeline Value", metric: "€37.6M", summary: "Qualified pipeline across all stages and operators.", tone: "blue", icon: BarChart3, trend: [24, 27, 29, 31, 33, 34, 36, 37.6] },
    { id: "sal-2", title: "Win Rate", metric: "34%", summary: "Closed-won ratio for enterprise deals this quarter.", tone: "emerald", icon: CheckCircle2, trend: [24, 26, 28, 29, 31, 32, 33, 34] },
    { id: "sal-3", title: "At-Risk Deals", metric: "12", summary: "Opportunities with declining engagement or stalled stage.", tone: "amber", icon: Activity, trend: [22, 20, 18, 17, 16, 15, 13, 12] },
    { id: "sal-4", title: "AI Probability Avg", metric: "68%", summary: "Average close probability weighted across active pipeline.", tone: "blue", icon: Radar, trend: [54, 58, 60, 62, 64, 65, 67, 68] },
  ],
  finance: [
    { id: "fin-1", title: "Revenue (YTD)", metric: "€24.8M", summary: "Recognised revenue versus annual plan trajectory.", tone: "emerald", icon: BarChart3, trend: [14, 16.2, 17.8, 19.1, 20.4, 21.8, 23.2, 24.8] },
    { id: "fin-2", title: "Cash Conversion", metric: "62 days", summary: "Average days from closed-won to collected payment.", tone: "blue", icon: Clock3, trend: [82, 78, 74, 71, 68, 66, 64, 62] },
    { id: "fin-3", title: "Budget Variance", metric: "-2.4%", summary: "Aggregate under-spend vs approved quarterly budget.", tone: "amber", icon: Activity, trend: [5.2, 4.6, 4.1, 3.6, 3.2, 2.9, 2.6, 2.4] },
    { id: "fin-4", title: "Gross Margin", metric: "71%", summary: "Blended gross margin across product and service lines.", tone: "emerald", icon: GitBranch, trend: [64, 65, 66, 67, 68, 69, 70, 71] },
  ],
  operations: [
    { id: "ops-1", title: "Active Projects", metric: "28", summary: "Projects in flight across all departments and teams.", tone: "blue", icon: Workflow, trend: [18, 20, 22, 23, 24, 25, 27, 28] },
    { id: "ops-2", title: "Resource Utilisation", metric: "84%", summary: "Cross-team capacity utilised vs available headcount.", tone: "emerald", icon: Users, trend: [70, 73, 75, 77, 79, 81, 82, 84] },
    { id: "ops-3", title: "Open Incidents", metric: "7", summary: "Active operational incidents pending resolution.", tone: "amber", icon: ShieldCheck, trend: [18, 16, 14, 12, 11, 9, 8, 7] },
    { id: "ops-4", title: "Supply Risk Score", metric: "Low", summary: "Aggregate supply chain concentration risk index.", tone: "blue", icon: Network, trend: [72, 66, 60, 54, 48, 40, 34, 22] },
  ],
  hr: [
    { id: "hr-1", title: "Headcount", metric: "342", summary: "Active employees across all offices and remote locations.", tone: "blue", icon: Users, trend: [290, 298, 306, 314, 320, 328, 336, 342] },
    { id: "hr-2", title: "Retention Rate", metric: "91%", summary: "12-month rolling retention across all departments.", tone: "emerald", icon: CheckCircle2, trend: [84, 86, 87, 88, 89, 90, 90, 91] },
    { id: "hr-3", title: "Open Roles", metric: "18", summary: "Approved headcount openings across active hiring plans.", tone: "amber", icon: Activity, trend: [8, 10, 12, 14, 15, 16, 17, 18] },
    { id: "hr-4", title: "Skills Coverage", metric: "78%", summary: "Required skills mapped and verified across team profiles.", tone: "blue", icon: BookOpen, trend: [62, 65, 67, 69, 71, 73, 76, 78] },
  ],
  customer: [
    { id: "cus-1", title: "Healthy Accounts", metric: "489", summary: "Customers with green health score and active engagement.", tone: "emerald", icon: Users, trend: [420, 435, 448, 458, 465, 472, 481, 489] },
    { id: "cus-2", title: "Churn Risk", metric: "23", summary: "Accounts with elevated risk score requiring intervention.", tone: "amber", icon: Activity, trend: [38, 36, 33, 31, 29, 27, 25, 23] },
    { id: "cus-3", title: "Avg Lifetime Value", metric: "€142K", summary: "Average LTV across enterprise and mid-market segments.", tone: "blue", icon: BarChart3, trend: [108, 114, 118, 124, 128, 133, 138, 142] },
    { id: "cus-4", title: "NPS Signal", metric: "+62", summary: "Net Promoter Score trend across surveyed accounts.", tone: "emerald", icon: Radar, trend: [44, 48, 50, 52, 55, 57, 59, 62] },
  ],
};

export const NextGenDomainWidgets = memo(function NextGenDomainWidgets({ domain }: { domain: NextGenDomain }) {
  const shouldReduceMotion = useReducedMotion();
  const widgets = widgetCatalog[domain];

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {widgets.map((widget) => (
        <motion.article
          key={widget.id}
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          transition={{ duration: 0.2 }}
          tabIndex={0}
          className={cn(
            "rounded-2xl border bg-gradient-to-br p-4 shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
            toneClass[widget.tone],
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{widget.title}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-800">{widget.metric}</p>
            </div>
            <span
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/70 text-slate-700"
              aria-hidden="true"
            >
              <widget.icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{widget.summary}</p>
          <MiniSparkline values={widget.trend} tone={widget.tone} />
        </motion.article>
      ))}
    </div>
  );
});
