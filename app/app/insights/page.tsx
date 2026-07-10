"use client";

import { useEffect, useState } from "react";
import {
  CircleAlert as AlertCircle,
  TrendingUp,
  Bell,
  type LucideIcon,
} from "lucide-react";
import InsightCard from "@/components/insights/InsightCard";
import { supabase } from "@/lib/supabase";

type FilterType = "all" | "risks" | "opportunities" | "alerts";

interface InsightData {
  id: string;
  type: "Risk" | "Opportunity" | "Alert";
  title: string;
  description: string;
  impact_score: number;
  confidence_score: number;
  status: string;
  created_at: string;
}

const filterTabs: Array<{ label: string; value: FilterType }> = [
  { label: "All", value: "all" },
  { label: "Risks", value: "risks" },
  { label: "Opportunities", value: "opportunities" },
  { label: "Alerts", value: "alerts" },
];

export default function AppInsightsPage() {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("insights")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setInsights(data as InsightData[]);
      }
      setLoading(false);
    }

    fetchInsights();
  }, []);

  function getFilteredInsights() {
    if (activeFilter === "all") {
      return insights;
    }

    const typeMap: Record<InsightData["type"], FilterType> = {
      Risk: "risks",
      Opportunity: "opportunities",
      Alert: "alerts",
    };

    return insights.filter((insight) => typeMap[insight.type] === activeFilter);
  }

  function handleAction(action: string, insightTitle: string) {
    const actionMessages: Record<string, string> = {
      resolve: `Marked as resolved: "${insightTitle}"`,
      assign: `Assigned to team: "${insightTitle}"`,
      ignore: `Ignored: "${insightTitle}"`,
    };

    setActionFeedback(actionMessages[action] || "Action completed");
    setTimeout(() => setActionFeedback(null), 3000);
  }

  const filteredInsights = getFilteredInsights();
  const typeIcons: Record<InsightData["type"], LucideIcon> = {
    Risk: AlertCircle,
    Opportunity: TrendingUp,
    Alert: Bell,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insights</h1>
          <p className="mt-1 text-sm text-slate-500">AI-driven intelligence and recommendations</p>
        </div>
      </div>

      {actionFeedback && (
        <div className="animate-fade-in flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
          <span className="h-2 w-2 rounded-full bg-primary-500" />
          {actionFeedback}
        </div>
      )}

      <div className="flex gap-2 border-b border-slate-200">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeFilter === tab.value
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {activeFilter === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-5 w-32 rounded bg-slate-100" />
                  <div className="h-5 w-24 rounded bg-slate-100" />
                </div>
                <div className="h-6 w-2/3 rounded bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-5/6 rounded bg-slate-100" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 rounded bg-slate-100" />
                  <div className="h-8 w-12 rounded bg-slate-100" />
                </div>
              </div>
            </div>
          ))
        ) : filteredInsights.length > 0 ? (
          filteredInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              icon={typeIcons[insight.type]}
              onAction={(action) => handleAction(action, insight.title)}
            />
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-500">
              No {activeFilter === "all" ? "insights" : activeFilter} to display
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
