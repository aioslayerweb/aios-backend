"use client";

import * as React from "react";
import { useState } from "react";
import { BrandLogo } from "@/components/branding";
import { formatDemoEuro } from "@/lib/demo/currency";
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
  x: number;
  y: number;
  Icon: LucideIcon;
  tone: string;
  edge: string;
};

const domains: Domain[] = [
  { id: "sales", label: "Sales", signal: "Pipeline acceleration", health: "32 agents · steady", x: 50, y: 13, Icon: BriefcaseBusiness, tone: "text-blue-700", edge: "border-blue-200 bg-blue-50" },
  { id: "marketing", label: "Marketing", signal: "Demand quality", health: "18 agents · steady", x: 18, y: 31, Icon: ChartNoAxesCombined, tone: "text-violet-700", edge: "border-violet-200 bg-violet-50" },
  { id: "customers", label: "Customer success", signal: "Retention risk", health: "24 agents · attention", x: 82, y: 31, Icon: Users, tone: "text-emerald-700", edge: "border-emerald-200 bg-emerald-50" },
  { id: "finance", label: "Finance", signal: "Margin guardrails", health: "12 agents · steady", x: 18, y: 65, Icon: CircleDollarSign, tone: "text-amber-700", edge: "border-amber-200 bg-amber-50" },
  { id: "operations", label: "Operations", signal: "Throughput stability", health: "20 agents · steady", x: 82, y: 65, Icon: Factory, tone: "text-cyan-700", edge: "border-cyan-200 bg-cyan-50" },
  { id: "product", label: "Product", signal: "Roadmap confidence", health: "16 agents · watch", x: 50, y: 82, Icon: ShoppingBag, tone: "text-indigo-700", edge: "border-indigo-200 bg-indigo-50" },
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
};

const initialOpportunities: Opportunity[] = [
  { id: "sample-proposal", name: "Sample Opportunity A", amount: 2_100_000, stage: "Proposal", intent: "High intent" },
  { id: "sample-negotiation", name: "Sample Opportunity B", amount: 1_800_000, stage: "Negotiation", intent: "High intent" },
  { id: "sample-qualified", name: "Sample Opportunity C", amount: 1_200_000, stage: "Qualified", intent: "Medium intent" },
];

const pipelineStages = [
  { stage: "Prospect", amount: 8_400_000, height: "h-9", color: "bg-blue-200" },
  { stage: "Qualified", amount: 12_100_000, height: "h-14", color: "bg-blue-300" },
  { stage: "Proposal", amount: 9_600_000, height: "h-12", color: "bg-blue-400" },
  { stage: "Negotiation", amount: 5_300_000, height: "h-16", color: "bg-indigo-400" },
  { stage: "Won", amount: 2_200_000, height: "h-20", color: "bg-emerald-400" },
];

const customerRisks = [
  { id: "sample-account-a", name: "Sample Account A", score: 92 },
  { id: "sample-account-b", name: "Sample Account B", score: 87 },
  { id: "sample-account-c", name: "Sample Account C", score: 65 },
];

const activity = [
  { id: "activity-a", label: "Sample signal summarized for Account A." },
  { id: "activity-b", label: "Example opportunity stage reviewed." },
  { id: "activity-c", label: "Sample retention signal flagged for review." },
  { id: "activity-d", label: "Example onboarding workflow inspected." },
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

function focusStyle() {
  return "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-colors duration-200 motion-reduce:transition-none";
}

function CityPlatformIllustration() {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 100" className="h-full w-full overflow-visible">
      <ellipse cx="90" cy="82" rx="68" ry="12" fill="#9eb5c9" opacity="0.2" />
      <path d="M17 61c0-10 33-18 73-18s73 8 73 18v8c0 10-33 18-73 18s-73-8-73-18z" fill="#c8d9e8" />
      <ellipse cx="90" cy="61" rx="73" ry="19" fill="#edf5fb" stroke="#9dbbd4" strokeWidth="2" />
      <ellipse cx="90" cy="59" rx="64" ry="14" fill="#f8fbff" stroke="#d7e7f4" />
      <path d="M35 59h110" stroke="#b9d5e9" strokeDasharray="2 4" />
      <g fill="#a9c9e2">
        <path d="M53 53h13V34l-6-5-7 5z" />
        <path d="M69 52h16V25l-8-7-8 7z" />
        <path d="M91 53h12V31l-6-5-6 5z" />
        <path d="M108 54h17V37l-8-6-9 6z" />
        <path d="M43 56h9V43l-5-4-4 4z" />
        <path d="M128 56h10V45l-5-4-5 4z" />
      </g>
      <g fill="#6f9fc5">
        <path d="M69 25h16l-8-7z" />
        <path d="M53 34h13l-6-5z" />
        <path d="M91 31h12l-6-5z" />
        <path d="M108 37h17l-8-6z" />
        <path d="M43 43h9l-5-4z" />
        <path d="M128 45h10l-5-4z" />
      </g>
      <g fill="#f8fbff" opacity="0.9">
        <path d="M73 30h2v3h-2zm5-5h2v3h-2zm-5 9h2v3h-2zm16 1h2v3h-2zm16 4h2v3h-2zm9-2h2v3h-2zm-68 8h2v3h-2z" />
      </g>
      <g fill="#74b995">
        <circle cx="34" cy="52" r="4" /><circle cx="148" cy="55" r="4" />
        <circle cx="61" cy="21" r="3" /><circle cx="132" cy="34" r="3" />
      </g>
      <g stroke="#5f9c7b" strokeWidth="1.5">
        <path d="M34 56v5m114-2v5M61 24v4m71 9v4" />
      </g>
    </svg>
  );
}

export function DemoExecutiveCommandCenter() {
  const [selectedDomainId, setSelectedDomainId] = useState("sales");
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [metricValues, setMetricValues] = useState(() => Object.fromEntries(metrics.map(({ id, value }) => [id, value])));
  const [metricDraft, setMetricDraft] = useState("");
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [opportunityDraft, setOpportunityDraft] = useState("");
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<string | null>(null);
  const [pipelineAmounts, setPipelineAmounts] = useState(() => Object.fromEntries(pipelineStages.map(({ stage, amount }) => [stage, amount])));
  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [reviewedOpportunity, setReviewedOpportunity] = useState<string | null>(null);
  const [customerScores, setCustomerScores] = useState(() => Object.fromEntries(customerRisks.map(({ id, score }) => [id, score])));
  const [customerDraft, setCustomerDraft] = useState("");
  const [healthFilter, setHealthFilter] = useState<string | null>(null);
  const [reviewedCustomer, setReviewedCustomer] = useState<string | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [reviewedActivity, setReviewedActivity] = useState<string[]>([]);
  const [previewRecommendation, setPreviewRecommendation] = useState<string | null>(null);
  const [simulatedRecommendations, setSimulatedRecommendations] = useState<string[]>([]);
  const [askPreviewOpen, setAskPreviewOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const selectedDomain = domains.find((domain) => domain.id === selectedDomainId) ?? domains[0]!;
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesStage = selectedPipelineStage === null || opportunity.stage === selectedPipelineStage;
    const query = opportunitySearch.trim().toLowerCase();
    const matchesQuery = !query || `${opportunity.name} ${opportunity.stage} ${opportunity.intent}`.toLowerCase().includes(query);
    return matchesStage && matchesQuery;
  });
  return (
    <section className="relative isolate mx-auto w-full max-w-[1500px] px-0 pb-8 pt-4 text-slate-800 sm:px-2 lg:px-4">
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
        <div id="ask-aios-preview" className="mt-4 flex flex-wrap items-start gap-3 rounded-xl border border-blue-200 bg-white/90 p-4 text-sm shadow-sm" role="status" aria-live="polite">
          <Lightbulb aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
          <p className="min-w-0 flex-1 text-slate-700">
            Demo preview: AIOS would summarize the selected <strong>{selectedDomain.label}</strong> signal, “{selectedDomain.signal}.” No prompt is sent and no business data is accessed.
          </p>
        </div>
      ) : null}

      {actionMessage ? (
        <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900" role="status" aria-live="polite">
          <span className="min-w-0 break-words">{actionMessage}</span>
          <button type="button" onClick={() => setActionMessage("")} className={`min-h-10 rounded-md px-2 font-semibold hover:bg-white ${focusStyle()}`}>Dismiss</button>
        </div>
      ) : null}

      <section aria-label="Executive sample metrics" className="mt-5 overflow-hidden rounded-2xl border border-white/90 bg-white/75 shadow-[0_10px_35px_rgba(73,112,165,0.08)] backdrop-blur">
        <div className="grid grid-cols-2 divide-y divide-blue-100 md:grid-cols-3 md:divide-x xl:grid-cols-5 xl:divide-y-0">
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
                  <span className="mt-1 block text-[10px] text-blue-700">{expanded ? "Close sample editor" : "Inspect / edit sample"}</span>
                </button>
                {expanded ? (
                  <form
                    id={`metric-editor-${id}`}
                    className="mt-2 space-y-2 rounded-lg bg-blue-50 p-2"
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
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(220px,0.82fr)_minmax(400px,1.4fr)_minmax(250px,0.92fr)]">
        <section aria-labelledby="landscape-heading" className="order-1 min-w-0 rounded-[1.75rem] border border-white/90 bg-white/55 p-4 shadow-[0_16px_45px_rgba(73,112,165,0.1)] backdrop-blur-sm lg:col-span-2 xl:order-2 xl:col-span-1 xl:col-start-2">
          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
            <div className="w-full min-w-0 sm:w-auto sm:flex-1">
              <h2 id="landscape-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Connected operating landscape</h2>
              <p className="mt-1 text-xs text-slate-600">Select a domain to focus its sample signal.</p>
            </div>
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-800">
              <Network aria-hidden="true" className="h-3 w-3" /> Sample network
            </span>
          </div>

          <div className="mt-3 hidden aspect-[1.12] min-h-[360px] max-h-[490px] md:block">
            <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-[radial-gradient(ellipse_at_50%_50%,rgba(219,234,254,0.76),rgba(248,251,255,0.42)_62%,transparent_100%)]">
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {domains.map((domain) => {
                  const active = selectedDomainId === domain.id;
                  return (
                    <line key={domain.id} x1="50" y1="50" x2={domain.x} y2={domain.y} stroke={active ? "#3b82f6" : "#a9c9ed"} strokeWidth={active ? "0.8" : "0.45"} strokeDasharray={active ? "0" : "1.4 1.4"} />
                  );
                })}
                <circle cx="50" cy="50" r="16" fill="none" stroke="#dbeafe" strokeWidth="0.5" />
              </svg>

              {domains.map(({ id, x, y }) => (
                <div
                  key={`${id}-platform`}
                  aria-hidden="true"
                  style={{ left: `${x}%`, top: `calc(${y}% + 1rem)` }}
                  className="pointer-events-none absolute z-[1] h-[4.5rem] w-[7.6rem] -translate-x-1/2"
                >
                  <CityPlatformIllustration />
                </div>
              ))}

              <div className="absolute left-1/2 top-1/2 z-10 h-32 w-36 -translate-x-1/2 -translate-y-1/2">
                <div aria-hidden="true" className="absolute inset-x-1 bottom-0 h-10 rounded-[50%] border border-blue-200 bg-gradient-to-b from-white to-blue-100 shadow-[0_12px_25px_rgba(37,99,235,0.2)]" />
                <div aria-hidden="true" className="absolute inset-x-3 bottom-2 h-8 rounded-[50%] border border-blue-100 bg-gradient-to-b from-blue-50 to-white shadow-inner" />
                <div className="absolute left-1/2 top-0 flex h-[5.5rem] w-[5.5rem] -translate-x-1/2 flex-col items-center justify-center rounded-[1.5rem] border border-blue-200 bg-white text-center shadow-[0_12px_35px_rgba(37,99,235,0.2)] sm:h-24 sm:w-24">
                  <BrandLogo variant="square" width={35} height={35} alt="AIOS Pilot" />
                  <span className="mt-0.5 text-[8px] font-bold tracking-[0.16em] text-blue-800">PILOT HUB</span>
                </div>
              </div>

              {domains.map(({ id, label, signal, health, x, y, Icon, tone, edge }) => {
                const isSelected = selectedDomainId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedDomainId(id)}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className={`absolute z-20 flex min-h-[3.25rem] w-[7.3rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border px-1.5 py-1.5 text-center shadow-[0_5px_18px_rgba(71,104,151,0.1)] sm:w-[8.5rem] sm:px-2 ${edge} ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:shadow-md"} ${focusStyle()}`}
                  >
                    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase leading-tight sm:text-[11px] ${tone}`}><Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />{label}</span>
                    <span className="mt-1 text-[9px] leading-tight text-slate-600">{health}</span>
                    <span className="sr-only">Sample signal: {signal}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 md:hidden">
            <div className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-blue-50/80 to-white/80 px-4 py-5">
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-blue-200 bg-white shadow-[0_8px_22px_rgba(37,99,235,0.16)]">
                <BrandLogo variant="square" width={38} height={38} alt="AIOS Pilot" />
              </div>
              <span className="mt-2 text-xs font-bold tracking-[0.2em] text-slate-800">AIOS PILOT · HUB</span>
              <span aria-hidden="true" className="my-2 h-7 border-l border-dashed border-blue-400" />
              <div className={`grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-1 rounded-xl border px-3 py-3 ${selectedDomain.edge}`}>
                <selectedDomain.Icon aria-hidden="true" className={`row-span-2 h-4 w-4 ${selectedDomain.tone}`} />
                <span className="min-w-0 break-words font-semibold text-slate-800">{selectedDomain.label}</span>
                <span className="min-w-0 break-words text-xs text-slate-600">{selectedDomain.signal}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Select a business domain">
              {domains.map(({ id, label, Icon, tone }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selectedDomainId === id}
                  onClick={() => setSelectedDomainId(id)}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-2 text-xs font-semibold ${selectedDomainId === id ? "border-blue-400 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"} ${focusStyle()}`}
                >
                  <Icon aria-hidden="true" className={`h-4 w-4 ${tone}`} />{label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-3 rounded-xl border border-blue-100/80 bg-white/75 px-3 py-2.5 text-xs leading-5 text-slate-700" aria-live="polite">
            <strong className="text-slate-900">Selected · {selectedDomain.label}.</strong> {selectedDomain.signal} · {selectedDomain.health}. This is a synthetic demo signal.
          </p>
        </section>

        <section aria-labelledby="pipeline-heading" className="order-2 min-w-0 rounded-[1.5rem] border border-white/90 bg-white/80 p-4 shadow-[0_12px_35px_rgba(73,112,165,0.08)] xl:order-1 xl:col-start-1">
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
              </button>
            ))}
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
                        <p className="text-xs leading-5 text-slate-700">Synthetic {opportunity.stage.toLowerCase()} evidence. No opportunity record is opened or changed.</p>
                        {editing ? (
                          <form
                            className="space-y-2"
                            onSubmit={(event) => {
                              event.preventDefault();
                              const nextAmount = Number(opportunityDraft);
                              if (Number.isFinite(nextAmount) && nextAmount >= 0) {
                                setOpportunities((current) => current.map((item) => item.id === opportunity.id ? { ...item, amount: nextAmount } : item));
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
                            <button type="button" onClick={() => { setReviewedOpportunity(reviewedOpportunity === opportunity.id ? null : opportunity.id); setActionMessage(reviewedOpportunity === opportunity.id ? "Sample review undone locally." : "Sample opportunity review simulated locally."); }} className={`min-h-10 rounded-md px-3 text-xs font-semibold text-blue-800 hover:bg-white ${focusStyle()}`}>
                              {reviewedOpportunity === opportunity.id ? "Undo simulated review" : "Simulate review"}
                            </button>
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

        <div className="order-3 min-w-0 space-y-4 xl:col-start-3">
          <section aria-labelledby="health-heading" className="rounded-[1.5rem] border border-white/90 bg-white/80 p-4 shadow-[0_12px_35px_rgba(73,112,165,0.08)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 id="health-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Customer health map</h2>
                <p className="mt-1 text-xs text-slate-500">642 sample accounts · illustrative</p>
              </div>
              <HeartPulse aria-hidden="true" className="h-4 w-4 text-emerald-700" />
            </div>
            <svg role="img" aria-label="Illustrative sample customer health map with mostly healthy accounts, several accounts to watch, and two high-risk clusters" className="mt-2 h-28 w-full rounded-xl bg-[linear-gradient(135deg,#f8fbff,#edf5ff)]" viewBox="0 0 100 100">
              <path d="M5 82H95M8 20V84" stroke="#cbdcf0" strokeWidth="0.7" strokeDasharray="2 2" />
              {healthPoints.filter(([, , status]) => healthFilter === null || status === healthFilter).map(([x, y, status], index) => (
                <circle key={`${x}-${y}-${index}`} cx={x} cy={y} r={status === "risk" ? 2.2 : 1.6} fill={status === "healthy" ? "#10b981" : status === "watch" ? "#f59e0b" : "#ef4444"} opacity="0.82" />
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
                  onClick={() => setHealthFilter(filter.id)}
                  className={`inline-flex min-h-10 items-center gap-1 rounded-md px-2 text-[10px] text-slate-700 ${healthFilter === filter.id ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-slate-50"} ${focusStyle()}`}
                >
                  <i aria-hidden="true" className={`h-2 w-2 rounded-full ${filter.marker}`} />{filter.label}
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="risk-heading" className="rounded-[1.5rem] border border-white/90 bg-white/80 p-4 shadow-[0_12px_35px_rgba(73,112,165,0.08)]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 id="risk-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Churn risk alerts</h2>
                <p className="mt-1 text-xs text-slate-500">Example accounts · review only</p>
              </div>
              <ShieldAlert aria-hidden="true" className="h-4 w-4 text-amber-700" />
            </div>
            <div className="mt-2 divide-y divide-slate-100">
              {customerRisks.map((customer) => {
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
                        <p className="text-[10px] leading-4 text-slate-600">Synthetic review signal only; this is not a live account assessment.</p>
                        <form
                          className="space-y-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            const nextScore = Number(customerDraft);
                            if (Number.isFinite(nextScore) && nextScore >= 0 && nextScore <= 100) {
                              setCustomerScores((current) => ({ ...current, [customer.id]: nextScore }));
                              setActionMessage(`${customer.name} sample score updated locally.`);
                            }
                          }}
                        >
                          <label className="block text-[10px] font-medium text-slate-700" htmlFor={`customer-score-${customer.id}`}>Sample risk score (0–100)</label>
                          <input id={`customer-score-${customer.id}`} type="number" min="0" max="100" step="1" value={customerDraft} onChange={(event) => setCustomerDraft(event.target.value)} className="min-h-11 w-full min-w-0 rounded-md border border-amber-200 bg-white px-2 text-sm" />
                          <div className="flex flex-wrap gap-2">
                            <button type="submit" className={`min-h-10 rounded-md bg-amber-700 px-3 text-xs font-semibold text-white ${focusStyle()}`}>Save score</button>
                            <button type="button" onClick={() => setCustomerDraft(String(score))} className={`min-h-10 rounded-md px-2 text-xs font-semibold text-slate-700 ${focusStyle()}`}>Cancel edit</button>
                            <button type="button" onClick={() => { setReviewedCustomer(reviewedCustomer === customer.id ? null : customer.id); setActionMessage(reviewedCustomer === customer.id ? "Sample account review undone locally." : "Sample account review simulated locally."); }} className={`min-h-10 rounded-md px-2 text-xs font-semibold text-blue-800 ${focusStyle()}`}>
                              {reviewedCustomer === customer.id ? "Undo review" : "Simulate review"}
                            </button>
                          </div>
                        </form>
                        {reviewedCustomer === customer.id ? <p role="status" className="text-xs font-medium text-emerald-800">Review simulated locally only.</p> : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="activity-heading" className="rounded-[1.5rem] border border-white/90 bg-white/80 p-4 shadow-[0_12px_35px_rgba(73,112,165,0.08)]">
            <div className="flex items-center gap-2">
              <Activity aria-hidden="true" className="h-4 w-4 text-blue-700" />
              <h2 id="activity-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800">Sample activity</h2>
            </div>
            <ul className="mt-2 space-y-2">
              {activity.map((item) => {
                const expanded = expandedActivity === item.id;
                const reviewed = reviewedActivity.includes(item.id);
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
                        <p className="text-xs leading-5 text-slate-600">Synthetic activity example. No message, workflow, or account was changed.</p>
                        <button
                          type="button"
                          onClick={() => { setReviewedActivity((current) => reviewed ? current.filter((id) => id !== item.id) : [...current, item.id]); setActionMessage(reviewed ? "Sample activity review undone locally." : "Sample activity marked reviewed locally."); }}
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

        <section aria-labelledby="recommendations-heading" className="order-4 min-w-0 rounded-[1.5rem] border border-blue-100 bg-white/85 px-4 py-4 shadow-[0_14px_38px_rgba(73,112,165,0.09)] lg:col-span-2 xl:col-span-3">
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
              const simulated = simulatedRecommendations.includes(recommendation.id);
              const linkedCustomer = recommendation.customerId ? customerRisks.find((customer) => customer.id === recommendation.customerId) : undefined;
              const linkedOpportunity = recommendation.opportunityId ? opportunities.find((opportunity) => opportunity.id === recommendation.opportunityId) : undefined;
              return (
                <article key={recommendation.id} className="min-w-0 py-3 md:px-3 first:md:pl-0 last:md:pr-0 xl:px-4">
                  <h3 className="text-sm font-semibold text-slate-900">{recommendation.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-700">
                    <strong>Observation:</strong> {recommendation.observation}
                    {linkedCustomer ? ` Current synthetic score: ${customerScores[linkedCustomer.id] ?? linkedCustomer.score}.` : null}
                    {linkedOpportunity ? ` Current sample value: ${formatDemoEuro(linkedOpportunity.amount, true)}.` : null}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600"><strong>Evidence:</strong> {recommendation.evidence}</p>
                  {expanded ? (
                    <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-5 text-slate-700" aria-live="polite">
                      <p><strong>Expected outcome:</strong> {recommendation.outcome}</p>
                      <p className="mt-1 font-semibold text-blue-900">{simulated ? "Simulation complete in this page only; no business action was performed." : "Local demo preview only. No business action was performed."}</p>
                      <button
                        type="button"
                        onClick={() => { setSimulatedRecommendations((current) => simulated ? current.filter((id) => id !== recommendation.id) : [...current, recommendation.id]); setActionMessage(simulated ? "Recommendation simulation undone locally." : "Recommendation simulated locally; no business action was performed."); }}
                        className={`mt-2 min-h-11 rounded-md bg-blue-700 px-3 text-xs font-semibold text-white hover:bg-blue-800 ${focusStyle()}`}
                      >
                        {simulated ? "Undo simulation" : "Simulate recommendation"}
                      </button>
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
