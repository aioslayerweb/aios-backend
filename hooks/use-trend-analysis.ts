"use client"

import { useExecutiveReports } from "@/hooks/use-executive-reports"

export function useTrendAnalysis() {
  const { trendSeries, selectedTrend, selectedTrendId, setSelectedTrendId } = useExecutiveReports()

  return {
    trendSeries,
    selectedTrend,
    selectedTrendId,
    setSelectedTrendId,
  }
}