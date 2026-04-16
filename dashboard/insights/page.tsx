"use client";

import { useEffect, useState } from "react";

type Insight = {
  title: string;
  description: string;
  impact_score: number;
  category: string;
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch(
          "https://YOUR-RENDER-URL.onrender.com/api/insights"
        );

        const data = await res.json();
        setInsights(data);
      } catch (err) {
        console.error("Failed to load insights", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">AIOS Insights</h1>

      {loading && (
        <p className="text-gray-500">Loading AI insights...</p>
      )}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{insight.title}</h2>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {insight.category}
                </span>
              </div>

              <p className="text-gray-600 mt-2">
                {insight.description}
              </p>

              <div className="mt-3 text-sm">
                Impact Score:{" "}
                <span className="font-bold">
                  {insight.impact_score}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
