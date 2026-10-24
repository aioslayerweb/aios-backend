"use client";

import { useState } from "react";
import {
  CircleAlert as AlertCircle,
  TrendingUp,
  Bell,
  type LucideIcon,
} from "lucide-react";
import InsightCard from "@/components/insights/InsightCard";
import { ContentContainer } from "@/components/layout/foundation";
import { syntheticDemoInsights } from "@/lib/demo/synthetic-insights";

type FilterType = "all" | "risks" | "opportunities" | "alerts";

const insightIcons: Record<string, LucideIcon> = {
  Risk: AlertCircle,
  Opportunity: TrendingUp,
  Alert: Bell,
};

export default function DemoInsightsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredInsights = syntheticDemoInsights.filter((insight) => {
    if (filter === "all") return true;
    if (filter === "risks") return insight.type === "Risk";
    if (filter === "opportunities") return insight.type === "Opportunity";
    if (filter === "alerts") return insight.type === "Alert";
    return true;
  });

  const handleInsightAction = (_insightId: string, action: string) => {
    const actionLabels: Record<string, string> = {
      resolve: "resolve",
      assign: "assign",
      ignore: "ignore",
    };
    setActionFeedback(`Simulation only — ${actionLabels[action] ?? "review"} action recorded locally. No business data was changed.`);
  };

  return (
    <ContentContainer className="space-y-4">
      <header className="rounded-xl border border-border bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Synthetic demo data · simulation only</p>
        <h2 className="mt-1 text-xl font-semibold text-brand-navy">Executive Insights</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Example risks, opportunities, and alerts for exploring the AIOS experience. These are not live business insights.
        </p>
      </header>

      {actionFeedback ? (
        <p role="status" aria-live="polite" className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {actionFeedback}
        </p>
      ) : null}

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

      {filteredInsights.length === 0 ? (
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
