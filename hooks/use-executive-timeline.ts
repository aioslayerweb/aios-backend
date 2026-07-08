"use client"

import { useExecutiveReports } from "@/hooks/use-executive-reports"

export function useExecutiveTimeline() {
  const { timeline } = useExecutiveReports()

  return {
    timeline,
  }
}