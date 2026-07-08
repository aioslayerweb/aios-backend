"use client"

import { useExecutiveReportsContext } from "@/contexts/executive-reports-context"

export function useExecutiveReports() {
  return useExecutiveReportsContext()
}