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
import { ContentContainer } from "@/components/layout/foundation";

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

const insightIcons: Record<string, LucideIcon> = {
  Risk: AlertCircle,
  Opportunity: TrendingUp,
  Alert: Bell,
};

export default function DemoInsightsPage() {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    async function fetchInsights() {
      try {
        if (!supabase) {
          console.error("Supabase client not available");
          setIsLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("business_insights")
          .select("*")
          .limit(20);

        if (error) throw error;
        if (data) {
          setInsights(
            data.map((item) => ({
              id: item.id,
              type: item.insight_type || "Alert",
              title: item.title || "Untitled Insight",
              description: item.description || "No description provided",
              impact_score: item.impact_score || 0,
              confidence_score: item.confidence_score || 0,
              status: item.status || "Active",
              created_at: item.created_at || new Date().toISOString(),
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInsights();
  }, []);

  const filteredInsights = insights.filter((insight) => {
    if (filter === "all") return true;
    if (filter === "risks") return insight.type === "Risk";
    if (filter === "opportunities") return insight.type === "Opportunity";
    if (filter === "alerts") return insight.type === "Alert";
    return true;
  });

  const handleInsightAction = (insightId: string, action: string) => {
    console.log(`Insight ${insightId} - Action: ${action}`);
  };

  return (
    <ContentContainer className="space-y-4">
      <header className="rounded-xl border border-border bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          AIOS Business Intelligence
        </p>
        <h2 className="mt-1 text-xl font-semibold text-brand-navy">Executive Insights</h2>
        <p className="mt-1 text-sm text-text-secondary">
          AI-generated insights on risks, opportunities, and critical business signals.
        </p>
      </header>

      <div className="flex gap-2">
        {(["all", "risks", "opportunities", "alerts"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border border-border bg-white text-text-secondary hover:bg-surface-muted"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-white py-12">
          <p className="text-sm text-text-muted">Loading insights...</p>
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-white py-12">
          <p className="text-sm text-text-muted">
            No {filter === "all" ? "" : filter} insights found.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              icon={insightIcons[insight.type]}
              onAction={(action) => handleInsightAction(insight.id, action)}
            />
          ))}
        </div>
      )}
    </ContentContainer>
  );
}
