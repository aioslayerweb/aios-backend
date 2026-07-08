"use client"

import { useOrganizationIntelligenceContext } from "@/contexts/organization-intelligence-context"

export function useDepartments() {
  const { departments, filteredDepartments, selectedDepartment, selectedDepartmentId, setSelectedDepartmentId } = useOrganizationIntelligenceContext()

  return {
    departments,
    filteredDepartments,
    selectedDepartment,
    selectedDepartmentId,
    setSelectedDepartmentId,
  }
}