"use client"

import { useExecutiveReports } from "@/hooks/use-executive-reports"

export function useBoardReports() {
  const { boardReports, selectedReport, selectedReportId, setSelectedReportId } = useExecutiveReports()

  return {
    boardReports,
    selectedReport,
    selectedReportId,
    setSelectedReportId,
  }
}