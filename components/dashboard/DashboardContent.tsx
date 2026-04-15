"use client";

import { useEffect, useState } from "react";
import { DollarSign, Handshake, Target, type LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import KpiCard from "./KpiCard";
import AiInsightCard from "./AiInsightCard";
import RecentActivity from "./RecentActivity";
import AgentStatusCard from "./AgentStatusCard";

interface KpiMetric {
  id: string;
  metric_name: string;
  value: number;
  change_percent: number;
  period: string;
}

interface AiInsight {
  id: string;
  title: string;
  body: string;
  action_label: string;
  action_type: string;
  priority: string;
}

function formatKpiValue(name: string, value: number): string {
  if (name === "Revenue") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (name === "Conversion") {
    return `${value}%`;
  }
  return value.toString();
}

const kpiColors: Record<string, "blue" | "emerald" | "amber"> = {
  Revenue: "blue",
  Deals: "emerald",
  Conversion: "amber",
};

const kpiIcons: Record<string, LucideIcon> = {
  Revenue: DollarSign,
  Deals: Handshake,
  Conversion: Target,
};

export default function DashboardContent() {
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: kpiData } = await supabase
        .from("kpi_metrics")
        .select("*")
        .order("created_at", { ascending: true });

      if (kpiData) setKpis(kpiData);
      setLoadingKpis(false);

      const { data: insightData } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (insightData) setInsights(insightData);
      setLoadingInsights(false);
    }

    fetchData();
  }, []);

  function handleAction(insight: AiInsight) {
    setActionFeedback(`Action triggered: "${insight.action_label}"`);
    setTimeout(() => setActionFeedback(null), 3000);
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{today}</p>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          All systems operational
        </div>
      </div>

      {actionFeedback && (
        <div className="bg-primary-50 border border-primary-200 text-primary-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 bg-primary-500 rounded-full" />
          {actionFeedback}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loadingKpis
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                  <div className="w-16 h-6 bg-slate-100 rounded-full" />
                </div>
                <div className="w-24 h-7 bg-slate-100 rounded mb-2" />
                <div className="w-32 h-4 bg-slate-100 rounded mb-1" />
                <div className="w-20 h-3 bg-slate-100 rounded" />
              </div>
            ))
          : kpis.map((kpi) => (
              <KpiCard
                key={kpi.id}
                title={kpi.metric_name}
                value={formatKpiValue(kpi.metric_name, kpi.value)}
                change={kpi.change_percent}
                period={kpi.period}
                icon={kpiIcons[kpi.metric_name] ?? Target}
                color={kpiColors[kpi.metric_name] ?? "blue"}
              />
            ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <AiInsightCard
            insights={insights}
            onAction={handleAction}
            loading={loadingInsights}
          />
          <RecentActivity />
        </div>

        <div className="space-y-6">
          <AgentStatusCard />

          <div className="bg-gradient-to-br from-primary-600 to-cyan-500 rounded-xl p-6 text-white shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
              AIOS Engine
            </p>
            <p className="text-lg font-bold mb-1">Phase 2 Active</p>
            <p className="text-sm opacity-80 leading-relaxed mb-4">
              Action automation running. 3 agents processing 25 tasks this hour.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/15 rounded-lg px-3 py-2 text-center">
                <p className="text-xl font-bold">25</p>
                <p className="text-xs opacity-75">Tasks/hr</p>
              </div>
              <div className="bg-white/15 rounded-lg px-3 py-2 text-center">
                <p className="text-xl font-bold">98%</p>
                <p className="text-xs opacity-75">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
