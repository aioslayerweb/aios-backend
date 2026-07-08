"use client"

import { useOrganizationIntelligenceContext } from "@/contexts/organization-intelligence-context"

export function useObjectives() {
  const { objectives, filteredObjectives } = useOrganizationIntelligenceContext()

  return { objectives, filteredObjectives }
}