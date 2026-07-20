"use client";

import { useState, useCallback, useMemo, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bell,
  Bot,
  ChevronRight,
  CircleDashed,
  Cpu,
  Gauge,
  Globe,
  Home,
  Layers,
  LineChart,
  Mic,
  Network,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

type DeptTone = "blue" | "green" | "amber" | "violet" | "cyan" | "rose";

interface DeptNode {
  key: string;
  name: string;
  href: string;
  x: number;
  y: number;
  agents: number;
  signal: string;
  tone: DeptTone;
  health: number; // 0-100
}

interface Opportunity {
  id: number;
  company: string;
  value: string;
  intent: "High intent" | "Medium intent" | "Low intent";
  stage: string;
}

interface ChurnRisk {
  id: number;
  company: string;
  score: number;
  level: "High Risk" | "At Risk";
}

interface ActivityItem {
  id: number;
  text: string;
  time: string;
  icon: "bell" | "trending" | "zap" | "workflow" | "doc";
}

interface RecommendationCard {
  id: string;
  title: string;
  detail: string;
  cta: string;
  tone: DeptTone;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const deptNodes: DeptNode[] = [
  { key: "sales", name: "Sales", href: "/demo-platform/sales-intelligence", x: 50, y: 9, agents: 32, signal: "Pipeline acceleration", tone: "blue", health: 92 },
  { key: "marketing", name: "Marketing", href: "/demo-platform/insights", x: 18, y: 30, agents: 18, signal: "Demand quality", tone: "violet", health: 78 },
  { key: "customer-success", name: "Customer Success", href: "/demo-platform/customer-intelligence", x: 82, y: 30, agents: 24, signal: "Retention risk", tone: "green", health: 85 },
  { key: "finance", name: "Finance", href: "/demo-platform/finance-intelligence", x: 18, y: 70, agents: 12, signal: "Margin guardrails", tone: "amber", health: 88 },
  { key: "operations", name: "Operations", href: "/demo-platform/operations", x: 82, y: 70, agents: 20, signal: "Throughput stability", tone: "cyan", health: 95 },
  { key: "product", name: "Product", href: "/demo-platform/planning", x: 50, y: 90, agents: 16, signal: "Roadmap confidence", tone: "blue", health: 72 },
];

const palette: Record<DeptTone, { gradient: string; glow: string; border: string; text: string; badge: string }> = {
  blue: { gradient: "from-blue-400 to-blue-600", glow: "rgba(59,130,246,0.45)", border: "border-blue-300", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  green: { gradient: "from-emerald-400 to-emerald-600", glow: "rgba(16,185,129,0.45)", border: "border-emerald-300", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
  amber: { gradient: "from-amber-400 to-amber-600", glow: "rgba(245,158,11,0.45)", border: "border-amber-300", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
  violet: { gradient: "from-violet-400 to-violet-600", glow: "rgba(139,92,246,0.45)", border: "border-violet-300", text: "text-violet-700", badge: "bg-violet-100 text-violet-700" },
  cyan: { gradient: "from-cyan-400 to-cyan-600", glow: "rgba(6,182,212,0.45)", border: "border-cyan-300", text: "text-cyan-700", badge: "bg-cyan-100 text-cyan-700" },
  rose: { gradient: "from-rose-400 to-rose-600", glow: "rgba(244,63,94,0.45)", border: "border-rose-300", text: "text-rose-700", badge: "bg-rose-100 text-rose-700" },
};

const kpis = [
  { label: "Total Revenue (YTD)", value: "$24.8M", delta: "+18.6% vs last year", icon: LineChart, up: true },
  { label: "Pipeline Value", value: "$37.6M", delta: "+21.3% vs last month", icon: Gauge, up: true },
  { label: "Active Customers", value: "642", delta: "+8.7% vs last month", icon: Users, up: true },
  { label: "Churn Risk (Active)", value: "23", delta: "-12.2% vs last month", icon: Activity, up: false },
  { label: "AI Actions Taken", value: "128", delta: "+32% vs last month", icon: Sparkles, up: true },
];

const opportunities: Opportunity[] = [
  { id: 1, company: "Global Marine Inc.", value: "$2.1M", intent: "High intent", stage: "Proposal" },
  { id: 2, company: "Skyline Aviation", value: "$1.8M", intent: "High intent", stage: "Negotiation" },
  { id: 3, company: "Northwind Logistics", value: "$1.2M", intent: "Medium intent", stage: "Qualified" },
  { id: 4, company: "TechCore Systems", value: "$980K", intent: "High intent", stage: "Proposal" },
  { id: 5, company: "BetaTech Industries", value: "$640K", intent: "Medium intent", stage: "Prospect" },
];

const churnRisks: ChurnRisk[] = [
  { id: 1, company: "BetaTech Industries", score: 92, level: "High Risk" },
  { id: 2, company: "Coastal Systems", score: 87, level: "High Risk" },
  { id: 3, company: "Everest Solutions", score: 65, level: "At Risk" },
  { id: 4, company: "Bluewave Corp", score: 62, level: "At Risk" },
];

const activityItems: ActivityItem[] = [
  { id: 1, text: "Reply sent to Global Marine Inc.", time: "2 min ago", icon: "doc" },
  { id: 2, text: "Deal stage updated for Skyline Aviation.", time: "8 min ago", icon: "trending" },
  { id: 3, text: "Churn risk detected for BetaTech Industries", time: "15 min ago", icon: "bell" },
  { id: 4, text: "Workflow automated: Onboarding Process", time: "32 min ago", icon: "workflow" },
  { id: 5, text: "Invoice reminder sent to Northwind Logistics", time: "1 hr ago", icon: "doc" },
];

const recommendations: RecommendationCard[] = [
  { id: "save-at-risk", title: "Save at Risk Account", detail: "BetaTech Industries shows strong churn signals. AI suggests immediate outreach.", cta: "Review", tone: "blue" },
  { id: "upsell", title: "Upsell Opportunity", detail: "Skyline Aviation is ready for expansion. Potential $1.3M increase in revenue.", cta: "View Opportunity", tone: "green" },
  { id: "workflow-opt", title: "Workflow Optimization", detail: "AI detected 3 manual processes that can be automated. Est. 12 hrs saved / week.", cta: "Automate", tone: "cyan" },
  { id: "resource-alloc", title: "Resource Allocation", detail: "Reallocate 2 agents from low-priority tasks. Improve response time by 18%.", cta: "Review", tone: "amber" },
];

// ─── Customer health scatter dots (simulated) ────────────────────────────────
const healthDots = Array.from({ length: 80 }, (_, i) => {
  const r = Math.random();
  const tone = r > 0.7 ? "red" : r > 0.45 ? "amber" : "green";
  return { id: i, x: Math.random() * 90 + 5, y: Math.random() * 80 + 10, tone };
});

// ─── Revenue pipeline nodes ──────────────────────────────────────────────────
type PipelineTone = "blue" | "indigo" | "violet" | "amber" | "emerald";
const pipelineNodes: Array<{ id: number; x: number; y: number; r: number; tone: PipelineTone; label: string }> = [
  { id: 1, x: 12, y: 30, r: 8, tone: "blue", label: "Prospect" },
  { id: 2, x: 28, y: 55, r: 7, tone: "indigo", label: "Qualified" },
  { id: 3, x: 44, y: 20, r: 9, tone: "violet", label: "Proposal" },
  { id: 4, x: 60, y: 60, r: 6, tone: "amber", label: "Negotiation" },
  { id: 5, x: 78, y: 35, r: 10, tone: "emerald", label: "Closed Won" },
  { id: 6, x: 20, y: 70, r: 5, tone: "blue", label: "Discovery" },
  { id: 7, x: 52, y: 78, r: 7, tone: "indigo", label: "Demo" },
  { id: 8, x: 68, y: 15, r: 6, tone: "violet", label: "Evaluation" },
  { id: 9, x: 86, y: 70, r: 5, tone: "emerald", label: "Renewal" },
];

const pipelineEdges = [[1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5], [6, 2], [6, 7], [7, 4], [8, 3], [8, 5], [9, 5]];

const pipelineColors: Record<PipelineTone, { fill: string; stroke: string }> = {
  blue: { fill: "#3b82f6", stroke: "#2563eb" },
  indigo: { fill: "#6366f1", stroke: "#4f46e5" },
  violet: { fill: "#8b5cf6", stroke: "#7c3aed" },
  amber: { fill: "#f59e0b", stroke: "#d97706" },
  emerald: { fill: "#10b981", stroke: "#059669" },
};

const intentStyle: Record<string, string> = {
  "High intent": "bg-green-100 text-green-700",
  "Medium intent": "bg-amber-100 text-amber-700",
  "Low intent": "bg-slate-100 text-slate-500",
};

const activityIcon: Record<ActivityItem["icon"], typeof Bell> = {
  bell: Bell, trending: TrendingUp, zap: Zap, workflow: Network, doc: Globe,
};

// ─── Left mini-nav ────────────────────────────────────────────────────────────
const miniNav = [
  { label: "Overview", icon: Home, href: "/demo-platform" },
  { label: "Pipeline", icon: Gauge, href: "/demo-platform/sales-intelligence" },
  { label: "Customers", icon: Users, href: "/demo-platform/customer-intelligence" },
  { label: "AI Agents", icon: Bot, href: "/demo-platform/agents" },
  { label: "Insights", icon: Sparkles, href: "/demo-platform/insights" },
  { label: "Actions", icon: Zap, href: "/demo-platform/decisions" },
  { label: "Settings", icon: Settings, href: "/demo-platform/settings" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DemoExecutiveDashboard() {
  const [activeDept, setActiveDept] = useState<string>("sales");
  const [hoverDept, setHoverDept] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeRec, setActiveRec] = useState<string | null>(null);
  const [activeOpportunity, setActiveOpportunity] = useState<number | null>(null);
  const [activeChurn, setActiveChurn] = useState<number | null>(null);
  const [activeNav, setActiveNav] = useState("Overview");

  const activeDeptData = useMemo(() => deptNodes.find((n) => n.key === activeDept) ?? deptNodes[0]!, [activeDept]);

  const handlePlaneMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ox = (e.clientX - rect.left) / rect.width;
    const oy = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - oy) * 10, y: (ox - 0.5) * 10 });
  }, []);

  const handlePlaneLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <div className="flex h-full min-h-screen bg-gradient-to-br from-[#f0f6ff] via-[#edf3ff] to-[#f5f7ff]">
      {/* ── Left mini-nav ── */}
      <aside className="hidden w-20 flex-shrink-0 flex-col items-center gap-1 border-r border-slate-200/80 bg-white/70 py-4 backdrop-blur lg:flex">
        {miniNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.label;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setActiveNav(item.label)}
              title={item.label}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[10px] font-semibold transition-all ${isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"}`}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </aside>

      {/* ── Main content ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 gap-2 border-b border-slate-200/80 bg-white/70 p-3 backdrop-blur md:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
                className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <p className={`mt-1 text-[11px] font-semibold ${kpi.up ? "text-emerald-600" : "text-rose-500"}`}>
                  {kpi.up ? "▲" : "▼"} {kpi.delta}
                </p>
              </motion.div>
            );
          })}
          {/* Ask AIOS button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-3 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-700">Ask AIOS</span>
            </div>
            <div className="flex items-end gap-0.5 h-6">
              {[3, 5, 8, 6, 10, 7, 5, 9, 4, 6, 8, 5].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-sm bg-blue-400"
                  style={{ height: h * 2 }}
                  animate={{ height: [h * 2, h * 2 + 4, h * 2] }}
                  transition={{ duration: 0.8 + i * 0.07, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
          </motion.button>
        </div>

        {/* ── Three-column body ── */}
        <div className="grid flex-1 gap-3 p-3 xl:grid-cols-[300px_1fr_280px]">
          {/* ── Left column: Revenue Pipeline + Opportunities ── */}
          <div className="space-y-3">
            {/* Revenue Pipeline */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue Pipeline</p>
              <p className="text-sm font-semibold text-slate-700">3D Pipeline Network</p>
              <div className="relative mt-2 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {pipelineEdges.map(([a, b], i) => {
                    const na = pipelineNodes.find((n) => n.id === a)!;
                    const nb = pipelineNodes.find((n) => n.id === b)!;
                    return (
                      <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                        stroke="rgba(99,102,241,0.45)" strokeWidth="0.8" strokeDasharray="2 1.5" />
                    );
                  })}
                  {pipelineNodes.map((node) => {
                    const c = pipelineColors[node.tone];
                    return (
                      <g key={node.id}>
                        <circle cx={node.x} cy={node.y} r={node.r + 2} fill={c.fill} opacity={0.2} />
                        <circle cx={node.x} cy={node.y} r={node.r} fill={c.fill} stroke={c.stroke} strokeWidth="0.8" />
                      </g>
                    );
                  })}
                </svg>
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                  {(["Prospect", "Qualified", "Proposal", "Negotiation", "Closed Won"] as const).map((stage, i) => {
                    const tones: PipelineTone[] = ["blue", "indigo", "violet", "amber", "emerald"];
                    const c = pipelineColors[tones[i]!];
                    return (
                      <span key={stage} className="inline-flex items-center gap-1 rounded text-[9px] text-white/80">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ background: c.fill }} />
                        {stage}
                      </span>
                    );
                  })}
                </div>
              </div>
              <button className="mt-2 text-xs font-semibold text-blue-600 hover:underline">View full pipeline →</button>
            </div>

            {/* Top Opportunities */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Top Opportunities</p>
              <div className="space-y-1">
                {opportunities.map((opp, idx) => (
                  <motion.button
                    key={opp.id}
                    type="button"
                    onClick={() => setActiveOpportunity(activeOpportunity === opp.id ? null : opp.id)}
                    whileHover={{ x: 3 }}
                    className={`w-full rounded-xl border px-2 py-2 text-left transition-all ${activeOpportunity === opp.id ? "border-blue-300 bg-blue-50" : "border-transparent hover:border-slate-200 hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{idx + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">{opp.company}</span>
                      <span className="text-xs font-bold text-slate-800">{opp.value}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 pl-7">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${intentStyle[opp.intent]}`}>{opp.intent}</span>
                      <AnimatePresence>
                        {activeOpportunity === opp.id && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-[10px] text-slate-500"
                          >
                            Stage: {opp.stage}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                ))}
              </div>
              <button className="mt-2 text-xs font-semibold text-blue-600 hover:underline">View all opportunities →</button>
            </div>
          </div>

          {/* ── Center: WebXR City ── */}
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/60 p-3 shadow-lg backdrop-blur">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Spatial Intelligence Plane</p>
                  <p className="text-sm font-semibold text-slate-700">Interactive city mesh — {activeDeptData.name}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <CircleDashed className="h-3 w-3" /> WebXR topology
                </span>
              </div>

              <motion.div
                className="relative h-[460px] cursor-crosshair overflow-hidden rounded-2xl border border-slate-200"
                style={{
                  background: "radial-gradient(ellipse at 50% 30%, #dbeafe 0%, #e0e7ff 30%, #c7d2fe 55%, #e0f2fe 75%, #f0f9ff 100%)",
                  transformStyle: "preserve-3d",
                  perspective: "1200px",
                }}
                animate={{ rotateX: tilt.x, rotateY: tilt.y }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                onMouseMove={handlePlaneMove}
                onMouseLeave={handlePlaneLeave}
                aria-label="3D spatial intelligence plane"
              >
                {/* Orbital rings */}
                {[240, 340, 440].map((size, i) => (
                  <motion.div
                    key={i}
                    className="pointer-events-none absolute rounded-full border border-blue-300/30"
                    style={{
                      width: size,
                      height: size,
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
                    aria-hidden
                  />
                ))}

                {/* Connection lines */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                  {deptNodes.map((node) => (
                    <motion.line
                      key={node.key}
                      x1="50" y1="50" x2={node.x} y2={node.y}
                      stroke={node.key === activeDept ? "#2563eb" : "#93c5fd"}
                      strokeWidth={node.key === activeDept ? 0.7 : 0.3}
                      strokeDasharray={node.key === activeDept ? "0" : "2 2"}
                      animate={{ opacity: node.key === activeDept ? 1 : 0.5 }}
                    />
                  ))}
                </svg>

                {/* Glowing ground plate */}
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: 120, height: 120,
                    background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
                    filter: "blur(12px)",
                  }}
                  aria-hidden
                />

                {/* Core node */}
                <motion.div
                  className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    y: [0, -6, 0],
                    filter: ["drop-shadow(0 12px 24px rgba(37,99,235,0.25))", "drop-shadow(0 18px 32px rgba(37,99,235,0.40))", "drop-shadow(0 12px 24px rgba(37,99,235,0.25))"],
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-3xl border-2 border-blue-300/60 bg-white/95 shadow-2xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">AIOS</p>
                    <p className="text-[10px] font-bold text-slate-700">PILOT</p>
                    <p className="text-[9px] text-slate-400">42 agents</p>
                  </div>
                </motion.div>

                {/* Department nodes */}
                {deptNodes.map((dept) => {
                  const isActive = dept.key === activeDept;
                  const isHover = dept.key === hoverDept;
                  const p = palette[dept.tone];
                  return (
                    <motion.button
                      key={dept.key}
                      type="button"
                      onClick={() => setActiveDept(dept.key)}
                      onMouseEnter={() => setHoverDept(dept.key)}
                      onMouseLeave={() => setHoverDept(null)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      animate={{
                        y: [0, isActive ? -5 : -2, 0],
                        filter: isActive
                          ? [`drop-shadow(0 10px 20px ${p.glow})`, `drop-shadow(0 16px 28px ${p.glow})`, `drop-shadow(0 10px 20px ${p.glow})`]
                          : [`drop-shadow(0 6px 12px rgba(0,0,0,0.1))`, `drop-shadow(0 8px 16px rgba(0,0,0,0.12))`, `drop-shadow(0 6px 12px rgba(0,0,0,0.1))`],
                      }}
                      transition={{ duration: 3.5 + dept.x / 60, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute z-10 w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white/95 px-2.5 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isActive ? `${p.border} shadow-xl` : "border-white/90 shadow-lg"}`}
                      style={{ left: `${dept.x}%`, top: `${dept.y}%` }}
                      aria-label={`Select ${dept.name}`}
                      aria-pressed={isActive}
                    >
                      {(isHover || isActive) && (
                        <motion.span
                          className={`pointer-events-none absolute -inset-1 rounded-2xl border ${p.border} opacity-70`}
                          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.9, 0.5] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                          aria-hidden
                        />
                      )}
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${p.text}`}>{dept.name}</p>
                      <p className="mt-0.5 text-xs font-bold text-slate-800">{dept.agents} Agents Active</p>
                      <p className="text-[10px] text-slate-500">{dept.signal}</p>
                      <div className={`mt-1.5 h-1 rounded-full bg-gradient-to-r ${p.gradient}`} />
                      <div className="mt-1 flex items-center gap-1">
                        <div className="h-1 flex-1 rounded-full bg-slate-100">
                          <div className={`h-1 rounded-full bg-gradient-to-r ${p.gradient}`} style={{ width: `${dept.health}%` }} />
                        </div>
                        <span className={`text-[9px] font-bold ${p.text}`}>{dept.health}%</span>
                      </div>
                    </motion.button>
                  );
                })}

                {/* Active dept "Open" button */}
                <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
                  <Link
                    href={activeDeptData.href}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white/95 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-lg hover:bg-blue-50"
                  >
                    Open {activeDeptData.name} workspace <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* AI Recommendations */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Recommendations</p>
                  <p className="text-xs font-semibold text-slate-600">Prioritized actions from the spatial network</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-700">
                  <Cpu className="h-3 w-3" /> Live orchestration
                </span>
              </div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                {recommendations.map((rec) => {
                  const p = palette[rec.tone];
                  const isActive = activeRec === rec.id;
                  return (
                    <motion.div
                      key={rec.id}
                      whileHover={{ y: -2 }}
                      className={`rounded-xl border p-3 transition-all ${isActive ? `${p.border} bg-white shadow-md` : "border-slate-200 bg-white/80"}`}
                    >
                      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient}`}>
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">{rec.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{rec.detail}</p>
                      <button
                        type="button"
                        onClick={() => setActiveRec(isActive ? null : rec.id)}
                        className={`mt-2 w-full rounded-lg bg-gradient-to-r ${p.gradient} px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity`}
                      >
                        {rec.cta}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-3">
            {/* Customer Health Map */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer Health Map</p>
              <p className="text-xs font-semibold text-slate-600">642 customers</p>
              <div className="relative mt-2 h-44 overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
                {healthDots.map((dot) => (
                  <div
                    key={dot.id}
                    className={`absolute h-2.5 w-2.5 rounded-full opacity-80 ${dot.tone === "green" ? "bg-emerald-500" : dot.tone === "amber" ? "bg-amber-400" : "bg-rose-500"} cursor-pointer hover:opacity-100 hover:scale-150 transition-all`}
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                    title={dot.tone === "green" ? "Healthy" : dot.tone === "amber" ? "At Risk" : "High Risk"}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-3 text-[10px] font-semibold">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Healthy</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> At Risk</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> High Risk</span>
              </div>
              <button className="mt-2 text-xs font-semibold text-blue-600 hover:underline">View all customers →</button>
            </div>

            {/* Churn Risk Alerts */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Churn Risk Alerts</p>
              <p className="mb-2 text-xs font-semibold text-slate-600">{churnRisks.length} at risk</p>
              <div className="space-y-1.5">
                {churnRisks.map((risk) => {
                  const isHigh = risk.level === "High Risk";
                  const isSelected = activeChurn === risk.id;
                  return (
                    <motion.button
                      key={risk.id}
                      type="button"
                      onClick={() => setActiveChurn(isSelected ? null : risk.id)}
                      whileHover={{ x: 2 }}
                      className={`w-full rounded-xl border px-2 py-2 text-left transition-all ${isSelected ? "border-rose-200 bg-rose-50" : "border-transparent hover:border-slate-200 hover:bg-slate-50"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${isHigh ? "bg-rose-500" : "bg-amber-400"}`}>
                          {risk.id}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">{risk.company}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${isHigh ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                          {risk.level}
                        </span>
                      </div>
                      <p className="mt-0.5 pl-7 text-[11px] text-slate-500">Score {risk.score}</p>
                    </motion.button>
                  );
                })}
              </div>
              <button className="mt-2 text-xs font-semibold text-blue-600 hover:underline">View all churn risks →</button>
            </div>

            {/* AI Activity Feed */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Activity Feed</p>
              <div className="mt-2 space-y-2" aria-live="polite">
                {activityItems.map((item) => {
                  const Icon = activityIcon[item.icon];
                  return (
                    <div key={item.id} className="flex items-start gap-2">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <Icon className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] leading-relaxed text-slate-600">{item.text}</p>
                        <p className="text-[10px] text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="mt-2 text-xs font-semibold text-blue-600 hover:underline">View full activity →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
