"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CircleAlert as AlertCircle, TrendingUp, Bell } from "lucide-react";
import InsightCard from "@/components/insights/InsightCard";

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

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
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
    if (activeFilter === "all") return insights;

    const typeMap: Record<string, FilterType> = {
      "Risk": "risks",
      "Opportunity": "opportunities",
      "Alert": "alerts",
    };

    return insights.filter(
      (insight) => typeMap[insight.type] === activeFilter
    );
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
  const typeIcons: Record<string, React.ComponentType<any>> = {
    Risk: AlertCircle,
    Opportunity: TrendingUp,
    Alert: Bell,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insights</h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-driven intelligence and recommendations
          </p>
        </div>
      </div>

      {actionFeedback && (
        <div className="bg-primary-50 border border-primary-200 text-primary-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 bg-primary-500 rounded-full" />
          {actionFeedback}
        </div>
      )}

      <div className="flex gap-2 border-b border-slate-200">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-4 py-3 font-medium text-sm transition-colors relative ${
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
              className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-32 h-5 bg-slate-100 rounded" />
                  <div className="w-24 h-5 bg-slate-100 rounded" />
                </div>
                <div className="w-2/3 h-6 bg-slate-100 rounded" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-slate-100 rounded" />
                  <div className="w-5/6 h-4 bg-slate-100 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-8 bg-slate-100 rounded" />
                  <div className="w-12 h-8 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : filteredInsights.length > 0 ? (
          filteredInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              icon={typeIcons[insight.type] || AlertCircle}
              onAction={(action) => handleAction(action, insight.title)}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500">
              No {activeFilter === "all" ? "insights" : activeFilter} to display
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
