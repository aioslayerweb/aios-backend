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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch(
          "https://aios-backend-3.onrender.com/api/insights"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setInsights(data);
      } catch (err: any) {
        setError(err.message || "Failed to load insights");
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">AIOS Insights</h1>

      {loading && (
        <p className="text-gray-500">Loading AI insights...</p>
      )}

      {error && (
        <p className="text-red-500">
          Error: {error}
        </p>
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">
                  {insight.title}
                </h2>

                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {insight.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                {insight.description}
              </p>

              <div className="text-sm">
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
