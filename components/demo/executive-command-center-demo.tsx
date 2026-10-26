"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { formatDemoEuro } from "@/lib/demo/currency";
import {
  answerDemoQuestion,
  demoDepartmentSummaries,
  demoExecutiveRoles,
  type DemoExecutiveRole,
} from "@/lib/demo/executive-command-center-model";
import { DepartmentCities } from "@/components/demo/department-cities";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  Check,
  ChartNoAxesCombined,
  CircleDollarSign,
  Factory,
  HeartPulse,
  Lightbulb,
  Mic,
  Network,
  Search,
  ShieldAlert,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";

type Domain = {
  id: string;
  label: string;
  signal: string;
  health: string;
  accent: string;
  Icon: LucideIcon;
  tone: string;
  edge: string;
};

const domains: Domain[] = [
  { id: "sales", label: "Sales", signal: "Pipeline acceleration", health: "32 agents · steady", accent: "#2563eb", Icon: BriefcaseBusiness, tone: "text-blue-700", edge: "border-blue-200 bg-blue-50" },
  { id: "marketing", label: "Marketing", signal: "Demand quality", health: "18 agents · steady", accent: "#7c3aed", Icon: ChartNoAxesCombined, tone: "text-violet-700", edge: "border-violet-200 bg-violet-50" },
  { id: "customers", label: "Customer success", signal: "Retention risk", health: "24 agents · attention", accent: "#059669", Icon: Users, tone: "text-emerald-700", edge: "border-emerald-200 bg-emerald-50" },
  { id: "finance", label: "Finance", signal: "Margin guardrails", health: "12 agents · steady", accent: "#d97706", Icon: CircleDollarSign, tone: "text-amber-700", edge: "border-amber-200 bg-amber-50" },
  { id: "operations", label: "Operations", signal: "Throughput stability", health: "20 agents · steady", accent: "#0891b2", Icon: Factory, tone: "text-cyan-700", edge: "border-cyan-200 bg-cyan-50" },
  { id: "product", label: "Product", signal: "Roadmap confidence", health: "16 agents · watch", accent: "#4f46e5", Icon: ShoppingBag, tone: "text-indigo-700", edge: "border-indigo-200 bg-indigo-50" },
];

const metrics = [
  { id: "revenue", label: "Revenue · sample YTD", value: 24_800_000, kind: "currency" as const, change: "↑ 18.6%", Icon: CircleDollarSign, positive: true },
  { id: "pipeline", label: "Pipeline · sample", value: 37_600_000, kind: "currency" as const, change: "↑ 21.3%", Icon: ChartNoAxesCombined, positive: true },
  { id: "customers", label: "Active customers · sample", value: 642, kind: "count" as const, change: "↑ 8.7%", Icon: Users, positive: true },
  { id: "risk", label: "Accounts at risk · sample", value: 23, kind: "count" as const, change: "↓ 12.2%", Icon: HeartPulse, positive: false },
  { id: "actions", label: "AI actions · examples", value: 128, kind: "count" as const, change: "↑ 32%", Icon: Bot, positive: true },
];

type Opportunity = {
  id: string;
  name: string;
  amount: number;
  stage: string;
  intent: string;
  account: string;
  owner: string;
  closeDate: string;
  probability: number;
};

const initialOpportunities: Opportunity[] = [
  { id: "sample-proposal", name: "Sample Opportunity A", amount: 2_100_000, stage: "Proposal", intent: "High intent", account: "Sample Account A", owner: "Demo owner 1", closeDate: "2026-12-15", probability: 55 },
  { id: "sample-negotiation", name: "Sample Opportunity B", amount: 1_800_000, stage: "Negotiation", intent: "High intent", account: "Sample Account B", owner: "Demo owner 2", closeDate: "2026-11-30", probability: 70 },
  { id: "sample-qualified", name: "Sample Opportunity C", amount: 1_200_000, stage: "Qualified", intent: "Medium intent", account: "Sample Account C", owner: "Demo owner 3", closeDate: "2027-01-20", probability: 35 },
  { id: "sample-qualified-d", name: "Sample Opportunity D", amount: 980_000, stage: "Qualified", intent: "Review intent", account: "Sample Account D", owner: "Demo owner 4", closeDate: "2027-02-10", probability: 25 },
];

const pipelineStages = [
  { stage: "Prospect", amount: 8_400_000, count: 42, height: "h-9", color: "bg-blue-200" },
  { stage: "Qualified", amount: 12_100_000, count: 35, height: "h-14", color: "bg-blue-300" },
  { stage: "Proposal", amount: 9_600_000, count: 22, height: "h-12", color: "bg-blue-400" },
  { stage: "Negotiation", amount: 5_300_000, count: 13, height: "h-16", color: "bg-indigo-400" },
  { stage: "Closed Won", amount: 2_200_000, count: 9, height: "h-20", color: "bg-emerald-400" },
];

const customerRisks = [
  { id: "sample-account-a", name: "Sample Account A", score: 92, drivers: "Renewal within 45 days · support trend above sample baseline", owner: "Demo owner 1", renewal: "2026-12-01" },
  { id: "sample-account-b", name: "Sample Account B", score: 87, drivers: "Product usage decline · two unresolved sample support cases", owner: "Demo owner 2", renewal: "2027-01-15" },
  { id: "sample-account-c", name: "Sample Account C", score: 65, drivers: "Engagement below sample target · renewal in 90 days", owner: "Demo owner 3", renewal: "2027-01-30" },
];

const DEMO_NOW = "2026-10-24T12:00:00.000Z";
const activity = [
  { id: "activity-a", label: "Sample signal summarized for Account A.", department: "Customer success", agent: "Retention review", status: "Reviewed", type: "Insight", minutesAgo: 8, href: "/demo-platform/customer-intelligence" },
  { id: "activity-b", label: "Example opportunity stage reviewed.", department: "Sales", agent: "Pipeline monitor", status: "Proposed", type: "Opportunity", minutesAgo: 21, href: "/demo-platform/sales-intelligence" },
  { id: "activity-c", label: "Sample retention signal flagged for review.", department: "Customer success", agent: "Health monitor", status: "Proposed", type: "Risk", minutesAgo: 37, href: "/demo-platform/customer-intelligence" },
  { id: "activity-d", label: "Example onboarding workflow inspected.", department: "Operations", agent: "Workflow analyst", status: "Simulated", type: "Workflow", minutesAgo: 62, href: "/demo-platform/workflows" },
];

const recommendations = [
  {
    id: "retention",
    title: "Protect a renewal",
    customerId: "sample-account-a",
    observation: "A sample account shows a churn signal that merits review.",
    evidence: "Renewal timing and support signals are flagged for review.",
    outcome: "A timely account review may reduce renewal risk.",
  },
  {
    id: "expansion",
    title: "Review an expansion",
    opportunityId: "sample-negotiation",
    observation: "A sample expansion opportunity is marked high intent.",
    evidence: "The example account is marked high intent in negotiation.",
    outcome: "Confirm fit and next steps before committing resources.",
  },
  {
    id: "workflow",
    title: "Examine workflow friction",
    observation: "Three sample processes show repeated manual handoffs.",
    evidence: "The example review estimates 12 hours per week of effort.",
    outcome: "Assess a low-risk improvement; no workflow is run here.",
  },
  {
    id: "capacity",
    title: "Check team capacity",
    observation: "Two sample teams have uneven task distribution.",
    evidence: "The example model projects an 18% response-time change.",
    outcome: "Review workload before making any resource decision.",
  },
];

const healthPoints = [
  [9, 32, "healthy"], [13, 46, "healthy"], [18, 26, "healthy"], [19, 55, "healthy"], [23, 38, "healthy"],
  [26, 62, "healthy"], [29, 30, "healthy"], [33, 46, "healthy"], [37, 23, "healthy"], [39, 58, "healthy"],
  [42, 36, "healthy"], [45, 66, "healthy"], [49, 27, "healthy"], [52, 48, "healthy"], [56, 35, "healthy"],
  [59, 60, "healthy"], [63, 23, "healthy"], [66, 48, "healthy"], [70, 34, "healthy"], [73, 61, "healthy"],
  [77, 27, "healthy"], [81, 46, "healthy"], [84, 59, "healthy"], [88, 35, "healthy"], [23, 76, "watch"],
  [36, 72, "watch"], [52, 77, "watch"], [65, 73, "watch"], [78, 78, "risk"], [88, 68, "risk"],
] as const;

const departmentConnections = [
  { from: "sales", to: "marketing", relationship: "Lead conversion" },
  { from: "sales", to: "customers", relationship: "Account and renewal context" },
  { from: "sales", to: "finance", relationship: "Forecast and commercial context" },
  { from: "customers", to: "product", relationship: "Feedback and product issues" },
  { from: "finance", to: "operations", relationship: "Process cost and throughput" },
];

function focusStyle() {
  return "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-colors duration-200 motion-reduce:transition-none";
}

function MetricTrendChart({ id, label }: { id: string; label: string }) {
  const seriesByMetric: Record<string, number[]> = {
    revenue: [28, 33, 31, 42, 47, 45, 58, 64],
    pipeline: [34, 39, 36, 45, 52, 49, 61, 69],
    customers: [35, 38, 43, 45, 49, 54, 58, 64],
    risk: [68, 61, 64, 55, 51, 47, 42, 38],
    actions: [22, 29, 27, 38, 46, 51, 61, 72],
  };
  const values = seriesByMetric[id] ?? seriesByMetric.revenue!;
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${90 - value}`).join(" ");

  return (
    <svg role="img" aria-label={`${label} sample eight-period trend`} viewBox="0 0 100 38" className="mt-2 h-8 w-full overflow-visible">
      <path d="M0 31H100M0 18H100" stroke="#dbe7f3" strokeWidth="1" strokeDasharray="2 3" />
      <polyline points={points} fill="none" stroke="#3285f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {values.map((value, index) => (
        <circle key={`${id}-${index}`} cx={(index / (values.length - 1)) * 100} cy={90 - value} r="1.7" fill="#1d4ed8">
        </circle>
      ))}
    </svg>
  );
}

export function DemoExecutiveCommandCenter() {
  const [selectedDomainId, setSelectedDomainId] = useState("sales");
  const [coreOverviewOpen, setCoreOverviewOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedHealthPoint, setSelectedHealthPoint] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [metricValues, setMetricValues] = useState(() => Object.fromEntries(metrics.map(({ id, value }) => [id, value])));
  const [metricDraft, setMetricDraft] = useState("");
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [opportunityDraft, setOpportunityDraft] = useState("");
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<string | null>(null);
  const [pipelineAmounts, setPipelineAmounts] = useState(() => Object.fromEntries(pipelineStages.map(({ stage, amount }) => [stage, amount])));
  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [opportunityOwnerFilter, setOpportunityOwnerFilter] = useState("All owners");
  const [reviewedOpportunity, setReviewedOpportunity] = useState<string | null>(null);
  const [customerScores, setCustomerScores] = useState(() => Object.fromEntries(customerRisks.map(({ id, score }) => [id, score])));
  const [customerDraft, setCustomerDraft] = useState("");
  const [healthFilter, setHealthFilter] = useState<string | null>(null);
  const [reviewedCustomer, setReviewedCustomer] = useState<string | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [reviewedActivity, setReviewedActivity] = useState<string[]>([]);
  const [previewRecommendation, setPreviewRecommendation] = useState<string | null>(null);
  const [simulatedRecommendations, setSimulatedRecommendations] = useState<string[]>([]);
  const [recommendationStatuses, setRecommendationStatuses] = useState<Record<string, "New" | "Reviewed" | "Approved" | "In Progress" | "Completed" | "Rejected">>({});
  const [recommendationRejectionReason, setRecommendationRejectionReason] = useState("");
  const [askPreviewOpen, setAskPreviewOpen] = useState(false);
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState<ReturnType<typeof answerDemoQuestion> | null>(null);
  const [selectedRole, setSelectedRole] = useState<DemoExecutiveRole>("CEO");
  const [activityDepartmentFilter, setActivityDepartmentFilter] = useState("All departments");
  const [activityStatusFilter, setActivityStatusFilter] = useState("All statuses");
  const [activityTypeFilter, setActivityTypeFilter] = useState("All types");
  const [demoActivityEntries, setDemoActivityEntries] = useState<typeof activity>([]);
  const [actionMessage, setActionMessage] = useState("");
  const selectedDomain = domains.find((domain) => domain.id === selectedDomainId) ?? domains[0]!;
  const selectedDepartmentSummary = demoDepartmentSummaries.find((department) => department.id === selectedDomainId) ?? demoDepartmentSummaries[0]!;
  const rolePriority: Record<DemoExecutiveRole, string> = {
    CEO: "sales",
    CFO: "finance",
    "Sales leader": "sales",
    "Customer Success leader": "customers",
    "Operations leader": "operations",
  };
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesStage = selectedPipelineStage === null || opportunity.stage === selectedPipelineStage;
    const query = opportunitySearch.trim().toLowerCase();
    const matchesQuery = !query || `${opportunity.name} ${opportunity.account} ${opportunity.stage} ${opportunity.intent} ${opportunity.owner}`.toLowerCase().includes(query);
    return matchesStage && matchesQuery && (opportunityOwnerFilter === "All owners" || opportunity.owner === opportunityOwnerFilter);
  });
  const activityEntries = [...demoActivityEntries, ...activity];
  const recordDemoActivity = (label: string, department = selectedDomain.label, type = "Demo action", href = "/demo-platform/activity") => {
    setDemoActivityEntries((current) => [{
      id: `demo-action-${Date.now()}`,
      label,
      department,
      agent: "Local demo preview",
      status: "Simulated",
      type,
      minutesAgo: 0,
      href,
    }, ...current]);
  };
  const filteredActivity = activityEntries.filter((item) =>
    (activityDepartmentFilter === "All departments" || item.department === activityDepartmentFilter) &&
    (activityStatusFilter === "All statuses" || (reviewedActivity.includes(item.id) ? "Reviewed" : item.status) === activityStatusFilter) &&
    (activityTypeFilter === "All types" || item.type === activityTypeFilter),
  );
  const filteredRiskAccounts = customerRisks.filter((customer) =>
    `${customer.name} ${customer.owner} ${customer.drivers}`.toLowerCase().includes(customerSearch.trim().toLowerCase()),
  );
  const submitDemoQuestion = (question: string) => {
    setAssistantQuestion(question);
    setAssistantAnswer(answerDemoQuestion(question, {
      revenueEur: metricValues.revenue ?? 0,
      pipelineEur: metricValues.pipeline ?? 0,
      activeCustomers: metricValues.customers ?? 0,
      atRiskCustomers: metricValues.risk ?? 0,
      selectedDepartment: selectedDomain.label,
      selectedDepartmentFocus: selectedDomain.signal,
    }));
  };
  return (
    <section className="aios-demo-executive relative isolate mx-auto w-full max-w-[1500px] px-0 pb-8 pt-4 text-slate-800 sm:px-2 lg:px-4">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(191,219,254,0.46),transparent_56%),linear-gradient(135deg,#f8fbff_0%,#eef5ff_52%,#f8fbff_100%)]" />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">AIOS Pilot · executive view</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Executive Command Center</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">A connected view of sample business signals, evidence, and decisions to review.</p>
        </div>
        <button
          type="button"
          aria-expanded={askPreviewOpen}
          aria-controls="ask-aios-preview"
          onClick={() => setAskPreviewOpen((open) => !open)}
          className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-200 bg-white/90 px-4 text-sm font-semibold text-blue-800 shadow-sm hover:bg-blue-50 ${focusStyle()}`}
        >
          <Mic aria-hidden="true" className="h-4 w-4" />
          Ask AIOS · demo
        </button>
      </header>

      {askPreviewOpen ? (
        <div id="ask-aios-preview" className="mt-4 rounded-xl border border-blue-200 bg-white/95 p-4 text-sm shadow-sm">
          <div className="flex items-start gap-3">
            <Lightbulb aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">Ask AIOS · deterministic demo assistant</p>
              <p className="mt-1 text-xs text-slate-600">Answers are generated locally from the synthetic dashboard state. No prompt or business data is sent.</p>
            </div>
          </div>
          <form className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); submitDemoQuestion(assistantQuestion); }}>
            <label className="sr-only" htmlFor="demo-assistant-question">Ask about sample business information</label>
            <input
              id="demo-assistant-question"
              value={assistantQuestion}
              onChange={(event) => setAssistantQuestion(event.target.value)}
              placeholder="Ask about pipeline, revenue, customer risk, or priorities"
              className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            />
            <button type="submit" className={`min-h-11 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 ${focusStyle()}`}>Ask demo</button>
          </form>
          <div className="mt-2 flex flex-wrap gap-2">
            {["What are my priorities?", "Why are accounts at risk?", "What is the pipeline bottleneck?", "Summarize revenue"].map((question) => (
              <button key={question} type="button" onClick={() => submitDemoQuestion(question)} className={`min-h-10 rounded-full border border-blue-100 bg-blue-50/70 px-3 text-xs font-medium text-blue-900 hover:bg-blue-100 ${focusStyle()}`}>{question}</button>
            ))}
          </div>
          {assistantAnswer ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3" aria-live="polite">
              <p className="font-semibold text-slate-900">{assistantAnswer.summary}</p>
              <p className="mt-1 text-xs leading-5 text-slate-700"><strong>Basis:</strong> {assistantAnswer.evidence}</p>
              <Link href={assistantAnswer.href} className={`mt-2 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>{assistantAnswer.linkLabel}<ArrowRight aria-hidden="true" className="h-3 w-3" /></Link>
            </div>
          ) : null}
        </div>
      ) : null}

      {actionMessage ? (
        <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900" role="status" aria-live="polite">
          <span className="min-w-0 break-words">{actionMessage}</span>
          <button type="button" onClick={() => setActionMessage("")} className={`min-h-10 rounded-md px-2 font-semibold hover:bg-white ${focusStyle()}`}>Dismiss</button>
        </div>
      ) : null}

      <nav aria-label="Executive demo navigation" className="mt-4 flex min-w-0 flex-wrap gap-2 pb-1">
        {[
          { label: "Overview", href: "/demo-platform" },
          { label: "Pipeline", href: "/demo-platform/sales-intelligence" },
          { label: "Customers", href: "/demo-platform/customer-intelligence" },
          { label: "AI Agents", href: "/demo-platform/agents" },
          { label: "Insights", href: "/demo-platform/insights" },
          { label: "Actions", href: "/demo-platform/activity" },
          { label: "Settings", href: "/demo-platform/settings" },
        ].map(({ label, href }) => (
          <Link key={label} href={href} aria-current={label === "Overview" ? "page" : undefined} className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-3 text-center text-xs font-semibold ${label === "Overview" ? "border-blue-300 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"} ${focusStyle()}`}>{label}</Link>
        ))}
      </nav>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <label htmlFor="demo-role" className="font-semibold text-slate-700">Priority lens · demo role</label>
        <select id="demo-role" value={selectedRole} onChange={(event) => {
          const nextRole = demoExecutiveRoles.find((role) => role === event.target.value);
          if (nextRole) {
            setSelectedRole(nextRole);
            setSelectedDomainId(rolePriority[nextRole]);
          }
        }} className="min-h-10 max-w-full rounded-md border border-slate-300 bg-white px-2 text-slate-800">
          {demoExecutiveRoles.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <span className="text-slate-500">Synthetic prioritization only; does not grant or change permissions.</span>
      </div>

      <section aria-label="Executive sample metrics" className="mt-5 overflow-hidden rounded-2xl border border-white/90 bg-white/75 shadow-[0_10px_35px_rgba(73,112,165,0.08)] backdrop-blur">
        <div className="aios-demo-primary-card-grid grid grid-cols-1 divide-y divide-blue-100 md:grid-cols-3 md:divide-x xl:grid-cols-5 xl:divide-y-0">
          {metrics.map(({ id, label, kind, change, Icon, positive }) => {
            const expanded = selectedMetric === id;
            const value = metricValues[id] ?? 0;
            return (
              <div key={id} className="min-w-0 px-3 py-3 sm:px-4">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`metric-editor-${id}`}
                  onClick={() => {
                    setSelectedMetric(expanded ? null : id);
                    setMetricDraft(String(value));
                  }}
                  className={`block w-full min-w-0 rounded-lg text-left ${focusStyle()}`}
                >
                  <span className="block text-[10px] font-semibold uppercase leading-4 tracking-wide text-slate-500">{label}</span>
                  <span className="mt-1 flex items-center justify-between gap-2">
                    <span className="min-w-0 break-words text-base font-semibold tabular-nums text-slate-900 sm:text-xl lg:text-2xl">
                      {kind === "currency" ? formatDemoEuro(value, true) : new Intl.NumberFormat("de-DE").format(value)}
                    </span>
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-blue-500" />
                  </span>
                  <span className={`mt-1 flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-700" : "text-amber-700"}`}>
                    {positive ? <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /> : <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5" />}
                    {change} · example
                  </span>
                  <MetricTrendChart id={id} label={label} />
                  <span className="mt-1 block text-[10px] text-blue-700">{expanded ? "Close sample details" : "Inspect sample trend / edit"}</span>
                </button>
                {expanded ? (
                  <div id={`metric-editor-${id}`} className="mt-2 space-y-2 rounded-lg bg-blue-50 p-2">
                    <p className="text-[10px] leading-4 text-slate-700">
                      Eight synthetic reporting periods · sample comparison: {change.replace(/[↑↓]\s*/, "")} · last updated {new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(DEMO_NOW))}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                      <span>Current sample: <strong className="text-slate-900">{kind === "currency" ? formatDemoEuro(value, true) : new Intl.NumberFormat("de-DE").format(value)}</strong></span>
                      <span>Data source: <strong className="text-slate-900">synthetic demo</strong></span>
                    </div>
                    <form
                      className="space-y-2 border-t border-blue-100 pt-2"
                      onSubmit={(event) => {
                      event.preventDefault();
                      const nextValue = Number(metricDraft);
                      if (Number.isFinite(nextValue) && nextValue >= 0) {
                        if (id === "pipeline") {
                          const previousTotal = metricValues.pipeline ?? 0;
                          const scaledStages = pipelineStages.slice(0, -1).map(({ stage, amount }) => [
                            stage,
                            previousTotal > 0 ? Math.round((pipelineAmounts[stage] ?? amount) * nextValue / previousTotal) : 0,
                          ] as const);
                          const allocatedTotal = scaledStages.reduce((sum, [, amount]) => sum + amount, 0);
                          const lastStage = pipelineStages[pipelineStages.length - 1]!;
                          setPipelineAmounts(Object.fromEntries([...scaledStages, [lastStage.stage, Math.max(0, nextValue - allocatedTotal)]]));
                        }
                        setMetricValues((current) => ({ ...current, [id]: nextValue }));
                        recordDemoActivity(`${label} changed to ${kind === "currency" ? formatDemoEuro(nextValue, true) : new Intl.NumberFormat("de-DE").format(nextValue)}.`, "Executive", "KPI");
                        setActionMessage(`${label} updated in this demo page only.`);
                        setSelectedMetric(null);
                      }
                    }}
                    >
                      <label className="block text-[10px] font-medium text-slate-700" htmlFor={`metric-value-${id}`}>
                        {kind === "currency" ? "Sample amount (EUR)" : "Sample count"}
                      </label>
                      <input
                        id={`metric-value-${id}`}
                        type="number"
                        min="0"
                        step={kind === "currency" ? "1000" : "1"}
                        value={metricDraft}
                        onChange={(event) => setMetricDraft(event.target.value)}
                        className="min-h-10 w-full min-w-0 rounded-md border border-blue-200 bg-white px-2 text-sm text-slate-900"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button type="submit" className={`min-h-10 rounded-md bg-blue-700 px-3 text-xs font-semibold text-white hover:bg-blue-800 ${focusStyle()}`}>Save sample</button>
                        <button type="button" onClick={() => { setSelectedMetric(null); setActionMessage("Sample edit cancelled."); }} className={`min-h-10 rounded-md px-2 text-xs font-semibold text-slate-700 hover:bg-white ${focusStyle()}`}>Cancel</button>
                      </div>
                    </form>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <div className="aios-demo-city-dashboard mt-5 grid min-w-0 gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(220px,0.82fr)_minmax(400px,1.4fr)_minmax(250px,0.92fr)]">
        <section aria-labelledby="landscape-heading" className="aios-demo-city-landscape order-1 min-w-0 rounded-[1.75rem] border border-white/90 bg-white/55 p-4 shadow-[0_16px_45px_rgba(73,112,165,0.1)] backdrop-blur-sm lg:col-span-2 xl:col-span-3 xl:col-start-1">
          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
            <div className="w-full min-w-0 sm:w-auto sm:flex-1">
              <h2 id="landscape-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Connected operating landscape</h2>
              <p className="mt-1 text-xs text-slate-600">Select a department city to inspect its synthetic signal.</p>
            </div>
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-800">
              <Network aria-hidden="true" className="h-3 w-3" /> Sample network
            </span>
          </div>

          <DepartmentCities
            departments={domains}
            connections={departmentConnections}
            selectedDepartmentId={selectedDomainId}
            onDepartmentSelect={setSelectedDomainId}
            onCoreSelect={() => setCoreOverviewOpen((open) => !open)}
            coreOverviewOpen={coreOverviewOpen}
          />

          <p className="aios-demo-city-selected mt-3 rounded-xl border border-blue-100/80 bg-white/75 px-3 py-2.5 text-xs leading-5 text-slate-700" aria-live="polite">
            <strong className="text-slate-900">Selected · {selectedDomain.label}.</strong> {selectedDomain.signal} · {selectedDomain.health}. This is a synthetic demo signal.
          </p>
          {coreOverviewOpen ? (
            <div id="company-wide-intelligence" className="aios-demo-city-overview mt-3 rounded-xl border border-blue-200 bg-white p-3 shadow-sm" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Company-wide intelligence · {selectedRole} lens</h3>
                <button type="button" onClick={() => setCoreOverviewOpen(false)} className={`min-h-10 rounded-md px-2 text-xs font-semibold text-blue-800 hover:bg-blue-50 ${focusStyle()}`}>Close overview</button>
              </div>
              <div className="mt-2 grid gap-3 text-xs sm:grid-cols-2">
                <p><strong>Current evidence:</strong> {formatDemoEuro(metricValues.revenue ?? 0, true)} sample YTD revenue · {formatDemoEuro(metricValues.pipeline ?? 0, true)} sample pipeline · {metricValues.risk ?? 0} accounts flagged.</p>
                <p><strong>Priority:</strong> {selectedDepartmentSummary.issue} <strong>Suggested review:</strong> {selectedDepartmentSummary.recommendation}</p>
              </div>
              <p className="mt-2 text-[10px] leading-4 text-slate-500">Cross-team context is illustrative; the role lens only reorders synthetic priorities and does not enforce or grant access.</p>
              <Link href="/demo-platform/insights" className={`mt-2 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>Review sample insights <ArrowRight aria-hidden="true" className="h-3 w-3" /></Link>
            </div>
          ) : null}
          <div className="aios-demo-city-detail mt-3 grid min-w-0 gap-3 rounded-xl border border-slate-200 bg-white/90 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{selectedDomain.label} department intelligence · synthetic</p>
              <p className="mt-1 text-xs font-semibold text-slate-900">{selectedDepartmentSummary.kpi}</p>
              <p className="mt-1 text-xs text-amber-800"><strong>Issue:</strong> {selectedDepartmentSummary.issue}</p>
              <p className="mt-1 text-xs text-slate-600"><strong>Next review:</strong> {selectedDepartmentSummary.recommendation}</p>
              <p className="mt-1 text-[10px] text-slate-500"><strong>Connected sample context:</strong> {selectedDepartmentSummary.relatedDepartmentIds.map((id) => domains.find((domain) => domain.id === id)?.label).filter(Boolean).join(", ") || "Company-wide"}.</p>
            </div>
            <Link href={selectedDepartmentSummary.href} className={`inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-blue-200 px-3 text-xs font-semibold text-blue-800 hover:bg-blue-50 ${focusStyle()}`}>Open {selectedDomain.label}<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>
          </div>
        </section>

        <section aria-labelledby="pipeline-heading" className="aios-demo-floating-card aios-demo-pipeline-card order-2 min-w-0 rounded-[1.5rem] border border-white/90 bg-white/80 p-4 shadow-[0_12px_35px_rgba(73,112,165,0.08)] xl:order-1 xl:col-start-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 id="pipeline-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Revenue pipeline</h2>
              <p className="mt-1 text-xs text-slate-500">Sample opportunity flow · {formatDemoEuro(metricValues.pipeline ?? 0, true)}</p>
            </div>
            <ChartNoAxesCombined aria-hidden="true" className="h-4 w-4 text-blue-700" />
          </div>
          <div className="mt-4 flex min-w-0 items-end gap-1" role="group" aria-label="Filter sample opportunities by pipeline stage">
            {pipelineStages.map((item) => (
              <button
                key={item.stage}
                type="button"
                aria-pressed={selectedPipelineStage === item.stage}
                onClick={() => setSelectedPipelineStage(selectedPipelineStage === item.stage ? null : item.stage)}
                className={`flex min-w-0 flex-1 flex-col items-center rounded-md px-0.5 pb-1 text-center ${selectedPipelineStage === item.stage ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-slate-50"} ${focusStyle()}`}
              >
                <span className="w-full break-words text-[8px] font-medium leading-tight text-slate-600 sm:text-[9px]">{formatDemoEuro(pipelineAmounts[item.stage] ?? item.amount, true)}</span>
                <span aria-hidden="true" className={`mt-1 block w-full max-w-10 rounded-t-md ${item.height} ${item.color}`} />
                <span className="mt-1 break-words text-[9px] leading-tight text-slate-600">{item.stage}</span>
                <span className="mt-0.5 text-[9px] tabular-nums text-slate-500">{item.count} deals</span>
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[10px] text-slate-600">
            <span>Unweighted sample value · stage bars are aggregates; opportunity rows below are selected examples.</span>
            <Link href="/demo-platform/sales-intelligence" className={`inline-flex min-h-10 items-center gap-1 font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>View full pipeline <ArrowRight aria-hidden="true" className="h-3 w-3" /></Link>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-slate-800">Opportunities to review</h3>
              {selectedPipelineStage ? (
                <button type="button" onClick={() => setSelectedPipelineStage(null)} className={`min-h-10 px-2 text-xs font-semibold text-blue-700 ${focusStyle()}`}>Clear stage</button>
              ) : null}
            </div>
            <label className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
              <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="sr-only">Search sample opportunities</span>
              <input
                type="search"
                value={opportunitySearch}
                onChange={(event) => setOpportunitySearch(event.target.value)}
                placeholder="Search examples"
                className="min-w-0 flex-1 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>
            <label className="mt-2 block text-[10px] font-medium text-slate-600">Filter by sample owner
              <select value={opportunityOwnerFilter} onChange={(event) => setOpportunityOwnerFilter(event.target.value)} className="mt-1 min-h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-800">
                {["All owners", ...Array.from(new Set(opportunities.map((opportunity) => opportunity.owner)))].map((owner) => <option key={owner}>{owner}</option>)}
              </select>
            </label>
            <div className="mt-2 divide-y divide-slate-100">
              {filteredOpportunities.length === 0 ? (
                <p className="py-3 text-xs text-slate-600">No sample opportunities match this search and stage.</p>
              ) : null}
              {filteredOpportunities.map((opportunity) => {
                const expanded = selectedOpportunity === opportunity.id;
                const editing = expanded && opportunityDraft !== "";
                return (
                  <div key={opportunity.id} className="py-2">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`opportunity-detail-${opportunity.id}`}
                      onClick={() => {
                        setSelectedOpportunity(expanded ? null : opportunity.id);
                        setOpportunityDraft("");
                      }}
                      className={`block min-h-11 w-full text-left ${focusStyle()}`}
                    >
                      <span className="flex min-w-0 items-center justify-between gap-2">
                        <span className="min-w-0 flex-1 break-words text-xs font-semibold text-slate-800">{opportunity.name}</span>
                        <span className="shrink-0 text-right text-xs font-semibold tabular-nums text-slate-900">{formatDemoEuro(opportunity.amount, true)}</span>
                      </span>
                      <span className="mt-0.5 flex flex-wrap items-center justify-between gap-x-2 text-[10px] text-slate-500">
                        <span className="break-words">{opportunity.stage} · synthetic example</span><span className="break-words">{opportunity.intent}</span>
                      </span>
                    </button>
                    {expanded ? (
                      <div id={`opportunity-detail-${opportunity.id}`} className="mt-2 space-y-2 rounded-lg bg-blue-50/70 p-3">
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700">
                          <span>Account: <strong>{opportunity.account}</strong></span>
                          <span>Owner: <strong>{opportunity.owner}</strong></span>
                          <span>Probability: <strong>{opportunity.probability}% modeled</strong></span>
                          <span>Expected close: <strong>{opportunity.closeDate}</strong></span>
                        </div>
                        <p className="text-[10px] leading-4 text-slate-600">Intent and probability are synthetic prioritization estimates, not calibrated predictions.</p>
                        {editing ? (
                          <form
                            className="space-y-2"
                            onSubmit={(event) => {
                              event.preventDefault();
                              const nextAmount = Number(opportunityDraft);
                              if (Number.isFinite(nextAmount) && nextAmount >= 0) {
                                setOpportunities((current) => current.map((item) => item.id === opportunity.id ? { ...item, amount: nextAmount } : item));
                                const stageDelta = nextAmount - opportunity.amount;
                                setPipelineAmounts((current) => ({ ...current, [opportunity.stage]: Math.max(0, (current[opportunity.stage] ?? 0) + stageDelta) }));
                                const nextTotal = Math.max(0, Object.values(pipelineAmounts).reduce((sum, amount) => sum + amount, 0) + stageDelta);
                                setMetricValues((current) => ({ ...current, pipeline: nextTotal }));
                                recordDemoActivity(`${opportunity.name} sample value edited locally.`, "Sales", "Opportunity", "/demo-platform/sales-intelligence");
                                setActionMessage(`${opportunity.name} sample value updated locally.`);
                                setOpportunityDraft("");
                              }
                            }}
                          >
                            <label className="block text-[10px] font-medium text-slate-700" htmlFor={`opportunity-amount-${opportunity.id}`}>Synthetic amount (EUR)</label>
                            <input id={`opportunity-amount-${opportunity.id}`} type="number" min="0" step="1000" value={opportunityDraft} onChange={(event) => setOpportunityDraft(event.target.value)} className="min-h-11 w-full min-w-0 rounded-md border border-blue-200 bg-white px-2 text-sm" />
                            <div className="flex flex-wrap gap-2">
                              <button type="submit" className={`min-h-10 rounded-md bg-blue-700 px-3 text-xs font-semibold text-white ${focusStyle()}`}>Save value</button>
                              <button type="button" onClick={() => { setOpportunityDraft(""); setActionMessage("Opportunity edit cancelled."); }} className={`min-h-10 rounded-md px-2 text-xs font-semibold text-slate-700 ${focusStyle()}`}>Cancel edit</button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => setOpportunityDraft(String(opportunity.amount))} className={`min-h-10 rounded-md border border-blue-200 bg-white px-3 text-xs font-semibold text-blue-800 ${focusStyle()}`}>Edit sample value</button>
                            <button type="button" onClick={() => { setReviewedOpportunity(reviewedOpportunity === opportunity.id ? null : opportunity.id); if (reviewedOpportunity !== opportunity.id) recordDemoActivity(`Opportunity review recorded for ${opportunity.name}.`, "Sales", "Review", "/demo-platform/sales-intelligence"); setActionMessage(reviewedOpportunity === opportunity.id ? "Sample review undone locally." : "Sample opportunity review simulated locally."); }} className={`min-h-10 rounded-md px-3 text-xs font-semibold text-blue-800 hover:bg-white ${focusStyle()}`}>
                              {reviewedOpportunity === opportunity.id ? "Undo simulated review" : "Simulate review"}
                            </button>
                            <Link href="/demo-platform/sales-intelligence" className={`inline-flex min-h-10 items-center px-2 text-xs font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>Open sales view</Link>
                            <button type="button" onClick={() => { recordDemoActivity(`Demo follow-up assigned for ${opportunity.name}.`, "Sales", "Task", "/demo-platform/sales-intelligence"); setActionMessage(`A demo-only follow-up was recorded for ${opportunity.name}.`); }} className={`min-h-10 rounded-md px-2 text-xs font-semibold text-blue-800 ${focusStyle()}`}>Create demo follow-up</button>
                          </div>
                        )}
                        {reviewedOpportunity === opportunity.id ? <p className="text-xs font-medium text-emerald-800" role="status"><Check aria-hidden="true" className="mr-1 inline h-3.5 w-3.5" />Review simulated locally only.</p> : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="aios-demo-floating-card aios-demo-side-stack order-3 min-w-0 space-y-4 xl:col-span-2 xl:col-start-2">
          <section aria-labelledby="health-heading" className="aios-demo-floating-panel rounded-[1.5rem] border border-white/90 bg-white/80 p-4 shadow-[0_12px_35px_rgba(73,112,165,0.08)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 id="health-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Customer health map</h2>
                <p className="mt-1 text-xs text-slate-500">642 active sample accounts · 30 illustrative map points</p>
              </div>
              <HeartPulse aria-hidden="true" className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="mt-3 space-y-1.5 text-[10px]">
              {[
                { label: "Healthy", count: 528, color: "bg-emerald-500" },
                { label: "At risk", count: 91, color: "bg-amber-500" },
                { label: "High risk", count: 23, color: "bg-rose-500" },
              ].map((segment) => (
                <div key={segment.label} className="grid grid-cols-[4.5rem_1fr_5rem] items-center gap-2">
                  <span>{segment.label}</span>
                  <span className="h-2 overflow-hidden rounded-sm bg-slate-100">
                    <span className={`block h-full ${segment.color}`} style={{ width: `${segment.count / 642 * 100}%` }} />
                  </span>
                  <span className="text-right tabular-nums text-slate-600">{segment.count} · {(segment.count / 642 * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
            <svg role="group" aria-label="Select a representative point in the synthetic customer-health map" className="mt-3 h-28 w-full rounded-xl bg-[linear-gradient(135deg,#f8fbff,#edf5ff)]" viewBox="0 0 100 100">
              <path d="M5 82H95M8 20V84" stroke="#cbdcf0" strokeWidth="0.7" strokeDasharray="2 2" />
              {healthPoints.map((point, index) => ({ point, index })).filter(({ point: [, , status] }) => healthFilter === null || status === healthFilter).map(({ point: [x, y, status], index }) => (
                <circle
                  key={`${x}-${y}-${index}`}
                  cx={x}
                  cy={y}
                  r={selectedHealthPoint === `${status}-${index}` ? 3.5 : status === "risk" ? 2.2 : 1.6}
                  fill={status === "healthy" ? "#10b981" : status === "watch" ? "#f59e0b" : "#ef4444"}
                  stroke={selectedHealthPoint === `${status}-${index}` ? "#0f172a" : "#ffffff"}
                  strokeWidth={selectedHealthPoint === `${status}-${index}` ? "1.2" : "0.5"}
                  opacity="0.9"
                />
              ))}
            </svg>
            <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label="Filter customer health map">
              {[
                { id: null, label: "All", marker: "bg-slate-400" },
                { id: "healthy", label: "Healthy", marker: "bg-emerald-500" },
                { id: "watch", label: "At risk", marker: "bg-amber-500" },
                { id: "risk", label: "High risk", marker: "bg-rose-500" },
              ].map((filter) => (
                <button
                  key={filter.id ?? "all"}
                  type="button"
                  aria-pressed={healthFilter === filter.id}
                  onClick={() => {
                    setHealthFilter(filter.id);
                    if (filter.id !== null && selectedHealthPoint?.split("-")[0] !== filter.id) {
                      setSelectedHealthPoint(null);
                    }
                  }}
                  className={`inline-flex min-h-10 items-center gap-1 rounded-md px-2 text-[10px] text-slate-700 ${healthFilter === filter.id ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-slate-50"} ${focusStyle()}`}
                >
                  <i aria-hidden="true" className={`h-2 w-2 rounded-full ${filter.marker}`} />{filter.label}
                </button>
              ))}
            </div>
            {selectedHealthPoint ? (
              <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50/70 p-2 text-[10px] leading-4 text-slate-700" aria-live="polite">
              Selected {selectedHealthPoint.split("-")[0] === "watch" ? "at-risk" : selectedHealthPoint.split("-")[0]} point. Plotted points are illustrative samples; the category counts above come from a separate synthetic aggregate.
              <Link href="/demo-platform/customer-intelligence" className={`ml-1 font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>Open customer directory</Link>
              </div>
            ) : null}
          </section>

          <section aria-labelledby="risk-heading" className="aios-demo-floating-panel rounded-[1.5rem] border border-white/90 bg-white/80 p-4 shadow-[0_12px_35px_rgba(73,112,165,0.08)]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 id="risk-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Churn risk alerts</h2>
                <p className="mt-1 text-xs text-slate-500">3 example records · 23 aggregate high-risk accounts</p>
              </div>
              <ShieldAlert aria-hidden="true" className="h-4 w-4 text-amber-700" />
            </div>
            <label className="mt-2 flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-2">
              <Search aria-hidden="true" className="h-3.5 w-3.5 text-slate-500" />
              <span className="sr-only">Search sample at-risk accounts</span>
              <input type="search" value={customerSearch} onChange={(event) => setCustomerSearch(event.target.value)} placeholder="Search sample accounts" className="min-w-0 flex-1 bg-transparent text-xs outline-none" />
            </label>
            <div className="mt-2 divide-y divide-slate-100">
              {filteredRiskAccounts.length === 0 ? <p className="py-3 text-xs text-slate-600">No sample accounts match this search.</p> : null}
              {filteredRiskAccounts.map((customer) => {
                const expanded = selectedCustomer === customer.id;
                const score = customerScores[customer.id] ?? customer.score;
                const tone = score >= 80 ? "text-rose-700" : "text-amber-700";
                const marker = score >= 80 ? "bg-rose-500" : "bg-amber-500";
                return (
                  <div key={customer.id} className="py-2">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`customer-detail-${customer.id}`}
                      onClick={() => {
                        setSelectedCustomer(expanded ? null : customer.id);
                        setCustomerDraft(String(score));
                        setSelectedHealthPoint(score >= 80 ? "risk-28" : "watch-24");
                      }}
                      className={`flex min-h-11 w-full min-w-0 items-center justify-between gap-2 text-left ${focusStyle()}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <i aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${marker}`} />
                        <span className="min-w-0 break-words text-xs font-semibold text-slate-800">{customer.name}</span>
                      </span>
                      <span className={`max-w-24 shrink-0 break-words text-right text-[10px] font-semibold ${tone}`}>{score >= 80 ? "High risk" : "At risk"}<br />Score {score}</span>
                    </button>
                    {expanded ? (
                      <div id={`customer-detail-${customer.id}`} className="mt-1 space-y-2 rounded-lg bg-amber-50/70 p-3">
                        <p className="text-[10px] leading-4 text-slate-700"><strong>Drivers:</strong> {customer.drivers}</p>
                        <p className="text-[10px] leading-4 text-slate-600">Owner: {customer.owner} · Renewal: {customer.renewal}</p>
                        <p className="text-[10px] leading-4 text-slate-600">Risk trend: sample watchlist review required. Risk score is a 0–100 prioritization index, not a calibrated churn probability. Synthetic example only.</p>
                        <Link href="/demo-platform/customer-intelligence" className={`inline-flex min-h-10 items-center text-[10px] font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>Open sample customer view</Link>
                        <form
                          className="space-y-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            const nextScore = Number(customerDraft);
                            if (Number.isFinite(nextScore) && nextScore >= 0 && nextScore <= 100) {
                              setCustomerScores((current) => ({ ...current, [customer.id]: nextScore }));
                              recordDemoActivity(`${customer.name} sample risk score changed to ${nextScore}.`, "Customer success", "Risk", "/demo-platform/customer-intelligence");
                              setActionMessage(`${customer.name} sample score updated locally.`);
                            }
                          }}
                        >
                          <label className="block text-[10px] font-medium text-slate-700" htmlFor={`customer-score-${customer.id}`}>Sample risk score (0–100)</label>
                          <input id={`customer-score-${customer.id}`} type="number" min="0" max="100" step="1" value={customerDraft} onChange={(event) => setCustomerDraft(event.target.value)} className="min-h-11 w-full min-w-0 rounded-md border border-amber-200 bg-white px-2 text-sm" />
                          <div className="flex flex-wrap gap-2">
                            <button type="submit" className={`min-h-10 rounded-md bg-amber-700 px-3 text-xs font-semibold text-white ${focusStyle()}`}>Save score</button>
                            <button type="button" onClick={() => setCustomerDraft(String(score))} className={`min-h-10 rounded-md px-2 text-xs font-semibold text-slate-700 ${focusStyle()}`}>Cancel edit</button>
                            <button type="button" onClick={() => { setReviewedCustomer(reviewedCustomer === customer.id ? null : customer.id); if (reviewedCustomer !== customer.id) recordDemoActivity(`Sample account review recorded for ${customer.name}.`, "Customer success", "Review", "/demo-platform/customer-intelligence"); setActionMessage(reviewedCustomer === customer.id ? "Sample account review undone locally." : "Sample account review simulated locally."); }} className={`min-h-10 rounded-md px-2 text-xs font-semibold text-blue-800 ${focusStyle()}`}>
                              {reviewedCustomer === customer.id ? "Undo review" : "Simulate review"}
                            </button>
                            <button type="button" onClick={() => { recordDemoActivity(`Demo follow-up task created for ${customer.name}.`, "Customer success", "Task", "/demo-platform/customer-intelligence"); setActionMessage(`Demo follow-up task created for ${customer.name}; no external task system was contacted.`); }} className={`min-h-10 rounded-md px-2 text-xs font-semibold text-blue-800 ${focusStyle()}`}>Create demo follow-up</button>
                          </div>
                        </form>
                        {reviewedCustomer === customer.id ? <p role="status" className="text-xs font-medium text-emerald-800">Review simulated locally only.</p> : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <Link href="/demo-platform/customer-intelligence" className={`mt-2 inline-flex min-h-10 items-center gap-1 text-[10px] font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>View all churn risks <ArrowRight aria-hidden="true" className="h-3 w-3" /></Link>
          </section>

          <section aria-labelledby="agent-status-heading" className="aios-demo-floating-panel aios-demo-agent-status rounded-[1.5rem] border border-white/90 bg-white/80 p-4 shadow-[0_12px_35px_rgba(73,112,165,0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 id="agent-status-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">AIOS demo status</h2>
                <p className="mt-1 text-xs text-emerald-800">Sample services available · synthetic status only</p>
              </div>
              <Bot aria-hidden="true" className="h-4 w-4 text-blue-700" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="border-r border-slate-200"><strong className="block text-lg tabular-nums text-slate-900">122</strong><span className="text-[10px] text-slate-600">sample agents</span></div>
              <div className="border-r border-slate-200"><strong className="block text-lg tabular-nums text-emerald-700">118</strong><span className="text-[10px] text-slate-600">ready</span></div>
              <div><strong className="block text-lg tabular-nums text-amber-700">4</strong><span className="text-[10px] text-slate-600">review state</span></div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500">Department totals reconcile: 32 + 18 + 24 + 12 + 20 + 16 = 122. Not production infrastructure health.</p>
            <Link href="/demo-platform/agents" className={`mt-2 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>Open agent status <ArrowRight aria-hidden="true" className="h-3 w-3" /></Link>
          </section>

          <section aria-labelledby="activity-heading" className="aios-demo-floating-panel rounded-[1.5rem] border border-white/90 bg-white/80 p-4 shadow-[0_12px_35px_rgba(73,112,165,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity aria-hidden="true" className="h-4 w-4 text-blue-700" />
                <h2 id="activity-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Sample activity</h2>
              </div>
              <Link href="/demo-platform/activity" className={`inline-flex min-h-10 items-center gap-1 text-[10px] font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>View full activity <ArrowRight aria-hidden="true" className="h-3 w-3" /></Link>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <label className="text-[10px] font-medium text-slate-600">Department
                <select value={activityDepartmentFilter} onChange={(event) => setActivityDepartmentFilter(event.target.value)} className="mt-1 min-h-10 w-full min-w-0 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-800">
                  {["All departments", ...Array.from(new Set(activityEntries.map((item) => item.department)))].map((department) => <option key={department}>{department}</option>)}
                </select>
              </label>
              <label className="text-[10px] font-medium text-slate-600">Status
                <select value={activityStatusFilter} onChange={(event) => setActivityStatusFilter(event.target.value)} className="mt-1 min-h-10 w-full min-w-0 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-800">
                  {["All statuses", "Proposed", "Reviewed", "Simulated"].map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label className="text-[10px] font-medium text-slate-600">Event type
                <select value={activityTypeFilter} onChange={(event) => setActivityTypeFilter(event.target.value)} className="mt-1 min-h-10 w-full min-w-0 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-800">
                  {["All types", ...Array.from(new Set(activityEntries.map((item) => item.type)))].map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
            </div>
            <ul className="mt-2 space-y-2">
              {filteredActivity.length === 0 ? <li className="py-3 text-xs text-slate-600">No sample events match these filters.</li> : null}
              {filteredActivity.map((item) => {
                const expanded = expandedActivity === item.id;
                const reviewed = reviewedActivity.includes(item.id);
                const occurredAt = new Date(Date.parse(DEMO_NOW) - item.minutesAgo * 60_000);
                return (
                  <li key={item.id} className="border-l-2 border-blue-200 pl-3">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`activity-detail-${item.id}`}
                      onClick={() => setExpandedActivity(expanded ? null : item.id)}
                      className={`min-h-11 w-full break-words py-1 text-left text-xs leading-5 text-slate-700 ${focusStyle()}`}
                    >
                      {item.label}
                    </button>
                    {expanded ? (
                      <div id={`activity-detail-${item.id}`} className="mb-2 space-y-2 rounded-lg bg-blue-50/70 p-3">
                        <p className="text-xs leading-5 text-slate-700">{item.department} · {item.agent} · {reviewed ? "Reviewed" : item.status}</p>
                        <p className="text-[10px] text-slate-600">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(occurredAt)} UTC · synthetic event</p>
                        <p className="text-[10px] text-slate-600">This event represents a sample or local demo interaction; no external operation is implied.</p>
                        <Link href={item.href} className={`inline-flex min-h-10 items-center text-xs font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>Open related demo view</Link>
                        <button
                          type="button"
                          onClick={() => { setReviewedActivity((current) => reviewed ? current.filter((id) => id !== item.id) : [...current, item.id]); if (!reviewed) recordDemoActivity(`Activity event reviewed: ${item.label}`, item.department, "Review", item.href); setActionMessage(reviewed ? "Sample activity review undone locally." : "Sample activity marked reviewed locally."); }}
                          className={`min-h-10 rounded-md border border-blue-200 bg-white px-3 text-xs font-semibold text-blue-800 ${focusStyle()}`}
                        >
                          {reviewed ? "Undo local review" : "Mark reviewed locally"}
                        </button>
                        {reviewed ? <p role="status" className="text-xs font-medium text-emerald-800">Review saved in this page only.</p> : null}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <section aria-labelledby="recommendations-heading" className="aios-demo-floating-card aios-demo-recommendations order-4 min-w-0 rounded-[1.5rem] border border-blue-100 bg-white/85 px-4 py-4 shadow-[0_14px_38px_rgba(73,112,165,0.09)] lg:col-span-2 xl:col-span-3">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-blue-100 pb-3">
            <div>
              <h2 id="recommendations-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Executive recommendations</h2>
              <p className="mt-1 text-xs text-slate-600">Observation → evidence → expected outcome · synthetic examples</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-800"><Lightbulb aria-hidden="true" className="h-3.5 w-3.5" />Review before acting</span>
          </div>
          <div className="grid min-w-0 divide-y divide-blue-100 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            {recommendations.map((recommendation) => {
              const expanded = previewRecommendation === recommendation.id;
              const status = recommendationStatuses[recommendation.id] ?? "New";
              const simulated = simulatedRecommendations.includes(recommendation.id);
              const linkedCustomer = recommendation.customerId ? customerRisks.find((customer) => customer.id === recommendation.customerId) : undefined;
              const linkedOpportunity = recommendation.opportunityId ? opportunities.find((opportunity) => opportunity.id === recommendation.opportunityId) : undefined;
              return (
                <article key={recommendation.id} className="min-w-0 py-3 md:px-3 first:md:pl-0 last:md:pr-0 xl:px-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{recommendation.title}</h3>
                    <span className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-700">{status}</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-700">
                    <strong>Observation:</strong> {recommendation.observation}
                    {linkedCustomer ? ` Current synthetic score: ${customerScores[linkedCustomer.id] ?? linkedCustomer.score}.` : null}
                    {linkedOpportunity ? ` Current sample value: ${formatDemoEuro(linkedOpportunity.amount, true)}.` : null}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600"><strong>Evidence:</strong> {recommendation.evidence}</p>
                  {expanded ? (
                    <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-5 text-slate-700" aria-live="polite">
                      <p><strong>Expected outcome:</strong> {recommendation.outcome}</p>
                      {recommendation.id === "retention" ? <p className="mt-1">Review timing: renewal window and synthetic support signals. Suggested intervention: assign a human account review. Confidence: illustrative, not calibrated.</p> : null}
                      {recommendation.id === "expansion" ? <p className="mt-1">Potential value: €1.3M estimate. Assumption: a sample cross-sell scenario, subject to customer confirmation and commercial review.</p> : null}
                      {recommendation.id === "workflow" ? <p className="mt-1">Proposal: inspect three sample manual handoffs; 12 hours/week is an estimate. A local simulation changes demo status only and does not connect to systems.</p> : null}
                      {recommendation.id === "capacity" ? <p className="mt-1">Proposal: review two sample agent assignments; 18% response-time improvement is a modeled estimate with workload constraints to validate.</p> : null}
                      <p className="mt-1 font-semibold text-blue-900">{simulated ? "Demo simulation finished locally; no real business action was performed." : "Synthetic recommendation preview; no business action has been performed."}</p>
                      {linkedCustomer ? <Link href="/demo-platform/customer-intelligence" className={`mt-1 inline-flex min-h-10 items-center font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>Open linked customer</Link> : null}
                      {linkedOpportunity ? <Link href="/demo-platform/sales-intelligence" className={`mt-1 inline-flex min-h-10 items-center font-semibold text-blue-800 underline underline-offset-2 ${focusStyle()}`}>Open linked opportunity</Link> : null}
                      <label className="mt-2 block text-[10px] font-semibold text-slate-700" htmlFor={`recommendation-reason-${recommendation.id}`}>Reason (required to reject)</label>
                      <input id={`recommendation-reason-${recommendation.id}`} value={recommendationRejectionReason} onChange={(event) => setRecommendationRejectionReason(event.target.value)} className="min-h-10 w-full rounded-md border border-blue-200 bg-white px-2 text-xs" placeholder="Add a review note or rejection reason" />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => { setRecommendationStatuses((current) => ({ ...current, [recommendation.id]: "Reviewed" })); recordDemoActivity(`Recommendation reviewed: ${recommendation.title}.`, "Executive", "Recommendation"); setActionMessage("Recommendation marked reviewed in local demo state."); }} className={`min-h-10 rounded-md border border-blue-200 bg-white px-2 text-[10px] font-semibold text-blue-800 ${focusStyle()}`}>Mark reviewed</button>
                        <button type="button" onClick={() => { setRecommendationStatuses((current) => ({ ...current, [recommendation.id]: "Approved" })); recordDemoActivity(`Recommendation approved in demo: ${recommendation.title}.`, "Executive", "Recommendation"); setActionMessage("Demo recommendation approval recorded locally; no external action was triggered."); }} className={`min-h-10 rounded-md border border-emerald-200 bg-white px-2 text-[10px] font-semibold text-emerald-800 ${focusStyle()}`}>Approve demo</button>
                        <button type="button" onClick={() => {
                          if (!recommendationRejectionReason.trim()) {
                            setActionMessage("Add a reason before rejecting this sample recommendation.");
                            return;
                          }
                          setRecommendationStatuses((current) => ({ ...current, [recommendation.id]: "Rejected" }));
                          recordDemoActivity(`Recommendation rejected: ${recommendation.title}. Reason: ${recommendationRejectionReason.trim()}`, "Executive", "Recommendation");
                          setActionMessage("Recommendation rejection recorded in local demo state.");
                        }} className={`min-h-10 rounded-md border border-rose-200 bg-white px-2 text-[10px] font-semibold text-rose-800 ${focusStyle()}`}>Reject with reason</button>
                        {status === "Approved" ? <button type="button" onClick={() => { setRecommendationStatuses((current) => ({ ...current, [recommendation.id]: "In Progress" })); setSimulatedRecommendations((current) => current.includes(recommendation.id) ? current : [...current, recommendation.id]); recordDemoActivity(`Demo simulation started: ${recommendation.title}.`, "Executive", "Simulation"); setActionMessage("A local demo simulation is in progress; no external system was changed."); }} className={`min-h-10 rounded-md bg-blue-700 px-2 text-[10px] font-semibold text-white ${focusStyle()}`}>Start demo simulation</button> : null}
                        {status === "In Progress" ? <button type="button" onClick={() => { setRecommendationStatuses((current) => ({ ...current, [recommendation.id]: "Completed" })); recordDemoActivity(`Local demo simulation completed: ${recommendation.title}.`, "Executive", "Simulation"); setActionMessage("Local demo simulation completed. No external operation occurred."); }} className={`min-h-10 rounded-md bg-blue-700 px-2 text-[10px] font-semibold text-white ${focusStyle()}`}>Complete demo simulation</button> : null}
                      </div>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setPreviewRecommendation(expanded ? null : recommendation.id)}
                    className={`mt-2 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-blue-800 hover:bg-blue-50 ${focusStyle()}`}
                  >
                    {expanded ? "Close preview" : "Preview reasoning"} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <p className="sr-only" role="note">This public demo uses synthetic sample data. All interactions are local previews and do not connect to live business systems.</p>
    </section>
  );
}
