"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpDown, Check, Pause, ShieldAlert, SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils";
import type { NextGenDomain } from "./domain-widgets";

type QueueItem = {
  id: string;
  title: string;
  owner: string;
  impact: string;
  confidence: number;
  priority: "high" | "medium" | "low";
};

type TelemetryRow = {
  id: string;
  stream: string;
  latencyMs: number;
  errorPct: number;
  status: "healthy" | "watch" | "risk";
};

type SortKey = "stream" | "latencyMs" | "errorPct" | "status";
type SortDir = "asc" | "desc";

const queueItems: QueueItem[] = [
  { id: "q-1", title: "Approve strategic discount policy", owner: "Finance Operator", impact: "Revenue Retention", confidence: 94, priority: "high" },
  { id: "q-2", title: "Escalate churn segment risk", owner: "Customer Operator", impact: "Customer Health", confidence: 91, priority: "high" },
  { id: "q-3", title: "Authorize workflow capacity shift", owner: "Operations Operator", impact: "Execution Throughput", confidence: 88, priority: "medium" },
  { id: "q-4", title: "Confirm governance control update", owner: "Compliance Operator", impact: "Policy Coverage", confidence: 86, priority: "medium" },
  { id: "q-5", title: "Validate integration retry policy", owner: "Developer Operator", impact: "Reliability", confidence: 84, priority: "low" },
  { id: "q-6", title: "Lock next board simulation plan", owner: "Executive Operator", impact: "Decision Velocity", confidence: 92, priority: "high" },
];

const telemetryRows: TelemetryRow[] = [
  { id: "t-1", stream: "Workflow Engine", latencyMs: 82, errorPct: 0.12, status: "healthy" },
  { id: "t-2", stream: "Policy Evaluation", latencyMs: 106, errorPct: 0.24, status: "healthy" },
  { id: "t-3", stream: "Recommendation API", latencyMs: 136, errorPct: 0.72, status: "watch" },
  { id: "t-4", stream: "MCP Gateway", latencyMs: 194, errorPct: 1.42, status: "watch" },
  { id: "t-5", stream: "Event Ingestion", latencyMs: 128, errorPct: 0.44, status: "healthy" },
  { id: "t-6", stream: "Identity Guard", latencyMs: 210, errorPct: 2.05, status: "risk" },
];

function priorityClass(priority: QueueItem["priority"]) {
  if (priority === "high") return "border-rose-200 bg-rose-50 text-rose-700";
  if (priority === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function statusClass(status: TelemetryRow["status"]) {
  if (status === "healthy") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "watch") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

/* ─── Approval Queue ─── */
function ApprovalQueuePanel() {
  const [decision, setDecision] = useState<Record<string, "approved" | "held" | undefined>>({});

  const approve = useCallback((id: string) => {
    setDecision((prev) => ({ ...prev, [id]: "approved" }));
  }, []);

  const hold = useCallback((id: string) => {
    setDecision((prev) => ({ ...prev, [id]: "held" }));
  }, []);

  const pendingCount = queueItems.filter((item) => !decision[item.id]).length;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Decision Queue</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-800">
            Pending Approvals
            <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
              {pendingCount}
            </span>
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" /> Human in loop
        </span>
      </div>

      {/* live region announces status changes to screen readers */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {Object.entries(decision)
          .map(([id, val]) => {
            const item = queueItems.find((q) => q.id === id);
            return item ? `${item.title}: ${val === "approved" ? "approved" : "on hold"}` : null;
          })
          .filter(Boolean)
          .join(". ")}
      </div>

      <ul className="space-y-2" aria-label="Approval queue items">
        {queueItems.map((item) => {
          const resolved = decision[item.id];
          return (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.owner} · {item.impact}</p>
                </div>
                <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", priorityClass(item.priority))}>
                  {item.priority}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-500">Confidence {item.confidence}%</span>
                {resolved ? (
                  <p className="text-xs font-semibold text-slate-600">
                    {resolved === "approved" ? "✓ Approved" : "⏸ On hold"}
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => approve(item.id)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); approve(item.id); } }}
                      aria-label={`Approve: ${item.title}`}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 hover:bg-emerald-100 active:scale-95 transition-all"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => hold(item.id)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hold(item.id); } }}
                      aria-label={`Hold: ${item.title}`}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-1 hover:bg-amber-100 active:scale-95 transition-all"
                    >
                      <Pause className="h-3.5 w-3.5" aria-hidden="true" /> Hold
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

/* ─── Scenario Controls ─── */
function ScenarioControlsPanel() {
  const [riskBias, setRiskBias] = useState(46);
  const [growthBias, setGrowthBias] = useState(62);
  const [automationLevel, setAutomationLevel] = useState(71);

  const projected = useMemo(() => {
    const score = Math.round((growthBias * 0.45 + automationLevel * 0.35 + (100 - riskBias) * 0.2) * 10) / 10;
    return score;
  }, [riskBias, growthBias, automationLevel]);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Scenario Engine</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-800">Optimization Controls</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Live simulation
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
            <label htmlFor="slider-risk" className="cursor-pointer">Risk tolerance</label>
            <span aria-live="polite">{riskBias}%</span>
          </div>
          <input
            id="slider-risk"
            type="range"
            min={0}
            max={100}
            value={riskBias}
            onChange={(e) => setRiskBias(Number(e.target.value))}
            aria-valuenow={riskBias}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Risk tolerance"
            className="w-full cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
            <label htmlFor="slider-growth" className="cursor-pointer">Growth priority</label>
            <span aria-live="polite">{growthBias}%</span>
          </div>
          <input
            id="slider-growth"
            type="range"
            min={0}
            max={100}
            value={growthBias}
            onChange={(e) => setGrowthBias(Number(e.target.value))}
            aria-valuenow={growthBias}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Growth priority"
            className="w-full cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
            <label htmlFor="slider-automation" className="cursor-pointer">Automation intensity</label>
            <span aria-live="polite">{automationLevel}%</span>
          </div>
          <input
            id="slider-automation"
            type="range"
            min={0}
            max={100}
            value={automationLevel}
            onChange={(e) => setAutomationLevel(Number(e.target.value))}
            aria-valuenow={automationLevel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Automation intensity"
            className="w-full cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3" role="status" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Projected Confidence</p>
        <p className="mt-1 text-2xl font-semibold text-blue-900">{projected}%</p>
      </div>
    </article>
  );
}

/* ─── Risk Heatmap ─── */
function RiskHeatmapPanel() {
  const shouldReduceMotion = useReducedMotion();
  const cells = useMemo(
    () =>
      Array.from({ length: 35 }).map((_, index) => {
        const row = Math.floor(index / 7);
        const col = index % 7;
        const intensity = (row * 14 + col * 9 + 12) % 100;
        const label = intensity > 72 ? "High" : intensity > 45 ? "Medium" : "Low";
        return { id: `cell-${index}`, intensity, label };
      }),
    [],
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Risk Engine</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-800">Probability Heatmap</h3>
      </div>

      <div className="grid grid-cols-7 gap-1.5" role="grid" aria-label="Risk probability heatmap">
        {cells.map((cell) => (
          <motion.div
            key={cell.id}
            role="gridcell"
            tabIndex={0}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.12 }}
            whileFocus={shouldReduceMotion ? undefined : { scale: 1.12 }}
            className={cn(
              "h-7 rounded-md border border-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
              cell.intensity > 72
                ? "bg-rose-400/70"
                : cell.intensity > 45
                  ? "bg-amber-300/70"
                  : "bg-emerald-300/70",
            )}
            aria-label={`${cell.label} risk — ${cell.intensity}%`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500" aria-hidden="true">
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Low</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /> Medium</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> High</span>
      </div>
    </article>
  );
}

/* ─── Responsive Telemetry Table ─── */
function ResponsiveTelemetryPanel() {
  const [sortKey, setSortKey] = useState<SortKey>("stream");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggle = useCallback((key: SortKey) => {
    setSortDir((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortKey(key);
  }, [sortKey]);

  const sorted = useMemo(() => {
    return [...telemetryRows].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  const cols: { key: SortKey; label: string }[] = [
    { key: "stream", label: "Stream" },
    { key: "latencyMs", label: "Latency" },
    { key: "errorPct", label: "Error %" },
    { key: "status", label: "Status" },
  ];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Platform Telemetry</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-800">Live Streams</h3>
      </div>

      {/* Desktop table with keyboard-sortable columns */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
        <table className="w-full text-left text-sm" role="grid" aria-label="Live telemetry streams">
          <thead className="bg-slate-50">
            <tr>
              {cols.map((col) => (
                <th key={col.key} scope="col" className="px-3 py-2" aria-sort={sortKey === col.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                  <button
                    type="button"
                    onClick={() => toggle(col.key)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(col.key); } }}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  >
                    {col.label}
                    <ArrowUpDown className={cn("h-3 w-3", sortKey === col.key ? "text-blue-600" : "text-slate-300")} aria-hidden="true" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="px-3 py-2 font-medium text-slate-700">{row.stream}</td>
                <td className="px-3 py-2 text-slate-600">{row.latencyMs}ms</td>
                <td className="px-3 py-2 text-slate-600">{row.errorPct}%</td>
                <td className="px-3 py-2">
                  <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", statusClass(row.status))}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-2 md:hidden">
        {sorted.map((row) => (
          <div key={row.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-700">{row.stream}</p>
              <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", statusClass(row.status))}>
                {row.status}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
              <span>Latency {row.latencyMs}ms</span>
              <span>Error {row.errorPct}%</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function sidePanelByDomain(domain: NextGenDomain) {
  if (domain === "qbi" || domain === "blueprint") {
    return <ScenarioControlsPanel />;
  }
  if (domain === "runtime" || domain === "developer" || domain === "mcp") {
    return <ResponsiveTelemetryPanel />;
  }
  return <RiskHeatmapPanel />;
}

export function NextGenInteractivePanel({ domain }: { domain: NextGenDomain }) {
  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <ApprovalQueuePanel />
      {sidePanelByDomain(domain)}
    </div>
  );
}
