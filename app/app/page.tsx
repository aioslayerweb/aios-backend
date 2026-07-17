"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  ChevronRight,
  CircleDashed,
  Cpu,
  Dot,
  Gauge,
  Layers,
  LineChart,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState, type MouseEvent } from "react";
import { workspaceItems } from "@/utils/navigation";

type CityNode = {
  key: string;
  name: string;
  href: string;
  x: number;
  y: number;
  agents: number;
  signal: string;
  tone: "blue" | "green" | "amber" | "violet" | "cyan";
};

const cityNodes: CityNode[] = [
  { key: "sales", name: "Sales", href: "/app/corporate", x: 50, y: 18, agents: 32, signal: "Pipeline acceleration", tone: "blue" },
  { key: "marketing", name: "Marketing", href: "/app/intelligence", x: 28, y: 36, agents: 18, signal: "Demand quality", tone: "violet" },
  { key: "customer-success", name: "Customer Success", href: "/app/activity", x: 73, y: 40, agents: 24, signal: "Retention risk", tone: "green" },
  { key: "finance", name: "Finance", href: "/app/reports", x: 30, y: 70, agents: 12, signal: "Margin guardrails", tone: "amber" },
  { key: "operations", name: "Operations", href: "/app/workflows", x: 72, y: 72, agents: 20, signal: "Throughput stability", tone: "cyan" },
  { key: "product", name: "Product", href: "/app/planning", x: 51, y: 88, agents: 16, signal: "Roadmap confidence", tone: "blue" },
];

const palette: Record<CityNode["tone"], string> = {
  blue: "from-blue-200 to-blue-500",
  green: "from-emerald-200 to-emerald-500",
  amber: "from-amber-200 to-amber-500",
  violet: "from-violet-200 to-violet-500",
  cyan: "from-cyan-200 to-cyan-500",
};

const metrics = [
  { label: "Total Revenue (YTD)", value: "€24.8M", delta: "+18.6% vs last year", icon: LineChart },
  { label: "Pipeline Value", value: "€37.6M", delta: "+21.3% vs last month", icon: Gauge },
  { label: "Active Customers", value: "642", delta: "+8.7% vs last month", icon: Users },
  { label: "Churn Risk (Active)", value: "23", delta: "-12.2% vs last month", icon: Activity },
  { label: "AI Actions Taken", value: "128", delta: "+32% vs last month", icon: Sparkles },
];

const recommendationCards = [
  { title: "Save at-risk account", detail: "BetaTech signals indicate intervention window in <48h.", cta: "Review", tone: "blue" },
  { title: "Upsell opportunity", detail: "Skyline Aviation expansion sequence can unlock +€1.3M potential.", cta: "View", tone: "green" },
  { title: "Workflow optimization", detail: "Three manual routing steps can be automated this week.", cta: "Automate", tone: "cyan" },
  { title: "Resource allocation", detail: "Rebalance 2 agents to low-priority queue to improve SLA by 18%.", cta: "Review", tone: "amber" },
];

function statusBadge(status: "active" | "placeholder" | "future" | undefined): string {
  if (status === "future") {
    return "Roadmap";
  }
  if (status === "placeholder") {
    return "Setup";
  }
  return "Live";
}

export default function AppHomePage() {
  const [activeCityKey, setActiveCityKey] = useState(cityNodes[0]?.key);
  const [hoverCityKey, setHoverCityKey] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const activeCity = useMemo(
    () => cityNodes.find((node) => node.key === activeCityKey) ?? cityNodes[0],
    [activeCityKey],
  );

  const handlePlaneMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width;
    const offsetY = (event.clientY - rect.top) / rect.height;

    const rotateY = (offsetX - 0.5) * 8;
    const rotateX = (0.5 - offsetY) * 8;
    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handlePlaneLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div className="space-y-4 rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_10%_-10%,#dbeafe,transparent_42%),radial-gradient(circle_at_92%_0%,#e0f2fe,transparent_38%),linear-gradient(180deg,#f8fbff_0%,#eff6ff_42%,#f8fafc_100%)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-5">
      <section className="grid gap-3 rounded-3xl border border-white/70 bg-white/65 p-3 backdrop-blur md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <motion.article
            key={metric.label}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-semibold text-slate-800">{metric.value}</p>
              <metric.icon className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-2 text-xs font-medium text-emerald-600">{metric.delta}</p>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[240px_1fr_300px]">
        <aside className="rounded-3xl border border-white/70 bg-white/70 p-3 backdrop-blur">
          <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Executive Command Center</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">All navigation sections</p>
          </div>
          <nav className="space-y-1 overflow-auto pr-1" aria-label="Workspace sections">
            {workspaceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="truncate">{item.title}</span>
                <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400 group-hover:text-blue-600">
                  {statusBadge(item.status)}
                  <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-3 backdrop-blur">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-28 bg-[radial-gradient(circle,#bfdbfe_0%,rgba(191,219,254,0)_70%)]" />
          <div className="mb-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-3 py-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Spatial Intelligence Plane</p>
              <p className="text-sm font-semibold text-slate-700">Interactive city mesh</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <CircleDashed className="h-3 w-3" /> WebXR-style topology
            </span>
          </div>

          <motion.div
            className="relative h-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_50%_5%,#f0f9ff_0%,#e2e8f0_46%,#dbeafe_100%)]"
            onMouseMove={handlePlaneMove}
            onMouseLeave={handlePlaneLeave}
            animate={{ rotateX: tilt.x, rotateY: tilt.y }}
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.6 }}
            style={{ transformStyle: "preserve-3d", perspective: "1100px" }}
          >
            <motion.div
              className="pointer-events-none absolute left-1/2 top-[54%] z-[1] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200/70"
              animate={{ rotate: 360 }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="pointer-events-none absolute left-1/2 top-[54%] z-[1] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/60"
              animate={{ rotate: -360 }}
              transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
            />
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {cityNodes.map((node) => (
                <motion.line
                  key={`line-${node.key}`}
                  x1="50"
                  y1="54"
                  x2={node.x}
                  y2={node.y}
                  stroke={node.key === activeCity?.key ? "#2563eb" : "#93c5fd"}
                  strokeWidth={node.key === activeCity?.key ? 0.6 : 0.3}
                  strokeDasharray={node.key === activeCity?.key ? "0" : "2 1.5"}
                  animate={{ opacity: node.key === activeCity?.key ? 1 : 0.55 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </svg>

            <motion.div
              className="absolute left-1/2 top-[54%] z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-blue-200 bg-white/90 p-4 text-center shadow-[0_20px_60px_rgba(37,99,235,0.18)]"
              animate={{ y: [0, -6, 0], boxShadow: ["0 20px 60px rgba(37,99,235,0.18)", "0 26px 70px rgba(37,99,235,0.24)", "0 20px 60px rgba(37,99,235,0.18)"] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                <Layers className="h-6 w-6" />
              </div>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">AIOS Pilot</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Cognitive Core</p>
              <p className="mt-1 text-xs text-slate-500">42 connected agents</p>
            </motion.div>

            {cityNodes.map((city) => {
              const isActive = activeCity?.key === city.key;

              return (
                <motion.button
                  key={city.key}
                  type="button"
                  onClick={() => setActiveCityKey(city.key)}
                  onMouseEnter={() => setHoverCityKey(city.key)}
                  onMouseLeave={() => setHoverCityKey((current) => (current === city.key ? null : current))}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    y: [0, city.key === activeCity?.key ? -4 : -2, 0],
                    boxShadow: city.key === activeCity?.key
                      ? ["0 12px 28px rgba(15,23,42,0.16)", "0 18px 34px rgba(37,99,235,0.24)", "0 12px 28px rgba(15,23,42,0.16)"]
                      : ["0 12px 28px rgba(15,23,42,0.12)", "0 14px 30px rgba(15,23,42,0.16)", "0 12px 28px rgba(15,23,42,0.12)"],
                  }}
                  transition={{ duration: 4.4 + city.x / 80, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute z-10 w-40 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/90 bg-white/90 px-3 py-2 text-left shadow-[0_12px_28px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                  aria-label={`Activate ${city.name} city node`}
                >
                  {hoverCityKey === city.key || isActive ? (
                    <motion.span
                      className="pointer-events-none absolute -inset-1 rounded-2xl border border-blue-300/80"
                      initial={{ opacity: 0.3, scale: 1 }}
                      animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.06, 1] }}
                      transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{city.name}</p>
                    <Dot className={`h-5 w-5 ${isActive ? "text-blue-500" : "text-slate-300"}`} />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{city.agents} Agents Active</p>
                  <p className="mt-1 text-xs text-slate-500">{city.signal}</p>
                  <div className={`mt-2 h-1.5 rounded-full bg-gradient-to-r ${palette[city.tone]}`} />
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <aside className="space-y-3 rounded-3xl border border-white/70 bg-white/70 p-3 backdrop-blur">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected City</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-800">{activeCity?.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{activeCity?.signal}</p>
            <p className="mt-2 text-xs font-medium text-emerald-600">{activeCity?.agents} autonomous agents online</p>
            <Link href={activeCity?.href ?? "/app"} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500">
              Open workspace
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Churn risk alerts</p>
            <ul className="mt-2 space-y-2 text-xs text-slate-600">
              <li className="flex items-center justify-between rounded-xl bg-rose-50 px-2 py-2"><span>BetaTech Industries</span><span className="font-semibold text-rose-600">92</span></li>
              <li className="flex items-center justify-between rounded-xl bg-amber-50 px-2 py-2"><span>Coastal Systems</span><span className="font-semibold text-amber-600">87</span></li>
              <li className="flex items-center justify-between rounded-xl bg-amber-50 px-2 py-2"><span>Bluewave Corp</span><span className="font-semibold text-amber-600">62</span></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI activity feed</p>
            <ul className="mt-2 space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2"><Bell className="mt-0.5 h-3.5 w-3.5 text-blue-500" /><span>Reply drafted for Global Marine Inc. <strong className="text-slate-700">2m ago</strong></span></li>
              <li className="flex items-start gap-2"><Bell className="mt-0.5 h-3.5 w-3.5 text-blue-500" /><span>Deal stage updated for Skyline Aviation. <strong className="text-slate-700">8m ago</strong></span></li>
              <li className="flex items-start gap-2"><Bell className="mt-0.5 h-3.5 w-3.5 text-blue-500" /><span>Workflow automation completed: onboarding process. <strong className="text-slate-700">15m ago</strong></span></li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/70 p-3 backdrop-blur">
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-3 py-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI Recommendations</p>
            <p className="text-sm font-semibold text-slate-700">Prioritized actions from the spatial network</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
            <Cpu className="h-3.5 w-3.5" /> Live orchestration
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {recommendationCards.map((item) => (
            <motion.article
              key={item.title}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-800">{item.title}</p>
              <p className="mt-2 text-xs text-slate-600">{item.detail}</p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                {item.cta}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
